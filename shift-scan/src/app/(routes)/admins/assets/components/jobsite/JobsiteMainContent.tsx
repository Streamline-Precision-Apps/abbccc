"use client";
import React, { Dispatch, SetStateAction, useState, useCallback } from "react";
import { Grids } from "@/components/(reusable)/grids";
import { Holds } from "@/components/(reusable)/holds";
import { NModals } from "@/components/(reusable)/newmodals";
import { Texts } from "@/components/(reusable)/texts";
import { Buttons } from "@/components/(reusable)/buttons";
import { Jobsite, TagSummary } from "../../types";
import {
  JobsiteHeaderActions,
  JobsiteFormView,
  JobsiteRegistrationView,
  JobsiteEmptyState,
  useJobsiteForm,
} from "./index";
import Spinner from "@/components/(animations)/spinner";
import DiscardChangesModal from "../shared/DiscardChangesModal";
import DeleteConfirmationModal from "../shared/DeleteConfirmationModal";
import { UseTagsFormReturn } from "../costcode/hooks/useTagsForm";

interface JobsiteMainContentProps {
  /** Assets data */
  assets: string;
  /** Currently selected jobsite */
  selectJobsite: Jobsite | null;
  /** Handler to set selected jobsite */
  setSelectJobsite: Dispatch<SetStateAction<Jobsite | null>>;
  /** Callback when unsaved changes state changes */
  onUnsavedChangesChange?: (hasChanges: boolean) => void;
  /** Function to refresh jobsite list */
  refreshJobsites?: () => Promise<void>;
  /** Loading state */
  loading?: boolean;
  /** Callback when registration form changes state changes */
  onRegistrationFormChangesChange?: (hasChanges: boolean) => void;
  /** UI state setter */
  setJobsiteUIState: Dispatch<SetStateAction<"idle" | "creating" | "editing">>;
  /** Current UI state */
  jobsiteUIState: "idle" | "creating" | "editing";
  /** Setter for unsaved changes state */
  setHasUnsavedChanges: React.Dispatch<React.SetStateAction<boolean>>;
  /** Function to set the tag form */
  tagFormHook: UseTagsFormReturn;
  /** Cost code group summary data */
  tagSummaries?: TagSummary[];
}

/**
 * Main content component for jobsite management.
 * Handles jobsite viewing, editing, and registration using decomposed components.
 *
 * This component follows the pattern of EquipmentMainContent for consistency.
 *
 * @param props - The component props
 * @returns JSX element containing the appropriate view based on current state
 */
export default function JobsiteMainContent({
  assets,
  selectJobsite,
  setSelectJobsite,
  onUnsavedChangesChange,
  refreshJobsites,
  loading = false,
  onRegistrationFormChangesChange,
  setJobsiteUIState,
  jobsiteUIState,
  setHasUnsavedChanges,
  tagFormHook,
  tagSummaries = [],
}: JobsiteMainContentProps) {
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
    handleRevertField,
    handleNewJobsiteSubmit,
    handleDeleteJobsite,
    confirmDeleteJobsite,
  } = useJobsiteForm({
    selectJobsite,
    setSelectJobsite,
    onUnsavedChangesChange,
    refreshJobsites,
    setJobsiteUIState,
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
    setJobsiteUIState("creating");
    setSelectJobsite(null);
  };

  // Handle cancel registration with unsaved changes check
  const handleCancelRegistration = useCallback(() => {
    // Show confirmation modal if there are unsaved changes
    if (hasRegistrationFormChanges) {
      setShowConfirmModal(true);
    } else {
      setJobsiteUIState("idle");
    }
  }, [hasRegistrationFormChanges, setJobsiteUIState]);

  // Modal confirmation handlers
  const handleConfirmDiscard = () => {
    setShowConfirmModal(false);
    setJobsiteUIState("idle");
    setHasRegistrationFormChanges(false);
  };

  const handleCancelDiscard = () => {
    setShowConfirmModal(false);
  };

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

  return (
    <>
      {jobsiteUIState === "creating" ? (
        <JobsiteRegistrationView
          onSubmit={handleNewJobsiteSubmit}
          onCancel={handleCancelRegistration}
          onUnsavedChangesChange={handleRegistrationFormChanges}
          tagSummaries={tagSummaries}
        />
      ) : jobsiteUIState === "editing" && selectJobsite && formData ? (
        <Holds className="w-full h-full col-span-4">
          <Grids className="w-full h-full grid-rows-[40px_1fr] gap-4">
            <JobsiteHeaderActions
              hasUnsavedChanges={hasUnsavedChanges}
              isSaving={isSaving}
              successfullyUpdated={successfullyUpdated}
              onRegisterNew={handleOpenRegistration}
              onDiscardChanges={handleDiscardChanges}
              onSaveChanges={handleSaveChanges}
              onDeleteJobsite={handleDeleteJobsite}
            />

            <JobsiteFormView
              formData={formData}
              changedFields={changedFields}
              onInputChange={handleInputChange}
              onRevertField={handleRevertField}
              onRegisterNew={handleOpenRegistration}
              onDiscardChanges={handleDiscardChanges}
              onSaveChanges={handleSaveChanges}
              hasUnsavedChanges={hasUnsavedChanges}
              isSaving={isSaving}
              successfullyUpdated={successfullyUpdated}
              setJobsiteUIState={setJobsiteUIState}
              onDeleteJobsite={handleDeleteJobsite}
              tagSummaries={tagSummaries}
            />
          </Grids>
        </Holds>
      ) : jobsiteUIState === "idle" ? (
        <JobsiteEmptyState onRegisterNew={handleOpenRegistration} />
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
        itemType="jobsite"
        onConfirm={confirmDeleteJobsite}
        onCancel={() => setShowDeleteConfirmModal(false)}
      />
    </>
  );
}

// Export removed - now using default export in the function declaration
