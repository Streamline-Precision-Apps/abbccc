import admin from "firebase-admin";
import type { ServiceAccount } from "firebase-admin";
import { Message, MulticastMessage } from "firebase-admin/messaging";
import { NextRequest, NextResponse } from "next/server";
import serviceAccountJson from "@/service_key.json";
import prisma from "@/lib/prisma";

// Get the service account from environment variable
let serviceAccount: ServiceAccount;

if (process.env.FIREBASE_SERVICE_ACCOUNT_KEY) {
  // Parse the environment variable string to get the service account
  serviceAccount = JSON.parse(
    process.env.FIREBASE_SERVICE_ACCOUNT_KEY,
  ) as ServiceAccount;
} else {
  // Fallback to local import for development (if needed)
  try {
    serviceAccount = serviceAccountJson as ServiceAccount;
  } catch (error) {
    console.error("Failed to load Firebase service account:", error);
    throw new Error("Firebase service account is not available");
  }
}

export async function POST(request: NextRequest) {
  const {
    token,
    topic,
    condition,
    title,
    message,
    link: rawLink,
  } = await request.json();

  // Validate and type-cast the link from the request body to ensure it's a string
  const link =
    typeof rawLink === "string" && rawLink.trim() !== ""
      ? rawLink.trim()
      : undefined;

  // Define common parts of the message payload
  const notificationPayload = {
    title: title,
    body: message,
  };

  // Define the webpush configuration only if a link is provided.
  // The 'link' property for deep-linking belongs specifically inside webpush.fcmOptions.
  const webpushConfig = link
    ? {
        fcmOptions: {
          link: link, // This specific FcmOptions type (for webpush) includes the 'link' property
        },
      }
    : undefined;

  let messagePayload: Message; // Declare the type of the final messagePayload

  // Determine the correct message type (TokenMessage, TopicMessage, or ConditionMessage)
  // and construct the payload accordingly to satisfy TypeScript's discriminated union checks.
  if (token) {
    messagePayload = {
      token: token, // This makes it a TokenMessage
      notification: notificationPayload,
      ...(webpushConfig && { webpush: webpushConfig }), // Conditionally add webpush config
    };
  } else if (topic) {
    messagePayload = {
      topic: topic, // This makes it a TopicMessage
      notification: notificationPayload,
      ...(webpushConfig && { webpush: webpushConfig }), // Conditionally add webpush config
    };
  } else if (condition) {
    // Basic validation for condition string
    if (typeof condition !== "string" || condition.trim() === "") {
      return NextResponse.json(
        {
          success: false,
          error: "Condition must be a non-empty string when provided.",
        },
        { status: 400 },
      );
    }
    messagePayload = {
      condition: condition, // This makes it a ConditionMessage
      notification: notificationPayload,
      ...(webpushConfig && { webpush: webpushConfig }), // Conditionally add webpush config
    };
  } else {
    // If no targeting method is provided, return an error
    return NextResponse.json(
      {
        success: false,
        error: "Missing target: token, topic, or condition must be provided.",
      },
      { status: 400 },
    );
  }

  try {
    const response = await admin.messaging().send(messagePayload);
    // The response for a successful send operation is typically a message ID string.
    return NextResponse.json({
      success: true,
      message: "Notification sent!",
      response,
    });
  } catch (error) {
    console.error("Error sending message:", error);
    // Provide a more specific error message if available
    return NextResponse.json(
      { success: false, error: "Failed to send notification" },
      { status: 500 },
    );
  }
}
