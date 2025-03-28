"use server";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/auth";

// Utility to calculate the start date of the current pay period
const calculatePayPeriodStart = (): Date => {
  const startDate = new Date(2024, 7, 5); // August 5, 2024
  const now = new Date();
  const diffWeeks = Math.floor(
    (now.getTime() - startDate.getTime()) / (2 * 7 * 24 * 60 * 60 * 1000)
  ); // Two-week intervals
  return new Date(
    startDate.getTime() + diffWeeks * 2 * 7 * 24 * 60 * 60 * 1000
  );
};

export async function GET() {
  try {
    // Authenticate the user
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const userId = session.user.id;

    // Calculate the start date of the current pay period
    const payPeriodStart = calculatePayPeriodStart();
    const currentDate = new Date();

    // Fetch timesheets for the current pay period
    const payPeriodSheets = await prisma.timeSheet.findMany({
      where: {
        userId,
        startTime: {
          gte: payPeriodStart, // Start of the pay period
          lte: currentDate, // Up until the current date/time
        },
        endTime: {
          not: null, // Exclude timesheets without an end time
        },
      },
      select: {
        id: true,
        startTime: true,
        endTime: true,
      },
    });

    // Return the filtered timesheets with caching disabled
    return NextResponse.json(payPeriodSheets, {
      headers: {
        "Cache-Control": "no-store", // Prevent caching of sensitive data
      },
    });
  } catch (error) {
    console.error("Error fetching pay period sheets:", error);

    let errorMessage = "Failed to fetch pay period sheets";
    if (error instanceof Error) {
      errorMessage = error.message;
    }

    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
