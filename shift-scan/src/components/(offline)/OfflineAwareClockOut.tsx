"use client";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import TempClockOutContent from "@/app/(routes)/dashboard/clock-out/tempClockOutContent";
import { fetchWithOfflineCache } from "@/utils/offlineApi";

export default function OfflineAwareClockOut() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [clockOutComment, setClockOutComment] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  const [sessionTimeout, setSessionTimeout] = useState(false);
  const [offlineSession, setOfflineSession] = useState<any>(null);

  // Fallback timeout to prevent infinite loading (10 seconds max)
  useEffect(() => {
    const fallbackTimeout = setTimeout(() => {
      console.warn(
        "[OFFLINE] Clock-out loading timeout, forcing load with empty data",
      );
      setIsLoading(false);
      setClockOutComment("");
    }, 10000);

    return () => clearTimeout(fallbackTimeout);
  }, []);

  // Handle session timeout for offline support
  useEffect(() => {
    if (status === "loading") {
      const timeoutId = setTimeout(() => {
        console.warn(
          "Session loading timeout, proceeding with offline mode for clock-out",
        );
        setSessionTimeout(true);
      }, 2000);

      return () => clearTimeout(timeoutId);
    } else {
      setSessionTimeout(false);
    }
  }, [status]);

  // Check for offline session data when session fails
  useEffect(() => {
    if (sessionTimeout || status === "unauthenticated") {
      // Check if user has offline dashboard authorization
      if (typeof window !== "undefined") {
        const offlineCurrentPageView = localStorage.getItem(
          "offline_currentPageView",
        );
        const offlineTimesheetData = localStorage.getItem(
          "current_offline_timesheet",
        );

        if (offlineCurrentPageView === "dashboard" && offlineTimesheetData) {
          try {
            const timesheetData = JSON.parse(offlineTimesheetData);

            // Create a mock session object for offline use
            const mockSession = {
              user: {
                id: timesheetData.userId || "offline-user",
                permission: "USER", // Default permission for offline
              },
            };

            console.log(
              "[OFFLINE] Using offline session for clock-out:",
              mockSession,
            );
            setOfflineSession(mockSession);
          } catch (error) {
            console.error(
              "[OFFLINE] Failed to parse offline timesheet data:",
              error,
            );
            // Redirect to signin if no valid offline data
            router.push("/signin");
            return;
          }
        } else {
          console.log(
            "[OFFLINE] No offline dashboard authorization found, redirecting to signin",
          );
          router.push("/signin");
          return;
        }
      }
    }
  }, [sessionTimeout, status, router]);

  // Fetch clock-out comment with timeout
  useEffect(() => {
    const currentSession = session || offlineSession;

    if (status === "loading" && !sessionTimeout) {
      return; // Still loading session
    }

    if (!currentSession) {
      return; // Will be handled by redirect logic above
    }

    const fetchClockOutComment = async () => {
      try {
        // Add timeout to prevent hanging
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout

        const comment = await fetchWithOfflineCache(
          `clockOutComment-${currentSession.user.id}`,
          async () => {
            const response = await fetch(
              `/api/getComment?userId=${currentSession.user.id}`,
              { signal: controller.signal },
            );
            if (!response.ok) return "";
            const data = await response.json();
            return data?.comment || "";
          },
          { ttl: 5 * 60 * 1000 }, // 5 minute cache
        );

        clearTimeout(timeoutId);
        setClockOutComment(comment);
      } catch (error) {
        if (error instanceof Error && error.name === "AbortError") {
          console.log("Clock-out comment fetch timed out, using empty comment");
        } else {
          console.error("Failed to fetch clock-out comment:", error);
        }
        setClockOutComment(""); // Default to empty comment
      } finally {
        setIsLoading(false);
      }
    };

    fetchClockOutComment();
  }, [session, offlineSession, status, sessionTimeout]);

  // Show loading state
  if ((status === "loading" && !sessionTimeout) || isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  const currentSession = session || offlineSession;

  // If no session available, return null (redirect will handle it)
  if (!currentSession) {
    return null;
  }

  return (
    <TempClockOutContent
      userId={currentSession.user.id}
      permission={currentSession.user.permission}
      clockOutComment={clockOutComment}
    />
  );
}
