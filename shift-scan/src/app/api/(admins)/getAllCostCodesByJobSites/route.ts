import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/auth";

export const dynamic = "force-dynamic"; // Ensures API is always dynamic and not cached

/**
 * Get summary information of all cost codes for a given jobsite (just id and name)
 * Used for lightweight cost code listing in admin assets page
 * Expects jobsiteId as a query param (?jobsiteId=...)
 */
export async function GET(req: NextRequest) {
  try {
    // Authenticate the user
    const session = await auth();
    const userId = session?.user?.id;

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get jobsiteId from query params
    const { searchParams } = new URL(req.url);
    const jobsiteId = searchParams.get("jobsiteId");
    if (!jobsiteId) {
      return NextResponse.json({ error: "Missing jobsiteId" }, { status: 400 });
    }

    // Fetch cost codes related to the jobsite via CCTag relation
    const costCodes = await prisma.costCode.findMany({
      where: {
        isActive: true,
        CCTags: {
          some: {
            Jobsites: {
              some: {
                id: jobsiteId,
              },
            },
          },
        },
      },
      select: {
        id: true,
        name: true,
        isActive: true,
      },
      orderBy: {
        name: "asc",
      },
    });

    if (!costCodes || costCodes.length === 0) {
      return NextResponse.json(
        { message: "No cost codes found for this jobsite." },
        { status: 404 }
      );
    }

    return NextResponse.json(costCodes);
  } catch (error) {
    console.error("Error fetching cost codes by jobsite:", error);
    const errorMessage =
      error instanceof Error
        ? error.message
        : "Failed to fetch cost codes by jobsite";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
