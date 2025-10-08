import { NextResponse } from "next/server";
import * as Sentry from "@sentry/nextjs";
import prisma from "@/lib/prisma";

import { auth } from "@/auth";
import {
  Condition,
  EquipmentState,
  EquipmentTags,
  OwnershipType,
} from "../../../../../prisma/generated/prisma/client";

export const dynamic = "force-dynamic"; // Ensures API is always dynamic and not cached

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

    // Parse query params for pagination
    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status") || "all";
    const filtersParam = searchParams.get("filters");

    let equipmentSummary, total, pageSize, page, skip, totalPages;
    if (status === "pending") {
      page = undefined;
      pageSize = undefined;
      skip = undefined;
      totalPages = 1;
      equipmentSummary = await prisma.equipment.findMany({
        where: {
          approvalStatus: "PENDING",
        },
        select: {
          id: true,
          qrId: true,
          code: true,
          name: true,
          description: true,
          memo: true,
          ownershipType: true,
          equipmentTag: true,
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
        },
        orderBy: {
          code: "asc",
        },
      });
    } else if (filtersParam) {
      // When filters are applied, get all equipment without pagination
      try {
        const filters = JSON.parse(filtersParam);

        // Define the type for the where clause
        type WhereClause = {
          equipmentTag?: { in: EquipmentTags[] };
          ownershipType?: { in: OwnershipType[] };
          acquiredCondition?: { in: Condition[] };
          state?: { in: EquipmentState[] };
        };

        // Construct where clause based on filters
        const whereClause: WhereClause = {};

        // Add filter for equipment tags if provided
        if (filters.equipmentTags && filters.equipmentTags.length > 0) {
          whereClause.equipmentTag = {
            in: filters.equipmentTags,
          };
        }

        // Add filter for ownership types if provided
        if (filters.ownershipTypes && filters.ownershipTypes.length > 0) {
          whereClause.ownershipType = {
            in: filters.ownershipTypes,
          };
        }

        // Add filter for conditions if provided
        if (filters.conditions && filters.conditions.length > 0) {
          whereClause.acquiredCondition = {
            in: filters.conditions,
          };
        }

        // Add filter for statuses if provided
        if (filters.statuses && filters.statuses.length > 0) {
          whereClause.state = {
            in: filters.statuses,
          };
        }

        // Get all equipment that matches the filters (no pagination)
        equipmentSummary = await prisma.equipment.findMany({
          where: whereClause,
          select: {
            id: true,
            qrId: true,
            code: true,
            name: true,
            description: true,
            memo: true,
            ownershipType: true,
            equipmentTag: true,
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
          },
          orderBy: {
            code: "asc",
          },
        });

        // Set pagination values for response
        total = equipmentSummary.length;
        page = 1;
        pageSize = total;
        totalPages = 1;
      } catch (error) {
        console.error("Error parsing filters:", error);
        return NextResponse.json(
          { error: "Invalid filter format" },
          { status: 400 },
        );
      }
    } else {
      page = parseInt(searchParams.get("page") || "1", 10);
      pageSize = parseInt(searchParams.get("pageSize") || "25", 10);
      skip = (page - 1) * pageSize;
      total = await prisma.equipment.count();
      totalPages = Math.ceil(total / pageSize);

      equipmentSummary = await prisma.equipment.findMany({
        skip,
        take: pageSize,
        select: {
          id: true,
          qrId: true,
          code: true,
          name: true,
          description: true,
          memo: true,
          ownershipType: true,
          equipmentTag: true,
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
        },
        orderBy: {
          code: "asc",
        },
      });
    }
    const pendingEquipment = await prisma.equipment.count({
      where: {
        approvalStatus: "PENDING",
      },
    });

    return NextResponse.json({
      equipment: equipmentSummary,
      total,
      page,
      pageSize,
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
