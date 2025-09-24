"use client";

import { format, getDay, isToday, isYesterday } from "date-fns";
// Helper to get day label
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { ResolvedNotification } from "../page";
import {
  ArrowLeft,
  ArrowRight,
  BookCheck,
  SearchCheck,
  Verified,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { updateNotificationReadStatus } from "@/actions/NotificationActions";
import { markAllNotificationsAsRead } from "@/actions/NotificationActions";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Toggle } from "@/components/ui/toggle";
import React from "react";

export default function NotificationActionsList({
  resolved,
  currentUserId,
}: {
  resolved: ResolvedNotification[] | undefined;
  currentUserId: string;
}) {
  // Local state to track read notifications
  const [readIds, setReadIds] = useState<Set<number>>(new Set());
  // State for switch
  const [showOnlyUnread, setShowOnlyUnread] = useState(false);
  // Async function to mark notification as read
  const markNotificationAsRead = async (notificationId: number) => {
    try {
      await updateNotificationReadStatus({ notificationId });
      setReadIds((prev) => {
        const updated = new Set(prev);
        updated.add(notificationId);
        return updated;
      });
    } catch (error) {
      console.error("Failed to mark notification as read", error);
    }
  };

  // Mark all visible unread notifications as read
  const markAllAsRead = async () => {
    try {
      await markAllNotificationsAsRead();
      // Update local state to mark all as read
      if (resolved) {
        setReadIds(new Set(resolved.map((item) => item.id)));
      }
    } catch (error) {
      console.error("Failed to mark all notifications as read", error);
    }
  };

  // Show summary modal/alert
  const showSummary = (item: ResolvedNotification) => {};

  const getDayLabel = (date: Date) => {
    if (isToday(date)) return `Today ${format(date, "MMM d, yyyy")}`;
    if (isYesterday(date)) return `Yesterday ${format(date, "MMM d, yyyy")}`;
    return format(date, "MMM d, yyyy");
  };

  return (
    <div className="w-1/3 h-full bg-white rounded-lg">
      <div className="flex flex-col h-full">
        <div className="flex flex-row justify-between items-center border-b border-gray-200 p-3">
          <h1>Resolved</h1>
          <div className="flex items-center space-x-2">
            <Switch
              id="unread-notifications"
              checked={showOnlyUnread}
              onCheckedChange={setShowOnlyUnread}
              className="data-[state=checked]:bg-blue-500"
            />
            <Label
              htmlFor="unread-notifications"
              className="text-xs text-blue-500"
            >
              Show only unread
            </Label>
          </div>
        </div>
        {/* Show responses */}
        <div className="flex flex-col p-3 h-full overflow-auto no-scrollbar bg-neutral-100  ">
          {resolved && resolved.length > 0 ? (
            (() => {
              // Filter and sort notifications
              const filtered = resolved
                .filter((item) => {
                  const isRead =
                    item.Reads?.some(
                      (r: { userId: string }) => r.userId === currentUserId,
                    ) || readIds.has(item.id);
                  return showOnlyUnread ? !isRead : true;
                })
                .sort((a, b) => {
                  if (!a.Response || !b.Response) return 0;
                  return (
                    new Date(b.Response.respondedAt).getTime() -
                    new Date(a.Response.respondedAt).getTime()
                  );
                });

              // Group by day
              let lastDayLabel = "";
              return filtered.map((item) => {
                const isRead =
                  item.Reads?.some(
                    (r: { userId: string }) => r.userId === currentUserId,
                  ) || readIds.has(item.id);
                if (!item.Response) return null;
                const respondedDate = new Date(item.Response.respondedAt);
                const dayLabel = getDayLabel(respondedDate);
                const isToday = dayLabel.startsWith("Today");
                const showDivider = dayLabel !== lastDayLabel;
                lastDayLabel = dayLabel;
                return (
                  <React.Fragment key={item.id}>
                    {showDivider && (
                      <div className="flex items-center justify-between w-full mb-2">
                        <div className="text-sm font-semibold text-gray-500 mt-4 ">
                          {dayLabel}
                        </div>
                        {isToday && (
                          <Button
                            variant={"ghost"}
                            size="sm"
                            className="text-xs text-blue-500 hover:text-blue-600 hover:bg-blue-100 rounded"
                            onClick={markAllAsRead}
                            type="button"
                          >
                            Mark All as Read
                          </Button>
                        )}
                      </div>
                    )}
                    <div
                      className={`relative border rounded-md transition-colors duration-200 hover:bg-neutral-50 
            ${isRead ? "bg-white border-gray-200" : "bg-blue-50 border-blue-300"}`}
                    >
                      <div className="flex flex-row justify-between p-2">
                        {/* Response title and time */}
                        <div className="flex flex-row items-center gap-4">
                          <Tooltip delayDuration={1000}>
                            <TooltipTrigger>
                              <div className="relative group w-8 h-8">
                                <div className="flex items-center justify-center rounded-full bg-blue-200 text-blue-900 font-bold text-xs w-8 h-8 cursor-pointer">
                                  {`${item.Response.user?.firstName?.[0] ?? ""}${item.Response.user?.lastName?.[0] ?? ""}`}
                                </div>
                                {item.Response.response === "Verified" ? (
                                  <span className="absolute -bottom-1 -right-1">
                                    <Verified className="h-4 w-4 text-white bg-green-500 rounded-full" />
                                  </span>
                                ) : item.Response.response === "Read" ? (
                                  <span className="absolute -bottom-1 -right-1">
                                    <SearchCheck className="h-4 w-4 text-white bg-green-500 rounded-full" />
                                  </span>
                                ) : null}
                              </div>
                            </TooltipTrigger>
                            <TooltipContent
                              side="right"
                              sideOffset={10}
                              className="bg-white text-blue-700 border border-blue-300 font-semibold text-xs p-3"
                            >
                              {`${item.Response.response} by ${item.Response.user?.firstName ?? ""} ${item.Response.user?.lastName ?? ""}`}
                            </TooltipContent>
                          </Tooltip>

                          <div className="flex flex-row gap-4 ">
                            <p
                              className={`text-sm font-semibold ${!isRead ? "text-blue-700" : "text-gray-800"}`}
                            >
                              {item.title}
                            </p>
                            <span className="text-xs text-gray-500 mt-1">
                              {formatDistanceToNow(respondedDate, {
                                addSuffix: true,
                              })}
                            </span>
                          </div>
                        </div>

                        <div className="flex flex-row gap-2 items-start">
                          {!isRead && (
                            <Tooltip>
                              <TooltipTrigger>
                                <Button
                                  size="icon"
                                  variant="outline"
                                  onClick={async (e) => {
                                    e.stopPropagation();
                                    await markNotificationAsRead(item.id);
                                  }}
                                >
                                  <BookCheck className="h-4 w-4 text-blue-500" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>Mark as Read</TooltipContent>
                            </Tooltip>
                          )}
                        </div>
                      </div>
                    </div>
                  </React.Fragment>
                );
              });
            })()
          ) : (
            <p className="text-sm text-gray-500 text-center py-6">
              No notifications to show 🎉
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
