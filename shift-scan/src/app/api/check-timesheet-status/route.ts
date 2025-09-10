import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, timesheetId } = body;

    if (!userId || !timesheetId) {
      return NextResponse.json(
        { error: "Missing userId or timesheetId" },
        { status: 400 }
      );
    }

    // Check if the timesheet exists and belongs to the user
    const timesheet = await prisma.timeSheet.findFirst({
      where: {
        id: parseInt(timesheetId),
        userId: userId,
      },
      select: {
        id: true,
        endTime: true,
        userId: true,
      },
    });

    if (!timesheet) {
      return NextResponse.json(
        { error: "Timesheet not found" },
        { status: 404 }
      );
    }

    // Check if the timesheet has been clocked out (has endTime)
    const isClockedOut = timesheet.endTime !== null;

    return NextResponse.json({
      isClockedOut,
      timesheetId: timesheet.id,
      endTime: timesheet.endTime,
    });
  } catch (error) {
    console.error("Failed to check timesheet status:", error);
    return NextResponse.json(
      { error: "Failed to check timesheet status" },
      { status: 500 }
    );
  }
}
