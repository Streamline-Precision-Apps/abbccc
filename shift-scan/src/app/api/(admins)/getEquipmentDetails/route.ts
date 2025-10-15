import { NextResponse } from "next/server";
import * as Sentry from "@sentry/nextjs";
import prisma from "@/lib/prisma";

import { auth } from "@/auth";
import {
  ApprovalStatus,
  Condition,
  EquipmentState,
  EquipmentTags,
  OwnershipType,
} from "../../../../../prisma/generated/prisma/client";

export const dynamic = "force-dynamic"; // Ensures API is always dynamic and not cached

// Common select fields for equipment queries
const equipmentSelectFields = {
  id: true,
  qrId: true,
  code: true,
  name: true,
  description: true,
  memo: true,
  ownershipType: true,
  equipmentTag: true,
  status: true,
  approvalStatus: true,
  state: true,
  createdAt: true,
  updatedAt: true,
  make: true,
  model: true,
  year: true,
  color: true,
  serialNumber: true,
  acquiredDate: true,
  acquiredCondition: true,
  licensePlate: true,
  licenseState: true,
  _count: {
    select: {
      EmployeeEquipmentLogs: true,
      TascoLogs: true,
      HauledInLogs: true,
      UsedAsTrailer: true,
      UsedAsTruck: true,
      Maintenance: true,
    },
  },
};

/**
 * Get summary information of all equipment (just id and name)
 * Used for lightweight equipment listing in admin assets page
 */
export async function GET(req: Request) {
  try {
    // Authenticate the user
    const session = await auth();
    const userId = session?.user?.id;

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Parse query params for pagination and filtering
    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status") || "all";
    const filtersParam = searchParams.get("filters");
    const searchTerm = searchParams.get("search") || "";
    const requestedPage = parseInt(searchParams.get("page") || "1", 10);
    const requestedPageSize = parseInt(
      searchParams.get("pageSize") || "25",
      10,
    );

    // Base search condition that will be applied to all queries
    const searchCondition = searchTerm
      ? {
          OR: [
            { name: { contains: searchTerm, mode: "insensitive" } },
            { code: { contains: searchTerm, mode: "insensitive" } },
          ],
        }
      : {};

    // Parse filters if provided
    const whereClause: Record<string, unknown> = { ...searchCondition };

    // Add status filter if specified
    if (status === "pending") {
      whereClause.approvalStatus = "PENDING";
    }

    // Add custom filters if provided
    if (filtersParam) {
      try {
        const filters = JSON.parse(filtersParam);

        // Add filter for equipment tags if provided
        if (filters.equipmentTags && filters.equipmentTags.length > 0) {
          whereClause.equipmentTag = {
            in: filters.equipmentTags as EquipmentTags[],
          };
        }

        // Add filter for ownership types if provided
        if (filters.ownershipTypes && filters.ownershipTypes.length > 0) {
          whereClause.ownershipType = {
            in: filters.ownershipTypes as OwnershipType[],
          };
        }

        // Add filter for conditions if provided
        if (filters.conditions && filters.conditions.length > 0) {
          whereClause.acquiredCondition = {
            in: filters.conditions as Condition[],
          };
        }

        // Add filter for statuses if provided
        if (filters.statuses && filters.statuses.length > 0) {
          whereClause.state = {
            in: filters.statuses as ApprovalStatus[],
          };
        }
      } catch (error) {
        console.error("Error parsing filters:", error);
        return NextResponse.json(
          { error: "Invalid filter format" },
          { status: 400 },
        );
      }
    }

    // Count total matching records (for pagination)
    const total = await prisma.equipment.count({ where: whereClause });

    // Calculate pagination values
    const isPaginationDisabled =
      status === "pending" ||
      searchTerm.trim() !== "" ||
      (filtersParam && filtersParam !== "{}");

    // Either use pagination or get all results
    const skip = isPaginationDisabled
      ? 0
      : (requestedPage - 1) * requestedPageSize;
    const take = isPaginationDisabled ? undefined : requestedPageSize;
    const effectivePage = isPaginationDisabled ? 1 : requestedPage;
    const effectivePageSize = isPaginationDisabled ? total : requestedPageSize;
    const totalPages = Math.ceil(total / (effectivePageSize || 1)) || 1;

    // Fetch equipment data
    const equipmentSummary = await prisma.equipment.findMany({
      where: whereClause,
      skip,
      ...(take !== undefined && { take }),
      select: equipmentSelectFields,
      orderBy: {
        code: "asc",
      },
    });

    // Count pending equipment for badge count
    const pendingEquipment = await prisma.equipment.count({
      where: {
        approvalStatus: "PENDING",
      },
    });

    return NextResponse.json({
      equipment: equipmentSummary,
      total,
      page: effectivePage,
      pageSize: effectivePageSize,
      totalPages,
      pendingEquipment,
    });
  } catch (error) {
    Sentry.captureException(error);
    console.error("Error fetching equipment summary:", error);
    const errorMessage =
      error instanceof Error
        ? error.message
        : "Failed to fetch equipment summary";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
