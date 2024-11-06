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
  const session = await auth();

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Calculate the start date of the current pay period
  const payPeriodStart = calculatePayPeriodStart();
  const currentDate = new Date();

  try {
    // Fetch timesheets for the current pay period
    const payPeriodSheets = await prisma.timeSheets.findMany({
      where: {
        startTime: {
          gte: payPeriodStart, // Start of the pay period
          lte: currentDate, // Up until the current date/time
        },
      },
      select: {
        startTime: true,
        duration: true,
      },
    });

    // Filter out timesheets where duration is null
    const validSheets = payPeriodSheets.filter(
      (sheet) => sheet.duration !== null
    );

    // Return the filtered timesheets with caching disabled
    return NextResponse.json(validSheets, {
      headers: {
        "Cache-Control": "no-store", // Prevent caching of sensitive data
      },
    });
  } catch (error) {
    console.error("Error fetching pay period sheets:", error);
    return NextResponse.json(
      { error: "Failed to fetch pay period sheets" },
      { status: 500 }
    );
  }
}
