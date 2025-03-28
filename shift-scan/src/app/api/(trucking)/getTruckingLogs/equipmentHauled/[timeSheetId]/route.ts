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
    // Fetch state mileage based on truckingLogId (timeSheetId)
    const stateMileage = await prisma.equipmentHauled.findMany({
      where: {
        truckingLogId: timeSheetId,
      },
      include: {
        equipment: {
          select: {
            name: true,
          },
        },
        jobSite: {
          select: {
            name: true,
          },
        },
      },
    });

    // If no state mileage records are found, return a 404 response
    if (stateMileage.length === 0) {
      return NextResponse.json({ message: "No state mileage found for the provided timeSheetId" }, { status: 404 });
    }

    // Return the state mileage data
    return NextResponse.json(stateMileage);
  } catch (error) {
    console.error("Error fetching state mileage:", error);
    return NextResponse.json({ error: "Failed to fetch state mileage" }, { status: 500 });
  }
}
