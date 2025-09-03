import { NextResponse } from "next/server";
import webPush from "web-push";

const VAPID_PUBLIC_KEY = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!;
const VAPID_PRIVATE_KEY = process.env.VAPID_PRIVATE_KEY!;

// Configure web-push
webPush.setVapidDetails(
  "mailto:support@shiftscanapp.com",
  VAPID_PUBLIC_KEY,
  VAPID_PRIVATE_KEY,
);

export async function POST(req: Request) {
  try {
    const { subscription, message } = await req.json();

    // Send push notification
    await webPush.sendNotification(subscription, JSON.stringify(message));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error sending notification:", error);
    return NextResponse.json(
      { error: "Failed to send notification" },
      { status: 500 },
    );
  }
}
