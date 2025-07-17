import { NextResponse } from "next/server";
import * as Sentry from "@sentry/nextjs";
import prisma from "@/lib/prisma";
import { auth } from "@/auth";

export const dynamic = "force-dynamic"; // Ensures API is always dynamic and not cached

/**
 * Get summary information of all clients (just id and name)
 * Used for lightweight client listing in admin assets page
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
    const page = parseInt(searchParams.get("page") || "1", 10);
    const pageSize = parseInt(searchParams.get("pageSize") || "10", 10);
    const skip = (page - 1) * pageSize;
    const take = pageSize;

    // Fetch total count for pagination
    const total = await prisma.client.count();
    // Fetch only essential fields from clients
    const clientSummary = await prisma.client.findMany({
      skip,
      take,
      select: {
        id: true,
        name: true,
        description: true,
        approvalStatus: true,
        contactPerson: true,
        contactEmail: true,
        contactPhone: true,
        createdAt: true,
        updatedAt: true,
        Jobsites: {
          select: {
            id: true,
            name: true,
          },
        },
        Address: {
          select: {
            id: true,
            street: true,
            city: true,
            state: true,
            zipCode: true,
            country: true,
          },
        },
      },
      orderBy: {
        name: "asc",
      },
    });

    if (!clientSummary || clientSummary.length === 0) {
      return NextResponse.json(
        { message: "No clients found." },
        { status: 404 }
      );
    }

    return NextResponse.json({
      clients: clientSummary,
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
    });
  } catch (error) {
    Sentry.captureException(error);
    console.error("Error fetching client summary:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Failed to fetch client summary";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
