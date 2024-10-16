"use client";
import React from "react";
import { useTranslations } from "next-intl";
import QR from "./qr";
import QR_EQ from "./qr-eq";
import { Buttons } from "../(reusable)/buttons";
import { Texts } from "../(reusable)/texts";
import { useRouter } from "next/navigation";
import { Titles } from "../(reusable)/titles";

type QRStepProps = {
  handleAlternativePath: () => void;
  handleNextStep: () => void;
  handleChangeJobsite?: () => void;
  handleReturn?: () => void;
  type: string;
  url: string;
  option?: string;
};

export default function QRStep({
  option,
  handleReturn,
  handleAlternativePath,
  handleNextStep,
  handleChangeJobsite,
  type,
  url,
}: QRStepProps) {
  const t = useTranslations("Clock");
  const router = useRouter();
  return (
    <>
      {type === "equipment" ? (
        <Titles size={"h1"}>{t("ScanEquipment")}</Titles>
      ) : (
        <Titles size={"h1"}>{t("ScanJobSite")}</Titles>
      )}
      <div className="bg-white mx-5 rounded-2xl p-3 border-4 border-black">
        {type === "equipment" ? (
          <QR_EQ handleNextStep={handleNextStep} />
        ) : (
          <>
            <QR handleNextStep={handleNextStep} url={url} />
          </>
        )}
      </div>
      <Buttons onClick={handleAlternativePath}>
        {option !== "clockin" && option !== "break" ? (
          <Texts size={"p4"}>{t("SwitchSites")}</Texts>
        ) : (
          <Texts size={"p4"}>{t("TroubleScanning")}</Texts>
        )}
      </Buttons>
      {option === "break" ? (
        <Buttons onClick={handleReturn} background={"red"}>
          {t("ReturnToJobsite")}
        </Buttons>
      ) : null}
      {type !== "equipment" && option !== "clockin" && option !== "break" && (
        <Buttons onClick={handleChangeJobsite} background={"green"}>
          {t("ChangeCostCode")}
        </Buttons>
      )}
    </>
  );
}
