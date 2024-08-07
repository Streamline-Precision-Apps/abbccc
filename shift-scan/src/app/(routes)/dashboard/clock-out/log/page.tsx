"use client";
import React, { useEffect, useState } from "react";
import "@/app/globals.css";
import { isDashboardAuthenticated } from "@/app/api/auth";
import { useRouter, useSearchParams } from "next/navigation";
import { setAuthStep } from "@/app/api/auth";
import { useTranslations } from "next-intl";
import prisma from "@/lib/prisma";
import { cookies } from "next/headers";

export default function Log() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const buttonType = searchParams.get("bt");
  const t = useTranslations("clock-out");

  const [error, setError] = useState<string | null>(null);
  const [hasEquipmentCheckedOut, setHasEquipmentCheckedOut] = useState<boolean | null>(null);

  useEffect(() => {
    const fetchLogs = async () => {
      const userCookie = cookies().get("user");
      const userid = userCookie ? userCookie.value : undefined;

      const currentDate = new Date();
      const past24Hours = new Date(currentDate.getTime() - 24 * 60 * 60 * 1000);

      const logs = await prisma.employeeEquipmentLog.findMany({
        where: {
          employee_id: userid,
          createdAt: { lte: currentDate, gte: past24Hours },
          submitted: false,
        },
        include: {
          Equipment: true,
        },
      });

      setHasEquipmentCheckedOut(logs.length > 0);
    };

    fetchLogs();

    const handlePopstate = () => {
      if (isDashboardAuthenticated()) {
        window.location.href = "/dashboard/clock-out/log";
      }
    };

    const handleBeforeUnload = (ev: BeforeUnloadEvent) => {
      ev.preventDefault();
      ev.returnValue = "";
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    window.addEventListener("popstate", handlePopstate);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      window.removeEventListener("popstate", handlePopstate);
    };
  }, []);

  useEffect(() => {
    if (hasEquipmentCheckedOut === false) {
      handleContinue();
    }
  }, [hasEquipmentCheckedOut]);

  const handleContinue = async () => {
    try {
      if (buttonType === "b") {
        setAuthStep("break");
        await router.push("/");
      } else if (buttonType === "ewd") {
        await router.push("/dashboard/clock-out/injury-verification");
      } else {
        setError("Invalid button type. Unable to continue.");
      }
    } catch (err) {
      console.error("Navigation error:", err);
      setError(t("NavError"));
    }
  };

  const handleReturnToDashboard = async () => {
    try {
      await router.push("/dashboard");
    } catch (err) {
      console.error("Navigation error:", err);
      setError(t("NavError"));
    }
  };

  const handleGoToCurrentEquipment = async () => {
    try {
      await router.push("/dashboard/equipment/current");
    } catch (err) {
      console.error("Navigation error:", err);
      setError(t("NavError"));
    }
  };

  if (hasEquipmentCheckedOut === null) {
    return <div>Loading...</div>; // Add a loading state
  }

  return (
    <div className="flex flex-col items-center space-y-4">
      <h1 className="text-3xl font-bold">{t("EquipmentVerification")}</h1>
      {error && <div className="text-red-500">{error}</div>}
      {hasEquipmentCheckedOut ? (
        <>
          <p>You still have equipment checked out.</p>
          <div className="w-1/4">
            <button
              className="bg-app-red text-black font-bold text-xl flex justify-center w-full py-4 border border-gray-400 rounded"
              onClick={handleReturnToDashboard}
            >
              {t("Return")}
            </button>
            <button
              className="bg-app-green text-black font-bold text-xl flex justify-center w-full py-4 border border-gray-400 rounded mt-2"
              onClick={handleGoToCurrentEquipment}
            >
              Go to Current Equipment
            </button>
          </div>
        </>
      ) : null}
    </div>
  );
}
