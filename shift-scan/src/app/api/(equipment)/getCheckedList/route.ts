import { NextResponse } from "next/server";
import { unstable_cache } from "next/cache";
import prisma from "@/lib/prisma";
import { auth } from "@/auth";

export const dynamic = "force-dynamic"; // ✅ Ensures this API is dynamic and never pre-rendered


export async function GET() {
  try {
    const session = await auth();
    const userId = session?.user?.id;

    const currentDate = new Date();
    const past24Hours = new Date(currentDate.getTime() - 24 * 60 * 60 * 1000);
    
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Find the current open timesheet for this user
    const timeSheetId = await prisma.timeSheet.findFirst({
      where: {
        userId: userId,
        endTime: null,
      },
    });

    if (!timeSheetId) {
      return NextResponse.json(
        { message: "No open timesheet found for this user." },
        { status: 404 }
      );
    }

    // Create a cached function for fetching active equipment logs
    const getCachedEquipmentLogs = unstable_cache(
      async (userId: string, timesheetId: number, past24Hours: Date, currentDate: Date) => {
        return await prisma.employeeEquipmentLog.findMany({
          where: {
            startTime: { gte: past24Hours, lte: currentDate },
            timeSheetId: timesheetId,
          },
          include: {
            Equipment: true,
          },
        });
      },
      [`equipment-logs-${userId}-${timeSheetId.id}`],
      {
        tags: [`equipment-logs-${userId}`, "equipment", "timesheets"],
        revalidate: 60, // Cache for 1 minute (very short for real-time data)
      }
    );

    // Get the cached equipment logs
    const logs = await getCachedEquipmentLogs(userId, timeSheetId.id, past24Hours, currentDate);

    return NextResponse.json(logs);
  } catch (error) {
    console.error("Error fetching logs:", error);

    let errorMessage = "Failed to fetch logs";
    if (error instanceof Error) {
      errorMessage = error.message;
    }

    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
