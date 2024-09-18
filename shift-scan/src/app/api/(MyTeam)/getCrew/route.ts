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

  const userCrewData = await prisma.users.findUnique({
    where: { id: userId },
    select: {
      crewMembers: {
        select: {
          crewId: true,
          crew: {
            select: {
              crewMembers: {
                select: {
                  user: {
                    select: {
                      id: true,
                      firstName: true,
                      lastName: true,
                      image: true,
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  });

  const crew = userCrewData?.crewMembers[0]?.crew?.crewMembers || [];

  // Set Cache-Control header for caching
  return NextResponse.json(crew, {
    headers: {
      'Cache-Control': 'public, max-age=60, s-maxage=60, stale-while-revalidate=30',
    },
  });
}