import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

/**
 * Fetches all change logs for a specific timesheet
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const timeSheetId = searchParams.get("timeSheetId");

    if (!timeSheetId) {
      return NextResponse.json(
        { error: "TimeSheet ID is required" },
        { status: 400 },
      );
    }

    const changeLogs = await prisma.timeSheetChangeLog.findMany({
      where: {
        timeSheetId: parseInt(timeSheetId),
      },
      include: {
        User: {
          select: {
            firstName: true,
            lastName: true,
          },
        },
      },
      orderBy: {
        changedAt: "desc",
      },
    });

    return NextResponse.json(changeLogs);
  } catch (error) {
    console.error("Error fetching timesheet change logs:", error);
    return NextResponse.json(
      { error: "Failed to fetch timesheet change logs" },
      { status: 500 },
    );
  }
}
