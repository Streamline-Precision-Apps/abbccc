import React, { Dispatch, SetStateAction, useState, useCallback } from "react";
import { Holds } from "@/components/(reusable)/holds";
import {
  JobsiteFormView,
  JobsiteRegistrationView,
  JobsiteEmptyState,
  useJobsiteForm,
} from "./index";
import { Jobsite } from "../../types";
import Spinner from "@/components/(animations)/spinner";
import { NModals } from "@/components/(reusable)/newmodals";
import { Texts } from "@/components/(reusable)/texts";
import { Buttons } from "@/components/(reusable)/buttons";

interface JobsiteMainContentProps {
  assets: string;
  selectJobsite: Jobsite | null;
  isRegistrationFormOpen: boolean;
  setIsRegistrationFormOpen: Dispatch<SetStateAction<boolean>>;
  setSelectJobsite: Dispatch<SetStateAction<Jobsite | null>>;
  onUnsavedChangesChange: (hasChanges: boolean) => void;
  onRegistrationFormChangesChange?: (hasChanges: boolean) => void;
  refreshJobsites: () => Promise<void>;
  loading?: boolean;
  jobsiteUIState: "idle" | "creating" | "editing";
  setJobsiteUIState: Dispatch<SetStateAction<"idle" | "creating" | "editing">>;
  setHasUnsavedChanges: React.Dispatch<React.SetStateAction<boolean>>;
  hasUnsavedChanges: boolean;
}

const JobsiteMainContent: React.FC<JobsiteMainContentProps> = ({
  assets,
  selectJobsite,
  setSelectJobsite,
  onUnsavedChangesChange,
  onRegistrationFormChangesChange,
  refreshJobsites,
  loading = false,
  jobsiteUIState,
  setJobsiteUIState,
  hasUnsavedChanges,
  setHasUnsavedChanges,
}) => {
  const jobsiteFormHook = useJobsiteForm({
    selectJobsite,
    setSelectJobsite,
    onUnsavedChangesChange,
    setJobsiteUIState,
    refreshJobsites,
  });

  const [showUnsavedChangesModal, setShowUnsavedChangesModal] = useState(false);

  const handleRegistrationFormChanges = (hasChanges: boolean) => {
    setHasUnsavedChanges(hasChanges);
    onRegistrationFormChangesChange?.(hasChanges);
  };

  const handleCancelRegistration = () => {
    if (hasUnsavedChanges) {
      setShowUnsavedChangesModal(true); // Show the modal instead of directly calling the parent callback
    } else {
      setJobsiteUIState("idle"); // Reset the UI state to idle if no unsaved changes
    }
  };

  const cancelNavigation = () => {
    setShowUnsavedChangesModal(false);
  };

  const confirmNavigation = useCallback(() => {
    setShowUnsavedChangesModal(false);
    setJobsiteUIState("idle");
    setHasUnsavedChanges(false);
    setSelectJobsite(null);
  }, [setJobsiteUIState, setHasUnsavedChanges, setSelectJobsite]);

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
        <Holds className="w-full h-full col-start-3 col-end-7">
          <JobsiteRegistrationView
            onSubmit={jobsiteFormHook.handleNewJobsiteSubmit}
            onCancel={() => {
              handleCancelRegistration();
              setSelectJobsite(null);
            }}
            onUnsavedChangesChange={handleRegistrationFormChanges}
          />
        </Holds>
      ) : jobsiteUIState === "editing" && jobsiteFormHook.formData ? (
        <Holds className="w-full h-full col-start-3 col-end-7">
          <JobsiteFormView
            formData={jobsiteFormHook.formData}
            changedFields={jobsiteFormHook.changedFields}
            onInputChange={jobsiteFormHook.handleInputChange}
            onRevertField={jobsiteFormHook.handleRevertField}
            onRegisterNew={() => {
              setJobsiteUIState("creating");
              setSelectJobsite(null);
            }}
            onDiscardChanges={jobsiteFormHook.handleDiscardChanges}
            onSaveChanges={jobsiteFormHook.handleSaveChanges}
            hasUnsavedChanges={jobsiteFormHook.hasUnsavedChanges}
            isSaving={jobsiteFormHook.isSaving}
            successfullyUpdated={jobsiteFormHook.successfullyUpdated}
            setJobsiteUIState={setJobsiteUIState}
          />
        </Holds>
      ) : jobsiteUIState === "idle" ? (
        <Holds className="w-full h-full col-start-3 col-end-11">
          <JobsiteEmptyState
            onRegisterNew={() => {
              setJobsiteUIState("creating");
              setSelectJobsite(null);
            }}
          />
        </Holds>
      ) : null}

      <NModals
        isOpen={showUnsavedChangesModal}
        handleClose={cancelNavigation}
        size="sm"
        background={"noOpacity"}
      >
        <Holds className="w-full h-full items-center justify-center text-center pt-3">
          <Texts size="p5">
            You have unsaved changes. Are you sure you want to discard them?
          </Texts>
          <Holds className="flex justify-center items-center gap-4 mt-4">
            <Buttons
              background="red"
              shadow="none"
              className="w-full p-2"
              onClick={confirmNavigation}
            >
              <Texts size="sm">Yes, discard changes</Texts>
            </Buttons>
            <Buttons
              background="lightBlue"
              shadow="none"
              className="w-full p-2"
              onClick={cancelNavigation}
            >
              <Texts size="sm">No, go back</Texts>
            </Buttons>
          </Holds>
        </Holds>
      </NModals>
    </>
  );
};

export default JobsiteMainContent;
