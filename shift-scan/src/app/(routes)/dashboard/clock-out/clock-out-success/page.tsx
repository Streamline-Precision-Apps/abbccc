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

  const redirectToLogin = (message: string) => {
    console.log(message);
    router.push("/");
  };

  const formatDuration = (milliseconds: number) => {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return `${hours}:${minutes}:${seconds}`;
  };

  useEffect(() => {
    if (!isAuthenticated()) {
      redirectToLogin("Not authenticated");
    } else if (getAuthStep() !== "success") {
      setClockInTime(null);
      redirectToLogin(
        "Your clocked time has been removed due to authentication failure"
      );
    }
  }, [router, setClockInTime]);

  useEffect(() => {
    if (clockInTime === null) {
      redirectToLogin("It looks like you never clocked in.");
    }
  }, [clockInTime, router]);

  useEffect(() => {
    setBreakTime(0);
  }, [setBreakTime]);

  if (!isAuthenticated()) {
    return null; // Placeholder for non-authenticated state handling
  }

  return (
    <div className="flex flex-col items-center">
      <h1>{t("lN1")}</h1>
      <h2>
        {t("lN2")} {scanResult?.data || "No scan data available"}
      </h2>
      <h2>
        {t("lN3")} {savedCostCode || "No cost code available"}
      </h2>
      <p>Break Time: {formatDuration(breakTime)}</p>
      <p>Successfully Clocked Out</p>
      {clockInTime && (
        <h2>
          Hours Worked:{" "}
          {formatDuration(clockOutTime.getTime() - clockInTime.getTime())}
        </h2>
      )}
      <RedirectAfterDelay delay={5000} to="/" />
    </div>
  );
};

export default ClockOutSuccessPage;
