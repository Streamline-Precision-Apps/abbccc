"use server";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/auth";

export async function GET(
  request: Request,
  { params }: { params: { crewId: string } }
) {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { crewId } = params;

  try {
    const crew = await prisma.crew.findUnique({
      where: {
        id: crewId,
      },
      select: {
        users: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            image: true,
          },
        },
      },
    });

    // filtering crew members by first name and sorting them alphabetically
    const crewMembers = crew?.users
      .map((member) => member)
      .sort((a, b) => {
        return a.firstName.localeCompare(b.firstName);
      });

    // Set Cache-Control header for caching if necessary
    return NextResponse.json(crewMembers);
  } catch (error) {
    console.error("Error fetching crew data:", error);
    return NextResponse.json(
      { error: "Failed to fetch crew data" },
      { status: 500 }
    );
  }
}
