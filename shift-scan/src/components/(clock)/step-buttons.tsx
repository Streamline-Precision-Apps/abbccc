"use client";
import React from "react";
import { Buttons } from "../(reusable)/buttons";
import { useTranslations } from "next-intl";
import { Holds } from "../(reusable)/holds";
import { Titles } from "../(reusable)/titles";

interface StepButtonsProps {
  handleNextStep: () => void;
  isLastStep?: boolean;
}

export default function StepButtons({
  handleNextStep,
  isLastStep,
}: StepButtonsProps) {
  const t = useTranslations("Clock");
  return (
    <Holds className="h-full w-full">
      <Buttons background={"orange"} onClick={handleNextStep} className="py-3">
        <Titles size={"h2"}>{isLastStep ? t("Submit") : t("Continue")}</Titles>
      </Buttons>
    </Holds>
  );
}
