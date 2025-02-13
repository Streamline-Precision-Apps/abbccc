"use client";
import React, { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import QR from "./qr";
import { Buttons } from "../(reusable)/buttons";
import { Texts } from "../(reusable)/texts";
import { Titles } from "../(reusable)/titles";
import { Holds } from "../(reusable)/holds";
import { Grids } from "../(reusable)/grids";
import { Images } from "../(reusable)/images";
import { Contents } from "../(reusable)/contents";

type QRStepProps = {
  handleAlternativePath: () => void;
  handleNextStep: () => void;
  handlePrevStep: () => void;
  handleReturn?: () => void;
  handleReturnPath: () => void;
  handleScanJobsite?: (type: string) => void;
  type: string;
  url: string;
  option?: string;
  clockInRole: string | undefined;
  setClockInRole: React.Dispatch<React.SetStateAction<string | undefined>>;
  setScanned: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function QRStep({
  option,
  handleReturnPath,
  handleAlternativePath,
  handleNextStep,
  handleScanJobsite,
  type,
  url,
  clockInRole,
  handlePrevStep,

  setScanned,
}: QRStepProps) {
  const t = useTranslations("Clock");
  const [startCamera, setStartCamera] = useState<boolean>(false);
  const [failedToScan, setFailedToScan] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setFailedToScan(false);
    }, 5000);
  }, [failedToScan]);

  return (
    <>
      <Holds background={"white"} className="h-full w-full">
        <Contents width={"section"} className="h-full py-5">
          <Grids rows={"7"} gap={"5"} className="h-full w-full ">
            {type !== "equipment" ? (
              <>
                <Holds className="row-start-1 row-end-2 h-full w-full justify-center ">
                  <Grids
                    rows={"2"}
                    cols={"5"}
                    gap={"3"}
                    className="h-full w-full"
                  >
                    <Holds
                      className="row-start-1 row-end-2 col-start-1 col-end-2 h-full w-full justify-center"
                      onClick={handleReturnPath}
                    >
                      <Images
                        titleImg="/turnBack.svg"
                        titleImgAlt="back"
                        position={"left"}
                      />
                    </Holds>
                    <Holds className="row-start-2 row-end-3 col-span-5 h-full w-full justify-center">
                      <Titles size={"h1"}> {t("ScanJobSite")}</Titles>
                    </Holds>
                  </Grids>
                </Holds>
              </>
            ) : (
              <Holds className="row-start-1 row-end-2 h-full w-full justify-center ">
                <Grids
                  rows={"2"}
                  cols={"5"}
                  gap={"3"}
                  className="h-full w-full"
                >
                  <Holds
                    className="row-start-1 row-end-2 col-start-1 col-end-2 h-full w-full justify-center"
                    onClick={handlePrevStep}
                  >
                    <Images
                      titleImg="/turnBack.svg"
                      titleImgAlt="back"
                      position={"left"}
                    />
                  </Holds>
                  <Holds className="row-start-2 row-end-3 col-span-5 h-full w-full justify-center">
                    <Titles size={"h1"}> {t("ScanEquipment")}</Titles>
                  </Holds>
                </Grids>
              </Holds>
            )}

            {!startCamera ? (
              <Holds className={"h-full w-full row-start-2 row-end-7 "}>
                <Grids rows={"6"} gap={"2"} className="h-full w-full">
                  <Holds className="h-full w-full row-start-2 row-end-6 justify-center border-[3px] border-black rounded-[10px] p-3">
                    <Holds className="h-full w-full justify-center bg-app-gray border-[3px] border-black rounded-[10px]">
                      <Images
                        titleImg="/camera.svg"
                        titleImgAlt="clockIn"
                        position={"center"}
                        size={"40"}
                      />
                    </Holds>
                    {failedToScan === true && (
                      <Holds className="h-full w-full row-start-6 row-end-7 justify-center">
                        <Texts text={"red"} size={"p4"}>
                          {t("FailedToScanJobSiteDoesNotExist")}
                        </Texts>
                      </Holds>
                    )}
                  </Holds>
                </Grids>
              </Holds>
            ) : (
              <Holds className={"h-full w-full row-start-2 row-end-7"}>
                <Grids rows={"6"} gap={"2"}>
                  <Holds className="h-full w-full row-start-2 row-end-6 justify-center border-[3px] p-3 border-black rounded-[10px] ">
                    <QR
                      handleScanJobsite={handleScanJobsite}
                      url={url}
                      clockInRole={clockInRole || ""}
                      type={type}
                      handleNextStep={handleNextStep}
                      startCamera={startCamera}
                      setStartCamera={setStartCamera}
                      setFailedToScan={setFailedToScan}
                      setScanned={setScanned}
                    />
                  </Holds>

                  <Holds className="h-full w-full row-start-6 row-end-7 justify-center">
                    <Buttons
                      background={"none"}
                      onClick={handleAlternativePath}
                    >
                      <Texts size={"p4"}>{t("TroubleScanning")}</Texts>
                    </Buttons>
                  </Holds>
                </Grids>
              </Holds>
            )}
            {!startCamera ? (
              <Holds className="row-start-7 row-end-8 h-full w-full justify-center">
                <Buttons
                  onClick={() => setStartCamera(!startCamera)}
                  background={"green"}
                >
                  <Titles size={"h2"}>{t("StartCamera")}</Titles>
                </Buttons>
              </Holds>
            ) : null}
          </Grids>
        </Contents>
      </Holds>
    </>
  );
}
