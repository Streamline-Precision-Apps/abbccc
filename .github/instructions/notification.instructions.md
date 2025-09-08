````markdown
# Timesheet Notifications — Step‑by‑step implementation for Next.js 15

This guide walks you through implementing the notification system we designed (timesheet submissions → in‑app when active, push when away, support for immediate/hourly/daily frequency) in a Next.js 15 app using Prisma + PostgreSQL + Web Push.

What I did for you: I prepared a clear sequence of steps, complete Prisma models, required env vars, server & client snippets (service worker, API routes, scheduler), and testing instructions so you can implement incrementally.

Prerequisites

- Next.js 15 project (App Router)
- Node >= 18
- PostgreSQL database
- Prisma installed in the project
  - npm i prisma @prisma/client
- web-push installed on server:
  - npm i web-push
- A WebSocket or realtime mechanism (Socket.IO, Pusher, or simple SSE) for in‑app emission; we provide a simple polling/ping presence option if you don't have sockets yet.

Environment variables
Add these to your .env (or hosting environment):

- DATABASE_URL=postgresql://user:pass@host:port/db
- VAPID_PUBLIC_KEY=... (generate with web-push)
- VAPID_PRIVATE_KEY=...
- VAPID_SUBJECT=mailto:you@example.com
- ACTIVE_WINDOW_MINUTES=2 (how long a user counts as "active")
- SEND_CONCURRENCY=10

Step 1 — Prisma schema (minimal MVP)
Add / update schema.prisma with these models (user-level topic subscriptions + device push + notification history):

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

enum Frequency {
  immediate
  hourly
  daily
}

model User {
  id        String   @id @default(cuid())
  email     String   @unique
  name      String?
  lastSeen  DateTime? // update from client for presence
  createdAt DateTime @default(now())

  pushSubscriptions PushSubscription[]
  topicSubscriptions TopicSubscription[]
  notifications      Notification[]
}

model PushSubscription {
  id            String    @id @default(cuid())
  endpoint      String    @unique
  auth          String
  p256dh        String
  userId        String?
  user          User?     @relation(fields: [userId], references: [id])
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
  lastSuccessAt DateTime?
  lastFailureAt DateTime?
  failedCount   Int       @default(0)

  @@index([userId])
}

model TopicSubscription {
  id        String    @id @default(cuid())
  userId    String
  user      User      @relation(fields: [userId], references: [id])
  topic     String
  inApp     Boolean   @default(true)
  push      Boolean   @default(true)
  frequency Frequency @default(immediate)
  createdAt DateTime  @default(now())

  @@unique([userId, topic])
  @@index([topic])
}

model Notification {
  id          String   @id @default(cuid())
  userId      String
  user        User     @relation(fields: [userId], references: [id])
  topic       String
  title       String
  body        String?
  url         String?
  metadata    Json?
  createdAt   DateTime @default(now())
  pushedAt    DateTime? // null => not pushed yet / scheduler will process
  pushAttempts Int     @default(0)
  readAt      DateTime?

  @@index([userId, createdAt])
  @@index([topic, createdAt])
}
```
````

Run migration:

- npx prisma generate
- npx prisma migrate dev --name add_notifications

Step 2 — VAPID keys
Generate keys locally (one-time):

- npx web-push generate-vapid-keys
  Copy public/private keys to your environment variables VAPID_PUBLIC_KEY and VAPID_PRIVATE_KEY.

Step 3 — Server: notification library
Create a small server library to trigger notifications and send web-push. Place it in lib/notifications.ts.

Example file (app router compatible):

```typescript
// src/lib/notifications.ts
import webpush from "web-push";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

webpush.setVapidDetails(
  process.env.VAPID_SUBJECT || "mailto:you@example.com",
  process.env.VAPID_PUBLIC_KEY || "",
  process.env.VAPID_PRIVATE_KEY || ""
);

const ACTIVE_WINDOW_MS =
  Number(process.env.ACTIVE_WINDOW_MINUTES || 2) * 60 * 1000;
const SEND_CONCURRENCY = Number(process.env.SEND_CONCURRENCY || 10);

async function emitInAppToUser(userId: string, payload: any) {
  // Implement with your realtime system:
  // - Socket.IO: io.to(`user:${userId}`).emit("notification", payload)
  // - Pusher: trigger user channel
  // For now, this is a placeholder.
  return;
}

/**
 * Call this when a timesheet is submitted.
 * Creates Notification rows and tries to deliver based on presence and frequency.
 */
export async function triggerTimesheetSubmitted(payload: {
  timesheetId: string;
  submitterName?: string;
  message?: string;
}) {
  const topic = "timecardSubmissions";

  // 1) load subscribers
  const subs = await prisma.topicSubscription.findMany({
    where: { topic },
    include: { user: true },
  });
  if (!subs.length) return;

  // 2) create Notification rows for each user
  const created = await Promise.all(
    subs.map((ts) =>
      prisma.notification.create({
        data: {
          userId: ts.userId,
          topic,
          title: `${payload.submitterName ?? "Someone"} submitted a timesheet`,
          body:
            payload.message ?? `Timesheet ${payload.timesheetId} is pending.`,
          url: `/timesheets/${payload.timesheetId}`,
          metadata: {
            timesheetId: payload.timesheetId,
            submitterName: payload.submitterName ?? null,
          },
        },
      })
    )
  );

  // 3) delivery decisions
  for (let i = 0; i < subs.length; i += SEND_CONCURRENCY) {
    const batch = subs.slice(i, i + SEND_CONCURRENCY);
    await Promise.all(
      batch.map(async (ts) => {
        const user = ts.user!;
        const notification = created.find(
          (n) => n.userId === ts.userId && n.topic === topic
        );
        if (!notification) return;

        const isActive =
          !!user.lastSeen &&
          Date.now() - new Date(user.lastSeen).getTime() <= ACTIVE_WINDOW_MS;

        // If active and wants inApp => emit socket
        if (isActive && ts.inApp) {
          try {
            await emitInAppToUser(ts.userId, {
              id: notification.id,
              title: notification.title,
              body: notification.body,
              url: notification.url,
              metadata: notification.metadata,
              createdAt: notification.createdAt,
              topic,
            });
            return; // don't push
          } catch (err) {
            // fallthrough to push if allowed
          }
        }

        // If away and wants push and immediate => send now
        if (ts.push && ts.frequency === "immediate") {
          const devices = await prisma.pushSubscription.findMany({
            where: { userId: ts.userId },
          });
          await Promise.all(
            devices.map(async (d) => {
              try {
                await webpush.sendNotification(
                  {
                    endpoint: d.endpoint,
                    keys: { auth: d.auth, p256dh: d.p256dh },
                  },
                  JSON.stringify({
                    title: notification.title,
                    body: notification.body,
                    url: notification.url,
                    metadata: notification.metadata,
                    topic,
                    timestamp: new Date().toISOString(),
                  })
                );
                await prisma.pushSubscription.update({
                  where: { id: d.id },
                  data: { lastSuccessAt: new Date(), failedCount: 0 },
                });
                // mark notification as pushed (one device success enough)
                await prisma.notification.update({
                  where: { id: notification.id },
                  data: { pushedAt: new Date() },
                });
              } catch (err: any) {
                await prisma.pushSubscription.update({
                  where: { id: d.id },
                  data: {
                    lastFailureAt: new Date(),
                    failedCount: { increment: 1 },
                  },
                });
                const status = err?.statusCode || err?.status || null;
                if (status === 410 || status === 404) {
                  await prisma.pushSubscription.delete({ where: { id: d.id } });
                }
                await prisma.notification.update({
                  where: { id: notification.id },
                  data: { pushAttempts: { increment: 1 } },
                });
              }
            })
          );
        }

        // If frequency is hourly/daily: do nothing now; scheduler will aggregate and push later.
      })
    );
  }
}
```

Step 4 — Server API endpoints (Next.js App Router route handlers)
Create routes to:

- register a push subscription (save PushSubscription)
- subscribe/unsubscribe to topic preferences (TopicSubscription)
- ping presence (update User.lastSeen)
- list notifications (dashboard)
- mark read

Example route to register subscription (app/api/push/subscribe/route.ts):

```typescript
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export async function POST(req: Request) {
  const { endpoint, keys, userId } = await req.json();
  if (!endpoint || !keys?.auth || !keys?.p256dh)
    return NextResponse.json({ error: "invalid" }, { status: 400 });

  const existing = await prisma.pushSubscription.findUnique({
    where: { endpoint },
  });
  if (existing) {
    // attach to user if needed
    if (userId && existing.userId !== userId) {
      await prisma.pushSubscription.update({
        where: { id: existing.id },
        data: { userId },
      });
    }
    return NextResponse.json({ ok: true });
  }

  await prisma.pushSubscription.create({
    data: {
      endpoint,
      auth: keys.auth,
      p256dh: keys.p256dh,
      userId: userId ?? undefined,
    },
  });
  return NextResponse.json({ ok: true });
}
```

Example route to toggle topic subscription (app/api/topics/subscribe/route.ts):

```typescript
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export async function POST(req: Request) {
  const {
    userId,
    topic,
    inApp = true,
    push = true,
    frequency = "immediate",
  } = await req.json();
  if (!userId || !topic)
    return NextResponse.json({ error: "invalid" }, { status: 400 });

  await prisma.topicSubscription.upsert({
    where: { userId_topic: { userId, topic } },
    create: { userId, topic, inApp, push, frequency },
    update: { inApp, push, frequency },
  });

  return NextResponse.json({ ok: true });
}
```

Presence ping endpoint (app/api/presence/ping/route.ts):

```typescript
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export async function POST(req: Request) {
  const { userId } = await req.json();
  if (!userId) return NextResponse.json({ error: "invalid" }, { status: 400 });

  await prisma.user.update({
    where: { id: userId },
    data: { lastSeen: new Date() },
  });
  return NextResponse.json({ ok: true });
}
```

List notifications (app/api/notifications/route.ts):

```typescript
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export async function GET(req: Request) {
  const userId = req.headers.get("x-user-id");
  if (!userId) return NextResponse.json({ error: "no user" }, { status: 400 });

  const notifications = await prisma.notification.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    take: 100,
  });
  return NextResponse.json(notifications);
}
```

Mark read endpoint:

```typescript
// app/api/notifications/read/route.ts
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export async function POST(req: Request) {
  const { userId, notificationId } = await req.json();
  if (!userId || !notificationId)
    return NextResponse.json({ error: "invalid" }, { status: 400 });

  await prisma.notification.updateMany({
    where: { id: notificationId, userId },
    data: { readAt: new Date() },
  });
  return NextResponse.json({ ok: true });
}
```

Step 5 — Client: service worker + subscribe flow

1. Register service worker (e.g., /public/sw.js) and subscribe for push.

Service worker (public/sw.js):

```javascript
self.addEventListener("push", function (event) {
  const payload = event.data ? event.data.json() : {};
  const title = payload.title || "Notification";
  const options = {
    body: payload.body,
    data: payload,
    // icon: '/icons/notification-192.png'
  };
  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener("notificationclick", function (event) {
  const url = event.notification?.data?.url || "/notifications";
  event.notification.close();
  event.waitUntil(clients.openWindow(url));
});
```

Client subscribe snippet (React / Next.js component):

```tsx
async function registerPush(userId: string) {
  if (!("serviceWorker" in navigator) || !("PushManager" in window)) return;

  const reg = await navigator.serviceWorker.register("/sw.js");
  const permission = await Notification.requestPermission();
  if (permission !== "granted") return;

  const publicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC; // inject at build/time
  const sub = await reg.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: urlBase64ToUint8Array(publicKey),
  });

  // send to server
  await fetch("/api/push/subscribe", {
    method: "POST",
    body: JSON.stringify({
      endpoint: sub.endpoint,
      keys: sub.toJSON().keys,
      userId,
    }),
    headers: { "Content-Type": "application/json" },
  });
}
```

Remember to implement urlBase64ToUint8Array helper.

Step 6 — Client presence ping
Update user's lastSeen to indicate active/away using visibility events and interval pings:

```tsx
// in your main layout / root client component
useEffect(() => {
  let pingTimer: any;

  async function ping() {
    await fetch("/api/presence/ping", {
      method: "POST",
      body: JSON.stringify({ userId }),
      headers: { "Content-Type": "application/json" },
    });
  }

  function onVisible() {
    ping();
    pingTimer = setInterval(ping, 60 * 1000); // every minute
  }

  function onHidden() {
    clearInterval(pingTimer);
  }

  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "visible") onVisible();
    else onHidden();
  });

  // start if visible
  if (document.visibilityState === "visible") onVisible();

  return () => clearInterval(pingTimer);
}, [userId]);
```

Step 7 — Scheduler for hourly/daily
Add a small worker script that runs in a cron job (server or worker) to aggregate notifications with pushedAt == null and send summaries.

Example (scripts/scheduler.ts):

```typescript
import { PrismaClient } from "@prisma/client";
import webpush from "web-push";

const prisma = new PrismaClient();
webpush.setVapidDetails(...); // same envs

async function processFrequency(frequency: 'hourly' | 'daily') {
  const minutes = frequency === 'hourly' ? 60 : 24 * 60;
  const since = new Date(Date.now() - minutes * 60 * 1000);

  const subs = await prisma.topicSubscription.findMany({ where: { frequency } });
  const byUser: Record<string, string[]> = {};
  for (const s of subs) (byUser[s.userId] ||= []).push(s.topic);

  for (const userId of Object.keys(byUser)) {
    const pending = await prisma.notification.findMany({
      where: { userId, topic: { in: byUser[userId] }, createdAt: { gte: since }, pushedAt: null },
      orderBy: { createdAt: 'asc' }
    });
    if (!pending.length) continue;

    const title = `${pending.length} new notification${pending.length > 1 ? 's' : ''}`;
    const body = pending.slice(0, 5).map(p => p.title).join(' · ');

    const devices = await prisma.pushSubscription.findMany({ where: { userId } });
    for (const d of devices) {
      try {
        await webpush.sendNotification({ endpoint: d.endpoint, keys: { auth: d.auth, p256dh: d.p256dh } }, JSON.stringify({
          title, body, url: '/notifications', metadata: { count: pending.length }
        }));
        await prisma.pushSubscription.update({ where: { id: d.id }, data: { lastSuccessAt: new Date(), failedCount: 0 }});
        await prisma.notification.updateMany({ where: { id: { in: pending.map(p => p.id) }}, data: { pushedAt: new Date() }});
      } catch (err: any) {
        await prisma.pushSubscription.update({ where: { id: d.id }, data: { lastFailureAt: new Date(), failedCount: { increment: 1 } }});
        const status = err?.statusCode || err?.status || null;
        if (status === 410 || status === 404) {
          await prisma.pushSubscription.delete({ where: { id: d.id } });
        }
      }
    }
  }
}
```

Run scheduler:

- On a server: add system cron to run node ./dist/scripts/scheduler.js hourly and daily.
- On a hosted serverless platform: use their scheduled functions (Vercel Cron, Cloud Run cron, AWS EventBridge, etc).
- Or run a worker process with node-cron or BullMQ.

Step 8 — Dashboard UI

- Query /api/notifications to populate notifications list.
- Show unread counts by checking readAt null.
- Provide "Mark read" button calling /api/notifications/read.

Step 9 — Testing

1. Create a test user and subscribe them to topic "timecardSubmissions" using /api/topics/subscribe.
2. Register service worker and subscribe for push on a client device (desktop Chrome).
3. Simulate timesheet submission by calling the server function or creating API that calls triggerTimesheetSubmitted:
   - Confirm Notification rows created in DB.
   - If client is active (focus tab and lastSeen updated), you should see the in-app socket event (or fetch notifications).
   - If client is away, you should receive a push notification.
4. Test hourly aggregation:
   - Set frequency=hourly for user, submit a few events, run the scheduler for hourly and confirm aggregated push and pushedAt updates.

Operational notes & tradeoffs

- Simpler MVP: user-level topic preferences simplify UX and implementation; all devices follow same user pref.
- You may later add device-level TopicSubscription for per-device overrides.
- Consider adding NotificationDeliveryLog if you need delivery auditing.
- For high volume, move push sending to a queue (BullMQ / Redis) for retries / backoff and to avoid blocking requests.
- Security: protect API endpoints (only authenticated users should be able to set subscriptions, mark read, etc.). Validate incoming subscription payloads.
- Privacy: allow users to list & revoke their push subscriptions; remove push subscriptions on 410 responses.

What's next (story)
I prepared this step‑by‑step plan and sample code to get your Next.js 15 app from zero to a working notification system for timesheet submissions. You can implement each step incrementally: add the Prisma models + migrate, wire the push subscription endpoints and service worker, implement triggerTimesheetSubmitted where your timesheet submission logic runs, and finally add the scheduler for hourly/daily summaries. If you'd like, I can now:

- generate exact files for your repo structure (routes and lib files) so you can copy/paste them into your project, or
- produce the actual Prisma migration SQL, or
- adapt the code to use Socket.IO (I can scaffold a small Socket.IO server example).

Pick which of those you'd like me to do next and I'll produce the concrete files.

```

```
