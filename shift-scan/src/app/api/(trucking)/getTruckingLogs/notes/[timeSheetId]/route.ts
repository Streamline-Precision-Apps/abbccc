"use server";

import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(
  request: Request,
  { params }: { params: { timeSheetId: string } }
) {
  const { timeSheetId } = params;

  // Validate the timeSheetId parameter
  if (!timeSheetId || typeof timeSheetId !== "string") {
    return NextResponse.json({ error: "Invalid or missing timeSheetId" }, { status: 400 });
  }

  try {
    // Fetch the comment for the provided timeSheetId from the truckingLog
    const notes = await prisma.truckingLog.findFirst({
      where: {
        id: timeSheetId,
      },
      select: {
        comment: true,
      },
    });

    // Handle case when no matching record is found
    if (!notes) {
      return NextResponse.json({ error: "No notes found for the provided timeSheetId" }, { status: 404 });
    }

    // Return the fetched notes (comment)
    return NextResponse.json(notes);
  } catch (error) {
    console.error("Error fetching trucking log:", error);
    return NextResponse.json({ error: "Failed to fetch trucking log" }, { status: 500 });
  }
}
