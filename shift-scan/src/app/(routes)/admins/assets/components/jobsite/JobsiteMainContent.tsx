import React, { Dispatch, SetStateAction, useState } from "react";
import { Holds } from "@/components/(reusable)/holds";
import {
  JobsiteFormView,
  JobsiteRegistrationView,
  JobsiteEmptyState,
  useJobsiteForm,
} from "./index";
import { Jobsite } from "../../types";
import Spinner from "@/components/(animations)/spinner";
import { set } from "date-fns";

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
}

const JobsiteMainContent: React.FC<JobsiteMainContentProps> = ({
  assets,
  selectJobsite,
  isRegistrationFormOpen,
  setIsRegistrationFormOpen,
  setSelectJobsite,
  onUnsavedChangesChange,
  onRegistrationFormChangesChange,
  refreshJobsites,
  loading = false,
  jobsiteUIState,
  setJobsiteUIState,
}) => {
  const jobsiteFormHook = useJobsiteForm({
    selectJobsite,
    setSelectJobsite,
    onUnsavedChangesChange,
    setJobsiteUIState,
    refreshJobsites,
  });

  const [hasRegistrationFormChanges, setHasRegistrationFormChanges] =
    useState(false);

  const handleRegistrationFormChanges = (hasChanges: boolean) => {
    setHasRegistrationFormChanges(hasChanges);
    onRegistrationFormChangesChange?.(hasChanges);
  };

  const handleCancelRegistration = () => {
    if (hasRegistrationFormChanges) {
      // Let parent handle the confirmation modal
      onRegistrationFormChangesChange?.(true);
      return;
    }
    setJobsiteUIState("idle");
  };

  return (
    <>
      {loading ? (
        <Holds
          background={"white"}
          className="w-full h-full col-span-4 flex justify-center items-center animate-pulse"
        >
          <Spinner size={50} />
        </Holds>
      ) : jobsiteUIState === "creating" ? (
        <Holds className="w-full h-full col-start-3 col-end-7">
          <JobsiteRegistrationView
            onSubmit={jobsiteFormHook.handleNewJobsiteSubmit}
            onCancel={handleCancelRegistration}
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
    </>
  );
};

export default JobsiteMainContent;
