import { NextResponse } from "next/server";
import * as Sentry from "@sentry/nextjs";
import prisma from "@/lib/prisma";
import { auth } from "@/auth";

export const dynamic = "force-dynamic"; // Ensures API is always dynamic and not cached

/**
 * Get summary information of all tags (just id and name)
 * Used for lightweight tag listing in admin assets page
 */
export async function GET(req: Request) {
  try {
    // Authenticate the user
    const session = await auth();
    const userId = session?.user?.id;

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Parse query params for pagination
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1", 10);
    const pageSize = parseInt(searchParams.get("pageSize") || "10", 10);
    const skip = (page - 1) * pageSize;
    const take = pageSize;

    // Fetch total count for pagination
    const total = await prisma.cCTag.count();

    // Fetch only essential fields from tags
    const tagSummary = await prisma.cCTag.findMany({
      skip,
      take,
      orderBy: {
        name: "asc",
      },
    });

    if (!tagSummary || tagSummary.length === 0) {
      return NextResponse.json({ message: "No tags found." }, { status: 404 });
    }

    return NextResponse.json({
      tags: tagSummary,
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
    });
  } catch (error) {
    Sentry.captureException(error);
    console.error("Error fetching tag summary:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Failed to fetch tag summary";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
