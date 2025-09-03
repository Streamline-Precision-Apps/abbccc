self.addEventListener("push", (event) => {
  console.log("[Service Worker] Push Received.");

  // Extract notification data
  const data = event.data ? event.data.json() : {};
  const title = data.title || "Default Title";
  const options = {
    body: data.body || "Default body content",
    icon: data.icon || "/icon-192X192.png", // Default icon
    badge: data.badge || "/icon-192X192.png", // Default badge
    data: data.url || "/", // URL to open on click
  };

  // Show the notification
  event.waitUntil(self.registration.showNotification(title, options));
});

// Handle notification click events
self.addEventListener("notificationclick", (event) => {
  console.log("[Service Worker] Notification click Received.");

  event.notification.close(); // Close the notification

  // Open the URL specified in the notification data
  event.waitUntil(clients.openWindow(event.notification.data || "/"));
});

// Optional: Handle notification close events
self.addEventListener("notificationclose", (event) => {
  console.log("[Service Worker] Notification closed.", event);
});
