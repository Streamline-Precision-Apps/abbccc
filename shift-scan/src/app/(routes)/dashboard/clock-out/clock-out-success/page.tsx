"use client";
import React, { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useScanData } from "@/app/context/JobSiteContext";
import { useSavedCostCode } from "@/app/context/CostCodeContext";
import { useSavedClockInTime } from "@/app/context/ClockInTimeContext";
import { useSavedBreakTime } from "@/app/context/SavedBreakTimeContext";
import { useSavedUserData } from "@/app/context/UserContext";
import { useSavedTimeSheetData } from "@/app/context/TimeSheetIdContext";
import {
  clearAuthStep,
  getAuthStep,
  isAuthenticated,
  setAuthStep,
} from "@/app/api/auth";
import { updateTimeSheet } from "@/actions/timeSheetActions";
import { now } from "next-auth/client/_utils";

const ClockOutSuccessPage: React.FC = () => {
  const t = useTranslations("page5");
  const router = useRouter();
  const { scanResult } = useScanData();
  const { savedCostCode } = useSavedCostCode();
  const { clockInTime, setClockInTime } = useSavedClockInTime();
  const { breakTime } = useSavedBreakTime();
  const { savedUserData } = useSavedUserData();
  const { savedTimeSheetData } = useSavedTimeSheetData();
  const [clockOutTime, setClockOutTime] = useState(new Date(now()));

  // if (!isAuthenticated()) {
  //   return null; // Placeholder for non-authenticated state handling
  // }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      await updateTimeSheet(new FormData(event.currentTarget));
      setAuthStep("");
      router.push("/"); // Redirect to home page on successful submission
    } catch (error) {
      console.error("Failed to submit the time sheet:", error);
    }
  };

  return (
    <div className="flex flex-col items-center">
      <h1>{t("lN1")}</h1>
      <h2>
        {t("lN2")} {scanResult?.data || "No scan data available"}
      </h2>
      <h2>
        {t("lN3")} {savedCostCode || "No cost code available"}
      </h2>
      <p>Break Time: {breakTime}</p>
      <p>Clock Out Time: {new Date().toString()}</p>
      <p>Successfully Clocked Out</p>

      <form onSubmit={handleSubmit}>
        <button
          type="submit"
          className="bg-app-blue w-1/2 h-1/6 py-4 px-5 rounded-lg text-black font-bold mt-5"
        >
          Submit time sheet
        </button>
        {/* Hidden inputs */}
        <input type="hidden" name="id" value={savedTimeSheetData?.id} />
        <input type="hidden" name="end_time" value={new Date().toString()} />
        <input
          type="hidden"
          name="total_break_time"
          value={breakTime.toString()}
        />
        <input type="hidden" name="timesheet_comments" value={""} />
        <input type="hidden" name="app_comments" value={""} />
      </form>
    </div>
  );
};

export default ClockOutSuccessPage;
