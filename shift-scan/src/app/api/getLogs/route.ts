"use server";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/auth";

// TypeScript Types for Safety and Consistency
type EquipmentLog = {
  id: string;
  type: "equipment";
  userId: string;
  equipment: {
    id: string;
    qrId: string;
    name: string;
  } | null;
  submitted: boolean;
};

type MaintenanceLog = {
  id: string;
  type: "mechanic";
  maintenanceId: string;
  userId: string;
  submitted: boolean;
};

type TruckingLog = {
  id: string;
  laborType: string;
  endingMileage: number | null;
  comment: string | null;
  stateMileage: boolean;
  refueled: boolean;
  material: boolean;
  equipmentHauled: boolean;
};

export async function GET() {
  // Authenticate User
  const session = await auth();
  const userId = session?.user.id;

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const currentDate = new Date();
  const past24Hours = new Date(currentDate.getTime() - 24 * 60 * 60 * 1000);

  try {
    // Fetch all data concurrently using Promise.all
    const [employeeLogs, maintenanceLogs, truckingLogs] = await Promise.all([
      prisma.employeeEquipmentLog.findMany({
        where: {
          employeeId: userId,
          createdAt: { lte: currentDate, gte: past24Hours },
          isFinished: false,
        },
        include: {
          equipment: {
            select: {
              id: true,
              qrId: true,
              name: true,
            },
          },
        },
      }),

      prisma.maintenanceLog.findMany({
        where: {
          userId: userId,
          endTime: null,
        },
        select: {
          id: true,
          maintenanceId: true,
        },
      }),

      prisma.truckingLog.findMany({
        where: {
          timeSheet: {
            userId: userId,
            endTime: null,
          },
        },
        select: {
          id: true,
          endingMileage: true,
          comment: true,
          laborType: true,
          stateMileage: {
            select: {
              id: true,
              state: true,
              stateLineMileage: true,
            },
          },
          Refueled: {
            select: {
              id: true,
              gallonsRefueled: true,
              milesAtfueling: true,
            },
          },
          Material: {
            select: {
              id: true,
              LocationOfMaterial: true,
              quantity: true,
              name: true,
            },
          },
          EquipmentHauled: {
            select: {
              id: true,
              equipmentId: true,
              jobSiteId: true,
            },
          },
        },
      }),
    ]);

    // Reusable function to check incomplete fields
    const isFieldIncomplete = (
      item: Record<string, any>,
      requiredFields: string[]
    ): boolean => requiredFields.some((field) => !item[field]);

    // Mapping Employee Equipment Logs
    const mappedEquipmentLogs: EquipmentLog[] = employeeLogs.map((log) => ({
      id: log.id.toString(),
      type: "equipment",
      userId: log.employeeId,
      equipment: log.equipment
        ? {
            id: log.equipment.id,
            qrId: log.equipment.qrId,
            name: log.equipment.name,
          }
        : null,
      submitted: log.isFinished,
    }));

    // Mapping Maintenance Logs
    const mappedMaintenanceLogs: MaintenanceLog[] = maintenanceLogs.map(
      (log) => ({
        id: log.id.toString(),
        type: "mechanic",
        maintenanceId: log.maintenanceId,
        userId: userId,
        submitted: false,
      })
    );

    // Mapping Trucking Logs and Checking for Incomplete Fields
    // Mapping Trucking Logs and Checking for Incomplete Fields
    const mappedTruckingLogs: TruckingLog[] = truckingLogs
      .map((log) => {
        // Check if endingMileage is required
        const isEndingMileageRequired =
          log.laborType === "truckDriver" && log.endingMileage === null;
        return {
          id: log.id,
          type: "Trucking Assistant",
          laborType: log.laborType,
          endingMileage: log.endingMileage,
          comment: log.comment,
          stateMileage: log.stateMileage.some((item) =>
            isFieldIncomplete(item, ["state", "stateLineMileage"])
          ),
          refueled: log.Refueled.some((item) =>
            isFieldIncomplete(item, ["gallonsRefueled", "milesAtfueling"])
          ),
          material: log.Material.some((item) =>
            isFieldIncomplete(item, ["LocationOfMaterial", "quantity", "name"])
          ),
          equipmentHauled: log.EquipmentHauled.some((item) =>
            isFieldIncomplete(item, ["equipmentId", "jobSiteId"])
          ),
          incomplete: isEndingMileageRequired, // Track incomplete status
        };
      })
      .filter((log) => {
        // Filter logs with incomplete fields
        return (
          log.incomplete ||
          log.stateMileage ||
          log.refueled ||
          log.material ||
          log.equipmentHauled
        );
      });

    // Combine All Logs
    const combinedLogs = [
      ...mappedEquipmentLogs,
      ...mappedMaintenanceLogs,
      ...mappedTruckingLogs,
    ];

    return NextResponse.json(combinedLogs);
  } catch (error) {
    console.error("Error fetching logs:", error);
    return NextResponse.json(
      { error: "Failed to fetch logs" },
      { status: 500 }
    );
  }
}
