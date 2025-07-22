import prisma from "@/lib/prisma";
import * as Sentry from "@sentry/nextjs";
// import { TimesheetFilter } from "@/lib/types";
import { NextRequest } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const timesheetId = params.id;
    if (!timesheetId) {
      return new Response(
        JSON.stringify({ error: "Missing timesheet id in URL params." }),
        { status: 400 }
      );
    }

    const timesheet = await prisma.timeSheet.findUnique({
      where: { id: timesheetId },
      select: {
        id: true,
        comment: true,
        startTime: true,
        endTime: true,
        Jobsite: {
          select: {
            id: true,
            name: true,
          },
        },
        CostCode: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    const truckingLogs = await prisma.truckingLog.findMany({
      where: { timeSheetId: timesheetId },
      select: {
        id: true,
        truckNumber: true,
        trailerNumber: true,
        startingMileage: true,
        endingMileage: true,
        EquipmentHauled: {
          select: {
            id: true,
            startMileage: true,
            endMileage: true,
            Equipment: {
              select: {
                id: true,
                name: true,
              },
            },
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
            name: true,
            LocationOfMaterial: true,
            quantity: true,
            unit: true,
            loadType: true,
          },
        },
        StateMileages: {
          select: {
            id: true,
            state: true,
            stateLineMileage: true,
          },
        },
      },
    });

    const tascoLogs = await prisma.tascoLog.findMany({
      where: { timeSheetId: timesheetId },
      select: {
        id: true,
        shiftType: true,
        laborType: true,
        LoadQuantity: true,
        Equipment: {
          select: {
            id: true,
            name: true,
          },
        },
        RefuelLogs: {
          select: {
            id: true,
            gallonsRefueled: true,
          },
        },
      },
    });

    const MaintenanceLogs = await prisma.maintenanceLog.findMany({
      where: { timeSheetId: timesheetId },
      select: {
        id: true,
        startTime: true,
        endTime: true,
        comment: true,
        Maintenance: {
          select: {
            id: true,
            equipmentIssue: true,
          },
        },
      },
    });

    const employeeEquipmentLogs = await prisma.employeeEquipmentLog.findMany({
      where: { timeSheetId: timesheetId },
      select: {
        id: true,
        startTime: true,
        endTime: true,
        comment: true,
        RefuelLog: {
          select: {
            id: true,
            gallonsRefueled: true,
          },
        },
        Equipment: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    const timesheetDetails = {
      timesheet,
      truckingLogs,
      tascoLogs,
      MaintenanceLogs,
      employeeEquipmentLogs,
    };

    if (!timesheetDetails) {
      return new Response(JSON.stringify({ error: "Timesheet not found." }), {
        status: 404,
      });
    }

    return new Response(JSON.stringify({ timesheetDetails }), { status: 200 });
  } catch (error) {
    Sentry.captureException(error);
    return new Response(
      JSON.stringify({
        error: "Internal server error",
        details: String(error),
      }),
      { status: 500 }
    );
  }
}
