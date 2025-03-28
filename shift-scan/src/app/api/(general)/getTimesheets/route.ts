"use server";

import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/auth";

export async function GET(request: Request) {
  let session;

  // Authentication handling with error checking
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
  const dateParam = url.searchParams.get("date");

  // Check if date parameter is provided
  if (!dateParam) {
    return NextResponse.json({ error: "Date parameter is required" }, { status: 400 });
  }

  try {
    // Parse and validate the date parameter
    const date = new Date(dateParam);
    if (isNaN(date.getTime())) {
      return NextResponse.json({ error: "Invalid date format" }, { status: 400 });
    }

    const nextDay = new Date(date);
    nextDay.setDate(date.getDate() + 1);

    // Query the database for timesheets on the specified date
    const timesheets = await prisma.timeSheet.findMany({
      where: {
        userId: userId,
        date: {
          gte: date,
          lt: nextDay,
        },
      },
      orderBy: { date: "desc" },
    });

    // Return the timesheets if found, or a message if none are found
    if (timesheets.length > 0) {
      return NextResponse.json(timesheets);
    } else {
      return NextResponse.json(
        { message: "No timesheets found for the specified date" },
        { status: 404 }
      );
    }
  } catch (error) {
    console.error("Error fetching timesheets:", error);
    return NextResponse.json({ error: "Failed to fetch timesheets" }, { status: 500 });
  }
}
