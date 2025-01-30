"use client";
import React from "react";
import CodeFinder from "@/components/(search)/codeFinder";
import StepButtons from "./step-buttons";
import { useTranslations } from "next-intl";
import { Titles } from "../(reusable)/titles";
import { Grids } from "../(reusable)/grids";
import { Holds } from "../(reusable)/holds";
import { Images } from "../(reusable)/images";
import { Contents } from "../(reusable)/contents";

type CodeStepProps = {
  datatype: string;
  handleNextStep?: () => void;
  handlePreviousStep?: () => void;
  handleGoBack2?: () => void;
};

export default function CodeStep({
  datatype,
  handleNextStep,
  handlePreviousStep,
  handleGoBack2,
}: CodeStepProps) {
  const t = useTranslations("Clock");

  // TODO: This has an error inside of the browser console.
  return (
    <Holds background={"white"} className="h-full w-full">
      <Contents width={"section"}>
        <Grids rows={"7"} gap={"5"} className="h-full w-full my-5">
          <Holds className="h-full w-full row-start-1 row-end-2">
            <Grids rows={"2"} cols={"5"} gap={"3"} className=" h-full w-full">
              {(datatype === "jobsite") ? (
                <Holds 
                className="row-start-1 row-end-2 col-start-1 col-end-2 h-full w-full justify-center"
                onClick={handleGoBack2}>
                  <Images
                    titleImg="/turnBack.svg"
                    titleImgAlt="back"
                    position={"left"}
                  />
                </Holds>
              ) : (
                <Holds 
                className="row-start-1 row-end-2 col-start-1 col-end-2 h-full w-full justify-center"
                onClick={handlePreviousStep}>
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
            <CodeFinder datatype={datatype} />
          </Holds>
          {handleNextStep && (
            <Holds className="row-span-1 h-full">
              <StepButtons handleNextStep={handleNextStep} />
            </Holds>
          )}
        </Grids>
      </Contents>
    </Holds>
  );
}
