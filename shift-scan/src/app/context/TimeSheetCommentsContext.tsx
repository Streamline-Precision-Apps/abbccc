"use client";
import React, { createContext, useState, ReactNode, useContext } from "react";

type TimeSheetCommentsProps = {
  timeSheetComments: string | null;
  setTimeSheetComments: (timeSheetComments: string | null) => void;
};

const TimeSheetComments = createContext<TimeSheetCommentsProps | undefined>(
  undefined
);

export const TimeSheetCommentsProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [timeSheetComments, setTimeSheetCommentsState] = useState<string | null>(() => {
    // Load initial state from localStorage if available
    if (typeof window !== "undefined") {
      const savedComments = localStorage.getItem("timeSheetComments");
      return savedComments ? savedComments : null;
    } else {
      return null;
    }
  });

  const setTimeSheetComments = (comments: string | null) => {
    setTimeSheetCommentsState(comments);
    // Save to localStorage
    if (typeof window !== "undefined") {
      if (comments) {
        localStorage.setItem("timeSheetComments", comments);
      } else {
        localStorage.removeItem("timeSheetComments");
      }
    }
  };

  return (
    <TimeSheetComments.Provider
      value={{ timeSheetComments, setTimeSheetComments }}
    >
      {children}
    </TimeSheetComments.Provider>
  );
};

export const useTimeSheetComments = () => {
  const context = useContext(TimeSheetComments);
  if (!context) {
    throw new Error(
      "useTimeSheetComments must be used within a TimeSheetCommentsProvider"
    );
  }
  return context;
};
