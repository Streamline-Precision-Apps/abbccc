"use client";
import React, { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import "@/app/globals.css";
import Checkbox from "@/components/(inputs)/CheckBox";
import { useRouter } from "next/navigation";
import { TitleBoxes } from "@/components/(reusable)/titleBoxes";
import { Bases } from "@/components/(reusable)/bases";
import { Holds } from "@/components/(reusable)/holds";
import { Contents } from "@/components/(reusable)/contents";
import { Buttons } from "@/components/(reusable)/buttons";
import { z } from "zod";

// Zod schema for component state
const InjuryVerificationSchema = z.object({
  checked: z.boolean(), // Represents the checkbox state
  signatureBlob: z.instanceof(Blob).nullable(), // Represents the fetched signature Blob, which can be null
  error: z.string().nullable(), // Represents potential error messages, can be null
});

export default function InjuryVerification() {
  const t = useTranslations("clock-out");

  const router = useRouter();
  const [checked, setChecked] = useState(false);
  const [signatureBlob, setSignatureBlob] = useState<Blob | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Validate initial state with Zod schema
  try {
    InjuryVerificationSchema.parse({
      checked,
      signatureBlob,
      error,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error("Initial state validation error:", error.errors);
    }
  }

  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setChecked(event.target.checked);
  };

  useEffect(() => {
    const getSignature = async () => {
      try {
        const response = await fetch("/api/signature");
        const blob = await response.blob();
        setSignatureBlob(blob);
      } catch (err) {
        console.error("Error fetching signature:", err);
      }
    };
    getSignature();
  }, []);

  const handleReportInjury = async () => {
    try {
      router.push("/dashboard/clock-out/injury-report");
    } catch (err) {
      console.error("Navigation error:", err);
      setError(t("NavError"));
    }
  };

  return (
    <Bases>
      <Contents>
        <Holds>
          <TitleBoxes
            title={t("InjuryVerification")}
            titleImg="/endDay.svg"
            titleImgAlt="Team"
            type="row"
          />
          <h1>{t("SignBelow")}</h1>
          {/* <Signature onEnd={handleSignatureEnd} /> */}
          {signatureBlob && <p>{t("SignatureCaptured")}</p>}
          <Holds className="flex-row gap-2">
            <h1>{t("SignatureVerify")}</h1>
            <Checkbox
              defaultChecked={checked}
              onChange={handleCheckboxChange}
              id={"injury"}
              name={"injuryCheckbox"}
              size={2}
            />
          </Holds>
          {error && <div className="text-red-500">{error}</div>}
          <div>
            {checked ? (
              <Buttons background={"green"} size={null}>
                {t("Continue")}
              </Buttons>
            ) : (
              <Buttons
                background={"red"}
                size={null}
                onClick={handleReportInjury}
              >
                {t("ReportInjury")}
              </Buttons>
            )}
          </div>
        </Holds>
      </Contents>
    </Bases>
  );
}
