import { NextResponse } from "next/server";
import * as Sentry from "@sentry/nextjs";
import prisma from "@/lib/prisma";
import { auth } from "@/auth";

export const dynamic = "force-dynamic";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ equipmentId: string }> }
) {
  // Authenticate user
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { equipmentId } = await params;

  if (!equipmentId || typeof equipmentId !== "string") {
    return NextResponse.json(
      { error: "Invalid or missing equipmentId" },
      { status: 400 }
    );
  }

  try {
    // Find the most recent trucking log entry for this equipment that has an ending mileage
    const lastMileageEntry = await prisma.truckingLog.findFirst({
      where: {
        equipmentId: equipmentId,
        endingMileage: {
          not: null, // Only get entries that have an ending mileage recorded
        },
      },
      orderBy: {
        TimeSheet: {
          endTime: "desc", // Order by timesheet end time (most recent completed)
        },
      },
      select: {
        endingMileage: true,
        startingMileage: true,
        TimeSheet: {
          select: {
            endTime: true,
            createdAt: true,
            User: {
              select: {
                firstName: true,
                lastName: true,
              },
            },
          },
        },
        Equipment: {
          select: {
            name: true,
            qrId: true,
          },
        },
      },
    });

    if (!lastMileageEntry) {
      // No previous mileage found for this equipment
      return NextResponse.json({
        lastMileage: null,
        equipmentName: null,
        message: "No previous mileage records found for this equipment",
      });
    }

    return NextResponse.json({
      lastMileage: lastMileageEntry.endingMileage,
      startingMileage: lastMileageEntry.startingMileage,
      equipmentName: lastMileageEntry.Equipment?.name,
      equipmentQrId: lastMileageEntry.Equipment?.qrId,
      lastUpdated: lastMileageEntry.TimeSheet?.createdAt,
      lastUser: lastMileageEntry.TimeSheet?.User
        ? `${lastMileageEntry.TimeSheet.User.firstName} ${lastMileageEntry.TimeSheet.User.lastName}`
        : null,
      timesheetEndTime: lastMileageEntry.TimeSheet?.endTime,
    });
  } catch (error) {
    Sentry.captureException(error);
    console.error("Error fetching last mileage:", error);
    return NextResponse.json(
      { error: "Failed to fetch last mileage" },
      { status: 500 }
    );
  }
}
