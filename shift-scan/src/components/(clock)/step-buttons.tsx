"use client";
import React from "react";
import { Buttons } from "../(reusable)/buttons";
import { useTranslations } from "next-intl";

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
    <Buttons background={"orange"} onClick={handleNextStep}>
      {isLastStep ? t("Submit") : t("Continue")}
    </Buttons>
  );
}
