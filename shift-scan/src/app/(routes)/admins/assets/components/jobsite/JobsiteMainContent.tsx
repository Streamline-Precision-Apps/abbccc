"use client";
import React, { Dispatch, SetStateAction, useState, useCallback } from "react";
import { Grids } from "@/components/(reusable)/grids";
import { Holds } from "@/components/(reusable)/holds";
import { NModals } from "@/components/(reusable)/newmodals";
import { Texts } from "@/components/(reusable)/texts";
import { Buttons } from "@/components/(reusable)/buttons";
import { ClientsSummary, Jobsite, TagSummary } from "../../types";
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
  clients?: ClientsSummary[];
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
  clients = [],
}: JobsiteMainContentProps) {
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
    handleDeleteJobsite,
    confirmDeleteJobsite,
    successMessage,
    errorMessage,
  } = useJobsiteForm({
    selectJobsite,
    setSelectJobsite,
    onUnsavedChangesChange,
    refreshJobsites,
    setJobsiteUIState,
  });

  // Handle opening registration form
  const handleOpenRegistration = () => {
    setJobsiteUIState("creating");
    setSelectJobsite(null);
  };

  // Modal confirmation handlers
  const handleConfirmDiscard = () => {
    setShowConfirmModal(false);
    setJobsiteUIState("idle");
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
      {jobsiteUIState === "creating" ? (
        <JobsiteRegistrationView
          tagSummaries={tagSummaries}
          clients={clients}
          setJobsiteUIState={setJobsiteUIState}
          refreshJobsites={refreshJobsites}
          setShowConfirmModal={setShowConfirmModal}
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
              clients={clients}
            />
          </Grids>
        </Holds>
      ) : jobsiteUIState === "idle" ? (
        <JobsiteEmptyState
          onRegisterNew={handleOpenRegistration}
          successMessage={successMessage}
          errorMessage={errorMessage}
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
        itemType="jobsite"
        onConfirm={confirmDeleteJobsite}
        onCancel={() => setShowDeleteConfirmModal(false)}
      />
    </>
  );
}

// Export removed - now using default export in the function declaration
