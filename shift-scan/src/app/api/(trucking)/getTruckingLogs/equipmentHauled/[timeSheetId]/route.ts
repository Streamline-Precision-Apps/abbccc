import { NextResponse } from "next/server";
import * as Sentry from "@sentry/nextjs";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic"; // ✅ Ensures this API is dynamic and never pre-rendered

export async function GET(
  request: Request,
  { params }: { params: { timeSheetId: string } }
) {
  const { timeSheetId } = params;

  // Validate the timeSheetId parameter
  if (!timeSheetId || typeof timeSheetId !== "string") {
    return NextResponse.json(
      { error: "Invalid or missing timeSheetId" },
      { status: 400 }
    );
  }

  try {
    // Query the database for equipment hauled directly using the truckingLogId
    // Note: timeSheetId parameter is actually a truckingLogId from the frontend
    const equipmentHauled = await prisma.equipmentHauled.findMany({
      where: {
        truckingLogId: timeSheetId, // timeSheetId is actually truckingLogId
      },
      include: {
        Equipment: {
          select: {
            id: true,
            name: true,
          },
        },
        JobSite: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    // Return the equipment hauled data
    return NextResponse.json(equipmentHauled);
  } catch (error) {
    Sentry.captureException(error);
    console.error("Error fetching state mileage:", error);
    return NextResponse.json(
      { error: "Failed to fetch state mileage" },
      { status: 500 }
    );
  }
}

