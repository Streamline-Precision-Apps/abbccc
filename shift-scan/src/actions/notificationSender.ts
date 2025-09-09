"use server";

/**
 * Helper function to send a notification to users subscribed to a specific topic
 * This can be used from any server action
 *
 * @param topic - The topic name to send the notification to
 * @param title - The notification title
 * @param message - The notification message body
 * @param link - Optional URL to open when notification is clicked
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
    // Simple payload with the topic as is
    const payload = {
      topic,
      title,
      message,
      ...(link && { link }),
    };

    // Use a relative URL that works in both development and production
    const response = await fetch(`/send-notification`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
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
