"use client";
import React, { useEffect, useState, useCallback, useRef } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { PageHeaderContainer } from "./_pages/PageHeaderContainer";
import { NotificationTable } from "./_components/NotificationTable";
import NotificationActions from "./_components/NotificationAction";
import { JsonValue } from "../../../../prisma/generated/prisma/runtime/library";
import { Notification } from "../../../../prisma/generated/prisma/client";
import { useSession } from "next-auth/react";

export type ResolvedNotification = {
  id: number;
  topic: string | null;
  title: string;
  body: string | null;
  url: string | null;
  metadata: JsonValue | null;
  createdAt: string;
  pushedAt: string | null;
  pushAttempts: number;
  readAt: string | null;
  Response: {
    id: number;
    notificationId: number;
    userId: string;
    response: string | null;
    respondedAt: string;
    user: {
      firstName: string;
      lastName: string;
    };
  } | null;
  Reads: Array<{
    userId: string;
  }>;
};

export default function Admins() {
  const [data, setData] = useState<Notification[] | undefined>();
  const [totalCount, setTotalCount] = useState(0);
  const [resolved, setResolved] = useState<
    ResolvedNotification[] | undefined
  >();
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const initialLoad = useRef(true);
  const { data: session } = useSession();
  const currentUserId = session?.user?.id || "";

  const fetchData = useCallback(async () => {
    try {
      if (initialLoad.current) {
        setIsLoading(true);
        initialLoad.current = false;
      }
      setIsRefreshing(true);
      console.log("🔄 Manual data refresh triggered");
      const response = await fetch("/api/notification-center");
      const json = await response.json();
      // API returns { notifications: Notification[] }
      setData(json.notifications);
      setTotalCount(json.count);
      setResolved(json.resolved);
      console.log("✅ Data refresh complete");
    } catch (error) {
      console.error("❌ Error refreshing data:", error);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <div className="flex flex-col h-full w-full p-4 gap-4">
      {/* Main content goes here */}
      <div className="flex flex-col h-12 w-full">
        <PageHeaderContainer
          loading={isRefreshing}
          headerText="Admin Dashboard"
          descriptionText="Quick Actions - review pending tasks & keep track of new entries."
          refetch={() => {
            fetchData();
          }}
        />
      </div>

      <div className="flex flex-row h-[calc(100vh-8rem)] w-full gap-4">
        <NotificationTable
          data={data || []}
          totalCount={totalCount}
          loading={isLoading || isRefreshing}
        />
        <NotificationActions
          resolved={resolved}
          currentUserId={currentUserId}
        />
      </div>
    </div>
  );
}
