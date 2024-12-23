"use client";
import React from "react";
import CodeFinder from "@/components/(search)/codeFinder";
import StepButtons from "./step-buttons";
import { useTranslations } from "next-intl";
import { Titles } from "../(reusable)/titles";
import { Grids } from "../(reusable)/grids";
import { Holds } from "../(reusable)/holds";
import { Contents } from "../(reusable)/contents";

type CodeStepProps = {
  datatype: string;
  handleNextStep?: () => void;
};

export default function CodeStep({ datatype, handleNextStep }: CodeStepProps) {
  const t = useTranslations("Clock");

  return (
    <Holds className="h-full w-full">
      <Contents width={"section"}>
        <Grids rows={"7"} gap={"2"} className="my-5 h-full  ">
          <Holds className="row-span-1">
            <Titles size={"h1"}>{t(`Title-${datatype}`)}</Titles>
          </Holds>
          <Holds className="row-span-4 border-[3px] border-black rounded-[10px] h-full">
            <CodeFinder datatype={datatype} />
          </Holds>
          {handleNextStep && (
            <Holds className="row-span-1 h-full ">
              <StepButtons handleNextStep={handleNextStep} />
            </Holds>
          )}
        </Grids>
      </Contents>
    </Holds>
  );
}
