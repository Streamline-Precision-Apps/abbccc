"use server";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/auth";

export async function GET() {
  const session = await auth();
  const userId = session?.user.id;

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // Fetch all timesheets for the current day
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    const timesheets = await prisma.timeSheet.findMany({
      where: {
        userId: userId,
        submitDate: {
          gte: startOfDay,
          lte: endOfDay,
        },
      },
      orderBy: { submitDate: "asc" },
    });

    return NextResponse.json(timesheets);
  } catch (error) {
    console.error("Error fetching Time Sheets:", error);
    return NextResponse.json(
      { error: "Failed to fetch pay period sheets" },
      { status: 500 }
    );
  }
}
