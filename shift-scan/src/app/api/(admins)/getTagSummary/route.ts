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
    const search = searchParams.get("search")?.trim() || "";
    let tagSummary, total, pageSize, page, skip, totalPages;

    if (search !== "") {
      page = undefined;
      pageSize = undefined;
      skip = undefined;
      totalPages = 1;
      tagSummary = await prisma.cCTag.findMany({
        include: {
          CostCodes: {
            select: {
              id: true,
              name: true,
              isActive: true,
            },
          },
          Jobsites: {
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
      total = tagSummary.length;
    } else {
      page = parseInt(searchParams.get("page") || "1", 10);
      pageSize = parseInt(searchParams.get("pageSize") || "10", 10);
      skip = (page - 1) * pageSize;
      const take = pageSize;
      // Fetch total count for pagination
      total = await prisma.cCTag.count();
      totalPages = Math.ceil(total / pageSize);
      // Fetch only essential fields from tags
      tagSummary = await prisma.cCTag.findMany({
        skip,
        take,
        include: {
          CostCodes: {
            select: {
              id: true,
              name: true,
              isActive: true,
            },
          },
          Jobsites: {
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
    }

    if (!tagSummary || tagSummary.length === 0) {
      return NextResponse.json({ message: "No tags found." }, { status: 404 });
    }

    return NextResponse.json({
      tags: tagSummary,
      total,
      page,
      pageSize,
      totalPages,
    });
  } catch (error) {
    Sentry.captureException(error);
    console.error("Error fetching tag summary:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Failed to fetch tag summary";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
