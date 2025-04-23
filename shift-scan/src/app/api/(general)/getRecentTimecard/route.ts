import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/auth";

export const dynamic = "force-dynamic"; // ✅ Ensures this API is dynamic and never pre-rendered

export async function GET() {
  try {
    // Authenticate the user
    const session = await auth();
    const userId = session?.user?.id;

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Fetch the most recent active (unfinished) timesheet for the user
    const timesheet = await prisma.timeSheet.findFirst({
      where: {
        userId,
        endTime: null, // Ensure timesheet is still active
      },
      orderBy: {
        createdAt: "desc", // Sort by most recent submission date
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
    console.error("Error fetching active timesheet:", error);

    let errorMessage = "Failed to fetch active timesheet";
    if (error instanceof Error) {
      errorMessage = error.message;
    }

    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
