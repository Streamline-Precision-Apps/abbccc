"use client";
import React, { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import "@/app/globals.css";
import Checkbox from "../checkBox";
import {
  clearAuthStep,
  getAuthStep,
  isDashboardAuthenticated,
} from "@/app/api/auth";
import { useRouter } from "next/navigation";
import Signature from "./Signature";
import { TitleBox } from "@/app/(routes)/dashboard/myTeam/titleBox";

interface CheckboxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
}

export default function InjuryVerification() {
  // TODO: Add translations
  // const t = useTranslations("injury-verification");

  const router = useRouter();
  const [checked, setChecked] = useState(false);
  const [signatureBlob, setSignatureBlob] = useState<Blob | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleCheckboxChange = (newChecked: boolean) => {
    setChecked(newChecked);
  };

  const handleSignatureEnd = (blob: Blob) => {
    if (blob) {
      setSignatureBlob(blob);
    } else {
      setError("Failed to capture signature. Please try again.");
    }
  };

  useEffect(() => {
    const handlePopstate = () => {
      if (isDashboardAuthenticated()) {
        window.location.href = "/before-you-go";
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

  const handleContinue = async () => {
    try {
      await router.push("/dashboard/clock-out/clock-out-success");
    } catch (err) {
      console.error("Navigation error:", err);
      setError("Failed to navigate. Please try again.");
    }
  };

  const handleReportInjury = async () => {
    try {
      await router.push("/dashboard/clock-out/injury-report");
    } catch (err) {
      console.error("Navigation error:", err);
      setError("Failed to navigate. Please try again.");
    }
  };

  return (
    <div className="flex flex-col items-center space-y-4 w-full px-5 py-10 h-screen">
      <TitleBox title="End Work Day" />
      <h1 className="text-3xl font-bold">
        By signing below, I certify that I suffered no injuries this day.
      </h1>
      <Signature onEnd={handleSignatureEnd} />
      {signatureBlob && <p>Signature captured!</p>}
      <div className="flex flex-row items-center space-x-4 w-full justify-center ">
        <h1 className="text-3xl font-bold">This is my signature</h1>
        <Checkbox checked={checked} onChange={handleCheckboxChange} />
      </div>
      {error && <div className="text-red-500">{error}</div>}
      <div className="w-1/4 ">
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
            onClick={handleReportInjury}
          >
            Report Injury
          </button>
        )}
      </div>
    </div>
  );
}

function handleBeforeUnload(this: Window, ev: BeforeUnloadEvent) {
  throw new Error("Function not implemented.");
}
