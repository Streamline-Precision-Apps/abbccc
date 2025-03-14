"use client";
import React, { Dispatch, SetStateAction, useState } from "react";
import CodeFinder from "@/components/(search)/codeFinder";
import StepButtons from "./step-buttons";
import { useTranslations } from "next-intl";
import { Grids } from "../(reusable)/grids";
import { Holds } from "../(reusable)/holds";
import { TitleBoxes } from "../(reusable)/titleBoxes";

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
      {backArrow && (
        <Holds className="h-full row-start-1 row-end-2">
          <TitleBoxes
            title={t(`Title-${datatype}`)}
            titleImg="/mechanic.svg"
            titleImgAlt="Mechanic"
            onClick={handleBack}
            type="noIcon-NoHref"
          />
        </Holds>
      )}
      <Holds
        className={
          handleNextStep
            ? "row-start-2 row-end-7 h-full w-full pt-5"
            : "row-start-2 row-end-8 h-full w-full pt-5"
        }
      >
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
