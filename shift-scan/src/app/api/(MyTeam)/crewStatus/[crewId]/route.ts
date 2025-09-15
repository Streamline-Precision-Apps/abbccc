"use server";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/auth";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ crewId: string }> },
) {
  try {
    const session = await auth();
    const userId = session?.user?.id;

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { crewId } = await params;

    if (!crewId) {
      return NextResponse.json(
        { error: "Missing or invalid crew ID" },
        { status: 400 },
      );
    }

    const crew = await prisma.crew.findUnique({
      where: {
        id: crewId,
      },
      select: {
        Users: {
          select: {
            id: true,
            clockedIn: true,
          },
        },
      },
    });

    if (!crew) {
      return NextResponse.json({ error: "Crew not found" }, { status: 404 });
    }

    return NextResponse.json(crew, {
      headers: {
        "Cache-Control":
          "no-store, no-cache, must-revalidate, proxy-revalidate",
        Pragma: "no-cache",
        Expires: "0",
        "Content-Type": "application/json",
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
