/* Service worker snippet that posts incoming push payloads to open clients
   so your PushToastListener can show sonner toasts. Keep your existing
   showNotification logic if you also want OS notifications. */

self.addEventListener("install", (event) => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener("push", (event) => {
  let payload = {};
  try {
    if (event.data) payload = event.data.json();
  } catch {
    payload = { title: "Notification", body: event.data?.text() || "" };
  }

  event.waitUntil(
    (async () => {
      // post message to clients for in-app toasts (Sonner)
      const clientsList = await clients.matchAll({
        type: "window",
        includeUncontrolled: true,
      });
      clientsList.forEach((c) =>
        c.postMessage({ type: "PUSH_TOPIC", payload }),
      );

      // Check meta to decide whether to show OS notification
      const meta = payload.meta || {};
      const { showNotification = true } = meta;

      if (showNotification) {
        const {
          title = "Notification",
          body = "",
          icon = "/icon-192.png",
          badge = "/badge-72.png",
          tag,
          data = {},
        } = payload;
        await self.registration.showNotification(title, {
          body,
          icon,
          badge,
          tag,
          data,
        });
      }
    })(),
  );
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const data = event.notification.data || {};
  const url = data.url || "/";

  event.waitUntil(
    (async () => {
      const allClients = await clients.matchAll({
        type: "window",
        includeUncontrolled: true,
      });
      const focused = allClients.find((c) =>
        c.url.includes(self.registration.scope),
      );
      if (focused) {
        focused.focus();
        focused.postMessage({ type: "NOTIFICATION_CLICK", data });
      } else {
        await clients.openWindow(url);
      }
    })(),
  );
});
