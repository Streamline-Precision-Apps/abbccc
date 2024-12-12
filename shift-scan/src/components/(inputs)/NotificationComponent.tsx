"use client";

import { useNotification } from "@/app/context/NotificationContext";
import { Holds } from "@/components/(reusable)/holds";
import { Titles } from "../(reusable)/titles";

export const NotificationComponent = () => {
  const { notification, type } = useNotification(); // Access both `notification` and `type`

  if (!notification) return null; // Do not render if no notification exists

  const backgroundColor = {
    error: "red",
    success: "green",
    neutral: "orange",
  }[type]; // Determine background color based on `type`

  return (
    <Holds
      background={backgroundColor as "red" | "green" | "orange"}
      className="w-[70%] fixed top-[4.5%] left-1/2 -translate-x-1/2 z-50 "
    >
      <Titles text={"black"} size={"h5"} className="text-center">
        {notification}
      </Titles>
    </Holds>
  );
};
