export const useNotification = () => {
  const subscribeToNotifications = async () => {
    if ("serviceWorker" in navigator && "PushManager" in window) {
      try {
        const registration = await navigator.serviceWorker.register("/sw.js");
        const subscription = await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
        });

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
