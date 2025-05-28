import { NextResponse } from "next/server";
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
    const truckingLog = await prisma.truckingLog.findFirst({
      where: {
        timeSheetId: timeSheetId,
      },
      select: {
        id: true,
      },
    });
    // Fetch state mileage based on truckingLogId (timeSheetId)
    const stateMileage = await prisma.equipmentHauled.findMany({
      where: {
        truckingLogId: truckingLog?.id,
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
