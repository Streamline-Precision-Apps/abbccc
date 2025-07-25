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
    // Fetch the ending mileage for the provided timeSheetId
    const endingMileage = await prisma.truckingLog.findFirst({
      where: {
        id: timeSheetId,
      },
      select: {
        endingMileage: true,
      },
    });

    // Return the ending mileage
    return NextResponse.json(endingMileage);
  } catch (error) {
    Sentry.captureException(error);
    console.error("Error fetching trucking log:", error);
    return NextResponse.json(
      { error: "Failed to fetch trucking log" },
      { status: 500 }
    );
  }
}
