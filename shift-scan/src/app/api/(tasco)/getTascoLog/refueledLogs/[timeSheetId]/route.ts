"use server";

import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(
  request: Request,
  { params }: { params: { timeSheetId: string } }
) {
  const { timeSheetId } = params;

  // Ensure timeSheetId is provided and is a valid string
  if (!timeSheetId || typeof timeSheetId !== "string") {
    return NextResponse.json({ error: "Invalid or missing timeSheetId" }, { status: 400 });
  }

  try {
    const stateMileage = await prisma.refuelLog.findMany({
      where: {
        tascoLogId: timeSheetId,
      },
    });

    // If no state mileage records are found, return an empty array
    if (stateMileage.length === 0) {
      return NextResponse.json([], { status: 200 });
    }

    return NextResponse.json(stateMileage);
  } catch (error) {
    // Log the error for debugging purposes
    console.error("Error fetching state mileage:", error);
    return NextResponse.json(
      { error: "Failed to fetch state mileage data" },
      { status: 500 }
    );
  }
}
