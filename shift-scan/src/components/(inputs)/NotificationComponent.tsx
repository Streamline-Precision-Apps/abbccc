"use client";

import { useNotification } from "@/app/context/NotificationContext";
import { Holds } from "@/components/(reusable)/holds";
import { Texts } from "../(reusable)/texts";

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
      className="h-full absolute top-0 right-0 z-50 justify-center items-center rounded-[10px] px-3 py-1"
    >
      <Texts size={"p7"} className="text-center italic">
        {notification}
      </Texts>
    </Holds>
  );
};
