// scripts/notification-scheduler.ts
import { PrismaClient, Frequency } from "../prisma/generated/prisma/client";
import webpush from "web-push";

const prisma = new PrismaClient();

webpush.setVapidDetails(
  process.env.VAPID_SUBJECT || "mailto:you@example.com",
  process.env.VAPID_PUBLIC_KEY || "",
  process.env.VAPID_PRIVATE_KEY || "",
);

async function processFrequency(frequency: Frequency) {
  console.log(`Processing ${frequency} notifications...`);

  const minutes = frequency === "hourly" ? 60 : 24 * 60;
  const since = new Date(Date.now() - minutes * 60 * 1000);

  const subs = await prisma.topicSubscription.findMany({
    where: { frequency },
  });
  const byUser: Record<string, string[]> = {};
  for (const s of subs) (byUser[s.userId] ||= []).push(s.topic);

  for (const userId of Object.keys(byUser)) {
    const pending = await prisma.notification.findMany({
      where: {
        userId,
        topic: { in: byUser[userId] },
        createdAt: { gte: since },
        pushedAt: null,
      },
      orderBy: { createdAt: "asc" },
    });

    if (!pending.length) continue;

    const title = `${pending.length} new notification${pending.length > 1 ? "s" : ""}`;
    const body = pending
      .slice(0, 5)
      .map((p) => p.title)
      .join(" · ");

    const devices = await prisma.pushSubscription.findMany({
      where: { userId },
    });
    for (const d of devices) {
      try {
        await webpush.sendNotification(
          {
            endpoint: d.endpoint,
            keys: { auth: d.auth, p256dh: d.p256dh },
          },
          JSON.stringify({
            title,
            body,
            url: "/notifications",
            metadata: { count: pending.length },
          }),
        );

        await prisma.pushSubscription.update({
          where: { id: d.id },
          data: { lastSuccessAt: new Date(), failedCount: 0 },
        });

        await prisma.notification.updateMany({
          where: { id: { in: pending.map((p) => p.id) } },
          data: { pushedAt: new Date() },
        });
      } catch (err: any) {
        await prisma.pushSubscription.update({
          where: { id: d.id },
          data: { lastFailureAt: new Date(), failedCount: { increment: 1 } },
        });

        const status = err?.statusCode || err?.status || null;
        if (status === 410 || status === 404) {
          await prisma.pushSubscription.delete({ where: { id: d.id } });
        }
      }
    }
  }
}

async function main() {
  const args = process.argv.slice(2);
  const frequency = args[0]?.toLowerCase();

  if (frequency === "hourly") {
    await processFrequency("hourly");
  } else if (frequency === "daily") {
    await processFrequency("daily");
  } else {
    console.error("Usage: node notification-scheduler.js [hourly|daily]");
    process.exit(1);
  }

  await prisma.$disconnect();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
