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
import { Selects } from "../(reusable)/selects";
import { useSession } from "next-auth/react";
import { setWorkRole } from "@/actions/cookieActions";
import { Contents } from "../(reusable)/contents";

type QRStepProps = {
  handleAlternativePath: () => void;
  handleNextStep: () => void;
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

export default function QRMultiRoles({
  option,
  handleReturnPath,
  handleAlternativePath,
  handleNextStep,
  handleScanJobsite,
  type,
  url,
  clockInRole,
  setClockInRole,
  setScanned,
}: QRStepProps) {
  const t = useTranslations("Clock");
  const [startCamera, setStartCamera] = useState<boolean>(false);
  const { data: session } = useSession();
  const tascoView = session?.user.tascoView;
  const truckView = session?.user.truckView;
  const mechanicView = session?.user.mechanicView;
  const laborView = session?.user.laborView;
  const [numberOfViews, setNumberOfViews] = useState(0);
  const [failedToScan, setFailedToScan] = useState(false);

  const selectView = (clockInRole: string) => {
    setClockInRole(clockInRole);
  };

  useEffect(() => {
    let count = 0;
    if (tascoView) count++;
    if (truckView) count++;
    if (mechanicView) count++;
    if (laborView) count++;

    setNumberOfViews(count);
    console.log(count);
  }, [tascoView, truckView, mechanicView, laborView]);

  useEffect(() => {
    setTimeout(() => {
      setFailedToScan(false);
    }, 5000);
  }, [failedToScan]);

  return (
    <>
      <Holds background={"white"} className="h-full w-full">
        <Contents width={"section"}>
          <Grids rows={"8"} gap={"5"} className="h-full w-full py-5">
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
                {numberOfViews > 1 && option !== "switchJobs" ? (
                  <Holds className="p-1 justify-center border-[3px] border-black rounded-[10px] shadow-[6px_6px_0px_grey]">
                    <Selects
                      className="disabled:bg-app-dark-gray bg-app-blue text-center p-3"
                      value={clockInRole}
                      disabled={startCamera}
                      onChange={(e) => selectView(e.target.value)}
                    >
                      {tascoView === true && (
                        <option value="tasco">{t("TASCO")}</option>
                      )}
                      {truckView === true && (
                        <option value="truck">{t("Truck")}</option>
                      )}
                      {mechanicView === true && (
                        <option value="mechanic">{t("Mechanic")}</option>
                      )}
                      {laborView === true && (
                        <option value="general">{t("General")}</option>
                      )}
                    </Selects>
                  </Holds>
                ) : null}
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
                    onClick={handleReturnPath}
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
              <Holds
                className={
                  "h-full w-full row-start-3 row-end-7 border-[3px] border-black rounded-[10px] p-3 "
                }
              >
                <Holds className="h-full w-full justify-center border-[3px] border-black rounded-[10px]">
                  <Images
                    titleImg="/camera.svg"
                    titleImgAlt="clockIn"
                    position={"center"}
                    size={"40"}
                  />
                  {failedToScan === true && (
                    <Holds className="pt-5">
                      <Texts text={"red"} size={"p4"}>
                        {t("FailedToScanJobSiteDoesNotExist")}
                      </Texts>
                    </Holds>
                  )}
                </Holds>
              </Holds>
            ) : (
              <Holds className={"h-full w-full row-start-3 row-end-8"}>
                <Grids rows={"6"} gap={"2"}>
                  <Holds className="h-full w-full row-start-1 row-end-6 justify-center border-[3px] border-black rounded-[10px] p-3">
                    <QR
                      handleScanJobsite={handleScanJobsite}
                      url={url}
                      clockInRole={clockInRole}
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
              <Holds className="row-start-8 row-end-9 h-full w-full justify-center">
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
