import { NextResponse } from "next/server";
import * as Sentry from "@sentry/nextjs";
import prisma from "@/lib/prisma";

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
    // Fetch state mileage records for the given truckingLogId (timeSheetId)
    const stateMileage = await prisma.stateMileage.findMany({
      where: {
        truckingLogId: timeSheetId,
      },
    });

    // Return the fetched state mileage data
    return NextResponse.json(stateMileage);
  } catch (error) {
    Sentry.captureException(error);
    console.error("Error fetching state mileage:", error);
    return NextResponse.json(
      { error: "Failed to fetch state mileage" },
      { status: 500 }
    );
  }
}
