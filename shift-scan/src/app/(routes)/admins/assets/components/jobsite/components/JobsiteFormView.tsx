"use client";
import { Grids } from "@/components/(reusable)/grids";
import { Holds } from "@/components/(reusable)/holds";
import React from "react";
import JobsiteBasicFields from "./JobsiteBasicFields";
import JobsiteHeaderActions from "./JobsiteHeaderActions";
import { Jobsite } from "../../../types";

interface JobsiteFormViewProps {
  formData: Jobsite;
  changedFields: Set<string>;
  onInputChange: (fieldName: string, value: string | boolean) => void;
  onRevertField: (fieldName: string) => void;
  onRegisterNew: () => void;
  onDiscardChanges: () => void;
  onSaveChanges: () => void;
  hasUnsavedChanges: boolean;
  isSaving: boolean;
  successfullyUpdated: boolean;
}

/**
 * Complete jobsite form view component
 * Combines all jobsite form sections into a cohesive layout
 */
export default function JobsiteFormView({
  formData,
  changedFields,
  onInputChange,
  onRevertField,
  onRegisterNew,
  onDiscardChanges,
  onSaveChanges,
  hasUnsavedChanges,
  isSaving,
  successfullyUpdated,
}: JobsiteFormViewProps) {
  return (
    <Holds className="w-full h-full col-start-3 col-end-11">
      <Grids gap="4" className="w-full h-full grid-rows-[40px_1fr]">
        {/* Header Actions */}
        <Holds className="row-span-1 h-full ">
          <JobsiteHeaderActions
            onRegisterNew={onRegisterNew}
            onDiscardChanges={onDiscardChanges}
            onSaveChanges={onSaveChanges}
            hasUnsavedChanges={hasUnsavedChanges}
            isSaving={isSaving}
            successfullyUpdated={successfullyUpdated}
          />
        </Holds>

        {/* Basic Information Section */}
        <Holds background={"white"} className="h-full row-span-1">
          <JobsiteBasicFields
            formData={formData}
            changedFields={changedFields}
            onInputChange={onInputChange}
            onRevertField={onRevertField}
          />
        </Holds>
      </Grids>
    </Holds>
  );
}
