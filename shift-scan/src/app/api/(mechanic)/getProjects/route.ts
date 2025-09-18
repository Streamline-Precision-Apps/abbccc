import { NextResponse } from "next/server";
import * as Sentry from "@sentry/nextjs";
import prisma from "@/lib/prisma";
import { auth } from "@/auth";

export const dynamic = "force-dynamic"; // ✅ Ensures this API is dynamic and never pre-rendered

export async function GET(request: Request) {
  try {
    // Authenticate the user
    const session = await auth();
    const userId = session?.user?.id;

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get the timecard ID from the URL query parameters
    const { searchParams } = new URL(request.url);
    const timecardId = searchParams.get("timecardId");

    if (!timecardId) {
      return NextResponse.json(
        { error: "Timecard ID is required" },
        { status: 400 },
      );
    }

    const projects = await prisma.mechanicProjects.findMany({
      where: { timeSheetId: parseInt(timecardId) },
      select: {
        id: true,
        equipmentId: true,
        description: true,
        hours: true,
        Equipment: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    return NextResponse.json(projects, {
      headers: {
        "Cache-Control": "no-store",
      },
    });
  } catch (error) {
    Sentry.captureException(error);
    console.error("Error fetching maintenance projects:", error);

    let errorMessage = "Failed to fetch maintenance project data";
    if (error instanceof Error) {
      errorMessage = error.message;
    }

    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
