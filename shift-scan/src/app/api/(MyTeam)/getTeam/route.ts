"use server";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/auth";

export async function GET() {
  try {
    const session = await auth();
    const userId = session?.user?.id;

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Fetch the crews where the logged-in user is a lead and count the total crew members
    const teams = await prisma.crew.findMany({
      where: {
        leadId: userId,
      },
      select: {
        id: true,
        name: true,
        // Use _count to count the total crew members
        _count: {
          select: {
            Users: true, // Count the number of crew members
          },
        },
      },
    });

    if (!teams || teams.length === 0) {
      return NextResponse.json(
        { message: "No teams found for the current user." },
        { status: 404 }
      );
    }

    return NextResponse.json(teams, {
      headers: {
        "Cache-Control":
          "public, max-age=60, s-maxage=60, stale-while-revalidate=30",
      },
    });
  } catch (error) {
    console.error("Error fetching teams:", error);

    let errorMessage = "Failed to fetch teams";
    if (error instanceof Error) {
      errorMessage = error.message;
    }

    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}
