import { NextResponse } from "next/server";
import * as Sentry from "@sentry/nextjs";
import prisma from "@/lib/prisma";
import { auth } from "@/auth";

export const dynamic = "force-dynamic"; // Ensures API is always dynamic and not cached

/**
 * Get summary information of all cost codes (just id and name)
 * Used for lightweight cost code listing in admin assets page
 */
export async function GET(req: Request) {
  try {
    // Authenticate the user
    const session = await auth();
    const userId = session?.user?.id;

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1", 10);
    const pageSize = parseInt(searchParams.get("pageSize") || "10", 10);
    const skip = (page - 1) * pageSize;
    const take = pageSize;

    // Fetch total count for pagination
    const total = await prisma.costCode.count();
    // Fetch only essential fields from cost codes
    const costCodeSummary = await prisma.costCode.findMany({
      skip,
      take,
      include: {
        CCTags: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: {
        name: "asc",
      },
    });

    if (!costCodeSummary || costCodeSummary.length === 0) {
      return NextResponse.json(
        { message: "No cost codes found." },
        { status: 404 }
      );
    }

    return NextResponse.json({
      costCodes: costCodeSummary,
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
    });
  } catch (error) {
    Sentry.captureException(error);
    console.error("Error fetching cost code summary:", error);
    const errorMessage =
      error instanceof Error
        ? error.message
        : "Failed to fetch cost code summary";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
