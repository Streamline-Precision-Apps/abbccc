"use client";
import React, { useState } from "react";
import CodeFinder from "@/components/(search)/codeFinder";
import StepButtons from "./step-buttons";
import { useTranslations } from "next-intl";
import { Titles } from "../(reusable)/titles";
import { Grids } from "../(reusable)/grids";
import { Holds } from "../(reusable)/holds";
import { Images } from "../(reusable)/images";
import { useSavedCostCode } from "@/app/context/CostCodeContext";
import { useScanData } from "@/app/context/JobSiteScanDataContext";

type CodeStepProps = {
  datatype: string;
  handleNextStep?: () => void;
  backArrow?: boolean;
  handlePrevStep: () => void;
};

export default function CodeStep({
  datatype,
  handleNextStep,
  handlePrevStep,
  backArrow = true,
}: CodeStepProps) {
  const t = useTranslations("Clock");
  const { scanResult } = useScanData();
  const [selectedOpt, setSelectedOpt] = useState<boolean>(false);
  // TODO: This has an error inside of the browser console.
  return (
    <Holds background={"white"} className="h-full w-full">
      <Holds className="h-full w-[90%] px-1 py-3">
        <Grids rows={"7"} gap={"5"} className="h-full w-full">
          <Holds className="h-full w-full row-start-1 row-end-2">
            <Grids rows={"2"} cols={"5"} gap={"3"} className=" h-full w-full">
              {backArrow && (
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
              )}
              <Holds className="row-start-2 row-end-3 col-span-5 h-full w-full justify-center">
                <Titles size={"h1"}>{t(`Title-${datatype}`)}</Titles>
              </Holds>
            </Grids>
          </Holds>
          <Holds className="row-span-5 h-full w-full">
            <CodeFinder
              datatype={datatype}
              savedJS={scanResult?.data || ""}
              setSelectedOpt={setSelectedOpt}
            />
          </Holds>
          {handleNextStep && (
            <Holds className="row-span-1">
              <StepButtons
                handleNextStep={handleNextStep}
                disabled={!selectedOpt}
              />
            </Holds>
          )}
        </Grids>
      </Holds>
    </Holds>
  );
}
