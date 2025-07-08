import { NextResponse } from "next/server";
import * as Sentry from "@sentry/nextjs";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic"; // ✅ Ensures this API is dynamic and never pre-rendered

export async function GET(
  request: Request,
  { params }: { params: { timeSheetId: string } }
) {
  const { timeSheetId } = params;

  // Validate timeSheetId parameter
  if (!timeSheetId || typeof timeSheetId !== "string") {
    return NextResponse.json(
      { error: "Invalid or missing timeSheetId" },
      { status: 400 }
    );
  }

  try {
    // Query the database for materials related to the given truckingLogId (timeSheetId)
    const material = await prisma.material.findMany({
      where: {
        truckingLogId: timeSheetId,
      },
    });

    // Return the found materials (state mileage)
    return NextResponse.json(material);
  } catch (error) {
    Sentry.captureException(error);
    console.error("Error fetching materials:", error);
    return NextResponse.json(
      { error: "Failed to fetch material" },
      { status: 500 }
    );
  }
}
