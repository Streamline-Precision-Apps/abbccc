import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import prisma from "@/lib/prisma";

export async function POST(request: NextRequest) {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    return NextResponse.json(
      { success: false, message: "Unauthorized" },
      { status: 401 },
    );
  }

  try {
    const { preferences } = await request.json();

    if (!Array.isArray(preferences)) {
      return NextResponse.json(
        { success: false, message: "Invalid preferences format" },
        { status: 400 },
      );
    }

    // Start a transaction to update preferences
    await prisma.$transaction(async (tx) => {
      // Remove all existing preferences for this user
      await tx.topicSubscription.deleteMany({
        where: { userId },
      });

      // Add new preferences
      if (preferences.length > 0) {
        await tx.topicSubscription.createMany({
          data: preferences.map((pref: { topic: string }) => ({
            userId,
            topic: pref.topic,
          })),
        });
      }
    });

    return NextResponse.json({
      success: true,
      message: "Preferences updated successfully",
    });
  } catch (error) {
    console.error("Error updating notification preferences:", error);
    return NextResponse.json(
      { success: false, message: "Failed to update preferences" },
      { status: 500 },
    );
  }
}
