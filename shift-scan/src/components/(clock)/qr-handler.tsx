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

type QRStepProps = {
  handleAlternativePath: () => void;
  handleNextStep: () => void;
  handleChangeJobsite?: () => void;
  handleReturn?: () => void;
  handleReturnPath: () => void;
  handleScanTruck?: () => void;
  handleScanJobsite?: () => void;
  type: string;
  url: string;
  option?: string;
  clockInRole: string;
};

export default function QRStep({
  option,
  handleReturn,
  handleReturnPath,
  handleAlternativePath,
  handleNextStep,
  handleChangeJobsite,
  handleScanTruck,
  handleScanJobsite,
  clockInRole,
  type,
  url,
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
    setWorkRole(clockInRole);
    localStorage.setItem("clockInRole", clockInRole);
    handleNextStep();
  };

  useEffect(() => {
    if (tascoView === true) {
      setNumberOfViews((prevState) => prevState + 1);
    }

    if (truckView === true) {
      setNumberOfViews((prevState) => prevState + 1);
    }

    if (mechanicView === true) {
      setNumberOfViews((prevState) => prevState + 1);
    }

    if (laborView === true) {
      setNumberOfViews((prevState) => prevState + 1);
    }
  }, [tascoView, truckView, mechanicView, laborView]);
  return (
    <>
      <Holds background={"white"} className="h-full w-full">
        <Grids rows={"7"} gap={"5"} className="h-full w-full p-3">
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
          <Holds className="row-start-2 row-end-3 h-full w-full justify-center">
            {numberOfViews > 1 ? (
              <Holds className="h-full w-full justify-center border-[3px] border-black rounded-[10px] shadow-[6px_6px_0px_grey]">
                <Holds className="h-full w-11/12 justify-center">
                  <Selects
                    className="disabled:bg-app-blue bg-app-blue text-center"
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
              </Holds>
            ) : null}
          </Holds>
          {!startCamera ? (
            <Holds className="h-full w-full row-start-3 row-end-7">
              <Holds className="h-full w-1/2 justify-center">
                <Images
                  titleImg="/camera.svg"
                  titleImgAlt="clockIn"
                  position={"center"}
                />
              </Holds>
            </Holds>
          ) : (
            <Holds className="h-full w-full row-start-3 row-end-7">
              <Holds>
                <QR
                  handleScanJobsite={handleScanJobsite || (() => {})}
                  handleScanTruck={handleScanTruck || (() => {})}
                  url={url}
                  clockInRole={clockInRole}
                  type={type}
                  handleNextStep={handleNextStep}
                />
              </Holds>

              <Holds>
                <Buttons background={"none"} onClick={handleAlternativePath}>
                  {option !== "clockin" &&
                  option !== "break" &&
                  option !== "equipment" ? (
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
            </Holds>
          )}
          <Holds className="row-start-7 row-end-8 h-full w-full justify-center">
            <Buttons
              onClick={() => setStartCamera(!startCamera)}
              background={"lightBlue"}
              className="w-5/6"
            >
              <Titles size={"h3"}>Begin Scanning</Titles>
            </Buttons>
          </Holds>
        </Grids>
      </Holds>
    </>
  );
}

// <>
// <Holds background={"white"} className="h-screen">
// <Contents width={"section"} className="relative">
// <Holds
//   className="absolute top-1 left-0 w-10"
//   onClick={handleReturnPath}
//   >
//   <Images
//     titleImg="/turnBack.svg"
//     titleImgAlt="back"
//     position={"left"}
//     size={"full"}
//     />
// </Holds>
// <Grids rows={"7"} gap={"5"} className="my-5">
//   <Holds className="row-span-1">
//     {type === "equipment" ? (
//       <Titles size={"h1"}>{t("ScanEquipment")}</Titles>
//     ) : (
//       <Titles size={"h1"} className="my-auto">
//         {t("ScanJobSiteOrTruck")}
//       </Titles>
//     )}
//   </Holds>
//   <Holds className="row-span-5 ">
//     <div className="">
//       <QR
//         handleScanJobsite={handleScanJobsite || (() => {})}
//         handleScanTruck={handleScanTruck || (() => {})}
//         url={url}
//         clockInRole={clockInRole}
//         type={type}
//         handleNextStep={handleNextStep}
//         />
//     </div>
//   </Holds>
//   <Holds className="row-span-1 h-full space-y-2">
//     <Buttons onClick={handleAlternativePath}>
//       {option !== "clockin" &&
//       option !== "break" &&
//       option !== "equipment" ? (
//         <Texts size={"p4"}>{t("SwitchSites")}</Texts>
//       ) : (
//         <Texts size={"p4"}>{t("TroubleScanning")}</Texts>
//       )}
//     </Buttons>
//     {option === "break" ? (
//       <Buttons onClick={handleReturn} background={"red"}>
//         {t("ReturnToJobsite")}
//       </Buttons>
//     ) : null}
//     {type !== "equipment" &&
//       option !== "clockin" &&
//       option !== "break" && (
//         <Buttons onClick={handleChangeJobsite} background={"green"}>
//           {t("ChangeJobsite")}
//         </Buttons>
//       )}
//   </Holds>
// </Grids>
// </Contents>
//       </Holds>
// </>
