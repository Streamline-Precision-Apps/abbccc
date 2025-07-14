import { NextResponse } from "next/server";
import * as Sentry from "@sentry/nextjs";
import prisma from "@/lib/prisma";
import { auth } from "@/auth";

export const dynamic = "force-dynamic"; // Ensures API is always dynamic and not cached

/**
 * Get summary information of all jobsites (just id and name)
 * Used for lightweight jobsite listing in admin assets page
 */
export async function GET() {
  try {
    // Authenticate the user
    const session = await auth();
    const userId = session?.user?.id;

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Fetch only essential fields from jobsites
    const jobsiteSummary = await prisma.jobsite.findMany({
      select: {
        id: true,
        name: true,
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

    if (!jobsiteSummary || jobsiteSummary.length === 0) {
      return NextResponse.json(
        { message: "No jobsites found." },
        { status: 404 }
      );
    }

    return NextResponse.json(jobsiteSummary);
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
