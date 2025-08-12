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
    const search = searchParams.get("search")?.trim() || "";
    let costCodeSummary, total, pageSize, page, skip, totalPages;
    if (search !== "") {
      page = undefined;
      pageSize = undefined;
      skip = undefined;
      totalPages = 1;
      costCodeSummary = await prisma.costCode.findMany({
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
      total = costCodeSummary.length;
    } else {
      page = parseInt(searchParams.get("page") || "1", 10);
      pageSize = parseInt(searchParams.get("pageSize") || "10", 10);
      skip = (page - 1) * pageSize;
      const take = pageSize;
      // Fetch total count for pagination
      total = await prisma.costCode.count();
      totalPages = Math.ceil(total / pageSize);
      // Fetch only essential fields from cost codes
      costCodeSummary = await prisma.costCode.findMany({
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
    }

    if (!costCodeSummary || costCodeSummary.length === 0) {
      return NextResponse.json(
        { message: "No cost codes found." },
        { status: 404 },
      );
    }

    return NextResponse.json({
      costCodes: costCodeSummary,
      total,
      page,
      pageSize,
      totalPages,
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
