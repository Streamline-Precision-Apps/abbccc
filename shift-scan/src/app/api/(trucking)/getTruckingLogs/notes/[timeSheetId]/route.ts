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
    return NextResponse.json(
      { error: "Invalid or missing timeSheetId" },
      { status: 400 }
    );
  }

  try {
    // Fetch the comment for the provided timeSheetId from the truckingLog
    const notes = await prisma.truckingLog.findFirst({
      where: {
        id: timeSheetId,
      },
      select: {
        TimeSheet: {
          select: {
            comment: true,
          },
        },
      },
    });

    const comment = notes?.TimeSheet?.comment;

    if (comment === null || comment === undefined) {
      return NextResponse.json(""); // Return an empty string
    }

    // Return the fetched notes (comment)
    return NextResponse.json(comment);
  } catch (error) {
    console.error("Error fetching trucking log:", error);
    return NextResponse.json(
      { error: "Failed to fetch trucking log" },
      { status: 500 }
    );
  }
}
