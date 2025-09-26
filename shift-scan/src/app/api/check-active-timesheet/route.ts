import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { unstable_cache } from "next/cache";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId } = body;

    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    // Cache the active timesheet check for 30 seconds to avoid excessive database queries
    const getCachedActiveTimesheet = unstable_cache(
      async (userId: string) => {
        return await prisma.timeSheet.findFirst({
          where: {
            userId: userId,
            endTime: null, // No end time means still active
          },
          select: {
            id: true,
            startTime: true,
          },
        });
      },
      [`active-timesheet-check-${userId}`],
      {
        revalidate: 30, // Cache for 30 seconds
        tags: [`user-timesheet-${userId}`],
      }
    );

    // Check if user has any active timesheets (no endTime)
    const activeTimesheet = await getCachedActiveTimesheet(userId);

    return NextResponse.json({
      hasActiveTimesheet: !!activeTimesheet,
      timesheetId: activeTimesheet?.id || null,
    });
  } catch (error) {
    console.error("Failed to check active timesheet:", error);
    return NextResponse.json(
      { error: "Failed to check active timesheet" },
      { status: 500 }
    );
  }
}