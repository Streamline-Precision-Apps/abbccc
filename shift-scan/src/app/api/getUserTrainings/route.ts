"use server";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/auth";

export async function GET() {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const userTrainings = await prisma.userTrainings.findMany({
      where: {
        userId: userId, // Ensure this matches the actual field type in your schema
      },
      select: {
        userId: true,
        trainingId: true,
        isCompleted: true,
      },
    });

    // Return the fetched data as a response
    return NextResponse.json(userTrainings);
  } catch (error) {
    console.error("Error fetching profile data:", error);
    return NextResponse.json(
      { error: "Failed to fetch profile data" },
      { status: 500 }
    );
  }
}
