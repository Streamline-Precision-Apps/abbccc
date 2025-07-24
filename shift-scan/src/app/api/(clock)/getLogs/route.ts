import { NextResponse } from "next/server";
import * as Sentry from "@sentry/nextjs";
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
            TimeSheet: {
              userId: userId,
            },
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
            startingMileage: true,
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
                name: true,
                quantity: true,
                unit: true,
              },
            },
            EquipmentHauled: {
              select: {
                id: true,
                equipmentId: true,
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

    // Enhanced validation functions for different field types
    const validateField = {
      // Basic validation - field must not be empty/null/undefined
      required: (value: unknown): boolean => {
        return value !== null && value !== undefined && value !== "";
      },

      // Mileage validation - must exist and be >= starting mileage
      mileage: (value: unknown, startingMileage: number | null): boolean => {
        if (!validateField.required(value)) return false;
        if (startingMileage === null) return true; // Can't validate without starting mileage
        return typeof value === "number" && value >= startingMileage;
      },

      // Numeric validation - must be a positive number
      positiveNumber: (value: unknown): boolean => {
        if (!validateField.required(value)) return false;
        return typeof value === "number" && value > 0;
      },
    };

    // Validation rules for each log type
    const validateTruckingLog = (log: {
      laborType: string;
      startingMileage: number | null;
      endingMileage: number | null;
      StateMileages: Array<{
        state: string | null;
        stateLineMileage: number | null;
      }>;
      RefuelLogs: Array<{
        gallonsRefueled: number | null;
        milesAtFueling: number | null;
      }>;
      Materials: Array<{
        LocationOfMaterial: string | null;
        name: string | null;
        quantity: number | null;
        unit: string | null;
      }>;
      EquipmentHauled: Array<{
        equipmentId: string | null;
      }>;
    }) => {
      const startingMileage = log.startingMileage;

      // Calculate minimum end mileage (highest mileage from all logs)
      let maxMileage = startingMileage || 0;

      // Check state mileage logs
      log.StateMileages.forEach((stateLog) => {
        if (
          stateLog.stateLineMileage &&
          stateLog.stateLineMileage > maxMileage
        ) {
          maxMileage = stateLog.stateLineMileage;
        }
      });

      // Check refuel logs
      log.RefuelLogs.forEach((refuelLog) => {
        if (refuelLog.milesAtFueling && refuelLog.milesAtFueling > maxMileage) {
          maxMileage = refuelLog.milesAtFueling;
        }
      });

      return {
        // State mileage validation
        stateMileage: log.StateMileages.some(
          (item) =>
            !validateField.required(item.state) ||
            !validateField.mileage(item.stateLineMileage, startingMileage)
        ),

        // Refuel logs validation
        refueled: log.RefuelLogs.some(
          (item) =>
            !validateField.positiveNumber(item.gallonsRefueled) ||
            !validateField.mileage(item.milesAtFueling, startingMileage)
        ),

        // Material validation
        material: log.Materials.some(
          (item) =>
            !validateField.required(item.LocationOfMaterial) ||
            !validateField.required(item.name) ||
            !validateField.positiveNumber(item.quantity) ||
            !validateField.required(item.unit)
        ),

        // Equipment hauled validation
        equipmentHauled: log.EquipmentHauled.some(
          (item) => !validateField.required(item.equipmentId)
        ),

        // Enhanced ending mileage validation for truck drivers
        endingMileage:
          log.laborType === "truckDriver" &&
          (!validateField.required(log.endingMileage) ||
            (log.endingMileage !== null && log.endingMileage < maxMileage)),
      };
    };

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
    const mappedTruckingLogs: TruckingLog[] = truckingLogs
      .map((log) => {
        const validation = validateTruckingLog(log);

        return {
          id: log.id,
          type: "Trucking Assistant",
          laborType: log.laborType,
          endingMileage: log.endingMileage,
          stateMileage: validation.stateMileage,
          refueled: validation.refueled,
          material: validation.material,
          equipmentHauled: validation.equipmentHauled,
          incomplete: validation.endingMileage,
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
          refueled: log.RefuelLogs.some(
            (item) => !validateField.positiveNumber(item.gallonsRefueled)
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
    Sentry.captureException(error);
    console.error("Error fetching logs:", error);
    return NextResponse.json(
      { error: "Failed to fetch logs" },
      { status: 500 }
    );
  }
}
