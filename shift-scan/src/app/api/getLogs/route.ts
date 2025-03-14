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

type TascoLog = {
  id: string;
  shiftType: string | null;
  laborType: string | null;
  loads: boolean;
  refueled: boolean;
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
    const [employeeLogs, maintenanceLogs, truckingLogs, tascoLogs] = await Promise.all([
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

      prisma.tascoLog.findMany({
        where: {
          timeSheet: {
            userId: userId,
            endTime: null,
          },
        },
        select: {
          id: true,
          shiftType: true,
          laborType: true,
          loads: {
            select: {
              id: true,
              loadType: true,
              loadWeight: true,
            },
          },
          refueled: {
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
      });

      const mappedTascoLog: TascoLog[] = tascoLogs
  .map((log) => {
    return {
      id: log.id,
      type: "tasco",
      shiftType: log.shiftType,
      laborType: log.laborType,
      loads: log.laborType === "equipmentOperator"
        ? log.loads.some((item) => isFieldIncomplete(item, ["loadType", "loadWeight"]))
        : false,
      refueled: log.refueled.some((item) =>
        isFieldIncomplete(item, ["gallonsRefueled"])
      ),
    };
  })
  .filter((log) => {
    // Filter logs with incomplete fields
    return (
      log.loads ||
      log.refueled
    );
  });

    // Combine All Logs
    const combinedLogs = [
      ...mappedEquipmentLogs,
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
