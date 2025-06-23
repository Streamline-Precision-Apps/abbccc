import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/auth";

export const dynamic = "force-dynamic"; // ✅ Ensures this API is dynamic and never pre-rendered

/**
 * GET /api/getAllTimesheetInfo?page=1&pageSize=25
 * Returns paginated timesheets for admins.
 */
export async function GET(req: Request) {
  let session;

  // Handle authentication errors
  try {
    session = await auth();
  } catch (error) {
    console.error("Error during authentication:", error);
    return NextResponse.json(
      { error: "Authentication failed" },
      { status: 500 }
    );
  }

  const userId = session?.user.id;

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // Get the count using the same filter
    const length = await prisma.timeSheet.count({
      where: {
        endTime: {
          not: null,
        },
        status: "PENDING",
      },
    });

    return NextResponse.json({
      length,
    });
  } catch (error) {
    console.error("Error fetching Time Sheets:", error);
    return NextResponse.json(
      { error: "Failed to fetch pay period sheets" },
      { status: 500 }
    );
  }
}
