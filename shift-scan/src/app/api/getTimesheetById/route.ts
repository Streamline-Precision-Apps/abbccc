"use server";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/auth";
import { useTimeSheetData } from "@/app/context/TimeSheetIdContext";

export async function GET() {
  const session = await auth();
  const userId = session?.user.id;
  const { savedTimeSheetData } = useTimeSheetData();

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    if (savedTimeSheetData && savedTimeSheetData.id) {

      const timesheet = await prisma.timeSheets.findUnique({
        where: {
          id: Number(savedTimeSheetData.id),
        },
      });

      return timesheet
        ? NextResponse.json(timesheet)
        : NextResponse.json(
            { message: "No timesheets found for the specified date" },
            { status: 404 }
          );
    } else {
      return NextResponse.json(
        { error: "Date parameter is required" },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error("Error fetching Time Sheets:", error);
    return NextResponse.json(
      { error: "Failed to fetch timesheets" },
      { status: 500 }
    );
  }
}
