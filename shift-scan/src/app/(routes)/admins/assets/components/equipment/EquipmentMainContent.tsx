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

interface EquipmentMainContentProps {
  /** Assets data */
  assets: string;
  /** Currently selected equipment */
  selectEquipment: Equipment | null;
  /** Whether the registration form is open */
  isRegistrationFormOpen: boolean;
  /** Handler to set registration form state */
  setIsRegistrationFormOpen: React.Dispatch<React.SetStateAction<boolean>>;
  /** Handler to set selected equipment */
  setSelectEquipment: React.Dispatch<React.SetStateAction<Equipment | null>>;
  /** Callback when unsaved changes state changes */
  onUnsavedChangesChange?: (hasChanges: boolean) => void;
  /** Function to refresh equipment list */
  refreshEquipments?: () => Promise<void>;
  /** Loading state */
  loading?: boolean;
  /** Callback when registration form changes state changes */
  onRegistrationFormChangesChange?: (hasChanges: boolean) => void;
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
  isRegistrationFormOpen,
  setIsRegistrationFormOpen,
  setSelectEquipment,
  onUnsavedChangesChange,
  refreshEquipments,
  loading = false,
  onRegistrationFormChangesChange,
}: EquipmentMainContentProps) {
  const [hasRegistrationFormChanges, setHasRegistrationFormChanges] =
    useState(false);
  const {
    formData,
    changedFields,
    hasUnsavedChanges,
    isSaving,
    successfullyUpdated,
    handleInputChange,
    handleSaveChanges,
    handleDiscardChanges,
    handleNewEquipmentSubmit,
    handleRevertField,
  } = useEquipmentForm({
    selectEquipment,
    setSelectEquipment,
    setIsRegistrationFormOpen,
    onUnsavedChangesChange,
    refreshEquipments,
  });

  // Handle registration form unsaved changes
  const handleRegistrationFormChanges = useCallback(
    (hasChanges: boolean) => {
      setHasRegistrationFormChanges(hasChanges);
      onRegistrationFormChangesChange?.(hasChanges);
    },
    [onRegistrationFormChangesChange]
  );

  // Handle opening registration form
  const handleOpenRegistration = () => {
    setIsRegistrationFormOpen(true);
  };

  // Handle cancel registration with unsaved changes check
  const handleCancelRegistration = useCallback(() => {
    if (hasRegistrationFormChanges) {
      if (
        confirm(
          "You have unsaved registration form changes. Are you sure you want to discard them?"
        )
      ) {
        setIsRegistrationFormOpen(false);
        setHasRegistrationFormChanges(false);
      }
    } else {
      setIsRegistrationFormOpen(false);
    }
  }, [hasRegistrationFormChanges, setIsRegistrationFormOpen]);

  // Show loading indicator when data is being fetched
  if (loading) {
    return (
      <Holds
        background={"white"}
        className="w-full h-full col-span-4 flex justify-center items-center animate-pulse"
      >
        <Spinner size={50} />
      </Holds>
    );
  }

  // Show registration view when registration form is open
  if (isRegistrationFormOpen) {
    return (
      <EquipmentRegistrationView
        onSubmit={handleNewEquipmentSubmit}
        onCancel={handleCancelRegistration}
        onUnsavedChangesChange={handleRegistrationFormChanges}
      />
    );
  }

  // Show empty state when no equipment is selected and registration form is closed
  if (!selectEquipment) {
    return <EquipmentEmptyState onOpenRegistration={handleOpenRegistration} />;
  }

  // Show equipment form view when equipment is selected
  return (
    <Holds className="w-full h-full col-span-4">
      <Grids className="w-full h-full grid-rows-[40px_1fr] gap-4">
        <EquipmentHeaderActions
          hasUnsavedChanges={hasUnsavedChanges}
          isSaving={isSaving}
          successfullyUpdated={successfullyUpdated}
          onRegisterNew={handleOpenRegistration}
          onDiscardChanges={handleDiscardChanges}
          onSaveChanges={handleSaveChanges}
          changedFieldsCount={changedFields.size}
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
  );
}
