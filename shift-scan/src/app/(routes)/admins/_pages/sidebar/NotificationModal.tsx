import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Bell, Clock, FileText, Box, Check, Loader2 } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useSession } from "next-auth/react";

type Props = {
  open: boolean;
  setOpen: (open: boolean) => void;
};

type Channels = {
  inApp: boolean;
  push: boolean;
};

type Preference = {
  enabled: boolean;
  channels: Channels;
  frequency: "immediate" | "hourly" | "daily";
};

type subscriptions = {
  topic: string;
  inApp: boolean;
  push: boolean;
  frequency: "immediate" | "hourly" | "daily";
  id: string;
  userId: string;
  createdAt: Date;
};

export default function NotificationModal({ open, setOpen }: Props) {
  const { data: session } = useSession();
  const userId = session?.user.id;

  // State for subscription status
  const [subscriptionStatus, setSubscriptionStatus] = useState<{
    isSubscribed: boolean;
    endpoint?: string;
    permission?: string;
    serviceWorkerStatus?: string;
  }>({
    isSubscribed: false,
  });

  // State management
  const [prefs, setPrefs] = useState<subscriptions[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Fetch preferences when modal opens or user session changes
  useEffect(() => {
    if (!open || !userId) return;

    const fetchPreferences = async () => {
      try {
        setIsFetching(true);
        setErrorMessage(null);

        // Fetch user notification preferences from the server
        const response = await fetch("/api/notifications/topic-subscribe");
        const data = await response.json();

        if (data.subscriptions && Array.isArray(data.subscriptions)) {
          setPrefs(data.subscriptions);
        } else {
          // Handle empty or invalid response
          setPrefs([]);
        }
      } catch (err) {
        console.error("Error fetching preferences:", err);
        setErrorMessage("Network error while loading preferences");
        setPrefs([]);
      } finally {
        setIsFetching(false);
      }
    };

    fetchPreferences();
    checkSubscriptionStatus();
  }, [open, userId]);

  // Check if the browser is subscribed to push notifications
  const checkSubscriptionStatus = async () => {
    try {
      // Check permission status
      const permissionStatus = Notification.permission;

      // Check service worker registration
      let serviceWorkerStatus = "No service worker";
      let isSubscribed = false;
      let endpoint = "";

      if ("serviceWorker" in navigator) {
        const registration = await navigator.serviceWorker.getRegistration();

        if (registration) {
          serviceWorkerStatus = "Service worker registered";

          // Check if we have an active push subscription
          const subscription = await registration.pushManager.getSubscription();

          if (subscription) {
            isSubscribed = true;
            endpoint = subscription.endpoint;
          }
        }
      }

      setSubscriptionStatus({
        isSubscribed,
        endpoint,
        permission: permissionStatus,
        serviceWorkerStatus,
      });
    } catch (error) {
      console.error("Error checking subscription status:", error);
    }
  };
  // Helper functions for mapping between topic and preference keys
  const topicToKey = (topic: string): string => {
    switch (topic) {
      case "timecards":
        return "timecardApprovals";
      case "forms":
        return "formSubmissions";
      case "items":
        return "itemApprovals";
      case "timecards-changes":
        return "timecardChanges";
      default:
        return topic;
    }
  };

  const keyToTopic = (key: string): string => {
    switch (key) {
      case "timecardApprovals":
        return "timecards";
      case "formSubmissions":
        return "forms";
      case "itemApprovals":
        return "items";
      case "timecardChanges":
        return "timecards-changes";
      default:
        return key;
    }
  };

  // Find subscription by key
  const findSubscription = (key: string): subscriptions | undefined => {
    const topic = keyToTopic(key);
    return prefs.find((p) => p.topic === topic);
  };

  // Check if a specific preference is enabled
  const isEnabled = (key: string): boolean => {
    const sub = findSubscription(key);
    return !!sub && (sub.inApp || sub.push);
  };

  // Toggle enable/disable a preference
  const toggleEnabled = (key: string) => {
    const sub = findSubscription(key);
    const topic = keyToTopic(key);

    if (sub) {
      // If already exists, toggle it off
      setPrefs(
        prefs.map((p) =>
          p.topic === topic ? { ...p, inApp: false, push: false } : p,
        ),
      );
    } else {
      // Create a new subscription
      setPrefs([
        ...prefs,
        {
          topic,
          inApp: true,
          push: false,
          frequency: "immediate",
          id: `temp-${Date.now()}`, // Temporary ID until saved
          userId: userId || "",
          createdAt: new Date(),
        },
      ]);
    }
  };

  // Toggle a channel
  const toggleChannel = async (key: string, channel: keyof Channels) => {
    const topic = keyToTopic(key);
    const sub = findSubscription(key);

    // If enabling push, we need to handle push subscription
    if (channel === "push" && (!sub || !sub.push)) {
      try {
        // Request notification permission if not already granted
        if (Notification.permission !== "granted") {
          const permission = await Notification.requestPermission();
          if (permission !== "granted") {
            setErrorMessage("Push notification permission denied");
            return;
          }
        }

        // Register service worker if needed
        let registration;
        if ("serviceWorker" in navigator) {
          registration = await navigator.serviceWorker.register(
            "/notifications-sw.js",
          );
          await navigator.serviceWorker.ready;
        } else {
          setErrorMessage("Service workers not supported in this browser");
          return;
        }

        // Get or create push subscription
        let pushSubscription = await registration.pushManager.getSubscription();

        if (!pushSubscription) {
          // Need to get the VAPID public key
          try {
            // Function to convert base64 string to Uint8Array for the applicationServerKey
            function urlBase64ToUint8Array(base64String: string) {
              const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
              const base64 = (base64String + padding)
                .replace(/-/g, "+")
                .replace(/_/g, "/");
              const rawData = window.atob(base64);
              const outputArray = new Uint8Array(rawData.length);
              for (let i = 0; i < rawData.length; ++i) {
                outputArray[i] = rawData.charCodeAt(i);
              }
              return outputArray;
            }

            // Fetch the public key - adjust the endpoint based on your API
            const response = await fetch("/api/push/public-key");
            const { publicKey } = await response.json();

            if (!publicKey) {
              throw new Error("Failed to get VAPID public key");
            }

            // Subscribe to push
            pushSubscription = await registration.pushManager.subscribe({
              userVisibleOnly: true,
              applicationServerKey: urlBase64ToUint8Array(publicKey),
            });

            // Register subscription with server
            await fetch("/api/push/subscribe", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                endpoint: pushSubscription.endpoint,
                keys: {
                  auth: (pushSubscription.toJSON().keys as any).auth,
                  p256dh: (pushSubscription.toJSON().keys as any).p256dh,
                },
                userId,
              }),
            });

            // Update subscription status
            checkSubscriptionStatus();
            console.log("Successfully subscribed to push notifications");
          } catch (error) {
            console.error("Error creating push subscription:", error);
            setErrorMessage("Failed to subscribe to push notifications");
            return;
          }
        }
      } catch (error) {
        console.error("Error in push subscription process:", error);
        setErrorMessage("Push notification setup failed");
        return;
      }
    }

    // Update local state
    if (sub) {
      // Update existing subscription
      setPrefs(
        prefs.map((p) =>
          p.topic === topic ? { ...p, [channel]: !p[channel] } : p,
        ),
      );
    } else {
      // Create new subscription
      setPrefs([
        ...prefs,
        {
          topic,
          inApp: channel === "inApp",
          push: channel === "push",
          frequency: "immediate",
          id: `temp-${Date.now()}`, // Temporary ID until saved
          userId: userId || "",
          createdAt: new Date(),
        },
      ]);
    }
  };

  // Set frequency
  const setFrequency = (key: string, frequency: Preference["frequency"]) => {
    const topic = keyToTopic(key);
    const sub = findSubscription(key);

    if (sub) {
      // Update existing subscription
      setPrefs(prefs.map((p) => (p.topic === topic ? { ...p, frequency } : p)));
    }
  };

  const handleSave = async () => {
    if (!userId) return;

    try {
      setIsLoading(true);
      setErrorMessage(null);

      // Check if any preferences have push enabled
      const hasPushEnabled = prefs.some((pref) => pref.push);

      // If push is enabled for any preference, ensure service worker is registered
      if (hasPushEnabled) {
        try {
          // First ensure we have permission
          if (Notification.permission !== "granted") {
            const permission = await Notification.requestPermission();
            if (permission !== "granted") {
              // If permission denied, we should disable push for all preferences
              setPrefs(prefs.map((pref) => ({ ...pref, push: false })));
              setErrorMessage(
                "Push notifications permission denied. Push preferences have been disabled.",
              );
              setIsLoading(false);
              return;
            }
          }

          // Ensure service worker is registered
          if ("serviceWorker" in navigator) {
            // Register or get existing service worker
            const registration = await navigator.serviceWorker.register(
              "/notifications-sw.js",
            );
            console.log("Service Worker registered:", registration);
            await navigator.serviceWorker.ready;

            // Check if we have a push subscription
            let subscription = await registration.pushManager.getSubscription();

            // If no subscription exists, create one
            if (!subscription) {
              console.log("Creating push subscription...");

              // Fetch VAPID public key
              const response = await fetch("/api/push/public-key");
              const { publicKey } = await response.json();

              if (!publicKey) {
                setErrorMessage("Missing VAPID public key");
                console.error("Missing VAPID public key");
                return;
              }

              // Function to convert base64 string to Uint8Array
              function urlBase64ToUint8Array(base64String: string) {
                const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
                const base64 = (base64String + padding)
                  .replace(/-/g, "+")
                  .replace(/_/g, "/");
                const rawData = window.atob(base64);
                const outputArray = new Uint8Array(rawData.length);
                for (let i = 0; i < rawData.length; ++i) {
                  outputArray[i] = rawData.charCodeAt(i);
                }
                return outputArray;
              }

              // Subscribe to push
              console.log("Subscribing to push with public key:", publicKey);
              subscription = await registration.pushManager.subscribe({
                userVisibleOnly: true,
                applicationServerKey: urlBase64ToUint8Array(publicKey),
              });

              console.log("Push subscription created:", subscription);

              // Send subscription to server
              const result = await fetch("/api/push/subscribe", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  endpoint: subscription.endpoint,
                  keys: {
                    auth: (subscription.toJSON().keys as any).auth,
                    p256dh: (subscription.toJSON().keys as any).p256dh,
                  },
                  userId,
                }),
              });

              if (!result.ok) {
                const error = await result.text();
                throw new Error(`Failed to register subscription: ${error}`);
              }

              console.log("Subscription saved to server");
            } else {
              console.log(
                "Using existing push subscription:",
                subscription.endpoint,
              );
            }
          } else {
            setErrorMessage("Service Workers not supported in this browser");
            console.error("Service Workers not supported");
            // Continue saving preferences but log the error
          }
        } catch (error) {
          console.error("Push subscription setup failed:", error);
          setErrorMessage(
            `Push subscription failed: ${error instanceof Error ? error.message : String(error)}`,
          );
          // Continue saving preferences but log the error
        }
      }

      // Save each subscription
      for (const pref of prefs) {
        const result = await fetch("/api/notifications/topic-subscribe", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            topic: pref.topic,
            inApp: pref.inApp,
            push: pref.push,
            frequency: pref.frequency,
          }),
        });

        if (!result.ok) {
          const error = await result.text();
          console.error(`Failed to save preference for ${pref.topic}:`, error);
        }
      }

      // Check subscription status one more time
      checkSubscriptionStatus();

      // Success, close the modal
      setOpen(false);
    } catch (error) {
      console.error("Error saving preferences:", error);
      setErrorMessage(
        `Failed to save preferences: ${error instanceof Error ? error.message : String(error)}`,
      );
    } finally {
      setIsLoading(false);
    }
  };

  const rows = [
    {
      key: "timecardApprovals",
      title: "Pending Timecard Approvals",
      desc: "Get notified when team members submit timecards that require your approval.",
      icon: <Clock className="w-4 h-4" />,
    },
    {
      key: "formSubmissions",
      title: "Pending Form Submissions",
      desc: "Be alerted when forms are submitted and waiting for review.",
      icon: <FileText className="w-4 h-4" />,
    },
    {
      key: "itemApprovals",
      title: "New Item Approval Requests",
      desc: "Receive alerts when new items are submitted and need review.",
      icon: <Box className="w-4 h-4" />,
    },
    {
      key: "timecardChanges",
      title: "Timecard Changes",
      desc: "Be alerted when timecards are modified and require your attention.",
      icon: <Clock className="w-4 h-4" />,
    },
  ];

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="w-[90%] max-w-2xl min-h-[420px] rounded-lg">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <DialogTitle className="flex items-center gap-2 text-lg font-semibold">
              <Bell className="h-5 w-5" />
              Notification Settings
            </DialogTitle>
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            Configure how you'd like to receive alerts. You can choose channels
            and delivery frequency per notification type.
          </p>
        </DialogHeader>

        {isFetching ? (
          <div className="flex flex-col items-center justify-center py-10">
            <Loader2 className="h-10 w-10 animate-spin text-blue-500 mb-4" />
            <p className="text-sm text-muted-foreground">
              Loading your notification preferences...
            </p>
          </div>
        ) : (
          <div className="divide-y mt-4">
            {rows.map((r) => {
              const sub = findSubscription(r.key);
              const enabled = isEnabled(r.key);

              return (
                <div key={r.key} className="py-4 flex flex-col gap-3">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3">
                      <div className="mt-1 text-slate-700">{r.icon}</div>
                      <div>
                        <div className="flex items-center gap-2">
                          <Label className="text-sm font-medium">
                            {r.title}
                          </Label>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1 max-w-xl">
                          {r.desc}
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-col items-end gap-2">
                      <div className="flex items-center gap-3">
                        <Switch
                          id={r.key}
                          checked={enabled}
                          onCheckedChange={() => toggleEnabled(r.key)}
                        />
                      </div>
                    </div>
                  </div>
                  {enabled && (
                    <div className="flex flex-row items-center space-x-6">
                      <div className="flex flex-col items-start ml-6 gap-2">
                        <Label className="text-xs">
                          Choose your notifications
                        </Label>
                        <div className="flex items-center gap-2">
                          <Button
                            variant={sub?.inApp ? null : "outline"}
                            onClick={() => toggleChannel(r.key, "inApp")}
                            className={
                              sub?.inApp ? "bg-blue-500 text-white" : ""
                            }
                            size="sm"
                          >
                            <p>App alerts</p>
                            {sub?.inApp && (
                              <Check className="w-4 h-4 ml-1 text-white" />
                            )}
                          </Button>
                          <Button
                            variant={sub?.push ? null : "outline"}
                            onClick={() => toggleChannel(r.key, "push")}
                            className={
                              sub?.push ? "bg-blue-500 text-white" : ""
                            }
                            size="sm"
                          >
                            <p>Push notifications</p>
                            {sub?.push && (
                              <Check className="w-4 h-4 ml-1 text-white" />
                            )}
                          </Button>
                        </div>
                      </div>

                      <div className="">
                        <Label className="text-xs">
                          How often should we notify you?
                        </Label>
                        <Select
                          value={sub?.frequency || "immediate"}
                          onValueChange={(value) =>
                            setFrequency(
                              r.key,
                              value as Preference["frequency"],
                            )
                          }
                        >
                          <SelectTrigger className="w-[180px] text-xs">
                            <SelectValue placeholder="Select frequency" />
                          </SelectTrigger>
                          <SelectContent side="right">
                            <SelectItem value="immediate">
                              Right away
                            </SelectItem>
                            <SelectItem value="hourly">Every hour</SelectItem>
                            <SelectItem value="daily">Once a day</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        <DialogFooter className="flex items-center justify-end gap-3 mt-4">
          {errorMessage && (
            <div className="text-red-500 text-sm mr-auto">{errorMessage}</div>
          )}
          <Button
            variant="secondary"
            onClick={() => setOpen(false)}
            disabled={isLoading || isFetching}
          >
            Cancel
          </Button>
          <Button
            variant="default"
            onClick={handleSave}
            disabled={isLoading || isFetching}
          >
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Save Preferences
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
