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
    return NextResponse.json(
      { error: "Invalid or missing timeSheetId" },
      { status: 400 }
    );
  }

  try {
    // Fetch state mileage based on truckingLogId (timeSheetId)
    const stateMileage = await prisma.equipmentHauled.findMany({
      where: {
        truckingLogId: timeSheetId,
      },
      include: {
        Equipment: {
          select: {
            name: true,
          },
        },
        JobSite: {
          select: {
            name: true,
          },
        },
      },
    });

    // Return the state mileage data
    return NextResponse.json(stateMileage);
  } catch (error) {
    console.error("Error fetching state mileage:", error);
    return NextResponse.json(
      { error: "Failed to fetch state mileage" },
      { status: 500 }
    );
  }
}
