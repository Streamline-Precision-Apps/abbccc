import { NextResponse } from "next/server";
import * as Sentry from "@sentry/nextjs";
import prisma from "@/lib/prisma";
import { auth } from "@/auth";

export const dynamic = "force-dynamic";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ equipmentId: string }> },
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
      { status: 400 },
    );
  }

  try {
    // Find the most recent trucking log entry for this equipment that has an ending mileage
    // Prioritize truck usage, then trailer, then hauled equipment
    const lastMileageEntry = await prisma.truckingLog.findFirst({
      where: {
        OR: [
          { truckNumber: equipmentId }, // Equipment used as truck (most common for mileage)
          { trailerNumber: equipmentId }, // Equipment used as trailer
          { equipmentId: equipmentId }, // Equipment being hauled
        ],
        endingMileage: {
          not: null, // Only get entries that have an ending mileage recorded
        },
      },
      orderBy: [
        {
          TimeSheet: {
            // Order by creation time if endTime is null, otherwise by endTime
            createdAt: "desc",
          },
        },
      ],
      include: {
        Equipment: true,
        TimeSheet: {
          include: {
            User: true,
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

    const response = {
      lastMileage: lastMileageEntry.endingMileage,
      startingMileage: lastMileageEntry.startingMileage,
      equipmentName: lastMileageEntry.Equipment?.name,
      equipmentQrId: lastMileageEntry.Equipment?.qrId,
      lastUpdated: lastMileageEntry.TimeSheet?.createdAt,
      lastUser: lastMileageEntry.TimeSheet?.User
        ? `${lastMileageEntry.TimeSheet.User.firstName} ${lastMileageEntry.TimeSheet.User.lastName}`
        : null,
      timesheetEndTime: lastMileageEntry.TimeSheet?.endTime,
    };

    return NextResponse.json(response);
  } catch (error) {
    Sentry.captureException(error);
    console.error("Error fetching last mileage:", error);
    return NextResponse.json(
      { error: "Failed to fetch last mileage" },
      { status: 500 },
    );
  }
}
