"use server";

import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(
  request: Request,
  { params }: { params: { timeSheetId: string } }
) {
  const { timeSheetId } = params;

  // Validate timeSheetId parameter
  if (!timeSheetId || typeof timeSheetId !== "string") {
    return NextResponse.json({ error: "Invalid or missing timeSheetId" }, { status: 400 });
  }

  try {
    // Fetch state mileage (refueled) records for the given truckingLogId (timeSheetId)
    const stateMileage = await prisma.refueled.findMany({
      where: {
        truckingLogId: timeSheetId,
      },
    });

    // If no records found, return a 404 response
    if (stateMileage.length === 0) {
      return NextResponse.json({ message: "No state mileage found for the provided timeSheetId" }, { status: 404 });
    }

    // Return the fetched state mileage data
    return NextResponse.json(stateMileage);
  } catch (error) {
    console.error("Error fetching state mileage:", error);
    return NextResponse.json({ error: "Failed to fetch state mileage" }, { status: 500 });
  }
}
