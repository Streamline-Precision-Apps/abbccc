import { NextRequest, NextResponse } from "next/server";
import { sendPush } from "@/lib/(notification)/webPush";
import { PrismaClient } from "../../../../../prisma/generated/prisma/client";

export const runtime = "nodejs";
const prisma = new PrismaClient();

interface PushPayload {
  title: string;
  body: string;
  data: { url: string; ts: number };
  tag: string;
}

interface PushResult {
  endpoint: string;
  status: "ok" | "error";
  error?: string;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const payload: PushPayload = body.payload || {
      title: "Test Notification",
      body: "Hello from Next.js push server",
      data: { url: "/", ts: Date.now() },
      tag: "test-demo",
    };

    const subs = await prisma.pushSubscription.findMany({ take: 500 }); // batch limit
    const results: PushResult[] = [];

    for (const s of subs) {
      try {
        await sendPush(
          { endpoint: s.endpoint, keys: { auth: s.auth, p256dh: s.p256dh } },
          payload,
        );
        await prisma.pushSubscription.update({
          where: { endpoint: s.endpoint },
          data: { lastSuccessAt: new Date(), failedCount: 0 },
        });
        results.push({ endpoint: s.endpoint, status: "ok" });
      } catch (err: unknown) {
        const error = err as { statusCode?: number; message?: string };
        const statusCode = error?.statusCode;
        if (statusCode === 410 || statusCode === 404) {
          // Remove dead subscription
          await prisma.pushSubscription
            .delete({ where: { endpoint: s.endpoint } })
            .catch(() => {});
        } else {
          await prisma.pushSubscription
            .update({
              where: { endpoint: s.endpoint },
              data: {
                lastFailureAt: new Date(),
                failedCount: { increment: 1 },
              },
            })
            .catch(() => {});
        }
        results.push({
          endpoint: s.endpoint,
          status: "error",
          error: error?.message,
        });
      }
    }

    return NextResponse.json({ sent: results.length, results });
  } catch (e: unknown) {
    console.error(e);
    return NextResponse.json({ error: "Send failed" }, { status: 500 });
  }
}
