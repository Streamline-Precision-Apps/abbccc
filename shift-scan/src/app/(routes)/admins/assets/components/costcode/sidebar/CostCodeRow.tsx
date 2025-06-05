"use client";
import { Holds } from "@/components/(reusable)/holds";
import { Texts } from "@/components/(reusable)/texts";
import React, { useCallback, useMemo, useState } from "react";
import DiscardChangesModal from "../../shared/DiscardChangesModal";
import { CostCodeRowProps } from "../types";
import { formatCostCodeName } from "../utils/formatters";
import { CheckBox } from "@/components/(inputs)/checkBox";

/**
 * Individual cost code row component for the sidebar list
 * Displays cost code name with selection state and active status
 *
 * @param props The component props
 * @returns A memoized row component for cost codes
 */
function CostCodeRow({
  costCode,
  isSelected,
  onClick,
  hasUnsavedChanges,
  costCodeUIState,
  onToggleCostCode,
}: CostCodeRowProps) {
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  // Format the cost code name for display using utility function
  const formattedName = useMemo(() => {
    const formatted = formatCostCodeName(costCode.name);
    // Add inactive status if needed
    return costCode.isActive ? formatted : `${formatted} (inactive)`;
  }, [costCode.name, costCode.isActive]);

  // Memoized handlers to avoid unnecessary re-renders
  const handleCostCodeClick = useCallback(() => {
    if (hasUnsavedChanges) {
      // If there are unsaved changes, show confirmation modal
      setShowConfirmModal(true);
    } else {
      // Otherwise process click normally
      onClick(costCode);
    }
  }, [costCode, hasUnsavedChanges, onClick]);

  const handleConfirmNavigation = useCallback(() => {
    setShowConfirmModal(false);
    onClick(costCode); // Process the click after confirmation
  }, [costCode, onClick]);

  const handleCancelNavigation = useCallback(() => {
    setShowConfirmModal(false);
  }, []);

  const showCheckBox =
    costCodeUIState === "creatingGroups" || costCodeUIState === "editingGroups";
  return (
    <>
      <Holds
        key={costCode.id}
        position={"row"}
        className="w-full h-[40px] justify-center flex gap-2 mb-3"
      >
        <Holds
          background={showCheckBox && isSelected ? "lightBlue" : "gray"}
          className={`w-full h-[40px] justify-center flex hover:opacity-80 cursor-pointer relative ${
            isSelected && "outline outline-[2px] outline-black"
          } rounded-[10px] my-1 px-4`}
          onClick={handleCostCodeClick}
        >
          <Texts position="left" size="xs">
            {formattedName}
          </Texts>
        </Holds>
        {showCheckBox && (
          <Holds className="w-fit h-[40px] justify-center flex relative">
            <CheckBox
              id={costCode.id}
              name={costCode.name}
              checked={isSelected}
              onChange={() => {
                onToggleCostCode?.(costCode.id, costCode.name);
              }}
              height={30}
              width={30}
              shadow={false}
            />
          </Holds>
        )}
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

// Memoize the component to prevent unnecessary re-renders
export default React.memo(CostCodeRow);
