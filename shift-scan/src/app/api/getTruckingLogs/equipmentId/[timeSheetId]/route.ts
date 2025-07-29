import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ timeSheetId: string }> }
) {
  try {
    const { timeSheetId } = await params;

    if (!timeSheetId) {
      return NextResponse.json(
        { error: "Missing timeSheetId parameter" },
        { status: 400 }
      );
    }

    // Find the trucking log and get the equipment ID
    const truckingLog = await prisma.truckingLog.findFirst({
      where: {
        timeSheetId: timeSheetId,
      },
      select: {
        equipmentId: true,
        Equipment: {
          select: {
            id: true,
            name: true,
            qrId: true,
          },
        },
      },
    });

    if (!truckingLog) {
      return NextResponse.json(
        { error: "No trucking log found for this timesheet" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      equipmentId: truckingLog.equipmentId,
      equipment: truckingLog.Equipment,
    });
  } catch (error) {
    console.error("Error fetching equipment ID from trucking log:", error);
    return NextResponse.json(
      { error: "Failed to fetch equipment ID" },
      { status: 500 }
    );
  }
}
