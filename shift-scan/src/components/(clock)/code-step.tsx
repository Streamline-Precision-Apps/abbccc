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
 
  // TODO: This has an error inside of the browser console.
  return (
    <Contents width={"section"}>
      <Holds background={"white"} className="h-screen">
        <Holds className="h-full w-[90%]">
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
        </Holds>
      </Holds>
    </Contents>
  );
}
