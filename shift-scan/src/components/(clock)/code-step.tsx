"use client";
import React, { Dispatch, SetStateAction, useState } from "react";
import CodeFinder from "@/components/(search)/codeFinder";
import StepButtons from "./step-buttons";
import { useTranslations } from "next-intl";
import { Titles } from "../(reusable)/titles";
import { Grids } from "../(reusable)/grids";
import { Holds } from "../(reusable)/holds";
import { Images } from "../(reusable)/images";
import { useScanData } from "@/app/context/JobSiteScanDataContext";

type CodeStepProps = {
  datatype: string;
  handleNextStep?: () => void;
  backArrow?: boolean;
  handlePrevStep: () => void;
  handleScannedPrevStep: () => void;
  scanned: boolean;
  setScannedId?: Dispatch<SetStateAction<string | null>>;
};

export default function CodeStep({
  datatype,
  handleNextStep,
  handlePrevStep,
  handleScannedPrevStep,
  backArrow = true,
  scanned,
  setScannedId = undefined,
}: CodeStepProps) {
  const t = useTranslations("Clock");
  const [selectedOpt, setSelectedOpt] = useState<boolean>(false);

  const handleBack = () => {
    if (scanned) {
      handleScannedPrevStep();
    } else handlePrevStep();
  };

  return (
    <Grids rows={"7"} gap={"5"} className="h-full w-full">
      <Holds className="h-full w-full row-start-1 row-end-2">
        <Grids rows={"2"} cols={"5"} gap={"3"} className=" h-full w-full">
          {backArrow && (
            <Holds
              className="row-start-1 row-end-2 col-start-1 col-end-2 h-full w-full justify-center"
              onClick={handleBack}
            >
              <Images
                titleImg="/turnBack.svg"
                titleImgAlt="back"
                position={"left"}
              />
            </Holds>
          )}
          <Holds className="row-start-2 row-end-3 col-span-5 h-full w-full justify-center">
            <Titles size={"h1"}>{t(`Title-${datatype}`)}</Titles>
          </Holds>
        </Grids>
      </Holds>
      <Holds className="row-start-2 row-end-7 h-full w-full">
        <CodeFinder
          setScannedId={setScannedId}
          datatype={datatype}
          setSelectedOpt={setSelectedOpt}
        />
      </Holds>
      {handleNextStep && (
        <Holds className="row-start-7 row-end-8 h-full w-full justify-center">
          <StepButtons
            handleNextStep={handleNextStep}
            disabled={!selectedOpt}
          />
        </Holds>
      )}
    </Grids>
  );
}
