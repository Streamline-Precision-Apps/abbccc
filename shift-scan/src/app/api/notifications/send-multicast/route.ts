import { NextRequest, NextResponse } from "next/server";
import getFirebaseAdmin from "@/lib/firebase-admin";
import prisma from "@/lib/prisma";
import { Message } from "firebase-admin/messaging";

export const runtime = "nodejs"; // Ensure this runs in a Node.js environment

export async function POST(request: NextRequest) {
  const admin = getFirebaseAdmin();
  const { topic, title, message, link } = await request.json();
  if (!topic) {
    console.error("[send-multicast] ❌ No topic provided for notification");
    return NextResponse.json(
      {
        error: "Topic is required for sending notifications",
      },
      { status: 400 },
    );
  }
  if (!title || !message) {
    console.error("[send-multicast] ❌ Missing title or message body");
    return NextResponse.json(
      {
        error: "Title and message body are required",
      },
      { status: 400 },
    );
  }
  try {
    // Prepare message payload for topic messaging
    const payload: Message = {
      notification: { title, body: message },
      topic,
      webpush: link ? { fcmOptions: { link } } : undefined,
    };

    console.log("[send-multicast] 📦 Topic message payload:", payload);

    // Send the message to Firebase
    const response = await admin.messaging().send(payload);
    console.log(
      `[send-multicast] ✅ Topic message sent successfully, messageId: ${response}`,
    );

    // Save the notification to the database
    console.log("[send-multicast] 💾 Saving notification to database");
    await prisma.notification.create({
      data: {
        topic,
        title,
        body: message,
        url: link ?? null,
        pushedAt: new Date(),
        pushAttempts: 1,
      },
    });
    console.log("[send-multicast] 💾 Notification saved to database");

    return NextResponse.json(
      {
        messageId: response,
        success: true,
        sentToTopic: topic,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("[send-multicast] ❌ Error sending notification:", error);

    // Try to save the failed notification attempt if possible
    try {
      await prisma.notification.create({
        data: {
          topic,
          title,
          body: message,
          url: link ?? null,
          pushedAt: new Date(),
          pushAttempts: 1,
        },
      });
      console.log("[send-multicast] 🚨 Failed notification recorded");
    } catch (dbError) {
      console.error(
        "[send-multicast] 💔 Failed to record error in database:",
        dbError,
      );
    }

    return NextResponse.json(
      {
        error: "Failed to send notification",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
