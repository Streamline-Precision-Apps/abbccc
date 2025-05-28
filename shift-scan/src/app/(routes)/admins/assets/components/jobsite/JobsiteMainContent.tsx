import React, { Dispatch, SetStateAction } from "react";
import { Holds } from "@/components/(reusable)/holds";
import {
  JobsiteFormView,
  JobsiteRegistrationView,
  JobsiteEmptyState,
  useJobsiteForm,
} from "./index";
import { Jobsite } from "../../types";

interface JobsiteMainContentProps {
  assets: string;
  selectJobsite: Jobsite | null;
  isRegistrationFormOpen: boolean;
  setIsRegistrationFormOpen: Dispatch<SetStateAction<boolean>>;
  setSelectJobsite: Dispatch<SetStateAction<Jobsite | null>>;
  onUnsavedChangesChange: (hasChanges: boolean) => void;
}

const JobsiteMainContent: React.FC<JobsiteMainContentProps> = ({
  assets,
  selectJobsite,
  isRegistrationFormOpen,
  setIsRegistrationFormOpen,
  setSelectJobsite,
  onUnsavedChangesChange,
}) => {
  const jobsiteFormHook = useJobsiteForm({
    selectJobsite,
    setSelectJobsite,
    onUnsavedChangesChange,
    setIsRegistrationFormOpen,
  });

  return (
    <>
      {isRegistrationFormOpen ? (
        <Holds className="w-full h-full col-start-3 col-end-7">
          <JobsiteRegistrationView
            onSubmit={jobsiteFormHook.handleNewJobsiteSubmit}
            onCancel={() => setIsRegistrationFormOpen(false)}
          />
        </Holds>
      ) : selectJobsite && jobsiteFormHook.formData ? (
        <Holds className="w-full h-full col-start-3 col-end-7">
          <JobsiteFormView
            formData={jobsiteFormHook.formData}
            changedFields={jobsiteFormHook.changedFields}
            onInputChange={jobsiteFormHook.handleInputChange}
            onRevertField={jobsiteFormHook.handleRevertField}
            onRegisterNew={() => setIsRegistrationFormOpen(true)}
            onDiscardChanges={jobsiteFormHook.handleDiscardChanges}
            onSaveChanges={jobsiteFormHook.handleSaveChanges}
            hasUnsavedChanges={jobsiteFormHook.hasUnsavedChanges}
            isSaving={jobsiteFormHook.isSaving}
            successfullyUpdated={jobsiteFormHook.successfullyUpdated}
          />
        </Holds>
      ) : (
        <Holds className="w-full h-full col-start-3 col-end-11">
          <JobsiteEmptyState
            onRegisterNew={() => setIsRegistrationFormOpen(true)}
          />
        </Holds>
      )}
    </>
  );
};

export default JobsiteMainContent;
