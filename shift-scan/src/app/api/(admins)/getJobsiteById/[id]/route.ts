import { NextResponse } from "next/server";
import * as Sentry from "@sentry/nextjs";
import prisma from "@/lib/prisma";
import { auth } from "@/auth";

export const dynamic = "force-dynamic"; // Ensures API is always dynamic and not cached

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    // Authenticate the user
    const session = await auth();
    const userId = session?.user?.id;

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Validate the ID parameter
    const jobsiteId = (await params).id;
    if (!jobsiteId) {
      return NextResponse.json(
        { error: "Invalid or missing jobsite ID" },
        { status: 400 },
      );
    }

    // Fetch complete jobsite data with all relationships
    const jobsiteData = await prisma.jobsite.findUnique({
      where: { id: jobsiteId },
      include: {
        CCTags: {
          select: {
            id: true,
            name: true,
          },
        },
        createdBy: {
          select: {
            firstName: true,
            lastName: true,
          },
        },
      },
    });

    if (!jobsiteData) {
      return NextResponse.json({ error: "Jobsite not found" }, { status: 404 });
    }

    return NextResponse.json(jobsiteData);
  } catch (error) {
    Sentry.captureException(error);
    console.error("Error fetching jobsite data:", error);

    let errorMessage = "Failed to fetch jobsite data";
    if (error instanceof Error) {
      errorMessage = error.message;
    }

    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
