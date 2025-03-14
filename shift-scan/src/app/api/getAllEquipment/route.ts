"use server";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/auth";
import { EquipmentTags } from "@prisma/client"; // Importing EquipmentTags from Prisma

export async function GET(req: Request) {
  try {
    const session = await auth();
    const userId = session?.user?.id;

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const url = new URL(req.url);
    const filter = url.searchParams.get("filter");

    let equipment = [];

    if (filter === "temporary") {
      equipment = await prisma.equipment.findMany({
        where: { isActive: false },
        select: {
          id: true,
          qrId: true,
          name: true,
          description: true,
          equipmentTag: true,
          lastInspection: true,
          lastRepair: true,
          status: true,
          make: true,
          model: true,
          year: true,
          licensePlate: true,
          registrationExpiration: true,
          mileage: true,
          isActive: true,
          inUse: true,
        },
      });
    } else if (filter === "needsRepair") {
      equipment = await prisma.equipment.findMany({
        where: { status: "NEEDS_REPAIR" },
        select: {
          id: true,
          qrId: true,
          name: true,
          description: true,
          equipmentTag: true,
          lastInspection: true,
          lastRepair: true,
          status: true,
          make: true,
          model: true,
          year: true,
          licensePlate: true,
          registrationExpiration: true,
          mileage: true,
          isActive: true,
          inUse: true,
        },
      });
    } else if (filter && ["TRUCK", "TRAILER", "EQUIPMENT", "VEHICLE"].includes(filter.toUpperCase())) {
      equipment = await prisma.equipment.findMany({
        where: { equipmentTag: filter.toUpperCase() as EquipmentTags }, // Explicit type assertion
        select: {
          id: true,
          qrId: true,
          name: true,
          description: true,
          equipmentTag: true,
          lastInspection: true,
          lastRepair: true,
          status: true,
          make: true,
          model: true,
          year: true,
          licensePlate: true,
          registrationExpiration: true,
          mileage: true,
          isActive: true,
          inUse: true,
        },
      });
    } else {
      // Default: fetch all equipment
      equipment = await prisma.equipment.findMany({
        select: {
          id: true,
          qrId: true,
          name: true,
          description: true,
          equipmentTag: true,
          lastInspection: true,
          lastRepair: true,
          status: true,
          make: true,
          model: true,
          year: true,
          licensePlate: true,
          registrationExpiration: true,
          mileage: true,
          isActive: true,
          inUse: true,
        },
      });
    }

    if (!equipment || equipment.length === 0) {
      return NextResponse.json(
        { message: "No equipment found for the given filter." },
        { status: 404 }
      );
    }

    return NextResponse.json(equipment);
  } catch (error) {
    console.error("Error fetching equipment data:", error);

    let errorMessage = "Failed to fetch equipment data";
    if (error instanceof Error) {
      errorMessage = error.message;
    }

    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
