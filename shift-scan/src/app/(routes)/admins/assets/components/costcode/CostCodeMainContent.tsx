"use client";
import React, { Dispatch, SetStateAction, useState, useCallback } from "react";
import { Holds } from "@/components/(reusable)/holds";
import { CostCode } from "../../types";
import Spinner from "@/components/(animations)/spinner";
import CostCodeEmptyState from "./components/CostCodeEmptyState";
import CostCodeFormView from "./components/CostCodeFormView";
import CostCodeRegistrationView from "./components/CostCodeRegistrationView";
import { useCostCodeForm } from "./hooks/useCostCodeForm";

interface CostCodeMainContentProps {
  assets: string;
  selectCostCode: CostCode | null;
  isRegistrationFormOpen: boolean;
  setIsRegistrationFormOpen: Dispatch<SetStateAction<boolean>>;
  isRegistrationGroupFormOpen: boolean;
  setIsRegistrationGroupFormOpen: Dispatch<SetStateAction<boolean>>;
  setSelectCostCode: Dispatch<SetStateAction<CostCode | null>>;
  onUnsavedChangesChange: (hasChanges: boolean) => void;
  refreshCostCodes: () => Promise<void>;
  loading?: boolean;
  onRegistrationFormChangesChange?: (hasChanges: boolean) => void;
}

/**
 * Main content component for cost code management.
 * Handles cost code viewing, editing, and registration.
 */
const CostCodeMainContent: React.FC<CostCodeMainContentProps> = ({
  assets,
  selectCostCode,
  isRegistrationFormOpen,
  setIsRegistrationFormOpen,
  setSelectCostCode,
  onUnsavedChangesChange,
  refreshCostCodes,
  loading = false,
  isRegistrationGroupFormOpen,
  setIsRegistrationGroupFormOpen,
  onRegistrationFormChangesChange,
}) => {
  const [hasRegistrationFormChanges, setHasRegistrationFormChanges] =
    useState(false);

  const costCodeFormHook = useCostCodeForm({
    selectCostCode,
    setSelectCostCode,
    onUnsavedChangesChange,
    setIsRegistrationFormOpen,
    refreshCostCodes,
  });

  // Handle registration form unsaved changes
  const handleRegistrationFormChanges = useCallback(
    (hasChanges: boolean) => {
      setHasRegistrationFormChanges(hasChanges);
      onRegistrationFormChangesChange?.(hasChanges);
    },
    [onRegistrationFormChangesChange]
  );

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

  return (
    <>
      {loading ? (
        <Holds
          background={"white"}
          className="w-full h-full col-span-4 flex justify-center items-center animate-pulse"
        >
          <Spinner size={50} />
        </Holds>
      ) : isRegistrationFormOpen ? (
        <Holds className="w-full h-full col-start-3 col-end-7">
          <CostCodeRegistrationView
            onSubmit={costCodeFormHook.handleNewCostCodeSubmit}
            onCancel={handleCancelRegistration}
            onUnsavedChangesChange={handleRegistrationFormChanges}
          />
        </Holds>
      ) : selectCostCode && costCodeFormHook.formData ? (
        <Holds className="w-full h-full col-start-3 col-end-7">
          <CostCodeFormView
            formData={costCodeFormHook.formData}
            changedFields={costCodeFormHook.changedFields}
            onInputChange={costCodeFormHook.handleInputChange}
            onRevertField={costCodeFormHook.handleRevertField}
            onRegisterNew={() => setIsRegistrationFormOpen(true)}
            onDiscardChanges={costCodeFormHook.handleDiscardChanges}
            onSaveChanges={costCodeFormHook.handleSaveChanges}
            hasUnsavedChanges={costCodeFormHook.hasUnsavedChanges}
            isSaving={costCodeFormHook.isSaving}
            successfullyUpdated={costCodeFormHook.successfullyUpdated}
          />
        </Holds>
      ) : (
        <Holds className="w-full h-full col-start-3 col-end-11">
          <CostCodeEmptyState
            onRegisterNew={() => setIsRegistrationFormOpen(true)}
            onRegisterNewGroup={() => setIsRegistrationGroupFormOpen(true)}
          />
        </Holds>
      )}
    </>
  );
};

export default CostCodeMainContent;
