"use server";
import prisma from "@/lib/prisma";
import { auth } from "@/auth";
import { fetchToken as getFCMToken } from "@/firebase";

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

// Keep the old function names for backward compatibility
export const isTokenRecorded = async ({ token }: { token: string }) => {
  const tokenRecord = await prisma.fCMToken.findUnique({
    where: { token },
  });
  return tokenRecord !== null;
};

export const createToken = upsertFCMToken;

export type UserTopicPreference = {
  topic: string;
};

export async function getUserTopicPreferences(): Promise<
  UserTopicPreference[]
> {
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

export async function subscribeToTopic(topic: string): Promise<boolean> {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    console.warn("Attempted to subscribe unauthenticated user to topic.");
    return false;
  }

  try {
    // Get the current FCM token
    const token = await getFCMToken();
    if (!token) {
      console.warn("No FCM token available to subscribe to topic");
      return false;
    }

    // Call the server API to handle the FCM topic subscription
    const response = await fetch("/api/notifications/topic", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        action: "subscribe",
        topic,
        token,
        userId,
      }),
    });

    const result = await response.json();

    if (!result.success) {
      console.error(
        `Server error subscribing to topic ${topic}:`,
        result.error,
      );
      return false;
    }

    return true;
  } catch (error) {
    console.error(`Error subscribing to topic ${topic}:`, error);
    return false;
  }
}

export async function unsubscribeFromTopic(topic: string): Promise<boolean> {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    console.warn("Attempted to unsubscribe unauthenticated user from topic.");
    return false;
  }

  try {
    // Get the current FCM token
    const token = await getFCMToken();
    if (!token) {
      console.warn("No FCM token available to unsubscribe from topic");
      return false;
    }

    // Call the server API to handle the FCM topic unsubscription
    const response = await fetch("/api/notifications/topic", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        action: "unsubscribe",
        topic,
        token,
        userId,
      }),
    });

    const result = await response.json();

    if (!result.success) {
      console.error(
        `Server error unsubscribing from topic ${topic}:`,
        result.error,
      );
      return false;
    }

    return true;
  } catch (error) {
    console.error(`Error unsubscribing from topic ${topic}:`, error);
    return false;
  }
}

/**
 * Subscribe to multiple topics at once
 * @param topics Array of topic names to subscribe to
 * @returns Boolean indicating success
 */
export async function subscribeToTopics(topics: string[]): Promise<boolean> {
  if (!topics.length) return true; // No topics to subscribe to

  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    console.warn("Attempted to subscribe unauthenticated user to topics.");
    return false;
  }

  try {
    // Get the current FCM token
    const token = await getFCMToken();
    if (!token) {
      console.warn("No FCM token available to subscribe to topics");
      return false;
    }

    // Call the server API to handle the FCM topic subscriptions
    const response = await fetch("/api/notifications/topics", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        action: "subscribe",
        topics,
        token,
        userId,
      }),
    });

    const result = await response.json();

    if (!result.success) {
      console.error(`Server error subscribing to topics:`, result.error);
      return false;
    }

    return true;
  } catch (error) {
    console.error(`Error subscribing to topics:`, error);
    return false;
  }
}

/**
 * Unsubscribe from multiple topics at once
 * @param topics Array of topic names to unsubscribe from
 * @returns Boolean indicating success
 */
export async function unsubscribeFromTopics(
  topics: string[],
): Promise<boolean> {
  if (!topics.length) return true; // No topics to unsubscribe from

  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    console.warn("Attempted to unsubscribe unauthenticated user from topics.");
    return false;
  }

  try {
    // Get the current FCM token
    const token = await getFCMToken();
    if (!token) {
      console.warn("No FCM token available to unsubscribe from topics");
      return false;
    }

    // Call the server API to handle the FCM topic unsubscriptions
    const response = await fetch("/api/notifications/topics", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        action: "unsubscribe",
        topics,
        token,
        userId,
      }),
    });

    const result = await response.json();

    if (!result.success) {
      console.error(`Server error unsubscribing from topics:`, result.error);
      return false;
    }

    return true;
  } catch (error) {
    console.error(`Error unsubscribing from topics:`, error);
    return false;
  }
}
