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
  stateMileage: boolean;
  refueled: boolean;
  material: boolean;
  equipmentHauled: boolean;
};

type TascoLog = {
  id: string;
  shiftType: string | null;
  laborType: string | null;
  loadQuantity: number | null;
  refueled: boolean;
};

export async function GET() {
  // Authenticate User
  const session = await auth();
  const userId = session?.user.id;

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // Fetch all data concurrently using Promise.all
    const [employeeLogs, maintenanceLogs, truckingLogs, tascoLogs] =
      await Promise.all([
        prisma.employeeEquipmentLog.findMany({
          where: {
            endTime: null,
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
            TimeSheet: {
              userId: userId,
              endTime: null,
            },
          },
          select: {
            id: true,
            endingMileage: true,
            laborType: true,
            StateMileages: {
              select: {
                id: true,
                state: true,
                stateLineMileage: true,
              },
            },
            RefuelLogs: {
              select: {
                id: true,
                gallonsRefueled: true,
                milesAtFueling: true,
              },
            },
            Materials: {
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

        prisma.tascoLog.findMany({
          where: {
            TimeSheet: {
              userId: userId,
              endTime: null,
            },
          },
          select: {
            id: true,
            shiftType: true,
            laborType: true,
            LoadQuantity: true,
            RefuelLogs: {
              select: {
                id: true,
                gallonsRefueled: true,
              },
            },
          },
        }),
      ]);

    // Reusable function to check incomplete fields
    const isFieldIncomplete = (
      item: Record<string, unknown>,
      requiredFields: string[]
    ): boolean => requiredFields.some((field) => !item[field]);

    // Mapping Employee Equipment Logs
    const mappedEmployeeLogs: EquipmentLog[] = employeeLogs.map((log) => ({
      id: log.id.toString(),
      type: "equipment",
      userId: userId,
      equipment: log.Equipment
        ? {
            id: log.Equipment.id.toString(),
            qrId: log.Equipment.qrId,
            name: log.Equipment.name,
          }
        : null,
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
          stateMileage: log.StateMileages.some((item) =>
            isFieldIncomplete(item, ["state", "stateLineMileage"])
          ),
          refueled: log.RefuelLogs.some((item) =>
            isFieldIncomplete(item, ["gallonsRefueled", "milesAtFueling"])
          ),
          material: log.Materials.some((item) =>
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

    const mappedTascoLog: TascoLog[] = tascoLogs
      .map((log) => {
        return {
          id: log.id,
          type: "tasco",
          shiftType: log.shiftType,
          laborType: log.laborType,
          loadQuantity: log.LoadQuantity,
          refueled: log.RefuelLogs.some((item) =>
            isFieldIncomplete(item, ["gallonsRefueled"])
          ),
        };
      })
      .filter((log) => {
        // Filter logs with incomplete fields
        return log.refueled;
      });

    // Combine All Logs
    const combinedLogs = [
      ...mappedEmployeeLogs,
      ...mappedMaintenanceLogs,
      ...mappedTruckingLogs,
      ...mappedTascoLog,
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
