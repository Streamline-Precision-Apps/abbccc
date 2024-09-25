"use server";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/auth";

export async function GET() {
  const session = await auth();
  const userId = session?.user.id;

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Fetch the crews where the logged-in user is a member and count the total crew members for each crew
  const teams = await prisma.crews.findMany({
    where: {
      crewMembers: {
        some: {
          employeeId: userId, // Only fetch teams where the logged-in user is a member
        },
      },
    },
    select: {
      id: true,
      name: true,
      // Use _count to count the total crew members
      _count: {
        select: {
          crewMembers: true, // Count the number of crew members
        },
      },
    },
  });

  // Format the response to include crew name and total members
  const formattedTeams = teams.map((team) => ({
    id: team.id,
    name: team.name,
    totalMembers: team._count.crewMembers, // Use the count from _count.crewMembers
  }));

  // Set Cache-Control header for caching
  return NextResponse.json(formattedTeams, {
    headers: {
      "Cache-Control": "public, max-age=60, s-maxage=60, stale-while-revalidate=30",
    },
  });
}