import { NextRequest, NextResponse } from "next/server";
import getFirebaseAdmin from "@/lib/firebase-admin";
import prisma from "@/lib/prisma";
import { Message } from "firebase-admin/messaging";

export const runtime = "nodejs"; // Ensure this runs in a Node.js environment

export async function POST(request: NextRequest) {
  const admin = getFirebaseAdmin();
  const { topic, title, message, link, referenceId } = await request.json();
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
    const notification = await prisma.notification.create({
      data: {
        topic,
        title,
        body: message,
        url: link ?? null,
        pushedAt: new Date(),
        pushAttempts: 1,
        referenceId: referenceId ?? null,
      },
    });
    const urlWithId = `${notification.url ? notification.url : "/admins"}${notification.url?.includes("?") ? "&" : "?"}notificationId=${notification.id}`;
    // Update the notification with the URL containing the ID
    const notificationLink = await prisma.notification.update({
      where: { id: notification.id },
      data: { url: urlWithId },
    });

    // Create the FCM message payload
    const payload: Message = {
      notification: { title, body: message },
      topic,
      webpush: notificationLink.url
        ? { fcmOptions: { link: notificationLink.url } }
        : undefined,
    };

    // Send the message to Firebase
    const response = await admin.messaging().send(payload);

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
    return NextResponse.json(
      {
        error: "Failed to send notification",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
