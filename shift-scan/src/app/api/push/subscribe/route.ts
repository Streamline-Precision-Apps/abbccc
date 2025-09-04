import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "../../../../../prisma/generated/prisma/client";

export const runtime = "nodejs"; // ensure Node
const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    // Expect full PushSubscription JSON from browser
    // Example shape: { endpoint, keys: { p256dh, auth } }
    const { endpoint, keys, userId } = body || {};

    if (!endpoint || !keys?.p256dh || !keys?.auth) {
      return NextResponse.json(
        { error: "Invalid subscription object" },
        { status: 400 },
      );
    }

    await prisma.pushSubscription.upsert({
      where: { endpoint },
      update: {
        p256dh: keys.p256dh,
        auth: keys.auth,
        userId: userId || null,
      },
      create: {
        endpoint,
        p256dh: keys.p256dh,
        auth: keys.auth,
        userId: userId || null,
      },
    });

    return NextResponse.json({ success: true });
  } catch (e) {
    console.error("Subscribe error", e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
