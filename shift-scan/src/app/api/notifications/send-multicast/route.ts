import { NextRequest, NextResponse } from "next/server";
import getFirebaseAdmin from "@/lib/firebase-admin";
import prisma from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const admin = getFirebaseAdmin();
    const body = await req.json();
    const { topic, title, body: messageBody, link } = body;

    // Handle topic-based notification
    if (topic) {
      // For topic messaging
      const message = {
        notification: {
          title,
          body: messageBody,
        },
        ...(link && {
          webpush: {
            fcmOptions: {
              link,
            },
          },
        }),
        topic, // Topic to send to
      };

      const response = await admin.messaging().send(message);

      // Save the notification to the database
      await prisma.notification.create({
        data: {
          topic,
          title,
          body: messageBody,
          url: link,
          pushedAt: new Date(),
          pushAttempts: 1,
        },
      });

      return NextResponse.json(
        {
          messageId: response,
          success: true,
          sentToTopic: topic,
        },
        { status: 200 },
      );
    }

    // For multicast messaging to specific devices
    const message = {
      notification: {
        title,
        body: messageBody,
      },
      ...(link && {
        webpush: {
          fcmOptions: {
            link,
          },
        },
      }),
    };

    const response = await admin.messaging().sendEachForMulticast(message);

    // Save the notification to the database
    await prisma.notification.create({
      data: {
        title,
        body: messageBody,
        url: link,
        pushedAt: new Date(),
        pushAttempts: 1,
      },
    });

    return NextResponse.json(
      {
        successCount: response.successCount,
        failureCount: response.failureCount,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error sending multicast notification:", error);
    return NextResponse.json(
      {
        error: "Failed to send multicast notification",
      },
      { status: 500 },
    );
  }
}
