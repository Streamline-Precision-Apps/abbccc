"use client";
import React, { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import "@/app/globals.css";
import Checkbox from "@/components/(inputs)/checkbox";
import { useRouter } from "next/navigation";
import { TitleBoxes } from "@/components/(reusable)/titleBoxes";
import { Bases } from "@/components/(reusable)/bases";
import { Holds } from "@/components/(reusable)/holds";
import { Contents } from "@/components/(reusable)/contents";
import { Buttons } from "@/components/(reusable)/buttons";

//Do we need this?

// interface CheckboxProps {
//   checked: boolean;
//   onChange: (checked: boolean) => void;
// }

export default function InjuryVerification() {
  const t = useTranslations("clock-out");

  const router = useRouter();
  const [checked, setChecked] = useState(false);
  const [signatureBlob, setSignatureBlob] = useState<Blob | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setChecked(event.target.checked);
  };

  const handleSignatureEnd = (blob: Blob) => {
    if (blob) {
      setSignatureBlob(blob);
    } else {
      setError(t("SignatureFailure"));
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
