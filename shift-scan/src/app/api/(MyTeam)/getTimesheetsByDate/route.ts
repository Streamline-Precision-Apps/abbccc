"use server";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/auth";
import { formatInTimeZone } from "date-fns-tz";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const employeeId = searchParams.get("employeeId");
    const date = searchParams.get("date");

    const session = await auth();
    const userId = session?.user?.id;

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!employeeId) {
      return NextResponse.json({ error: "Missing employeeId" }, { status: 400 });
    }

    if (!date) {
      return NextResponse.json({ error: "Missing date" }, { status: 400 });
    }

    const startOfDay = new Date(date);
    if (isNaN(startOfDay.getTime())) {
      return NextResponse.json({ error: "Invalid date format" }, { status: 400 });
    }
    
    startOfDay.setUTCHours(0, 0, 0, 0);

    const endOfDay = new Date(startOfDay);
    endOfDay.setUTCHours(23, 59, 59, 999);

    console.log("Start Of Day:", startOfDay, "End Of Day:", endOfDay);

    const timeSheets = await prisma.timeSheet.findMany({
      where: {
        userId: employeeId,
        date: {
          gte: startOfDay.toISOString(), // Start of the day in UTC
          lte: endOfDay.toISOString(), // End of the day in UTC
        },
      },
      orderBy: {
        startTime: "asc",
      },
      include: {
        tascoLogs: true,
        truckingLogs: true,
        maintenanceLogs: true,
        employeeEquipmentLogs: true,
      },
    });

    if (!timeSheets || timeSheets.length === 0) {
      return NextResponse.json(
        { message: "No timesheets found for the specified date." },
        { status: 404 }
      );
    }

    console.log("Fetched Timesheets:", timeSheets);

    // Convert fetched ISO times to local timezone
    const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const adjustedTimeSheets = timeSheets.map((sheet) => ({
      ...sheet,
      submitDate: sheet.submitDate
        ? formatInTimeZone(sheet.submitDate, timeZone, "yyyy-MM-dd HH:mm:ss")
        : "",
      date: formatInTimeZone(sheet.date, timeZone, "yyyy-MM-dd"),
      startTime: sheet.startTime
        ? formatInTimeZone(sheet.startTime, timeZone, "yyyy-MM-dd HH:mm:ss")
        : "",
      endTime: sheet.endTime
        ? formatInTimeZone(sheet.endTime, timeZone, "yyyy-MM-dd HH:mm:ss")
        : "",
    }));

    return NextResponse.json(adjustedTimeSheets, {
      headers: {
        "Cache-Control": "public, max-age=60, s-maxage=60, stale-while-revalidate=30",
      },
    });
  } catch (error) {
    console.error("Error fetching timesheets:", error);

    let errorMessage = "Failed to fetch timesheets";
    if (error instanceof Error) {
      errorMessage = error.message;
    }

    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
