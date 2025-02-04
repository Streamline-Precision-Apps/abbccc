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

  try {
    const data = await prisma.userSettings.findUnique({
      where: {
        userId: userId,
      },
      select: {
        userId: true,
        language: true,
        personalReminders: true,
        generalReminders: true,
        cameraAccess: true,
        locationAccess: true,
        cookiesAccess: true,
      },
    });
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching Time Sheets:", error);
    return NextResponse.json(
      { error: "Failed to fetch pay period sheets" },
      { status: 500 }
    );
  }
}
