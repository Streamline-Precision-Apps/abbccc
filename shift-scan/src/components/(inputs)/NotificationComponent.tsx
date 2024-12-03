"use client";

import { useNotification } from "@/app/context/NotificationContext";
import { Holds } from "@/components/(reusable)/holds";
import { Titles } from "../(reusable)/titles";
import { useEffect } from "react";

export const NotificationComponent = () => {
  const { notification } = useNotification();

  useEffect(() => {
    if (notification) {
      console.log("Notification received:", notification);
    }
  }, [notification]);

  if (!notification) return null; // Do not render if no notification exists

  return (
    <Holds background={"grey"} className="fixed top-0 left-0 w-full p-4 z-50">
      <Titles text={"black"} size={"h4"} className="text-center">
        {notification}
      </Titles>
    </Holds>
  );
};
