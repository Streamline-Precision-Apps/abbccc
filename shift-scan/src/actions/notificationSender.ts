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
    // Prepare payload for the multicast endpoint
    const payload = {
      topic,
      title,
      body: message, // Note: the API expects 'body', not 'message'
      ...(link && { link }),
    };

    // Use the correct API endpoint for topic-based notifications
    const response = await fetch(`/api/notifications/send-multicast`, {
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
    // Use the correct API endpoint for device-specific notifications
    const response = await fetch(`/api/notifications/send-multicast`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        tokens: [token], // Send as an array of one token
        title,
        body: message, // API expects 'body', not 'message'
        link,
      }),
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
