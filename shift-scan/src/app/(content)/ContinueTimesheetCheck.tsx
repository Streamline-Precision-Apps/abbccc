"use client";
import { useEffect } from "react";
export default function ContinueTimesheetCheck({
  id,
}: {
  id: number | undefined;
}) {
  // This component is used to trigger the continue-timesheet API route on mount

  useEffect(() => {
    const continueTimesheet = async () => {
      try {
        await fetch(`/api/continue-timesheet?userId=${id}`);
      } catch (error) {
        console.error("Error continuing timesheet:", error);
      }
    };

    continueTimesheet();
  }, [id]);

  return null; // This component does not render anything
}
