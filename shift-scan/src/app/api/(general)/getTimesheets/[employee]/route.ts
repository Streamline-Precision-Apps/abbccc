"use server";

import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/auth";
import { ApprovalStatus } from "@/lib/enums";

export async function GET(
  request: Request,
  { params }: { params: { employee: string } }
) {
  let session;
  
  // Handle authentication
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

  const { employee } = params;
  const url = new URL(request.url);
  const filter = url.searchParams.get("filter");

  try {

    // Map filter to ApprovalStatus
    const statusMap: Record<string, ApprovalStatus> = {
      PENDING: ApprovalStatus.PENDING,
      APPROVED: ApprovalStatus.APPROVED,
      REJECTED: ApprovalStatus.REJECTED,
    };

    const status = filter !== null ? statusMap[filter as keyof typeof statusMap] : undefined;

    // Query the database with the filter applied (if any)
    const timeSheet = await prisma.timeSheet.findMany({
      where: {
        userId: employee,
        ...(status && { status }),
      },
      orderBy: { date: "desc" },
    });

    // Handle case when no timeSheet is found
    if (timeSheet.length === 0) {
      return NextResponse.json({ message: "No timesheets found" }, { status: 404 });
    }

    // Group the timesheets by day
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
    return NextResponse.json({ error: "Failed to fetch timeSheet" }, { status: 500 });
  }
}
