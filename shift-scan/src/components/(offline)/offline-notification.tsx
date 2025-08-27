"use client";
import React, { useEffect, useState } from "react";
import { useEnhancedOfflineStatus } from "@/hooks/useEnhancedOfflineStatus";
import { Holds } from "../(reusable)/holds";
import { Texts } from "../(reusable)/texts";
import { Buttons } from "../(reusable)/buttons";

interface OfflineNotificationProps {
  position?: "top" | "bottom";
  autoHide?: boolean;
  hideDelay?: number;
}

export default function OfflineNotification({
  position = "top",
  autoHide = true,
  hideDelay = 5000,
}: OfflineNotificationProps) {
  const {
    isOnline,
    notification,
    clearNotification,
    summary,
    performSync,
    isSyncing,
    offlineStatus,
  } = useEnhancedOfflineStatus();

  const [visible, setVisible] = useState(false);

  // Auto-hide notification
  useEffect(() => {
    if (notification && autoHide) {
      setVisible(true);
      const timer = setTimeout(() => {
        setVisible(false);
        setTimeout(clearNotification, 300); // Allow fade out animation
      }, hideDelay);

      return () => clearTimeout(timer);
    } else if (notification) {
      setVisible(true);
    }
  }, [notification, autoHide, hideDelay, clearNotification]);

  const getNotificationStyle = (type: string) => {
    switch (type) {
      case "success":
        return "bg-green-100 border-green-400 text-green-800";
      case "error":
        return "bg-red-100 border-red-400 text-red-800";
      case "info":
        return "bg-blue-100 border-blue-400 text-blue-800";
      default:
        return "bg-gray-100 border-gray-400 text-gray-800";
    }
  };

  const handleSyncNow = async () => {
    await performSync();
  };

  // Connection status bar
  const ConnectionStatus = () => (
    <Holds
      className={`fixed ${position === "top" ? "top-0" : "bottom-0"} left-0 right-0 z-50`}
    >
      <div
        className={`w-full px-4 py-2 ${isOnline ? "bg-green-50 border-green-200" : "bg-yellow-50 border-yellow-200"} border-b`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div
              className={`w-2 h-2 rounded-full ${isOnline ? "bg-green-500" : "bg-yellow-500"}`}
            ></div>
            <Texts
              size="p6"
              className={isOnline ? "text-green-700" : "text-yellow-700"}
            >
              {isOnline ? "Online" : "Offline Mode"}
            </Texts>
            {summary.hasPending && (
              <Texts size="p6" className="text-gray-600">
                • {offlineStatus.total} pending
              </Texts>
            )}
          </div>

          {summary.canSync && (
            <Buttons
              onClick={handleSyncNow}
              background="lightBlue"
              className="px-3 py-1"
              disabled={isSyncing}
            >
              <Texts size="p6">{isSyncing ? "Syncing..." : "Sync Now"}</Texts>
            </Buttons>
          )}
        </div>
      </div>
    </Holds>
  );

  // Notification popup
  const NotificationPopup = () => {
    if (!notification || !visible) return null;

    return (
      <Holds
        className={`fixed ${position === "top" ? "top-16" : "bottom-16"} left-4 right-4 z-50`}
      >
        <div
          className={`
          max-w-md mx-auto p-4 rounded-lg border shadow-lg transition-all duration-300
          ${getNotificationStyle(notification.type)}
          ${visible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2"}
        `}
        >
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <Texts size="p5" className="font-medium">
                {notification.type === "success" && "✓ "}
                {notification.type === "error" && "⚠ "}
                {notification.type === "info" && "ℹ "}
                {notification.message}
              </Texts>
            </div>
            <button
              onClick={() => {
                setVisible(false);
                setTimeout(clearNotification, 300);
              }}
              className="ml-2 text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
          </div>
        </div>
      </Holds>
    );
  };

  return (
    <>
      <ConnectionStatus />
      <NotificationPopup />
    </>
  );
}
