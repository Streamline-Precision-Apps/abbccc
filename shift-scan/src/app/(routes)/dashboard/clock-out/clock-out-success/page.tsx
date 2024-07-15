"use client";
import React, { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useScanData } from "@/app/context/JobSiteContext";
import { useSavedCostCode } from "@/app/context/CostCodeContext";
import { useSavedClockInTime } from "@/app/context/ClockInTimeContext";
import { useSavedBreakTime } from "@/app/context/SavedBreakTimeContext";
import RedirectAfterDelay from "@/components/redirectAfterDelay";
import {
  clearAuthStep,
  getAuthStep,
  isAuthenticated,
  setAuthStep,
} from "@/app/api/auth";

const ClockOutSuccessPage: React.FC = () => {
  const t = useTranslations("page5");
  const router = useRouter();
  const { scanResult } = useScanData();
  const { savedCostCode } = useSavedCostCode();
  const { clockInTime, setClockInTime } = useSavedClockInTime();
  const clockOutTime = new Date();
  const { breakTime, setBreakTime } = useSavedBreakTime();

  useEffect(() => {
    if (!isAuthenticated()) {
      console.log("Not authenticated");
      console.log(getAuthStep());
      router.push("/"); // Redirect to login page if not authenticated
    } else if (getAuthStep() !== "success") {
      // clearAuthStep();
      console.log(
        "Your clocked time has been removed due to authentication failure"
      );
      setClockInTime(null);
      router.push("/"); // Redirect to QR page if steps are not followed
    }
  }, []);

  useEffect(() => {
    if (clockInTime === null) {
      // clearAuthStep();
      console.log("It looks like you never clocked in.");
      router.push("/"); // Redirect to QR page if steps are not followed
    }
  }, [clockInTime, router, setClockInTime]);

  useEffect(() => {
    setBreakTime(0); // Clear break time when component mounts
  }, [setBreakTime]);

  const formatDuration = (milliseconds: number) => {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    return `${hours}:${minutes}:${seconds}`;
  };

  return isAuthenticated() ? (
    <div className="flex flex-col items-center ">
      <h1>{t("lN1")}</h1>
      <h2>
        {t("lN2")} {scanResult?.data}
      </h2>
      <h2>
        {t("lN3")} {savedCostCode}
      </h2>
      <p>Break Time: {formatDuration(breakTime)}</p>
      {/* TODO: create form for submitting timesheet. */}
      <p>Successfully Clocked Out</p>
      {/* Conditionally renders clockInTime to ensure it's not null */}
      {clockInTime && (
        <h2>
          Hours Worked:{" "}
          {formatDuration(clockOutTime.getTime() - clockInTime.getTime())}
        </h2>
      )}
      <RedirectAfterDelay delay={5000} to="/" />
    </div>
  ) : (
    <></> // Placeholder for non-authenticated state handling
  );
};

export default ClockOutSuccessPage;
