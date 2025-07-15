"use server";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/auth";

export async function GET(
  request: Request,
  { params }: { params: { crewId: string } }
) {
  try {
    const session = await auth();
    const userId = session?.user?.id;

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const crews = await prisma.crew.findMany({
      where: {
        leadId: userId,
      },
      select: {
        Users: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            clockedIn: true,
          },
        },
      },
    });

    if (!crews) {
      return NextResponse.json({ error: "Crew not found" }, { status: 404 });
    }

    // Collect all unique users from all crews, excluding the current user
    const userMap = new Map<string, typeof crews[0]["Users"][0]>();
    crews.forEach((crew) => {
      crew.Users.forEach((user) => {
        //! Put comment line back in after testing.
        // if (user.id !== userId && !userMap.has(user.id) && user.clockedIn === false) {
        // if (!userMap.has(user.id) && user.clockedIn === false) {
        if (!userMap.has(user.id)) {
          userMap.set(user.id, user);
        }
      });
    });
    const uniqueUsers = Array.from(userMap.values()).sort((a, b) =>
      a.firstName.localeCompare(b.firstName)
    );

    return NextResponse.json(uniqueUsers, {
      headers: {
        "Cache-Control":
          "public, max-age=60, s-maxage=60, stale-while-revalidate=30",
      },
    });
  } catch (error) {
    console.error("Error fetching crew data:", error);

    let errorMessage = "Failed to fetch crew data";
    if (error instanceof Error) {
      errorMessage = error.message;
    }

    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
