"use server";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/auth";

export async function GET() {
  try {
    const session = await auth();
    const userId = session?.user?.id;

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const currentDate = new Date();
    const past24Hours = new Date(currentDate.getTime() - 24 * 60 * 60 * 1000);

    const timeSheetId = await prisma.timeSheet.findFirst({
      where: {
        userId: userId,
        endTime: null,
      },
    });

    const logs = await prisma.employeeEquipmentLog.findMany({
      where: {
        employeeId: userId,
        createdAt: { lte: currentDate, gte: past24Hours },
        timeSheetId: timeSheetId?.id,
      },
      include: {
        Equipment: true,
      },
    });

    if (!logs || logs.length === 0) {
      return NextResponse.json(
        { message: "No logs found for the past 24 hours." },
        { status: 404 }
      );
    }

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
