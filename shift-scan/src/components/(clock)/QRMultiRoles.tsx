"use client";
import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
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
import { Contents } from "../(reusable)/contents";
import { TitleBoxes } from "../(reusable)/titleBoxes";
import { Title } from "@/app/(routes)/dashboard/mechanic/_components/Title";

type Option = {
  label: string;
  code: string;
};
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
  clockInRoleTypes: string | undefined;
  setClockInRoleTypes: Dispatch<SetStateAction<string | undefined>>;
  setJobsite: Dispatch<SetStateAction<Option>>;
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
  clockInRoleTypes,
  setClockInRoleTypes,
  setJobsite,
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

  const selectView = (selectedRoleType: string) => {
    setClockInRoleTypes(selectedRoleType);
    // Map the selected role type to the main clock-in role
    if (
      selectedRoleType === "tascoAbcdLabor" ||
      selectedRoleType === "tascoAbcdEquipment" ||
      selectedRoleType === "tascoEEquipment"
    ) {
      setClockInRole("tasco");
    } else if (
      selectedRoleType === "truckDriver" ||
      selectedRoleType === "truckEquipmentOperator" ||
      selectedRoleType === "truckLabor"
    ) {
      setClockInRole("truck");
    } else if (selectedRoleType === "mechanic") {
      setClockInRole("mechanic");
    } else if (selectedRoleType === "general") {
      setClockInRole("general");
    } else {
      setClockInRole(undefined); // Handle undefined or invalid cases
    }
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
        <TitleBoxes onClick={handleReturnPath}>
          <Titles size={"h1"}>
            {startCamera ? t("ScanJobsite") : t("SelectLaborType")}
          </Titles>
        </TitleBoxes>
        <Contents width={"section"} className="h-full pb-5">
          <Grids rows={"7"} gap={"5"} className="h-full w-full pt-5">
            {type !== "equipment" ? (
              <>
                {numberOfViews > 1 && option !== "switchJobs" ? (
                  <Holds className="p-1 justify-center ">
                    <Selects
                      className="bg-app-blue text-center p-3 disabled:bg-app-blue"
                      value={clockInRoleTypes}
                      disabled={startCamera}
                      onChange={(e) => selectView(e.target.value)}
                    >
                      <option value="">{t("SelectWorkType")}</option>
                      {tascoView === true && (
                        <>
                          <option value="tascoAbcdLabor">
                            {t("TASCOABCDLabor")}
                          </option>
                          <option value="tascoAbcdEquipment">
                            {t("TASCOABCDEquipmentOperator")}
                          </option>
                          <option value="tascoEEquipment">
                            {t("TASCOEEquipmentOperator")}
                          </option>
                        </>
                      )}
                      {truckView === true && (
                        <>
                          <option value="truckDriver">
                            {t("TruckDriver")}
                          </option>
                          <option value="truckEquipmentOperator">
                            {t("TruckEquipmentOperator")}
                          </option>
                          <option value="truckLabor">{t("TruckLabor")}</option>
                        </>
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
            ) : null}

            {!startCamera ? (
              <Holds
                className={
                  "h-full w-full row-start-2 row-end-6 border-[3px] border-black rounded-[10px] p-3 justify-center "
                }
              >
                <Images
                  titleImg="/camera.svg"
                  titleImgAlt="clockIn"
                  position={"center"}
                  size={"20"}
                />
                {failedToScan === true && (
                  <Holds className="pt-5">
                    <Texts text={"red"} size={"p4"}>
                      {t("FailedToScanJobSiteDoesNotExist")}
                    </Texts>
                  </Holds>
                )}
              </Holds>
            ) : (
              <Holds className={"h-full w-full row-start-2 row-end-7"}>
                <Grids rows={"6"} gap={"2"}>
                  <Holds className="h-full w-full row-start-1 row-end-6 justify-center ">
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
                      setJobsite={setJobsite}
                    />
                  </Holds>

                  <Holds className="h-full w-full row-start-6 row-end-7 justify-center">
                    <Buttons
                      background={"none"}
                      shadow={"none"}
                      onClick={handleAlternativePath}
                    >
                      <Texts size={"p4"}>{t("TroubleScanning")}</Texts>
                    </Buttons>
                  </Holds>
                </Grids>
              </Holds>
            )}
            {!startCamera ? (
              <Holds className="row-start-7 row-end-8 w-full justify-center">
                <Buttons
                  onClick={() => setStartCamera(!startCamera)}
                  background={"green"}
                  className="py-2"
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
