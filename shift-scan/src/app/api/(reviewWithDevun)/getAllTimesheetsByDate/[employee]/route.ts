"use server";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/auth";

export async function GET(
  request: Request,
  { params }: { params: { employee: string } }
) {
  try {
    const session = await auth();
    const userId = session?.user?.id;

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { employee } = params;
    if (!employee) {
      return NextResponse.json(
        { error: "Missing or invalid employee ID" },
        { status: 400 }
      );
    }

    const url = new URL(request.url);
    const dateQuery = url.searchParams.get("date");

    if (!dateQuery) {
      return NextResponse.json({ error: "Missing date query parameter" }, { status: 400 });
    }

    const date = new Date(dateQuery);
    if (isNaN(date.getTime())) {
      return NextResponse.json({ error: "Invalid date format" }, { status: 400 });
    }

    // Define start and end of the day in UTC
    const targetDate = new Date(date);
    const startOfDay = new Date(
      Date.UTC(
        targetDate.getFullYear(),
        targetDate.getMonth(),
        targetDate.getDate(),
        0, 0, 0, 0
      )
    );

    const endOfDay = new Date(
      Date.UTC(
        targetDate.getFullYear(),
        targetDate.getMonth(),
        targetDate.getDate(),
        23, 59, 59, 999
      )
    );

    console.log("Date:", date, "StartOfDay:", startOfDay, "EndOfDay:", endOfDay);

    // Fetch employee equipment logs
    const eqSheets = await prisma.employeeEquipmentLog.findMany({
      where: {
        employeeId: employee,
        createdAt: {
          gte: startOfDay.toISOString(), // Start of the day
          lte: endOfDay.toISOString(), // End of the day
        },
      },
      orderBy: { createdAt: "desc" },
    });

    console.log("eqSheets:", eqSheets[0]?.startTime);

    // Fetch timesheets
    const timesheets = await prisma.timeSheet.findMany({
      where: {
        userId: employee,
        date: date,
      },
      orderBy: { date: "desc" },
    });

    if (!eqSheets.length && !timesheets.length) {
      return NextResponse.json(
        { message: "No data found for the given employee and date." },
        { status: 404 }
      );
    }

    const combinedResponse = {
      equipmentLogs: eqSheets,
      timesheets: timesheets,
    };

    return NextResponse.json(combinedResponse);
  } catch (error) {
    console.error("Error fetching Time Sheets:", error);
    
    let errorMessage = "Failed to fetch timesheets";
    if (error instanceof Error) {
      errorMessage = error.message;
    }

    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}
