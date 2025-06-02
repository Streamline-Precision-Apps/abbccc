"use client";
import { Holds } from "@/components/(reusable)/holds";
import { Texts } from "@/components/(reusable)/texts";
import React, { useState } from "react";
import { CostCodeSummary } from "../../../types";
import DiscardChangesModal from "../../shared/DiscardChangesModal";

interface CostCodeRowProps {
  costCode: CostCodeSummary;
  isSelected?: boolean;
  onClick: (costCode: CostCodeSummary) => void;
  hasUnsavedChanges?: boolean;
}

/**
 * Individual cost code row component for the sidebar list
 * Displays cost code name with selection state and active status
 */
export default function CostCodeRow({
  costCode,
  isSelected = false,
  onClick,
  hasUnsavedChanges = false,
}: CostCodeRowProps) {
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const handleCostCodeClick = () => {
    if (hasUnsavedChanges) {
      // If there are unsaved changes, show confirmation modal
      setShowConfirmModal(true);
    } else {
      // Otherwise process click normally
      onClick(costCode);
    }
  };

  const handleConfirmNavigation = () => {
    setShowConfirmModal(false);
    onClick(costCode); // Process the click after confirmation
  };

  const handleCancelNavigation = () => {
    setShowConfirmModal(false);
  };

  return (
    <>
      <Holds
        background={!costCode.isActive ? "orange" : "lightGray"}
        className={`w-full h-[40px] justify-center flex hover:opacity-80 cursor-pointer relative ${
          isSelected && "outline outline-[2px] outline-black"
        } rounded-[10px] my-1 px-4`}
        onClick={handleCostCodeClick}
      >
        <Texts position="left" size="xs">
          {`${costCode.name} ${!costCode.isActive ? "(inactive)" : ""}`}
        </Texts>
      </Holds>
      <DiscardChangesModal
        isOpen={showConfirmModal}
        confirmDiscardChanges={handleConfirmNavigation}
        cancelDiscard={handleCancelNavigation}
        message="You have unsaved cost code changes. Are you sure you want to discard them?"
      />
    </>
  );
}
