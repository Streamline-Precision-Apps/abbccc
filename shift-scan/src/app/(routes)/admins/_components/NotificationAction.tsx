"use client";

import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { ResolvedNotification } from "../page";
import { Eye, Verified } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { updateNotificationReadStatus } from "@/actions/NotificationActions";
import { useState } from "react";
import { set } from "lodash";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export default function NotificationActions({
  resolved,
  currentUserId,
}: {
  resolved: ResolvedNotification[] | undefined;
  currentUserId: string;
}) {
  // Local state to track read notifications
  const [readIds, setReadIds] = useState<Set<number>>(new Set());
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

  return (
    <div className="w-1/3 h-full bg-white rounded-lg">
      <div className="p-3 flex flex-col h-full">
        <div className="flex flex-row justify-between items-center border-b border-gray-200 pb-2">
          <h1>Resolved</h1>
          <div className="flex items-center space-x-2">
            <Switch id="unread-notifications" />
            <Label
              htmlFor="unread-notifications"
              className="text-xs text-red-400"
            >
              Show only unread
            </Label>
          </div>
        </div>
        {/* Show responses */}
        <div className="flex flex-col gap-2 h-full overflow-auto no-scrollbar bg-neutral-100 ">
          {resolved?.map((item) => {
            const isRead =
              item.Reads?.some(
                (r: { userId: string }) => r.userId === currentUserId,
              ) || readIds.has(item.id);
            return item.Response ? (
              <div
                key={item.id}
                className={`text-base p-3  relative border-2 border-gray-200 ${isRead ? "text-black bg-white" : "text-black bg-emerald-50 "}`}
                style={{ cursor: !isRead ? "pointer" : "default" }}
                onClick={async () => {
                  if (!isRead) {
                    await markNotificationAsRead(item.id);
                  }
                }}
              >
                <div className="flex flex-col">
                  <div className="flex flex-row items-center gap-4">
                    <p className="text-sm font-semibold">{`${item.title}`}</p>
                    <span className="text-sm text-black">
                      {formatDistanceToNow(
                        new Date(item.Response.respondedAt),
                        { addSuffix: true },
                      )}
                    </span>
                  </div>
                  <div className="flex flex-row items-center mt-2 gap-2">
                    {item.Response.response === "Verified" ? (
                      <Verified className="h-4 w-4 text-green-500" />
                    ) : null}

                    <p className="text-xs text-black ">
                      {`${item.Response.response} by ${item.Response.user.firstName} ${item.Response.user.lastName}`}
                    </p>
                  </div>
                </div>
                {!isRead ? (
                  <span
                    className="absolute right-4 top-1/2 -translate-y-1/2 h-3 w-3 rounded-full bg-red-500 shadow-md border border-white"
                    aria-label="Unread notification"
                  />
                ) : (
                  <span
                    className="absolute right-4 top-1/2 -translate-y-1/2 h-3 w-3 rounded-full bg-green-500 shadow-md border border-white"
                    aria-label="Read notification"
                  />
                )}
              </div>
            ) : null;
          })}
        </div>
      </div>
    </div>
  );
}
