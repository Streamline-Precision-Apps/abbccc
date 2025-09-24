"use client";

import { useSession as useNextAuthSession } from "next-auth/react";
import { useEffect, useState } from "react";
import type { Session } from "next-auth";

// Session storage key for offline session cache
const OFFLINE_SESSION_KEY = 'offline_session_cache';

interface OfflineSessionResult {
  data: Session | null;
  status: "loading" | "authenticated" | "unauthenticated";
  isOffline?: boolean;
}

export function useOfflineSession(): OfflineSessionResult {
  const { data: onlineSession, status: onlineStatus } = useNextAuthSession();
  const [cachedSession, setCachedSession] = useState<Session | null>(null);
  const [isOnline, setIsOnline] = useState(true);

  // Monitor online/offline status
  useEffect(() => {
    function handleOnline() {
      setIsOnline(true);
    }

    function handleOffline() {
      setIsOnline(false);
    }

    setIsOnline(navigator.onLine);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Cache session when online and available
  useEffect(() => {
    if (onlineSession && isOnline && onlineStatus === "authenticated") {
      try {
        localStorage.setItem(OFFLINE_SESSION_KEY, JSON.stringify(onlineSession));
        console.log('🟢 Session cached for offline use');
      } catch (error) {
        console.error('Failed to cache session:', error);
      }
    }
  }, [onlineSession, isOnline, onlineStatus]);

  // Load cached session when offline
  useEffect(() => {
    if (!isOnline) {
      try {
        const cached = localStorage.getItem(OFFLINE_SESSION_KEY);
        if (cached) {
          const parsedSession = JSON.parse(cached);
          setCachedSession(parsedSession);
          console.log('🔵 Using cached session for offline mode');
        }
      } catch (error) {
        console.error('Failed to load cached session:', error);
        setCachedSession(null);
      }
    } else {
      setCachedSession(null);
    }
  }, [isOnline]);

  // Return appropriate session data
  if (isOnline) {
    // When online, use real session
    return {
      data: onlineSession,
      status: onlineStatus,
      isOffline: false
    };
  } else {
    // When offline, use cached session if available
    if (cachedSession) {
      return {
        data: cachedSession,
        status: "authenticated",
        isOffline: true
      };
    } else {
      return {
        data: null,
        status: "unauthenticated", 
        isOffline: true
      };
    }
  }
}