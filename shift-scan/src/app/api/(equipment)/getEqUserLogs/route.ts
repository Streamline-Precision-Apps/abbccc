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

    // Find all logs for the user via TimeSheet relation
    const usersLogs = await prisma.employeeEquipmentLog.findMany({
      where: {
        TimeSheet: {
          userId: userId,
        },
        startTime: {
          lte: currentDate,
          gte: past24Hours,
        },
      },
      include: {
        Equipment: {
          select: {
            name: true,
          },
        },
        RefuelLog: true,
      },
    });

    if (!usersLogs || usersLogs.length === 0) {
      return NextResponse.json(
        { message: "No unfinished logs found." },
        { status: 404 }
      );
    }

    return NextResponse.json(usersLogs);
  } catch (error) {
    console.error("Error fetching logs:", error);
    let errorMessage = "Failed to fetch logs";
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
