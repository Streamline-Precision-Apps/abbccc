import { NextResponse } from "next/server";
import * as Sentry from "@sentry/nextjs";
import prisma from "@/lib/prisma";
import { formatInTimeZone } from "date-fns-tz";
import { it } from "node:test";

export const dynamic = "force-dynamic"; // ✅ Ensures this API is dynamic and never pre-rendered

export async function GET(
  request: Request,
  { params }: { params: Promise<{ timeSheetId: string }> }
) {
  const { timeSheetId } = await params;

  // Validate the timeSheetId parameter
  if (!timeSheetId || typeof timeSheetId !== "string") {
    return NextResponse.json(
      { error: "Invalid or missing timeSheetId" },
      { status: 400 }
    );
  }

  try {
    // Fetch the ending mileage for the provided timeSheetId
    const laborType = await prisma.truckingLog.findFirst({
      where: {
        id: timeSheetId,
      },
      select: {
        TruckingLaborLogs: {
          select: {
            id: true,
            type: true,
            startTime: true,
            endTime: true,
          },
        },
      },
    });

    const newValues = laborType?.TruckingLaborLogs.map((item) => ({
      ...item,
      id: item.id,
      type: item.type,
      startTime: item.startTime.toISOString(),
      endTime: item.endTime?.toISOString() || null,
    }));

    // Return the ending mileage
    return NextResponse.json(newValues);
  } catch (error) {
    Sentry.captureException(error);
    console.error("Error fetching trucking log:", error);
    return NextResponse.json(
      { error: "Failed to fetch trucking log" },
      { status: 500 }
    );
  }
}
