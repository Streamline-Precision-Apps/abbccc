"use server";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/auth";

export async function GET(
  request: Request,
  { params }: { params: { employee: string } }
) {
  const session = await auth();
  const userId = session?.user.id;

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { employee } = params;
  const url = new URL(request.url);
  const filter = url.searchParams.get("filter");

  try {
    let timeSheet;
    if (filter === "DENIED") {
      timeSheet = await prisma.timeSheet.findMany({
        where: {
          userId: employee,
          status: "DENIED",
        },
        orderBy: { date: "desc" },
      });
    } else if (filter === "PENDING") {
      timeSheet = await prisma.timeSheet.findMany({
        where: {
          userId: employee,
          status: "PENDING",
        },
        orderBy: { date: "desc" },
      });
    } else if (filter === "APPROVED") {
      timeSheet = await prisma.timeSheet.findMany({
        where: {
          userId: employee,
          status: "APPROVED",
        },
        orderBy: { date: "desc" },
      });
    } else {
      timeSheet = await prisma.timeSheet.findMany({
        where: {
          userId: employee,
        },
        orderBy: { date: "desc" },
      });
      console.log("timeSheets: ", timeSheet);
    }
    // Process to group timeSheet by day
    const uniquetimeSheet = [];
    const seenDates = new Set();
    
    for (const timesheet of timeSheet) {
      const dateOnly = new Date(timesheet.date).toISOString().split("T")[0];
      if (!seenDates.has(dateOnly)) {
        uniquetimeSheet.push(timesheet);
        seenDates.add(dateOnly);
      }
    }

    return NextResponse.json({ timeSheet: uniquetimeSheet });
  } catch (error) {
    console.error("Error fetching Time Sheets:", error);
    return NextResponse.json(
      { error: "Failed to fetch timeSheet" },
      { status: 500 }
    );
  }
}
