"use client";
import React, { Dispatch, SetStateAction, useState } from "react";
import CodeFinder from "@/components/(search)/codeFinder";
import { useTranslations } from "next-intl";
import StepButtons from "@/components/(clock)/step-buttons";
import { Grids } from "@/components/(reusable)/grids";
import { Holds } from "@/components/(reusable)/holds";
import { TitleBoxes } from "@/components/(reusable)/titleBoxes";
import { Titles } from "@/components/(reusable)/titles";
import { Images } from "@/components/(reusable)/images";

type CodeStepProps = {
  handleNextStep?: () => void;
  backArrow?: boolean;
  handlePrevStep: () => void;
  setScanned?: Dispatch<SetStateAction<string | null>>;
};

export default function CodeStep({
  handleNextStep,
  handlePrevStep,
  setScanned = undefined,
}: CodeStepProps) {
  const t = useTranslations("Clock");
  const [selectedOpt, setSelectedOpt] = useState<boolean>(false);

  return (
    <Grids rows={"8"} gap={"5"} className="h-full w-full">
      <Holds className="h-full row-start-1 row-end-2">
        <TitleBoxes onClick={handlePrevStep}>
          <Holds position={"row"}>
            <Titles size={"h1"}>{t(`Title-${"equipment"}`)}</Titles>
            <Images
              titleImg="/equipment.svg"
              titleImgAlt="Equipment"
              className="w-8 h-8"
            />
          </Holds>
        </TitleBoxes>
      </Holds>
      <Holds className="row-start-2 row-end-8 h-full w-full pt-5">
        <CodeFinder
          setScannedId={setScanned}
          datatype={"equipment"}
          setSelectedOpt={setSelectedOpt}
        />
      </Holds>
      {handleNextStep && (
        <Holds className="row-start-8 row-end-9 h-full w-full justify-center">
          <StepButtons
            handleNextStep={handleNextStep}
            disabled={!selectedOpt}
          />
        </Holds>
      )}
    </Grids>
  );
}
