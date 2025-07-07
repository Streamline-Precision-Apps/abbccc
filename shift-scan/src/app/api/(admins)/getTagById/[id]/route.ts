import { NextResponse } from "next/server";
import * as Sentry from '@sentry/nextjs';
import prisma from "@/lib/prisma";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params;

  // Check if the ID is missing or invalid
  if (!id || typeof id !== "string") {
    return NextResponse.json(
      { error: "Invalid or missing ID" },
      { status: 400 }
    );
  }

  try {
    // Query the database for the complete tag data with full relationships
    const tags = await prisma.cCTag.findUnique({
      where: {
        id: String(id), // Ensure that the id is a string
      },
      include: {
        Jobsites: {
          select: {
            id: true,
            name: true,
            qrId: true,
          },
        },
        CostCodes: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    // If no tag is found, return a 404 response
    if (!tags) {
      return NextResponse.json({ error: "Tag not found" }, { status: 404 });
    }

    return NextResponse.json(tags);
  } catch (error) {
    Sentry.captureException(error);
    // Log any database errors
    console.error("Error fetching tags:", error);
    return NextResponse.json(
      { error: "Failed to fetch tags" },
      { status: 500 }
    );
  }
}
