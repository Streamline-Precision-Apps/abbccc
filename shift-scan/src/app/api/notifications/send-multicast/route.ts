import { NextRequest, NextResponse } from "next/server";
import getFirebaseAdmin from "@/lib/firebase-admin";
import prisma from "@/lib/prisma";

export async function POST(req: NextRequest) {
  // Define body variable at the top level so it's available in the catch block
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let body: any = {};

  try {
    console.log("[send-multicast] 📨 Starting notification processing");
    const admin = getFirebaseAdmin();
    console.log("[send-multicast] 🔥 Firebase Admin initialized");

    body = await req.json();
    console.log("[send-multicast] 📝 Request body received:", {
      ...body,
      // Don't log full tokens for security
      tokens: body.tokens ? `${body.tokens.length} tokens` : undefined,
    });

    const { topic, title, body: messageBody, link } = body;
    console.log(
      `[send-multicast] 📋 Extracted data - Title: "${title}", Topic: ${topic || "none"}, Link: ${link || "none"}`,
    );

    // Handle topic-based notification
    if (topic) {
      console.log(`[send-multicast] 📢 Sending to topic: "${topic}"`);
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

      console.log("[send-multicast] 📦 Topic message payload:", message);

      try {
        const response = await admin.messaging().send(message);
        console.log(
          `[send-multicast] ✅ Topic message sent successfully, messageId: ${response}`,
        );

        // Save the notification to the database
        console.log("[send-multicast] 💾 Saving notification to database");
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
        console.log("[send-multicast] 💾 Notification saved to database");

        return NextResponse.json(
          {
            messageId: response,
            success: true,
            sentToTopic: topic,
          },
          { status: 200 },
        );
      } catch (fcmError) {
        console.error(
          "[send-multicast] ❌ Firebase messaging error:",
          fcmError,
        );
        throw fcmError;
      }
    }

    // For multicast messaging to specific devices
    console.log("[send-multicast] 📱 Preparing for device-specific messaging");

    if (
      !body.tokens ||
      !Array.isArray(body.tokens) ||
      body.tokens.length === 0
    ) {
      console.error(
        "[send-multicast] ❌ No tokens provided for device messaging",
      );
      return NextResponse.json(
        {
          error:
            "Device tokens array is required for device-specific notifications",
        },
        { status: 400 },
      );
    }

    console.log(
      `[send-multicast] 📱 Sending to ${body.tokens.length} device tokens`,
    );

    const message = {
      tokens: body.tokens,
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

    console.log("[send-multicast] 📦 Device message payload:", {
      ...message,
      tokens: `${message.tokens.length} tokens`, // Don't log actual tokens
    });

    try {
      const response = await admin.messaging().sendEachForMulticast(message);
      console.log(
        `[send-multicast] ✅ Device message sent. Success: ${response.successCount}, Failures: ${response.failureCount}`,
      );

      // Save the notification to the database
      console.log("[send-multicast] 💾 Saving notification to database");
      await prisma.notification.create({
        data: {
          title,
          body: messageBody,
          url: link,
          pushedAt: new Date(),
          pushAttempts: 1,
        },
      });
      console.log("[send-multicast] 💾 Notification saved to database");

      return NextResponse.json(
        {
          successCount: response.successCount,
          failureCount: response.failureCount,
        },
        { status: 200 },
      );
    } catch (fcmError) {
      console.error("[send-multicast] ❌ Firebase messaging error:", fcmError);
      throw fcmError;
    }
  } catch (error) {
    console.error("[send-multicast] ❌ Error sending notification:", error);

    // Try to save the failed attempt to the database for tracking
    try {
      console.log("[send-multicast] 🚨 Recording failed notification attempt");
      await prisma.notification.create({
        data: {
          topic: body?.topic,
          title: body?.title || "Failed notification",
          body: body?.body || "Error occurred while sending",
          url: body?.link,
          pushedAt: new Date(),
          pushAttempts: 1,
          // Store error information in metadata
          metadata: {
            error: error instanceof Error ? error.message : String(error),
            timestamp: new Date().toISOString(),
          },
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
