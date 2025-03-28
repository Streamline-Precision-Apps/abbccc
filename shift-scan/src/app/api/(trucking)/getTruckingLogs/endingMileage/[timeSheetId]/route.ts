"use server";

import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(
  request: Request,
  { params }: { params: { timeSheetId: string } }
) {
  const { timeSheetId } = params;

  // Validate the timeSheetId parameter
  if (!timeSheetId || typeof timeSheetId !== "string") {
    return NextResponse.json({ error: "Invalid or missing timeSheetId" }, { status: 400 });
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

    // Handle case when no matching record is found
    if (!endingMileage) {
      return NextResponse.json({ error: "TimeSheet not found" }, { status: 404 });
    }

    // Return the ending mileage
    return NextResponse.json(endingMileage);
  } catch (error) {
    console.error("Error fetching trucking log:", error);
    return NextResponse.json({ error: "Failed to fetch trucking log" }, { status: 500 });
  }
}
