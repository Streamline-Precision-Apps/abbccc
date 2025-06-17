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

  // Parse pagination params
  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get("page") || "1", 10);
  const pageSize = parseInt(searchParams.get("pageSize") || "25", 10);
  const skip = (page - 1) * pageSize;

  try {
    // Get total count for pagination
    const total = await prisma.timeSheet.count();

    // Query the database for paginated timesheets
    const timesheets = await prisma.timeSheet.findMany({
      skip,
      take: pageSize,
      select: {
        id: true,
        date: true,
        User: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
        Jobsite: {
          select: {
            name: true,
          },
        },
        CostCode: {
          select: {
            id: true,
            name: true,
          },
        },
        startTime: true,
        endTime: true,
        comment: true,
        status: true,
        createdAt: true,
        updatedAt: true,
        workType: true,
      },
      orderBy: { createdAt: "asc" },
    });

    return NextResponse.json({
      timesheets,
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
    });
  } catch (error) {
    console.error("Error fetching Time Sheets:", error);
    return NextResponse.json(
      { error: "Failed to fetch pay period sheets" },
      { status: 500 }
    );
  }
}
