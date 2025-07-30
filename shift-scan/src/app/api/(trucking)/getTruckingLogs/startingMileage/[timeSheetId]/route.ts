import { NextResponse } from "next/server";
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
    // Fetch the starting mileage for the provided timeSheetId
    const truckingLog = await prisma.truckingLog.findFirst({
      where: {
        id: timeSheetId,
      },
      select: {
        startingMileage: true,
      },
    });

    // Return the starting mileage
    return NextResponse.json(truckingLog);
  } catch (error) {
    console.error("Error fetching trucking log starting mileage:", error);
    return NextResponse.json(
      { error: "Failed to fetch trucking log starting mileage" },
      { status: 500 }
    );
  }
}
