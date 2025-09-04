// src/lib/notifications.ts
import webpush from "web-push";
import prisma from "@/lib/prisma";

webpush.setVapidDetails(
  process.env.VAPID_SUBJECT || "mailto:you@example.com",
  process.env.VAPID_PUBLIC_KEY || "",
  process.env.VAPID_PRIVATE_KEY || "",
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
  const topic = "timecards";

  // 1) load subscribers
  const subs = await prisma.topicSubscription.findMany({
    where: { topic },
    include: { user: true },
  });
  if (!subs.length) return;

  // 2) create Notification rows for each user
  const created = await Promise.all(
    subs.map((ts: any) =>
      prisma.notification.create({
        data: {
          userId: ts.userId,
          topic,
          title: `${payload.submitterName ?? "Someone"} submitted a timesheet`,
          body:
            payload.message ?? `Timesheet ${payload.timesheetId} is pending.`,
          url: `/admins/timesheets`,
          metadata: {
            timesheetId: payload.timesheetId,
            submitterName: payload.submitterName ?? null,
          },
        },
      }),
    ),
  );

  // 3) delivery decisions
  for (let i = 0; i < subs.length; i += SEND_CONCURRENCY) {
    const batch = subs.slice(i, i + SEND_CONCURRENCY);
    await Promise.all(
      batch.map(async (ts: any) => {
        const user = ts.user!;
        const notification = created.find(
          (n: any) => n.userId === ts.userId && n.topic === topic,
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
            devices.map(async (d: any) => {
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
            }),
          );
        }

        // If frequency is hourly/daily: do nothing now; scheduler will aggregate and push later.
      }),
    );
  }
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
  const subs = await prisma.topicSubscription.findMany({
    where: { topic },
    include: { user: true },
  });
  if (!subs.length) return;

  // 2) create Notification rows for each user
  const created = await Promise.all(
    subs.map((ts: any) =>
      prisma.notification.create({
        data: {
          userId: ts.userId,
          topic,
          title: `${payload.submitterName ?? "Someone"} submitted a form`,
          body:
            payload.message ??
            `A ${payload.formType || "new"} form (${payload.formId}) has been submitted and requires your review.`,
          url: `/admins/forms/${payload.formId}`,
          metadata: {
            formId: payload.formId,
            submitterName: payload.submitterName ?? null,
            formType: payload.formType ?? null,
          },
        },
      }),
    ),
  );

  // 3) delivery decisions - similar to timesheet process
  for (let i = 0; i < subs.length; i += SEND_CONCURRENCY) {
    const batch = subs.slice(i, i + SEND_CONCURRENCY);
    await Promise.all(
      batch.map(async (ts: any) => {
        const user = ts.user!;
        const notification = created.find(
          (n: any) => n.userId === ts.userId && n.topic === topic,
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
            devices.map(async (d: any) => {
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
            }),
          );
        }

        // If frequency is hourly/daily: do nothing now; scheduler will aggregate and push later.
      }),
    );
  }
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
  const subs = await prisma.topicSubscription.findMany({
    where: { topic },
    include: { user: true },
  });
  if (!subs.length) return;

  // 2) create Notification rows for each user
  const created = await Promise.all(
    subs.map((ts: any) =>
      prisma.notification.create({
        data: {
          userId: ts.userId,
          topic,
          title: `${payload.requesterName ?? "Someone"} requested item approval`,
          body:
            payload.message ??
            `A ${payload.itemType || "new"} item (${payload.itemId}) requires your approval.`,
          url: `/admins/${payload.itemType}`,
          metadata: {
            itemId: payload.itemId,
            requesterName: payload.requesterName ?? null,
            itemType: payload.itemType ?? null,
          },
        },
      }),
    ),
  );

  // 3) delivery decisions - similar to timesheet process
  for (let i = 0; i < subs.length; i += SEND_CONCURRENCY) {
    const batch = subs.slice(i, i + SEND_CONCURRENCY);
    await Promise.all(
      batch.map(async (ts: any) => {
        const user = ts.user!;
        const notification = created.find(
          (n: any) => n.userId === ts.userId && n.topic === topic,
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
            devices.map(async (d: any) => {
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
            }),
          );
        }

        // If frequency is hourly/daily: do nothing now; scheduler will aggregate and push later.
      }),
    );
  }
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
  const subs = await prisma.topicSubscription.findMany({
    where: { topic },
    include: { user: true },
  });
  if (!subs.length) return;

  // 2) create Notification rows for each user
  const created = await Promise.all(
    subs.map((ts: any) =>
      prisma.notification.create({
        data: {
          userId: ts.userId,
          topic,
          title: `${payload.changerName ?? "Someone"} changed a timecard`,
          body:
            payload.message ??
            `Timecard ${payload.timesheetId} has been ${payload.changeType || "modified"} and may require your attention.`,
          url: `/admins/timesheets`,
          metadata: {
            timesheetId: payload.timesheetId,
            changerName: payload.changerName ?? null,
            changeType: payload.changeType ?? null,
          },
        },
      }),
    ),
  );

  // 3) delivery decisions - similar to timesheet process
  for (let i = 0; i < subs.length; i += SEND_CONCURRENCY) {
    const batch = subs.slice(i, i + SEND_CONCURRENCY);
    await Promise.all(
      batch.map(async (ts: any) => {
        const user = ts.user!;
        const notification = created.find(
          (n: any) => n.userId === ts.userId && n.topic === topic,
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
            devices.map(async (d: any) => {
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
            }),
          );
        }

        // If frequency is hourly/daily: do nothing now; scheduler will aggregate and push later.
      }),
    );
  }
}
