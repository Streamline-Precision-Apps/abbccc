import { NextResponse } from "next/server";
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

    // Fetch only essential fields from clients
    const clientSummary = await prisma.client.findMany({
      select: {
        id: true,
        name: true,
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

    return NextResponse.json(clientSummary);
  } catch (error) {
    console.error("Error fetching client summary:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Failed to fetch client summary";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
