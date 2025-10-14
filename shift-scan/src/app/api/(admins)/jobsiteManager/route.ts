import { NextResponse } from "next/server";
import * as Sentry from "@sentry/nextjs";
import prisma from "@/lib/prisma";
import { auth } from "@/auth";
export const dynamic = "force-dynamic";
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
    const status = searchParams.get("status") || "all";

    let jobsiteSummary, total, pageSize, page, skip, totalPages;

    if (status === "pending") {
      page = undefined;
      pageSize = undefined;
      skip = undefined;
      totalPages = 1;
      jobsiteSummary = await prisma.jobsite.findMany({
        where: {
          approvalStatus: "PENDING",
        },
        select: {
          id: true,
          code: true,
          name: true,
          qrId: true,
          description: true,
          status: true,
          approvalStatus: true,
          createdAt: true,
          updatedAt: true,
          Address: {
            select: {
              id: true,
              street: true,
              city: true,
              state: true,
              zipCode: true,
            },
          },
          _count: {
            select: {
              TimeSheets: true,
            },
          },
        },
        orderBy: {
          name: "asc",
        },
      });
      total = jobsiteSummary.length;
    } else {
      page = parseInt(searchParams.get("page") || "1", 10);
      pageSize = parseInt(searchParams.get("pageSize") || "25", 10);
      skip = (page - 1) * pageSize;

      total = await prisma.jobsite.count();
      totalPages = Math.ceil(total / pageSize);
      // Fetch only essential fields from jobsites, paginated
      jobsiteSummary = await prisma.jobsite.findMany({
        skip,
        take: pageSize,
        select: {
          id: true,
          code: true,
          name: true,
          qrId: true,
          description: true,
          status: true,
          approvalStatus: true,
          createdAt: true,
          updatedAt: true,
          Address: {
            select: {
              id: true,
              street: true,
              city: true,
              state: true,
              zipCode: true,
            },
          },
          _count: {
            select: {
              TimeSheets: true,
            },
          },
        },
        orderBy: {
          name: "asc",
        },
      });
    }

    return NextResponse.json({
      jobsites: jobsiteSummary,
      total,
      page,
      pageSize,
      totalPages,
    });
  } catch (error) {
    Sentry.captureException(error);
    console.error("Error fetching jobsite summary:", error);
    const errorMessage =
      error instanceof Error
        ? error.message
        : "Failed to fetch jobsite summary";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
