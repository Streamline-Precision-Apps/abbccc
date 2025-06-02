import React, { useState } from "react";
import { Holds } from "@/components/(reusable)/holds";
import { Texts } from "@/components/(reusable)/texts";
import DiscardChangesModal from "../../shared/DiscardChangesModal";
import { Equipment, EquipmentSummary } from "../../../types";

interface EquipmentRowProps {
  equipment: EquipmentSummary;
  isSelected: boolean;
  onEquipmentClick: (equipment: EquipmentSummary) => void;
  hasUnsavedChanges?: boolean;
}

const EquipmentRow: React.FC<EquipmentRowProps> = ({
  equipment,
  isSelected,
  onEquipmentClick,
  hasUnsavedChanges = false,
}) => {
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  // Handler for equipment click with unsaved changes check
  const handleEquipmentClick = () => {
    if (hasUnsavedChanges) {
      // If there are unsaved changes, show confirmation modal
      setShowConfirmModal(true);
    } else {
      // Otherwise process click normally
      onEquipmentClick(equipment);
    }
  };

  // Handle confirmation to discard changes and continue
  const handleConfirmNavigation = () => {
    setShowConfirmModal(false);
    onEquipmentClick(equipment); // Process the click after confirmation
  };

  // Handle cancellation - stay on current view
  const handleCancelNavigation = () => {
    setShowConfirmModal(false);
  };

  return (
    <>
      <Holds
        onClick={handleEquipmentClick}
        background="lightGray"
        className={`w-full h-[40px] flex  hover:opacity-80 cursor-pointer relative ${
          isSelected && "outline outline-[2px] outline-black"
        } rounded-[10px] my-1 px-4`}
      >
        <Texts position="left" size="xs">
          {`${equipment.name.slice(0, 30)} (${equipment.id})`}
        </Texts>
      </Holds>

      {/* Confirmation Modal for Unsaved Changes */}
      <DiscardChangesModal
        isOpen={showConfirmModal}
        confirmDiscardChanges={handleConfirmNavigation}
        cancelDiscard={handleCancelNavigation}
      />
    </>
  );
};

export default EquipmentRow;
