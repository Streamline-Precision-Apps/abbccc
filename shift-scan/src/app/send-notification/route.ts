import admin from "firebase-admin";
import type { ServiceAccount } from "firebase-admin";
import { Message } from "firebase-admin/messaging";
import { NextRequest, NextResponse } from "next/server";

// Get the service account from environment variable
let serviceAccount: ServiceAccount;

try {
  // Get the service account from environment variable
  const serviceAccountJson = {
    type: process.env.FIREBASE_SERVICE_JSON_TYPE,
    project_id: process.env.FIREBASE_SERVICE_JSON_PROJECT_ID,
    private_key_id: process.env.FIREBASE_SERVICE_JSON_PRIVATE_KEY_ID,
    private_key: process.env.FIREBASE_SERVICE_JSON_PRIVATE_KEY,
    client_email: process.env.FIREBASE_SERVICE_JSON_CLIENT_EMAIL,
    client_id: process.env.FIREBASE_SERVICE_JSON_CLIENT_ID,
    auth_uri: process.env.FIREBASE_SERVICE_JSON_AUTH_URI,
    token_uri: process.env.FIREBASE_SERVICE_JSON_TOKEN_URI,
    auth_provider_x509_cert_url:
      process.env.FIREBASE_SERVICE_JSON_AUTH_PROVIDER_X509_CERT_URL,
    client_x509_cert_url:
      process.env.FIREBASE_SERVICE_JSON_CLIENT_X509_CERT_URL,
    universe_domain: process.env.FIREBASE_SERVICE_JSON_UNIVERSE_DOMAIN,
  };
  serviceAccount = serviceAccountJson as ServiceAccount;
  // Initialize the app if it hasn't been initialized yet
  if (!admin.apps.length) {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
  }
} catch (error) {
  console.error("Failed to load Firebase service account:", error);
  throw new Error("Firebase service account is not available");
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
      {
        success: false,
        error: "Failed to send notification",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    );
  }
}
