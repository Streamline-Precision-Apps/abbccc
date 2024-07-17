"use client";
import React, { useEffect, useState } from "react";
import "@/app/globals.css";
import Checkbox from "@/app/(routes)/dashboard/clock-out/checkBox";
import { isDashboardAuthenticated } from "@/app/api/auth";
import { useRouter, useSearchParams } from "next/navigation";

export default function Log() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const buttonType = searchParams.get("bt");

  const handleCheckboxChange = (newChecked: boolean) => {
    setChecked(newChecked);
  };
  const [checked, setChecked] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handlePopstate = () => {
      if (isDashboardAuthenticated()) {
        window.location.href = "/before-you-go";
      }
    };

    const handleBeforeUnload = (ev: BeforeUnloadEvent) => {
      ev.preventDefault();
      ev.returnValue = '';
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    window.addEventListener("popstate", handlePopstate);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      window.removeEventListener("popstate", handlePopstate);
    };
  }, []);

  const handleContinue = async () => {
    try {
      if (buttonType === "b") {
        await router.push("/dashboard/clock-out/break");
      } else if (buttonType === "ewd") {
        await router.push("/dashboard/clock-out/injury-verification");
      } else {
        setError("Invalid button type. Unable to continue.");
      }
    } catch (err) {
      console.error("Navigation error:", err);
      setError("Failed to navigate. Please try again.");
    }
  };

  const handleReturnToDashboard = async () => {
    try {
      await router.push("/dashboard");
    } catch (err) {
      console.error("Navigation error:", err);
      setError("Failed to navigate. Please try again.");
    }
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      <h1 className="text-3xl font-bold">
        I have completed and logged all forms, equipment, and all other items required of me today.
      </h1>
      <Checkbox checked={checked} onChange={handleCheckboxChange} />
      <div className="w-1/4">
        {error && <div className="text-red-500">{error}</div>}
        {checked ? (
          <button
            className="bg-app-green text-black font-bold text-xl flex justify-center w-full py-4 border border-gray-400 rounded"
            onClick={handleContinue}
          >
            Continue
          </button>
        ) : (
          <button
            className="bg-app-red text-black font-bold text-xl flex justify-center w-full py-4 border border-gray-400 rounded"
            onClick={handleReturnToDashboard}
          >
            Return to Dashboard
          </button>
        )}
      </div>
    </div>
  );
}
