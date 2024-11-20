"use client";
import React from "react";
import { useTranslations } from "next-intl";
import QR from "./qr";
import QR_EQ from "./qr-eq";
import { Buttons } from "../(reusable)/buttons";
import { Texts } from "../(reusable)/texts";
import { Titles } from "../(reusable)/titles";
import { Holds } from "../(reusable)/holds";
import { Grids } from "../(reusable)/grids";
import { Contents } from "../(reusable)/contents";

type QRStepProps = {
  handleAlternativePath: () => void;
  handleNextStep: () => void;
  handleChangeJobsite?: () => void;
  handleReturn?: () => void;
  handleScanTruck?: () => void;
  handleScanJobsite?: () => void;
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
  handleScanTruck,
  handleScanJobsite,
  type,
  url,
}: QRStepProps) {
  const t = useTranslations("Clock");
  return (
    <>
      <Contents width={"section"}>
        <Grids rows={"7"} gap={"5"} className="my-5">
          <Holds className="row-span-1">
            {type === "equipment" ? (
              <Titles size={"h1"}>{t("ScanEquipment")}</Titles>
            ) : (
              <Titles size={"h1"} className="my-auto">
                {t("ScanJobSiteOrTruck")}
              </Titles>
            )}
          </Holds>
          <Holds className="row-span-5 ">
            <div className="">
              {type === "equipment" ? (
                <QR_EQ handleNextStep={handleNextStep} />
              ) : (
                <>
                  <QR handleScanJobsite={handleScanJobsite || (() => {})} handleScanTruck={handleScanTruck || (() => {})} url={url} />
                </>
              )}
            </div>
          </Holds>
          <Holds className="row-span-1 h-full">
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
            {type !== "equipment" &&
              option !== "clockin" &&
              option !== "break" && (
                <Buttons onClick={handleChangeJobsite} background={"green"}>
                  {t("ChangeJobsite")}
                </Buttons>
              )}
          </Holds>
        </Grids>
      </Contents>
    </>
  );
}
