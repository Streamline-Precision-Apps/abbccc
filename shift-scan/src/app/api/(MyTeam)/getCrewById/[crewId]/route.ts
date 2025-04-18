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

    const { crewId } = params;

    if (!crewId) {
      return NextResponse.json(
        { error: "Missing or invalid crew ID" },
        { status: 400 }
      );
    }

    const crew = await prisma.crew.findUnique({
      where: {
        id: crewId,
      },
      select: {
        crewType: true,
        Users: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            image: true,
            clockedIn: true,
          },
        },
      },
    });

    if (!crew) {
      return NextResponse.json({ error: "Crew not found" }, { status: 404 });
    }

    // Sort crew members alphabetically by first name
    const crewMembers = crew.Users.map((member) => member).sort((a, b) =>
      a.firstName.localeCompare(b.firstName)
    );

    const crewType = crew.crewType;

    return NextResponse.json([crewMembers, crewType], {
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
