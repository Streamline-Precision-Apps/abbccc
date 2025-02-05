"use server";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/auth";

export async function GET() {
  const session = await auth();
  const userId = session?.user.id;

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const timesheet = await prisma.timeSheet.findFirst({
      where: {
        userId,
        endTime: null,
      },
      orderBy: {
        submitDate: "desc", // Sort by date starting with most recent date
      },
      select: {
        id: true,
        endTime: true,
      },
    });

    return NextResponse.json(timesheet, {
      headers: {
        "Cache-Control": "no-store", // Prevent caching of sensitive data
      },
    });
  } catch (error) {
    console.error("Error fetching Time Sheets:", error);
    return NextResponse.json(
      { error: "Failed to fetch timesheets" },
      { status: 500 }
    );
  }
}
