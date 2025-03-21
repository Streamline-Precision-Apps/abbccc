"use server";

import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/auth";

export async function GET() {
  let session;
  
  // Handle authentication errors
  try {
    session = await auth();
  } catch (error) {
    console.error("Error during authentication:", error);
    return NextResponse.json({ error: "Authentication failed" }, { status: 500 });
  }

  const userId = session?.user.id;

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // Get the start and end of the current day
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    // Query the database for timesheets for the current day
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

    // Check if timesheets were found and return appropriate response
    if (timesheets.length === 0) {
      return NextResponse.json({ message: "No timesheets found for today" }, { status: 404 });
    }

    return NextResponse.json(timesheets);
  } catch (error) {
    console.error("Error fetching Time Sheets:", error);
    return NextResponse.json({ error: "Failed to fetch pay period sheets" }, { status: 500 });
  }
}
