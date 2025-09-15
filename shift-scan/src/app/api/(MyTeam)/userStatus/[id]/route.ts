"use server";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/auth";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await auth();
    const userId = session?.user?.id;

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { error: "Missing or invalid crew ID" },
        { status: 400 },
      );
    }

    const userStatus = await prisma.user.findUnique({
      where: {
        id,
      },
      select: {
        id: true,
        clockedIn: true,
      },
    });

    if (!userStatus) {
      return NextResponse.json({ error: "Crew not found" }, { status: 404 });
    }

    return NextResponse.json(userStatus, {
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
