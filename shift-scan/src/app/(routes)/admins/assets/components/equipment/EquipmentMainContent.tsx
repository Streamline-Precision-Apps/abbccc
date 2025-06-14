"use client";
import React, { Dispatch, SetStateAction, useState, useCallback } from "react";
import { Grids } from "@/components/(reusable)/grids";
import { Holds } from "@/components/(reusable)/holds";
import { Equipment } from "../../types";
import { useEquipmentForm } from "./hooks/useEquipmentForm";
import {
  EquipmentHeaderActions,
  EquipmentFormView,
  EquipmentEmptyState,
  EquipmentRegistrationView,
} from "./components";
import Spinner from "@/components/(animations)/spinner";
import DiscardChangesModal from "../shared/DiscardChangesModal";
import DeleteConfirmationModal from "../shared/DeleteConfirmationModal";

interface EquipmentMainContentProps {
  /** Assets data */
  assets: string;
  /** Currently selected equipment */
  selectEquipment: Equipment | null;
  /** Whether the registration form is open */
  /** Handler to set selected equipment */
  setSelectEquipment: Dispatch<SetStateAction<Equipment | null>>;
  /** Callback when unsaved changes state changes */
  onUnsavedChangesChange?: (hasChanges: boolean) => void;
  /** Function to refresh equipment list */
  refreshEquipments?: () => Promise<void>;
  /** Loading state */
  loading?: boolean;
  /** Callback when registration form changes state changes */
  onRegistrationFormChangesChange?: (hasChanges: boolean) => void;
  setEquipmentUIState: Dispatch<
    SetStateAction<"idle" | "creating" | "editing">
  >;
  equipmentUIState: "idle" | "creating" | "editing";
  setHasUnsavedChanges: Dispatch<SetStateAction<boolean>>;
}

/**
 * Main content component for equipment management.
 * Handles equipment viewing, editing, and registration using decomposed components.
 *
 * This component has been refactored from a 861-line monolithic component into
 * smaller, focused components following single responsibility principle.
 *
 * @param props - The component props
 * @returns JSX element containing the appropriate view based on current state
 */
export default function EquipmentMainContent({
  assets,
  selectEquipment,
  setSelectEquipment,
  onUnsavedChangesChange,
  refreshEquipments,
  loading = false,
  onRegistrationFormChangesChange,
  setEquipmentUIState,
  equipmentUIState,
}: EquipmentMainContentProps) {
  const [hasRegistrationFormChanges, setHasRegistrationFormChanges] =
    useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const {
    formData,
    changedFields,
    hasUnsavedChanges,
    isSaving,
    successfullyUpdated,
    showDeleteConfirmModal,
    setShowDeleteConfirmModal,
    handleInputChange,
    handleSaveChanges,
    handleDiscardChanges,
    handleNewEquipmentSubmit,
    handleRevertField,
    handleDeleteEquipment,
    confirmDeleteEquipment,
    message,
    error,
  } = useEquipmentForm({
    selectEquipment,
    setSelectEquipment,
    onUnsavedChangesChange,
    refreshEquipments,
    setEquipmentUIState,
  });

  // Handle registration form unsaved changes
  const handleRegistrationFormChanges = useCallback(
    (hasChanges: boolean) => {
      setHasRegistrationFormChanges(hasChanges);
      if (onRegistrationFormChangesChange) {
        onRegistrationFormChangesChange(hasChanges);
      }
      // Notify parent component about unsaved changes
      if (onUnsavedChangesChange) {
        onUnsavedChangesChange(hasChanges);
      }
    },
    [
      onRegistrationFormChangesChange,
      onUnsavedChangesChange,
      setHasRegistrationFormChanges,
    ]
  );

  // Handle opening registration form
  const handleOpenRegistration = () => {
    setEquipmentUIState("creating");
    setSelectEquipment(null);
  };
  // Handle cancel registration with unsaved changes check
  const handleCancelRegistration = useCallback(() => {
    // Show confirmation modal if there are unsaved changes
    if (hasRegistrationFormChanges) {
      setShowConfirmModal(true);
    } else {
      setEquipmentUIState("idle");
    }
  }, [hasRegistrationFormChanges, setEquipmentUIState]);

  // Modal confirmation handlers
  const handleConfirmDiscard = () => {
    setShowConfirmModal(false);
    setEquipmentUIState("idle");
    setHasRegistrationFormChanges(false);
  };

  const handleCancelDiscard = () => {
    setShowConfirmModal(false);
  };

  // Show loading indicator when data is being fetched
  if (loading) {
    return (
      <Holds className="w-full h-full col-span-4 flex justify-center items-center animate-pulse">
        <Grids className="w-full h-full grid-rows-[40px_1fr] gap-4">
          <Holds
            background={"white"}
            className="w-full h-full rounded-[10px] flex flex-col items-center justify-center"
          />
          <Holds
            background={"white"}
            className="w-full h-full rounded-[10px] flex flex-col items-center justify-center"
          >
            <Spinner size={50} />
          </Holds>
        </Grids>
      </Holds>
    );
  }

  return (
    <>
      {equipmentUIState === "creating" ? (
        <EquipmentRegistrationView
          onSubmit={handleNewEquipmentSubmit}
          onCancel={handleCancelRegistration}
          onUnsavedChangesChange={handleRegistrationFormChanges}
          onSuccess={successfullyUpdated}
        />
      ) : equipmentUIState === "editing" && selectEquipment && formData ? (
        <Holds className="w-full h-full col-span-4">
          <Grids className="w-full h-full grid-rows-[40px_1fr] gap-4">
            <EquipmentHeaderActions
              hasUnsavedChanges={hasUnsavedChanges}
              isSaving={isSaving}
              successfullyUpdated={successfullyUpdated}
              onRegisterNew={handleOpenRegistration}
              onDiscardChanges={handleDiscardChanges}
              onSaveChanges={handleSaveChanges}
              onDeleteEquipment={handleDeleteEquipment}
            />

            <EquipmentFormView
              equipment={selectEquipment}
              formData={formData!}
              changedFields={changedFields}
              onInputChange={handleInputChange}
              onRevertField={handleRevertField}
              isSaving={isSaving}
            />
          </Grids>
        </Holds>
      ) : equipmentUIState === "idle" ? (
        <EquipmentEmptyState
          onOpenRegistration={handleOpenRegistration}
          deletionConfirmationMessage={message}
          deletionErrorMessage={error}
        />
      ) : null}

      <DiscardChangesModal
        isOpen={showConfirmModal}
        confirmDiscardChanges={handleConfirmDiscard}
        cancelDiscard={handleCancelDiscard}
        message="You have unsaved changes. Are you sure you want to discard them?"
      />

      <DeleteConfirmationModal
        isOpen={showDeleteConfirmModal}
        itemName={formData?.name || ""}
        itemType="equipment"
        onConfirm={confirmDeleteEquipment}
        onCancel={() => setShowDeleteConfirmModal(false)}
      />
    </>
  );
}
