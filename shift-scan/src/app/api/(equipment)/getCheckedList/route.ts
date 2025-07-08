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

    // Find the current open timesheet for this user
    const currentTimeSheet = await prisma.timeSheet.findFirst({
      where: {
        userId: userId,
        endTime: null,
      },
    });

    if (!currentTimeSheet) {
      return NextResponse.json(
        { message: "No open timesheet found for this user." },
        { status: 404 }
      );
    }

    // Find all equipment logs for the current timesheet that are not finished (endTime is null)
    const logs = await prisma.employeeEquipmentLog.findMany({
      where: {
        timeSheetId: currentTimeSheet.id,
        endTime: null,
      },
      include: {
        Equipment: true,
      },
    });

    if (!logs || logs.length === 0) {
      return NextResponse.json(
        { message: "No unfinished equipment logs for the current timesheet." },
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
