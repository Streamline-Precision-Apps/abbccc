import { NextResponse } from "next/server";
import * as Sentry from "@sentry/nextjs";
import prisma from "@/lib/prisma";
import { auth } from "@/auth";

export const dynamic = "force-dynamic";

/**
 * GET /api/getTimesheetById?id=123
 * Returns a single timesheet by ID for admins, including all editable fields and related logs.
 */
export async function GET(req: Request) {
  let session;
  try {
    session = await auth();
  } catch (error) {
    console.error("Error during authentication:", error);
    return NextResponse.json(
      { error: "Authentication failed" },
      { status: 500 },
    );
  }

  const userId = session?.user.id;
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id) {
    return NextResponse.json(
      { error: "Missing timesheet id" },
      { status: 400 },
    );
  }

  try {
    const timesheet = await prisma.timeSheet.findUnique({
      where: { id: Number(id) },
      select: {
        id: true,
        date: true,
        User: {
          select: { id: true, firstName: true, lastName: true },
        },
        Jobsite: {
          select: { id: true, name: true },
        },
        CostCode: {
          select: { id: true, name: true },
        },
        startTime: true,
        endTime: true,
        comment: true,
        status: true,
        createdAt: true,
        updatedAt: true,
        workType: true,
        // Maintenance logs
        Maintenance: {
          select: {
            id: true,
            hours: true,
            equipmentId: true,
            description: true,
            Equipment: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
        // Trucking logs
        TruckingLogs: {
          select: {
            id: true,
            equipmentId: true,
            truckNumber: true,
            trailerNumber: true,
            startingMileage: true,
            endingMileage: true,
            // Equipment Hauled
            EquipmentHauled: {
              select: {
                id: true,
                equipmentId: true,
                source: true,
                destination: true,
                startMileage: true,
                endMileage: true,
                // Add more fields as needed
              },
            },

            Materials: {
              select: {
                id: true,
                LocationOfMaterial: true,
                name: true,
                quantity: true,
                unit: true,
                loadType: true,
              },
            },
            // Refuel Logs
            RefuelLogs: {
              select: {
                id: true,
                gallonsRefueled: true,
                milesAtFueling: true,
              },
            },
            // State Mileages
            StateMileages: {
              select: {
                id: true,
                state: true,
                stateLineMileage: true,
              },
            },
          },
        },
        // Tasco logs
        TascoLogs: {
          select: {
            id: true,
            shiftType: true,
            laborType: true,
            materialType: true,
            LoadQuantity: true,
            // TascoFLoads (F-Shift loads)
            FLoads: {
              select: {
                id: true,
                weight: true,
                screenType: true,
              },
            },
            // Refuel Logs
            RefuelLogs: {
              select: {
                id: true,
                gallonsRefueled: true,
              },
            },
            // Equipment
            Equipment: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
        // Labor logs
        EmployeeEquipmentLogs: {
          select: {
            id: true,
            equipmentId: true,
            startTime: true,
            endTime: true,
            Equipment: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
    });
    if (!timesheet) {
      return NextResponse.json(
        { error: "Timesheet not found" },
        { status: 404 },
      );
    }
    return NextResponse.json(timesheet);
  } catch (error) {
    Sentry.captureException(error);
    console.error("Error fetching timesheet by id:", error);
    return NextResponse.json(
      { error: "Failed to fetch timesheet" },
      { status: 500 },
    );
  }
}
