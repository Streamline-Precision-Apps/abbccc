"use client";
import React, { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import "@/app/globals.css";
import { Checkbox } from "./checkBox";
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
      <Holds size={"dynamic"}>
      <TitleBoxes
        title={t("InjuryVerification")}
        titleImg="/endDay.svg"
        titleImgAlt="Team"
        variant={"default"}
        size={"default"}
        type="row"
      />
      <h1>{t("SignBelow")}</h1>
      {/* <Signature onEnd={handleSignatureEnd} /> */}
      {signatureBlob && <p>{t("SignatureCaptured")}</p>}
      <Holds size={"titleBox"} className="flex-row gap-2">
        <h1>{t("SignatureVerify")}</h1>
        <Checkbox checked={checked} onChange={handleCheckboxChange} />
        </Holds>
      {error && <div className="text-red-500">{error}</div>}
      <div>
        {checked ? (
          <Buttons variant={"green"} size={null} >
              {t("Continue")}
            </Buttons>
        ) : (
          <Buttons variant={"red"} size={null}  onClick={handleReportInjury} >
            {t("ReportInjury")}
        </Buttons>
        )}
      </div>
      </Holds>
      </Contents>
    </Bases>
  );
}