import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/auth";

export const dynamic = "force-dynamic"; // ✅ Ensures this API is dynamic and never pre-rendered

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
        startTime: { gte: past24Hours, lte: currentDate },
        timeSheetId: timeSheetId?.id,
      },
      include: {
        Equipment: true,
      },
    });


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
