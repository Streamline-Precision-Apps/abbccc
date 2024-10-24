"use server";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/auth";
type Params = Promise<{ crewId: string }>;

export async function GET(request: Request, { params }: { params: Params }) {
  const session = await auth();
  const userId = session?.user.id;

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const crewId = Number((await params).crewId);

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

    const crew = crewMembers[0].crew.crewMembers.map((member) => member.user);

    // Set Cache-Control header for caching
    return NextResponse.json(crew);
  } catch (error) {
    console.error("Error fetching crew data:", error);
    return NextResponse.json(
      { error: "Failed to fetch crew data" },
      { status: 500 }
    );
  }
}
