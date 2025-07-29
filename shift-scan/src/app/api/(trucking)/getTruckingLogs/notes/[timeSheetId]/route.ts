import { NextResponse } from "next/server";
import * as Sentry from "@sentry/nextjs";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic"; // ✅ Ensures this API is dynamic and never pre-rendered

export async function GET(
  request: Request,
  { params }: { params: Promise<{ timeSheetId: string }> }
) {
  const { timeSheetId } = await params;

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
    Sentry.captureException(error);
    console.error("Error fetching trucking log:", error);
    return NextResponse.json(
      { error: "Failed to fetch trucking log" },
      { status: 500 }
    );
  }
}
