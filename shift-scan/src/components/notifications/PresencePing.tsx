// src/components/notifications/PresencePing.tsx
"use client";

import { useEffect } from "react";

interface PresencePingProps {
  userId: string;
}

export default function PresencePing({ userId }: PresencePingProps) {
  useEffect(() => {
    if (!userId) return;

    let pingTimer: NodeJS.Timeout;

    async function ping() {
      try {
        await fetch("/api/presence/ping", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          // The API gets userId from the session, so we don't need to send it
          // But we keep the empty object to maintain consistency
          body: JSON.stringify({}),
        });
      } catch (error) {
        console.error("Failed to ping presence:", error);
      }
    }

    function onVisible() {
      ping();
      pingTimer = setInterval(ping, 60 * 1000); // every minute
    }

    function onHidden() {
      clearInterval(pingTimer);
    }

    // Listen for visibility changes
    document.addEventListener("visibilitychange", () => {
      if (document.visibilityState === "visible") onVisible();
      else onHidden();
    });

    // Start if visible
    if (document.visibilityState === "visible") onVisible();

    // Cleanup
    return () => {
      clearInterval(pingTimer);
      document.removeEventListener("visibilitychange", () => {});
    };
  }, [userId]);

  // No visual component
  return null;
}
