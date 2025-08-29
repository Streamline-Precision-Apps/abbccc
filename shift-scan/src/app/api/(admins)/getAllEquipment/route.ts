import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/auth";
import { EquipmentState, EquipmentTags } from "@prisma/client";

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
      isDisabledByAdmin: true,
      approvalStatus: true,
      overWeight: true,
      currentWeight: true,
      equipmentVehicleInfo: {
        select: {
          make: true,
          model: true,
          year: true,
          licensePlate: true,
          registrationExpiration: true,
          mileage: true,
        },
      },
    } as const;

    let equipment;

    if (filter === "inactive") {
      equipment = await prisma.equipment.findMany({
        where: { isDisabledByAdmin: true },
        select: baseSelect,
      });
    } else if (filter === "needsRepair") {
      equipment = await prisma.equipment.findMany({
        where: { state: EquipmentState.NEEDS_REPAIR },
        select: baseSelect,
      });
    } else if (
      filter &&
      Object.values(EquipmentTags).includes(filter as EquipmentTags)
    ) {
      equipment = await prisma.equipment.findMany({
        where: { equipmentTag: filter as EquipmentTags },
        select: baseSelect,
      });
    } else {
      // Default: fetch all equipment
      equipment = await prisma.equipment.findMany({
        select: baseSelect,
      });
    }

    return NextResponse.json(equipment);
  } catch (error) {
    console.error("Error fetching equipment data:", error);

    const errorMessage =
      error instanceof Error ? error.message : "Failed to fetch equipment data";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
