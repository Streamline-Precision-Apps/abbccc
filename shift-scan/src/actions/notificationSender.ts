"use server";

/**
 * Helper function to send a notification to users subscribed to a specific topic
 * This can be used from any server action
 */
export async function sendNotificationToTopic({
  topic,
  title,
  message,
  link,
}: {
  topic: string;
  title: string;
  message: string;
  link?: string;
}) {
  try {
    // Use a relative URL that works in both development and production
    const response = await fetch(`/send-notification`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ topic, title, message, link }),
    });

    if (!response.ok) {
      const error = await response.json();
      console.error("Error sending notification:", error);
      return { success: false, error };
    }

    return { success: true };
  } catch (error) {
    console.error("Error sending notification:", error);
    return { success: false, error };
  }
}

/**
 * Helper function to send a notification to a specific device token
 * This can be used from any server action
 */
export async function sendNotificationToDevice({
  token,
  title,
  message,
  link,
}: {
  token: string;
  title: string;
  message: string;
  link?: string;
}) {
  try {
    // Use a relative URL that works in both development and production
    const response = await fetch(`/send-notification`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ token, title, message, link }),
    });

    if (!response.ok) {
      const error = await response.json();
      console.error("Error sending notification:", error);
      return { success: false, error };
    }

    return { success: true };
  } catch (error) {
    console.error("Error sending notification:", error);
    return { success: false, error };
  }
}
