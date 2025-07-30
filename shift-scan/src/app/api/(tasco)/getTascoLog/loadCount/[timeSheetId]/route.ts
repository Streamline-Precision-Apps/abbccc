"use server";

import { NextResponse } from "next/server";
import * as Sentry from "@sentry/nextjs";
import prisma from "@/lib/prisma";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ timeSheetId: string }> }
) {
  const { timeSheetId } = await params;

  try {
    const count = await prisma.tascoLog.findFirst({
      where: {
        id: timeSheetId,
      },
      select: {
        LoadQuantity: true,
      },
    });

    // If no notes are found, return a 404
    if (!count) {
      return NextResponse.json(
        { error: "No matching record found" },
        { status: 404 }
      );
    }

    return NextResponse.json(count);
  } catch (error) {
    Sentry.captureException(error);
    console.error("Error fetching tascoLog:", error);
    return NextResponse.json(
      { error: "Failed to fetch logs" },
      { status: 500 }
    );
  }
}
