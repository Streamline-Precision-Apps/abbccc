import { NextResponse } from "next/server";
import * as Sentry from '@sentry/nextjs';
import prisma from "@/lib/prisma";
import { auth } from "@/auth";

export const dynamic = "force-dynamic"; // Ensures API is always dynamic and not cached

/**
 * Get summary information of all tags (just id and name)
 * Used for lightweight tag listing in admin assets page
 */
export async function GET() {
  try {
    // Authenticate the user
    const session = await auth();
    const userId = session?.user?.id;

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Fetch only essential fields from tags
    const tagSummary = await prisma.cCTag.findMany({
      select: {
        id: true,
        name: true,
      },
      orderBy: {
        name: "asc",
      },
    });

    if (!tagSummary || tagSummary.length === 0) {
      return NextResponse.json({ message: "No tags found." }, { status: 404 });
    }

    // Return with name property for consistency with other summary endpoints
    const formattedTags = tagSummary.map((tag) => ({
      id: tag.id,
      name: tag.name,
    }));

    return NextResponse.json(formattedTags);
  } catch (error) {
    Sentry.captureException(error);
    console.error("Error fetching tag summary:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Failed to fetch tag summary";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
