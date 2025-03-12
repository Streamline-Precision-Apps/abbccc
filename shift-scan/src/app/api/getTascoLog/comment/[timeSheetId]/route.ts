"use server";

import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(
  request: Request,
  { params }: { params: { timeSheetId: string } }
) {
  const { timeSheetId } = params;

  // Ensure timeSheetId is provided and is a valid string
  if (!timeSheetId || typeof timeSheetId !== "string") {
    return NextResponse.json({ error: "Invalid or missing timeSheetId" }, { status: 400 });
  }

  try {
    const notes = await prisma.tascoLog.findFirst({
      where: {
        id: timeSheetId,
      },
      select: {
        comment: true,
      },
    });

    // If no notes are found, return a 404
    if (!notes) {
      return NextResponse.json({ error: "No matching record found" }, { status: 404 });
    }

    return NextResponse.json(notes);
  } catch (error) {
    // Log the error for debugging purposes
    console.error("Error fetching tascoLog:", error);
    return NextResponse.json(
      { error: "Failed to fetch logs" },
      { status: 500 }
    );
  }
}
