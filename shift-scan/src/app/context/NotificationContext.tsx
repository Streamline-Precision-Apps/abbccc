"use client";
import React, {
  createContext,
  useState,
  useEffect,
  ReactNode,
  useContext,
} from "react";

type NotificationProps = {
  notification: string | null;
  setNotification: (notification: string | null) => void;
};

const Notification = createContext<NotificationProps | undefined>(undefined);

export const NotificationProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [notification, setNotificationState] = useState<string | null>(() => {
    // Load initial state from localStorage if available
    if (typeof window !== "undefined") {
      const notification = localStorage.getItem("notification");
      return notification ? notification : null;
    } else {
      return null;
    }
  });

  const setNotification = (notification: string | null) => {
    setNotificationState(notification);
    // Save to localStorage
    if (typeof window !== "undefined") {
      if (notification) {
        localStorage.setItem("notification", notification);
      } else {
        localStorage.removeItem("notification");
      }
    }
  };

  // Automatically clear the notification after 6 seconds
  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => {
        setNotification(null);
      }, 6000);

      // Cleanup timer when notification changes or component unmounts
      return () => clearTimeout(timer);
    }
  }, [notification]);

  return (
    <Notification.Provider value={{ notification, setNotification }}>
      {children}
    </Notification.Provider>
  );
};

export const useNotification = () => {
  const context = useContext(Notification);
  if (!context) {
    throw new Error(
      "useNotification must be used within a NotificationProvider"
    );
  }
  return context;
};
