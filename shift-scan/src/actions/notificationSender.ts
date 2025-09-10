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
    `[sendNotificationToTopic] Received : topic: "${topic}, title: "${title}, message: "${message}, link: ${link || "none"}`,
  );

  try {
    const payload = JSON.stringify({
      topic,
      title,
      message,
      link,
    });

    // Use the correct API endpoint for topic-based notifications
    console.log(
      `[sendNotificationToTopic] Sending request to /api/notifications/send-multicast`,
    );

    const response = await fetch("/api/notifications/send-multicast", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: payload,
    });

    if (!response.ok) {
      throw new Error(`HTTP error: ${response.status}`);
    }

    return { success: true, response: "Successfully sent notification" };
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
    `[sendNotificationToDevice] Starting notification to device token: "${token.substring(0, 10)}...", Title: ${title}, Message: ${message}, Link: ${link || "none"}`,
  );

  try {
    // Prepare payload for the device notification
    const payload = JSON.stringify({
      tokens: [token], // Send as an array of one token
      title,
      body: message, // API expects 'body', not 'message'
      link,
    });

    // Use the correct API endpoint for device-specific notifications
    console.log(
      `[sendNotificationToDevice] Sending request to /api/notifications/send-multicast`,
    );

    const response = await fetch("/api/notifications/send-message", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: payload,
    });

    console.log(
      `[sendNotificationToDevice] Response status: ${response.status}`,
    );

    if (!response.ok) {
      console.error(
        `[sendNotificationToDevice] Error response status: ${response.status}`,
      );

      // Try to get error details if available
      try {
        const error = await response.json();
        console.error("[sendNotificationToDevice] Error details:", error);
        return { success: false, error, status: response.status };
      } catch (parseError) {
        // If we can't parse the error as JSON, just return the status
        return {
          success: false,
          error: `HTTP error: ${response.status}`,
          status: response.status,
        };
      }
    }

    // Try to handle non-JSON responses gracefully
    try {
      const result = await response.json();
      console.log(`[sendNotificationToDevice] Success! Response:`, result);
      return { success: true, result };
    } catch (jsonError) {
      console.error(
        "[sendNotificationToDevice] Failed to parse response as JSON:",
        jsonError,
      );

      // Try to get the response text for debugging
      try {
        const responseText = await response.text();
        console.error(
          "[sendNotificationToDevice] Response text (first 100 chars):",
          responseText.substring(0, 100),
        );
      } catch (textError) {
        console.error(
          "[sendNotificationToDevice] Failed to get response text:",
          textError,
        );
      }

      return {
        success: false,
        error: "Failed to parse server response as JSON",
        status: response.status,
      };
    }
  } catch (error) {
    console.error("[sendNotificationToDevice] Exception caught:", error);
    return { success: false, error };
  }
}
