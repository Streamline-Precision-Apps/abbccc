import { NextResponse } from "next/server";
import { unstable_cache } from "next/cache";
import prisma from "@/lib/prisma";
import { auth } from "@/auth";
import {
  EquipmentState,
  EquipmentTags,
} from "../../../../../prisma/generated/prisma";

export const dynamic = "force-dynamic"; // ✅ Ensures this API is dynamic and never pre-rendered

export async function GET(req: Request) {
  try {
    const session = await auth();
    const userId = session?.user?.id;

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const url = new URL(req.url);
    const filter = url.searchParams.get("filter");

    const baseSelect = {
      id: true,
      qrId: true,
      name: true,
      description: true,
      equipmentTag: true,
      state: true,
      status: true,
      approvalStatus: true,
      overWeight: true,
      currentWeight: true,
      make: true,
      model: true,
      year: true,
      licensePlate: true,
    } as const;

    // Create a cached function for fetching equipment with filters
    const getCachedEquipment = unstable_cache(
      async (filter: string | null) => {
        if (filter === "inactive") {
          return await prisma.equipment.findMany({
            where: { status: "ARCHIVED" },
            select: baseSelect,
          });
        } else if (filter === "needsRepair") {
          return await prisma.equipment.findMany({
            where: { state: EquipmentState.NEEDS_REPAIR },
            select: baseSelect,
          });
        } else if (
          filter &&
          Object.values(EquipmentTags).includes(filter as EquipmentTags)
        ) {
          return await prisma.equipment.findMany({
            where: { equipmentTag: filter as EquipmentTags },
            select: baseSelect,
          });
        } else {
          // Default: fetch all equipment
          return await prisma.equipment.findMany({
            select: baseSelect,
          });
        }
      },
      [`all-equipment-${filter || "all"}`],
      {
        tags: ["equipment", "admin-equipment"],
        revalidate: 1800, // Cache for 30 minutes
      },
    );

    const equipment = await getCachedEquipment(filter);

    return NextResponse.json(equipment);
  } catch (error) {
    console.error("Error fetching equipment data:", error);

    const errorMessage =
      error instanceof Error ? error.message : "Failed to fetch equipment data";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
