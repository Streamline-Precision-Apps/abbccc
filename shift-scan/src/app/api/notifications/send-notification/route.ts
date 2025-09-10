import { NextRequest, NextResponse } from "next/server";
import getFirebaseAdmin from "@/lib/firebase-admin";
import { Message } from "firebase-admin/messaging";
import prisma from "@/lib/prisma";

export async function POST(request: NextRequest) {
  const admin = getFirebaseAdmin();
  const { token, title, message, link, topic } = await request.json();

  if (!token) {
    return NextResponse.json(
      { error: "Device token is required" },
      { status: 400 },
    );
  }

  const payload: Message = {
    notification: { title, body: message },
    token,
    webpush: link ? { fcmOptions: { link } } : undefined,
  };

  try {
    // Send the FCM notification
    await admin.messaging().send(payload);

    // Save the notification to the database
    await prisma.notification.create({
      data: {
        topic,
        title,
        body: message,
        url: link,
        pushedAt: new Date(),
        pushAttempts: 1,
      },
    });

    return NextResponse.json({ success: true, message: "Notification sent!" });
  } catch (error) {
    // Still save notification to DB but with failed attempt
    try {
      await prisma.notification.create({
        data: {
          topic,
          title,
          body: message,
          url: link,
          pushAttempts: 1,
        },
      });
    } catch (dbError) {
      console.error("Failed to save notification to database:", dbError);
    }

    return NextResponse.json({ success: false, error });
  }
}
