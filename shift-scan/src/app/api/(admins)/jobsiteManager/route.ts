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
    const page = parseInt(searchParams.get("page") || "1", 10);
    const pageSize = parseInt(searchParams.get("pageSize") || "10", 10);
    const skip = (page - 1) * pageSize;
    const take = pageSize;

    // Fetch total count for pagination
    const total = await prisma.jobsite.count();

    // Fetch only essential fields from jobsites, paginated
    const jobsiteSummary = await prisma.jobsite.findMany({
      skip,
      take,
      select: {
        id: true,
        code: true,
        name: true,
        qrId: true,
        description: true,
        isActive: true,
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
        Client: {
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

    return NextResponse.json({
      jobsites: jobsiteSummary,
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
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
