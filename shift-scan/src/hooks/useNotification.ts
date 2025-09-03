export const useNotification = () => {
  const subscribeToNotifications = async () => {
    if ("serviceWorker" in navigator && "PushManager" in window) {
      try {
        console.log("Registering service worker...");
        const registration = await navigator.serviceWorker.register(
          "/notifications/sw.js",
        );
        console.log("Service worker registered:", registration);

        // Check for an existing subscription
        const existingSubscription =
          await registration.pushManager.getSubscription();
        if (existingSubscription) {
          console.log("Existing subscription found. Unsubscribing...");
          await existingSubscription.unsubscribe();
          console.log("Unsubscribed from existing push subscription.");
        }

        console.log("Subscribing to push manager...");
        const subscription = await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
        });
        console.log("Push subscription successful:", subscription);

        // Send subscription to the backend
        await fetch("/api/notifications/trigger", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ subscription }),
        });

        console.log("Push notifications subscribed successfully!");
      } catch (error) {
        console.error("Failed to subscribe to notifications:", error);
      }
    } else {
      console.error("Push notifications are not supported in this browser.");
    }
  };
  return { subscribeToNotifications };
};
