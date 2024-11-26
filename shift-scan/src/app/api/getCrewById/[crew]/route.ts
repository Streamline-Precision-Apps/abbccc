"use server";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/auth";

export async function GET(
  request: Request,
  { params }: { params: { crew: string } }
) {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const crewId = Number(params.crew);
  if (isNaN(crewId)) {
    return NextResponse.json({ error: "Invalid crew ID" }, { status: 400 });
  }

  try {
    const crewMembers = await prisma.crewMembers.findMany({
      where: { crewId: crewId },
      include: {
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
