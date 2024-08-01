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
import { TitleBoxes } from "@/components/(reusable)/titleBoxes";

interface CheckboxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
}

export default function InjuryVerification() {
  const t = useTranslations("clock-out");

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
      setError(t("SignatureFailure"));
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
      setError(t("NavError"));
    }
  };

  const handleReportInjury = async () => {
    try {
      await router.push("/dashboard/clock-out/injury-report");
    } catch (err) {
      console.error("Navigation error:", err);
      setError(t("NavError"));
    }
  };

  return (
    <div className="flex flex-col items-center space-y-4 w-full px-5 py-10 h-screen">
      <TitleBoxes
        title={t("InjuryVerification")}
        titleImg="/profile.svg"
        titleImgAlt="Team"
        variant={"default"}
        size={"default"}
      />
      <h1 className="text-3xl font-bold">{t("SignBelow")}</h1>
      <Signature onEnd={handleSignatureEnd} />
      {signatureBlob && <p>{t("SignatureCaptured")}</p>}
      <div className="flex flex-row items-center space-x-4 w-full justify-center ">
        <h1 className="text-3xl font-bold">{t("SignatureVerify")}</h1>
        <Checkbox checked={checked} onChange={handleCheckboxChange} />
      </div>
      {error && <div className="text-red-500">{error}</div>}
      <div className="w-1/4 ">
        {checked ? (
          <button
            className="bg-app-green text-black font-bold text-xl flex justify-center w-full py-4 border border-gray-400 rounded"
            onClick={handleContinue}
          >
            {t("Continue")}
          </button>
        ) : (
          <button
            className="bg-app-red text-black font-bold text-xl flex justify-center w-full py-4 border border-gray-400 rounded"
            onClick={handleReportInjury}
          >
            {t("ReportInjury")}
          </button>
        )}
      </div>
    </div>
  );
}

function handleBeforeUnload(this: Window, ev: BeforeUnloadEvent) {
  throw new Error("Function not implemented.");
}
