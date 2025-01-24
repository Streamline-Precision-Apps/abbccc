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
  handleScanTruck?: () => void;
  handleScanJobsite?: () => void;
  type: string;
  url: string;
  option?: string;
  clockInRole: string;
  setClockInRole: React.Dispatch<React.SetStateAction<string>>;
};

export default function QRStep({
  option,
  handleReturnPath,
  handleAlternativePath,
  handleNextStep,
  handleScanTruck,
  handleScanJobsite,
  type,
  url,
  clockInRole,
  setClockInRole,
}: QRStepProps) {
  const t = useTranslations("Clock");
  const [startCamera, setStartCamera] = useState<boolean>(false); // set to false;
  const { data: session } = useSession();
  const tascoView = session?.user.tascoView;
  const truckView = session?.user.truckView;
  const mechanicView = session?.user.mechanicView;
  const laborView = session?.user.laborView;
  const [numberOfViews, setNumberOfViews] = useState(0);

  const selectView = (clockInRole: string) => {
    setClockInRole(clockInRole);
  };

  useEffect(() => {
    let count = 0; // Reset count for fresh calculation
    if (tascoView) count++;
    if (truckView) count++;
    if (mechanicView) count++;
    if (laborView) count++;

    setNumberOfViews(count); // Update state with fresh count
  }, [tascoView, truckView, mechanicView, laborView]);

  return (
    <>
      <Holds background={"white"} className="h-full w-full">
        <Contents width={"section"}>
          <Grids rows={"7"} gap={"5"} className="h-full w-full my-5">
            <Holds className="row-start-1 row-end-2 h-full w-full justify-center ">
              <Grids rows={"2"} cols={"5"} gap={"3"} className=" h-full w-full">
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
                  className="disabled:gray-400 bg-app-blue text-center p-3"
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
            {!startCamera ? (
              <Holds
                className={
                  numberOfViews > 1
                    ? "h-full w-full row-start-4 row-end-6"
                    : "h-full w-full row-start-2 row-end-7"
                }
              >
                <Holds className="h-full m-auto">
                  <Images
                    titleImg="/camera.svg"
                    titleImgAlt="clockIn"
                    position={"center"}
                    size={"40"}
                  />
                </Holds>
              </Holds>
            ) : (
              <Holds
                className={
                  numberOfViews > 1
                    ? "h-full w-full row-start-3 row-end-7"
                    : "h-full w-full row-start-3 row-end-7"
                }
              >
                <Grids rows={"5"} gap={"2"}>
                  <Holds className="h-full w-full row-start-1 row-end-5 justify-center">
                    <QR
                      handleScanJobsite={handleScanJobsite || (() => {})}
                      handleScanTruck={handleScanTruck || (() => {})}
                      url={url}
                      clockInRole={clockInRole}
                      type={type}
                      handleNextStep={handleNextStep}
                    />
                  </Holds>

                  <Holds className="h-full w-full row-start-5 row-end-6 justify-center">
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
                  <Titles size={"h2"}>Begin Scanning</Titles>
                </Buttons>
              </Holds>
            ) : null}
          </Grids>
        </Contents>
      </Holds>
    </>
  );
}
