import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { a } from "framer-motion/dist/types.d-Cjd591yU";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId } = body;

    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 },
      );
    }

    // Cache the active timesheet check for 30 seconds to avoid excessive database queries

    const activeTimesheet = await prisma.timeSheet.findFirst({
      where: {
        userId: userId,
        endTime: null, // No end time means still active
      },
      select: {
        id: true,
        startTime: true,
      },
    });

    const hasActiveTimesheet = activeTimesheet ? true : false;

    return NextResponse.json({
      hasActiveTimesheet: hasActiveTimesheet,
      timesheetId: activeTimesheet?.id || null,
    });
  } catch (error) {
    console.error("Failed to check active timesheet:", error);
    return NextResponse.json(
      { error: "Failed to check active timesheet" },
      { status: 500 },
    );
  }
}
