// POST /api/notifications/topic-subscribe
// Body: { endpoint: string, topic: string }
// Ensure runtime is Node because we use Prisma
import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "../../../../../prisma/generated/prisma";
import { auth } from "@/auth";
export const runtime = "nodejs";
const prisma = new PrismaClient();

export async function GET() {
  try {
    const session = await auth();
    const userId = session?.user?.id;

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Find all subscriptions for this user and their topic subscriptions
    const subscriptions = await prisma.topicSubscription.findMany({
      where: {
        userId: userId,
      },
    });

    return NextResponse.json({ subscriptions });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    const userId = session?.user?.id;

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const {
      topic,
      inApp = true,
      push = true,
      frequency = "immediate",
    } = await req.json();

    if (!topic) {
      return NextResponse.json({ error: "Topic is required" }, { status: 400 });
    }

    // Update or create topic subscription
    await prisma.topicSubscription.upsert({
      where: {
        userId_topic: {
          userId,
          topic,
        },
      },
      create: { userId, topic, inApp, push, frequency },
      update: { inApp, push, frequency },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error updating topic subscription:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
