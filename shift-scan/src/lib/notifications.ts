// src/lib/notifications.ts
import webpush from "web-push";
import prisma from "@/lib/prisma";
import { Prisma } from "../../prisma/generated/prisma/client";

webpush.setVapidDetails(
  process.env.VAPID_SUBJECT || "mailto:you@example.com",
  process.env.VAPID_PUBLIC_KEY || "",
  process.env.VAPID_PRIVATE_KEY || "",
);

const ACTIVE_WINDOW_MS =
  Number(process.env.ACTIVE_WINDOW_MINUTES || 2) * 60 * 1000;
const SEND_CONCURRENCY = Number(process.env.SEND_CONCURRENCY || 10);

type NotificationPayload = {
  id: string;
  title: string;
  body: string | null;
  url: string | null;
  metadata: Prisma.JsonValue | null;
  createdAt: Date;
  topic: string;
};

async function emitInAppToUser(userId: string, payload: NotificationPayload) {
  // Implement with your realtime system:
  // - Socket.IO: io.to(`user:${userId}`).emit("notification", payload)

  // - Pusher: trigger user channel
  // For now, this is a placeholder.
  return;
}

async function loadSubscribersForTopic(topic: string) {
  return await prisma.topicSubscription.findMany({
    where: { topic },
    include: { user: true },
  });
}

async function createNotificationRowsForEachUser(
  subscribers: Array<{
    userId: string;
    inApp: boolean;
    push: boolean;
    frequency: "immediate" | "hourly" | "daily";
  }>,
  payload: {
    formId?: string;
    timesheetId?: string;
    submitterName?: string;
    message?: string;
    formType?: string;
    itemId?: string;
    requesterName?: string;
    itemType?: string;
    changerName?: string;
    changeType?: string;
  },
  topic: string,
  notificationTitle: string,
  link: string | null,
) {
  return await Promise.all(
    subscribers.map(
      (ts: {
        userId: string;
        inApp: boolean;
        push: boolean;
        frequency: "immediate" | "hourly" | "daily";
      }) =>
        prisma.notification.create({
          data: {
            userId: ts.userId,
            topic,
            title: `${payload.submitterName ?? "Someone"} ${notificationTitle}`,
            body: payload.message,
            url: `${link}`,
            metadata: {
              timesheetId: payload.timesheetId,
              submitterName: payload.submitterName ?? null,
              formType: payload.formType ?? null,
              itemId: payload.itemId ?? null,
              requesterName: payload.requesterName ?? null,
              itemType: payload.itemType ?? null,
              changerName: payload.changerName ?? null,
              changeType: payload.changeType ?? null,
            },
          },
        }),
    ),
  );
}

async function deliverNotifications({
  subs,
  created,
  topic,
}: {
  subs: Array<{
    user: { lastSeen: Date | null };
    userId: string;
    inApp: boolean;
    push: boolean;
    frequency: "immediate" | "hourly" | "daily";
  }>;
  created: Array<{
    userId: string;
    topic: string;
    id: string;
    title: string;
    body: string | null;
    url: string | null;
    metadata: Prisma.JsonValue | null;
    createdAt: Date;
  }>;
  topic: string;
}) {
  for (let i = 0; i < subs.length; i += SEND_CONCURRENCY) {
    const batch = subs.slice(i, i + SEND_CONCURRENCY);
    await Promise.all(
      batch.map(
        async (ts: {
          user: { lastSeen: Date | null };
          userId: string;
          inApp: boolean;
          push: boolean;
          frequency: "immediate" | "hourly" | "daily";
        }) => {
          const user = ts.user!;
          const notification = created.find(
            (n: { userId: string; topic: string }) =>
              n.userId === ts.userId && n.topic === topic,
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
              devices.map(
                async (d: {
                  id: string;
                  endpoint: string;
                  auth: string;
                  p256dh: string;
                }) => {
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
                      }),
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
                  } catch (err: unknown) {
                    await prisma.pushSubscription.update({
                      where: { id: d.id },
                      data: {
                        lastFailureAt: new Date(),
                        failedCount: { increment: 1 },
                      },
                    });

                    await prisma.notification.update({
                      where: { id: notification.id },
                      data: { pushAttempts: { increment: 1 } },
                    });
                  }
                },
              ),
            );
          }

          // If frequency is hourly/daily: do nothing now; scheduler will aggregate and push later.
        },
      ),
    );
  }
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
  const topic = "timecards";

  // 1) load subscribers
  const subs = await loadSubscribersForTopic(topic);

  if (!subs.length) return;

  // 2) create Notification rows for each user
  const notificationTitle = "submitted a timesheet";
  const link = "/admins/timesheets";
  const created = await createNotificationRowsForEachUser(
    subs,
    payload,
    topic,
    notificationTitle,
    link,
  );

  // 3) delivery decisions
  await deliverNotifications({ subs, created, topic });
}

/**
 * Call this when a form is submitted.
 * Creates Notification rows and tries to deliver based on presence and frequency.
 */
export async function triggerFormSubmitted(payload: {
  formId: string;
  submitterName?: string;
  message?: string;
  formType?: string;
}) {
  const topic = "forms";

  // 1) load subscribers
  const subs = await loadSubscribersForTopic(topic);
  if (!subs.length) return;

  // 2) create Notification rows for each user

  const notificationTitle = "submitted a form";
  const link = `/admins/forms/${payload.formId}`;
  const created = await createNotificationRowsForEachUser(
    subs,
    payload,
    topic,
    notificationTitle,
    link,
  );

  // 3) delivery decisions
  await deliverNotifications({ subs, created, topic });
}

/**
 * Call this when an item approval is requested.
 * Creates Notification rows and tries to deliver based on presence and frequency.
 */
export async function triggerItemApprovalRequested(payload: {
  itemId: string;
  requesterName?: string;
  message?: string;
  itemType?: string;
}) {
  const topic = "items";

  // 1) load subscribers
  const subs = await loadSubscribersForTopic(topic);
  if (!subs.length) return;

  // 2) create Notification rows for each user
  const notificationTitle = "requested item approval";
  const link = `/admins/${payload.itemType}`;
  const created = await createNotificationRowsForEachUser(
    subs,
    payload,
    topic,
    notificationTitle,
    link,
  );

  // 3) delivery decisions
  await deliverNotifications({ subs, created, topic });
}

/**
 * Call this when a timecard is changed (after initial submission).
 * Creates Notification rows and tries to deliver based on presence and frequency.
 */
export async function triggerTimecardChanged(payload: {
  timesheetId: string;
  changerName?: string;
  message?: string;
  changeType?: string;
}) {
  const topic = "timecards-changes";

  // 1) load subscribers
  const subs = await loadSubscribersForTopic(topic);
  if (!subs.length) return;

  // 2) create Notification rows for each user
  const notificationTitle = "changed a timecard";
  const link = `/admins/timesheets`;
  const created = await createNotificationRowsForEachUser(
    subs,
    payload,
    topic,
    notificationTitle,
    link,
  );

  // 3) delivery decisions
  await deliverNotifications({ subs, created, topic });
}
