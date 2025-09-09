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
  console.log(
    `[sendNotificationToTopic] Starting notification to topic: "${topic}"`,
  );
  console.log(`[sendNotificationToTopic] Title: "${title}"`);
  console.log(`[sendNotificationToTopic] Message: "${message}"`);
  console.log(`[sendNotificationToTopic] Link: ${link || "none"}`);

  try {
    // Prepare payload for the multicast endpoint
    const payload = {
      topic,
      title,
      body: message, // Note: the API expects 'body', not 'message'
      ...(link && { link }),
    };

    console.log(`[sendNotificationToTopic] Prepared payload:`, payload);

    // Use the correct API endpoint for topic-based notifications
    console.log(
      `[sendNotificationToTopic] Sending request to /api/notifications/send-multicast`,
    );
    const response = await fetch(`/api/notifications/send-multicast`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    console.log(
      `[sendNotificationToTopic] Response status: ${response.status}`,
    );

    if (!response.ok) {
      const error = await response.json();
      console.error(
        "[sendNotificationToTopic] Error sending notification:",
        error,
      );
      return { success: false, error };
    }

    const result = await response.json();
    console.log(`[sendNotificationToTopic] Success! Response:`, result);
    return { success: true, result };
  } catch (error) {
    console.error("[sendNotificationToTopic] Exception caught:", error);
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
  console.log(
    `[sendNotificationToDevice] Starting notification to device token: "${token.substring(0, 10)}..."`,
  );
  console.log(`[sendNotificationToDevice] Title: "${title}"`);
  console.log(`[sendNotificationToDevice] Message: "${message}"`);
  console.log(`[sendNotificationToDevice] Link: ${link || "none"}`);

  try {
    // Prepare payload for the device notification
    const payload = {
      tokens: [token], // Send as an array of one token
      title,
      body: message, // API expects 'body', not 'message'
      link,
    };

    console.log(`[sendNotificationToDevice] Prepared payload:`, {
      ...payload,
      tokens: [`${token.substring(0, 10)}...`], // Truncate token for logging
    });

    // Use the correct API endpoint for device-specific notifications
    console.log(
      `[sendNotificationToDevice] Sending request to /api/notifications/send-multicast`,
    );
    const response = await fetch(`/api/notifications/send-multicast`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    console.log(
      `[sendNotificationToDevice] Response status: ${response.status}`,
    );

    if (!response.ok) {
      const error = await response.json();
      console.error(
        "[sendNotificationToDevice] Error sending notification:",
        error,
      );
      return { success: false, error };
    }

    const result = await response.json();
    console.log(`[sendNotificationToDevice] Success! Response:`, result);
    return { success: true, result };
  } catch (error) {
    console.error("[sendNotificationToDevice] Exception caught:", error);
    return { success: false, error };
  }
}
