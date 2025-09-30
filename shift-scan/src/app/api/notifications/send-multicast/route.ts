import { NextRequest, NextResponse } from "next/server";
import getFirebaseAdmin from "@/lib/firebase-admin";
import prisma from "@/lib/prisma";
import { Message } from "firebase-admin/messaging";

export const runtime = "nodejs"; // Ensure this runs in a Node.js environment

export async function POST(request: NextRequest) {
  try {
    // Check Firebase configuration before initializing
    console.log("[send-multicast] Checking Firebase config...");
    const requiredEnvVars = [
      'FIREBASE_SERVICE_JSON_PROJECT_ID',
      'FIREBASE_SERVICE_JSON_CLIENT_EMAIL', 
      'FIREBASE_SERVICE_JSON_PRIVATE_KEY'
    ];
    
    const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);
    
    if (missingVars.length > 0) {
      console.warn("[send-multicast] ⚠️ Firebase not configured properly. Missing:", missingVars);
      return NextResponse.json(
        {
          success: false,
          error: "Firebase notification service not configured",
          details: `Missing environment variables: ${missingVars.join(', ')}`,
        },
        { status: 200 }, // Return 200 so clock-in doesn't fail
      );
    }
    
    const admin = getFirebaseAdmin();
    const { topic, title, message, link, referenceId } = await request.json();
    
    console.log("[send-multicast] Request data:", { topic, title, message, link, referenceId });
    
    if (!topic) {
      return NextResponse.json(
        {
          error: "Topic is required for sending notifications",
        },
        { status: 400 },
      );
    }
    if (!title || !message) {
      return NextResponse.json(
        {
          error: "Title and message body are required",
        },
        { status: 400 },
      );
    }
    
    try {
      // Store the notification in the database
      console.log("[send-multicast] Creating notification in database...");
      const notification = await prisma.notification.create({
        data: {
          topic,
          title,
          body: message,
          url: link ?? null,
          pushedAt: new Date(),
          pushAttempts: 1,
          referenceId: referenceId?.toString() ?? null,
        },
      });
      console.log("[send-multicast] Notification created:", notification.id);
      
      const urlWithId = `${notification.url ? notification.url : "/admins"}${notification.url?.includes("?") ? "&" : "?"}notificationId=${notification.id}`;
      
      // Update the notification with the URL containing the ID
      console.log("[send-multicast] Updating notification URL...");
      const notificationLink = await prisma.notification.update({
        where: { id: notification.id },
        data: { url: urlWithId },
      });
      console.log("[send-multicast] Notification updated with URL");

      // Create the FCM message payload
      const payload: Message = {
        notification: { title, body: message },
        topic,
        webpush: notificationLink.url
          ? { fcmOptions: { link: notificationLink.url } }
          : undefined,
      };

      // Send the message to Firebase
      console.log("[send-multicast] Sending FCM message...");
      const response = await admin.messaging().send(payload);
      console.log("[send-multicast] FCM response:", response);

      return NextResponse.json(
        {
          messageId: response,
          success: true,
          sentToTopic: topic,
        },
        { status: 200 },
      );
    } catch (error) {
      console.error("[send-multicast] ❌ Error in notification process:", error);
      return NextResponse.json(
        {
          error: "Failed to send notification",
          details: error instanceof Error ? error.message : "Unknown error",
        },
        { status: 500 },
      );
    }
  } catch (parseError) {
    console.error("[send-multicast] ❌ Error parsing request:", parseError);
    return NextResponse.json(
      {
        error: "Invalid request format",
        details: parseError instanceof Error ? parseError.message : "Unknown error",
      },
      { status: 400 },
    );
  }
}
