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
    // Fetch user trainings with associated training details
    const userTrainingsWithDetails = await prisma.userTrainings.findMany({
      where: {
        userId: userId, // Ensure this matches the actual field type in your schema
      },
      include: {
        Training: true, // Make sure this relation is correct in your schema
      },
    });

    // Return the fetched data as a response
    return NextResponse.json(userTrainingsWithDetails);
  } catch (error) {
    console.error("Error fetching profile data:", error);
    return NextResponse.json(
      { error: "Failed to fetch profile data" },
      { status: 500 }
    );
  }
}
