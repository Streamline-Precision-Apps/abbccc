"use server";

import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/auth";

export async function GET(request: Request) {
  let session;
  
  // Handle authentication with error handling
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

  const url = new URL(request.url);
  const startDateParam = url.searchParams.get('start');
  const endDateParam = url.searchParams.get('end');

  try {
    let timesheets;

    // Validate the date parameters
    if (startDateParam && endDateParam) {
      const startDate = new Date(startDateParam);
      const endDate = new Date(endDateParam);

      if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
        return NextResponse.json({ error: "Invalid date format" }, { status: 400 });
      }

      // Ensure the end date is after the start date
      if (startDate > endDate) {
        return NextResponse.json({ error: "Start date must be before the end date" }, { status: 400 });
      }

      // Set the time to 00:00:00 for startDate and 23:59:59 for endDate
      startDate.setUTCHours(0, 0, 0, 0);
      endDate.setUTCHours(23, 59, 59, 999);

      timesheets = await prisma.timeSheet.findMany({
        where: {
          userId: userId,
          date: {
            gte: startDate,
            lt: endDate,
          },
        },
        orderBy: { date: 'desc' },
      });
    } else {
      // Fetch all timesheets if no start and end dates are provided
      timesheets = await prisma.timeSheet.findMany({
        where: {
          userId: userId,
        },
        orderBy: { date: 'desc' },
      });
    }

    // Return timesheets or a message if no records were found
    if (timesheets.length === 0) {
      return NextResponse.json({ message: "No timesheets found" }, { status: 404 });
    }

    return NextResponse.json(timesheets);
  } catch (error) {
    console.error("Error fetching Time Sheets:", error);
    return NextResponse.json({ error: "Failed to fetch pay period sheets" }, { status: 500 });
  }
}
