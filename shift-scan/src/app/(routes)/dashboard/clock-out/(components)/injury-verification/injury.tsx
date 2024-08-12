"use client";
import React, { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import "@/app/globals.css";
import Checkbox from "./checkBox";
import {
  clearAuthStep,
  getAuthStep,
  isDashboardAuthenticated,
} from "@/app/api/auth";
import { useRouter } from "next/navigation";
import Signature from "./Signature";
import { TitleBoxes } from "@/components/(reusable)/titleBoxes";
import { Bases } from "@/components/(reusable)/bases";
import { Sections } from "@/components/(reusable)/sections";
import { Contents } from "@/components/(reusable)/contents";
import { Buttons } from "@/components/(reusable)/buttons";

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
      router.push("/dashboard/clock-out/clock-out-success");
    } catch (err) {
      console.error("Navigation error:", err);
      setError(t("NavError"));
    }
  };

  const handleReportInjury = async () => {
    try {
      router.push("/dashboard/clock-out/injury-report");
    } catch (err) {
      console.error("Navigation error:", err);
      setError(t("NavError"));
    }
  };

  return (
    <Bases variant={"default"}>
      <Contents size={"default"}>
      <Sections size={"dynamic"}>
      <TitleBoxes
        title={t("InjuryVerification")}
        titleImg="/endDay.svg"
        titleImgAlt="Team"
        variant={"default"}
        size={"default"}
        type="row"
      />
      <h1>{t("SignBelow")}</h1>
      <Signature onEnd={handleSignatureEnd} />
      {signatureBlob && <p>{t("SignatureCaptured")}</p>}
      <Sections size={"titleBox"} className="flex-row gap-2">
        <h1>{t("SignatureVerify")}</h1>
        <Checkbox checked={checked} onChange={handleCheckboxChange} />
        </Sections>
      {error && <div className="text-red-500">{error}</div>}
      <div>
        {checked ? (
          <Buttons variant={"green"} size={"default"} onClick={handleContinue} >
              {t("Continue")}
            </Buttons>
        ) : (
          <Buttons variant={"red"} size={"default"}  onClick={handleReportInjury} >
            {t("ReportInjury")}
        </Buttons>
        )}
      </div>
      </Sections>
      </Contents>
    </Bases>
  );
}