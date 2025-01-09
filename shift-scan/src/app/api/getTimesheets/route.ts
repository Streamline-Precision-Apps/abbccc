"use server";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/auth";

export async function GET(request: Request) {
  const session = await auth();
  const userId = session?.user.id;

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const url = new URL(request.url);
  const dateParam = url.searchParams.get("date");

  try {
    if (dateParam) {
      const date = new Date(dateParam);

      if (isNaN(date.getTime())) {
        return NextResponse.json(
          { error: "Invalid date format" },
          { status: 400 }
        );
      }

      const nextDay = new Date(date);
      nextDay.setDate(date.getDate() + 1);

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

      return timesheets.length > 0
        ? NextResponse.json(timesheets)
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
