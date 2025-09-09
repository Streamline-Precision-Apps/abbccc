import admin from "firebase-admin";
import type { ServiceAccount } from "firebase-admin";
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/auth";

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
  try {
    const { action, topics, token } = await request.json();

    // Get the current user session
    const session = await auth();
    const userId = session?.user?.id;

    if (!userId) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 },
      );
    }

    // Validation
    if (!action || !Array.isArray(topics) || !token) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Missing required fields: action, topics (array), and token are required",
        },
        { status: 400 },
      );
    }

    if (action !== "subscribe" && action !== "unsubscribe") {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid action. Must be 'subscribe' or 'unsubscribe'",
        },
        { status: 400 },
      );
    }

    // Batch process topics with a limit of 1000 tokens per request as per FCM docs
    const results = [];
    // Format topics to ensure they start with /topics/
    const formattedTopics = topics.map((topic) =>
      topic.startsWith("/topics/") ? topic : `/topics/${topic}`,
    );

    // Process in batches if needed (FCM has a limit of 1000 tokens per request)
    // Since we're only processing one token, we don't need to batch, but this is scalable
    const batchSize = 1000;
    for (let i = 0; i < formattedTopics.length; i += batchSize) {
      const batch = formattedTopics.slice(i, i + batchSize);

      // Perform the subscription/unsubscription for this batch
      for (const topic of batch) {
        let response;

        if (action === "subscribe") {
          response = await admin.messaging().subscribeToTopic(token, topic);

          // Record in database if successful
          if (response.successCount > 0) {
            // Check if already subscribed
            const topicName = topic.replace("/topics/", "");
            const existing = await prisma.topicSubscription.findFirst({
              where: {
                userId,
                topic: topicName,
              },
            });

            if (!existing) {
              // Create new subscription
              await prisma.topicSubscription.create({
                data: {
                  userId,
                  topic: topicName,
                },
              });
            }
          }
        } else {
          response = await admin.messaging().unsubscribeFromTopic(token, topic);

          // Remove from database if successful
          if (response.successCount > 0) {
            const topicName = topic.replace("/topics/", "");
            await prisma.topicSubscription.deleteMany({
              where: {
                userId,
                topic: topicName,
              },
            });
          }
        }

        results.push({
          topic,
          success: response.successCount > 0,
          failureCount: response.failureCount,
        });
      }
    }

    return NextResponse.json({
      success: true,
      message: `Successfully processed ${action} for ${results.filter((r) => r.success).length} out of ${topics.length} topics`,
      results,
    });
  } catch (error) {
    console.error("Error managing multiple topic subscriptions:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to manage topic subscriptions",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    );
  }
}
