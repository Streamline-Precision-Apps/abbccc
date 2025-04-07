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

    const usersLogs = await prisma.employeeEquipmentLog.findMany({
      where: {
        employeeId: userId,
        createdAt: {
          lte: currentDate,
          gte: past24Hours,
        },
        isFinished: false,
      },
      include: {
        Equipment: {
          select: {
            name: true,
          },
        },
        RefuelLogs: true,
      },
    });

    if (!usersLogs || usersLogs.length === 0) {
      return NextResponse.json(
        { message: "No unfinished logs found in the past 24 hours." },
        { status: 404 }
      );
    }

    console.log("usersLogs: ", usersLogs);
    return NextResponse.json(usersLogs);
  } catch (error) {
    console.error("Error fetching users logs:", error);

    let errorMessage = "Failed to fetch users logs";
    if (error instanceof Error) {
      errorMessage = error.message;
    }

    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}
