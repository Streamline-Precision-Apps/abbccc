"use server";
import prisma from "@/lib/prisma";
import { auth } from "@/auth";
/**
 * Upserts (updates or inserts) an FCM token in the database
 * - If token exists for the same user, updates lastUsedAt
 * - If token exists for different user or is invalid, updates ownership and validity
 * - If token doesn't exist, creates a new record
 */

export async function upsertFCMToken({ token }: { token: string }) {
  // Get the current user session

  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    console.error("Cannot save FCM token: No authenticated user");
    return false;
  }

  try {
    // Check if token already exists for any user
    const existingToken = await prisma.fCMToken.findUnique({
      where: {
        token: token,
      },
    });

    if (existingToken) {
      // Update the token if it exists but belongs to a different user or is marked invalid
      if (existingToken.userId !== userId || !existingToken.isValid) {
        await prisma.fCMToken.update({
          where: {
            id: existingToken.id,
          },
          data: {
            userId: userId,
            isValid: true,
            lastUsedAt: new Date(),
            platform: "web", // You can modify this based on the platform
          },
        });
      } else {
        // Just update the lastUsedAt timestamp
        await prisma.fCMToken.update({
          where: {
            id: existingToken.id,
          },
          data: {
            lastUsedAt: new Date(),
          },
        });
      }
      return true;
    } else {
      // Create new token record
      await prisma.fCMToken.create({
        data: {
          token: token,
          userId: userId,
          platform: "web", // You can modify this based on the platform
          lastUsedAt: new Date(),
        },
      });
      return true;
    }
  } catch (error) {
    console.error("Error saving FCM token:", error);
    return false;
  }
}

export async function getUserTopicPreferences(): Promise<{ topic: string }[]> {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    console.warn(
      "Attempted to fetch topic preferences for unauthenticated user.",
    );
    return [];
  }

  try {
    const preferences = await prisma.topicSubscription.findMany({
      where: { userId: userId },
      select: {
        topic: true,
      },
    });
    return preferences;
  } catch (error) {
    console.error("Error fetching user topic preferences:", error);
    return [];
  }
}
