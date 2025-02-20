"use server";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/auth";

export async function GET() {
  const session = await auth();
  const userId = session?.user.id;

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const currentDate = new Date();
  const past24Hours = new Date(currentDate.getTime() - 24 * 60 * 60 * 1000);

  // Fetching employee equipment logs
  const getlogs = await prisma.employeeEquipmentLog.findMany({
    where: {
      employeeId: userId,
      createdAt: { lte: currentDate, gte: past24Hours },
      isSubmitted: false,
    },
    include: {
      Equipment: {
        select: {
          id: true,
          qrId: true,
          name: true,
        },
      },
    },
  });

  // Fetching maintenance logs
  const maintenanceLogs = await prisma.maintenanceLog.findMany({
    where: {
      userId: userId,
      endTime: null,
    },
    select: {
      id: true,
      maintenanceId: true,
    },
  });

  // Mapping employee equipment logs
  const equipmentLogs = getlogs.map((log) => ({
    id: log.id.toString(),
    type: "equipment",
    userId: log.employeeId,
    equipment: log.Equipment
      ? {
          id: log.Equipment.id,
          qrId: log.Equipment.qrId,
          name: log.Equipment.name,
        }
      : null,
    submitted: log.isSubmitted,
  }));

  // Mapping maintenance logs
  const mappedMaintenanceLogs = maintenanceLogs.map((log) => ({
    id: log.id.toString(),
    type: "mechanic",
    maintenanceId: log.maintenanceId,
    userId: userId,
    submitted: false,
  }));

  // Merging both logs into one array
  const combinedLogs = [...equipmentLogs, ...mappedMaintenanceLogs];

  return NextResponse.json(combinedLogs);
}
