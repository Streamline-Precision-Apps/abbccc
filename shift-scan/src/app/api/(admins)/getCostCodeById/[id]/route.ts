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
    const costCodeId = (await params).id;
    if (!costCodeId) {
      return NextResponse.json(
        { error: "Invalid or missing cost code ID" },
        { status: 400 },
      );
    }

    // Fetch complete cost code data with all relationships
    const costCodeData = await prisma.costCode.findUnique({
      where: { id: costCodeId },
      include: {
        CCTags: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    if (!costCodeData) {
      return NextResponse.json({ error: "Cost code not found" }, { status: 404 });
    }

    return NextResponse.json(costCodeData);
  } catch (error) {
    Sentry.captureException(error);
    console.error("Error fetching cost code data:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Failed to fetch cost code data";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}