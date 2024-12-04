"use server";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/auth";

export async function GET(req: Request) {
  const session = await auth();
  const userId = session?.user.id;

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const url = new URL(req.url);
  const filter = url.searchParams.get("filter");

  try {
    let equipment = [];

    if (filter === "temporary") {
      equipment = await prisma.equipment.findMany({
        where: {
          isActive: false,
        },
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
        where: {
          status: "NEEDS_REPAIR",
        },
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
    } else if (filter === "truck") {
      equipment = await prisma.equipment.findMany({
        where: {
          equipmentTag: "TRUCK",
        },
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
    } else if (filter === "trailer") {
      equipment = await prisma.equipment.findMany({
        where: {
          equipmentTag: "TRAILER",
        },
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
    } else if (filter === "equipment") {
      equipment = await prisma.equipment.findMany({
        where: {
          equipmentTag: "EQUIPMENT",
        },
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
    } else if (filter === "vehicle") {
      equipment = await prisma.equipment.findMany({
        where: {
          equipmentTag: "VEHICLE",
        },
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

    return NextResponse.json(equipment);
  } catch (error) {
    console.error("Error fetching equipment data:", error);
    return NextResponse.json(
      { error: "Failed to fetch equipment data" },
      { status: 500 }
    );
  }
}
