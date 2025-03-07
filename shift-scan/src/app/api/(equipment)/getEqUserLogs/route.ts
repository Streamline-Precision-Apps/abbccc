"use server";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/auth";
export async function GET() {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const currentDate = new Date();
    const past24Hours = new Date(currentDate.getTime() - 24 * 60 * 60 * 1000);

    const usersLogs = await prisma.employeeEquipmentLog.findMany({
      where: {
        employeeId: userId,
        createdAt: {
          lte: currentDate,
          gte: past24Hours,
        },
        isSubmitted: false,
      },
      include: {
        Equipment: {
          select: {
            name: true,
          },
        },
        refueled: true,
      },
    });
    console.log("usersLogs: ", usersLogs);
    return NextResponse.json(usersLogs);
  } catch (error) {
    console.error("Error fetching users logs:", error);
    return NextResponse.json(
      { error: "Failed to fetch users logs" },
      { status: 500 }
    );
  }
}
