"use client";
import React from "react";
import { Buttons } from "../(reusable)/buttons";

interface StepButtonsProps {
  handleNextStep: () => void;
  isLastStep?: boolean;
}

export default function StepButtons({
  handleNextStep,
  isLastStep,
}: StepButtonsProps) {
  return (
    <Buttons background={"orange"} onClick={handleNextStep}>
      {isLastStep ? "Submit" : "Continue"}
    </Buttons>
  );
}
