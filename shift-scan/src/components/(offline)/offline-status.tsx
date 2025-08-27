"use client";
import React, { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import {
  useOfflineSync,
  getOfflineActionsStatus,
  retryFailedActions,
  clearOfflineData,
} from "@/utils/offlineFirstWrapper";
import { Buttons } from "../(reusable)/buttons";
import { Contents } from "../(reusable)/contents";
import { Titles } from "../(reusable)/titles";
import { Holds } from "../(reusable)/holds";
import { Grids } from "../(reusable)/grids";
import { Texts } from "../(reusable)/texts";
import { Images } from "../(reusable)/images";
import Spinner from "../(animations)/spinner";

interface OfflineStatusProps {
  onClose?: () => void;
}

export default function OfflineStatus({ onClose }: OfflineStatusProps) {
  const t = useTranslations("Clock");
  const { isOnline, syncOfflineActions } = useOfflineSync();
  const [offlineStatus, setOfflineStatus] = useState(getOfflineActionsStatus());
  const [syncing, setSyncing] = useState(false);
  const [retrying, setRetrying] = useState(false);

  useEffect(() => {
    const updateStatus = () => {
      setOfflineStatus(getOfflineActionsStatus());
    };

    // Listen for offline action events
    const handleOfflineEvents = () => updateStatus();

    if (typeof window !== "undefined") {
      window.addEventListener("offlineActionStored", handleOfflineEvents);
      window.addEventListener("offlineActionSynced", handleOfflineEvents);
      window.addEventListener("offlineActionFailed", handleOfflineEvents);

      return () => {
        window.removeEventListener("offlineActionStored", handleOfflineEvents);
        window.removeEventListener("offlineActionSynced", handleOfflineEvents);
        window.removeEventListener("offlineActionFailed", handleOfflineEvents);
      };
    }
  }, []);

  // Update status periodically
  useEffect(() => {
    const interval = setInterval(() => {
      setOfflineStatus(getOfflineActionsStatus());
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const handleSyncNow = async () => {
    if (!isOnline) return;

    setSyncing(true);
    try {
      const result = await syncOfflineActions();
      console.log("Manual sync result:", result);
    } catch (error) {
      console.error("Manual sync failed:", error);
    } finally {
      setSyncing(false);
      setOfflineStatus(getOfflineActionsStatus());
    }
  };

  const handleRetryFailed = async () => {
    setRetrying(true);
    try {
      const result = await retryFailedActions();
      console.log("Retry result:", result);
    } catch (error) {
      console.error("Retry failed:", error);
    } finally {
      setRetrying(false);
      setOfflineStatus(getOfflineActionsStatus());
    }
  };

  const handleClearData = () => {
    if (
      confirm(
        "Are you sure you want to clear all offline data? This cannot be undone.",
      )
    ) {
      clearOfflineData();
      setOfflineStatus(getOfflineActionsStatus());
    }
  };

  const formatTimestamp = (timestamp: number) => {
    return new Date(timestamp).toLocaleString();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "text-yellow-600 bg-yellow-100";
      case "syncing":
        return "text-blue-600 bg-blue-100";
      case "failed":
        return "text-red-600 bg-red-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  return (
    <Holds className="h-full w-full relative">
      <Contents width={"section"} className="h-full">
        <Grids rows={"6"} gap={"4"} className="h-full w-full py-4">
          {/* Header */}
          <Holds className="row-start-1 row-end-2 flex justify-between items-center">
            <Titles size={"h3"}>Offline Status</Titles>
            {onClose && (
              <Buttons
                onClick={onClose}
                background={"lightGray"}
                className="px-4 py-2"
              >
                <Texts>Close</Texts>
              </Buttons>
            )}
          </Holds>

          {/* Connection Status */}
          <Holds className="row-start-2 row-end-3">
            <div className="flex items-center gap-3 p-3 border rounded-lg">
              <div
                className={`w-3 h-3 rounded-full ${isOnline ? "bg-green-500" : "bg-red-500"}`}
              ></div>
              <Texts size={"p4"}>
                {isOnline
                  ? "Online - Connected to server"
                  : "Offline - Changes saved locally"}
              </Texts>
            </div>
          </Holds>

          {/* Summary Stats */}
          <Holds className="row-start-3 row-end-4">
            <div className="grid grid-cols-4 gap-2">
              <div className="text-center p-3 bg-yellow-50 border border-yellow-200 rounded">
                <Texts size={"lg"} className="text-yellow-700">
                  {offlineStatus.pending.length}
                </Texts>
                <Texts size={"p6"} className="text-yellow-600">
                  Pending
                </Texts>
              </div>
              <div className="text-center p-3 bg-blue-50 border border-blue-200 rounded">
                <Texts size={"lg"} className="text-blue-700">
                  {offlineStatus.syncing.length}
                </Texts>
                <Texts size={"p6"} className="text-blue-600">
                  Syncing
                </Texts>
              </div>
              <div className="text-center p-3 bg-red-50 border border-red-200 rounded">
                <Texts size={"lg"} className="text-red-700">
                  {offlineStatus.failed.length}
                </Texts>
                <Texts size={"p6"} className="text-red-600">
                  Failed
                </Texts>
              </div>
              <div className="text-center p-3 bg-gray-50 border border-gray-200 rounded">
                <Texts size={"lg"} className="text-gray-700">
                  {offlineStatus.total}
                </Texts>
                <Texts size={"p6"} className="text-gray-600">
                  Total
                </Texts>
              </div>
            </div>
          </Holds>

          {/* Action Buttons */}
          <Holds className="row-start-4 row-end-5">
            <div className="flex gap-2">
              <Buttons
                onClick={handleSyncNow}
                background={isOnline ? "lightBlue" : "lightGray"}
                className="flex-1 py-2"
                disabled={!isOnline || syncing}
              >
                {syncing ? <Spinner size={16} /> : null}
                <Texts>{syncing ? "Syncing..." : "Sync Now"}</Texts>
              </Buttons>

              <Buttons
                onClick={handleRetryFailed}
                background="orange"
                className="flex-1 py-2"
                disabled={retrying || offlineStatus.failed.length === 0}
              >
                {retrying ? <Spinner size={16} /> : null}
                <Texts>{retrying ? "Retrying..." : "Retry Failed"}</Texts>
              </Buttons>

              <Buttons
                onClick={handleClearData}
                background="red"
                className="flex-1 py-2"
                disabled={offlineStatus.total === 0}
              >
                <Texts>Clear All</Texts>
              </Buttons>
            </div>
          </Holds>

          {/* Offline Actions List */}
          <Holds className="row-start-5 row-end-7 overflow-y-auto">
            <div className="space-y-2">
              <Texts size={"p4"} className="font-semibold">
                Recent Actions:
              </Texts>

              {offlineStatus.total === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <Texts size={"p5"}>No offline actions stored</Texts>
                </div>
              ) : (
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {[
                    ...offlineStatus.pending,
                    ...offlineStatus.syncing,
                    ...offlineStatus.failed,
                  ]
                    .sort((a, b) => b.timestamp - a.timestamp)
                    .map((action) => (
                      <div
                        key={action.id}
                        className="p-3 border rounded-lg bg-white"
                      >
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <Texts size={"p5"} className="font-medium">
                                {action.actionName}
                              </Texts>
                              <span
                                className={`px-2 py-1 text-xs rounded-full ${getStatusColor(action.status)}`}
                              >
                                {action.status}
                              </span>
                            </div>
                            <Texts size={"p6"} className="text-gray-500">
                              {formatTimestamp(action.timestamp)}
                            </Texts>
                            <Texts size={"p6"} className="text-gray-600">
                              ID: {action.id}
                            </Texts>
                            {action.lastError && (
                              <Texts size={"p6"} className="text-red-600 mt-1">
                                Error: {action.lastError}
                              </Texts>
                            )}
                            {action.retryCount && action.retryCount > 0 && (
                              <Texts size={"p6"} className="text-orange-600">
                                Retries: {action.retryCount}/3
                              </Texts>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </div>
          </Holds>
        </Grids>
      </Contents>
    </Holds>
  );
}
