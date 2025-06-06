"use client";
import { Grids } from "@/components/(reusable)/grids";
import { Holds } from "@/components/(reusable)/holds";
import React from "react";
import JobsiteBasicFields from "./JobsiteBasicFields";
import JobsiteHeaderActions from "./JobsiteHeaderActions";
import { Jobsite, TagSummary } from "../../../types";
import Spinner from "@/components/(animations)/spinner";

interface JobsiteFormViewProps {
  formData: Jobsite;
  changedFields: Set<string>;
  onInputChange: (
    fieldName: string,
    value: string | boolean | Array<{ id: string; name: string }>
  ) => void;
  onRevertField: (fieldName: string) => void;
  onRegisterNew: () => void;
  onDiscardChanges: () => void;
  onSaveChanges: () => void;
  onDeleteJobsite: () => void;
  hasUnsavedChanges: boolean;
  isSaving: boolean;
  successfullyUpdated: boolean;
  setJobsiteUIState: React.Dispatch<
    React.SetStateAction<"idle" | "creating" | "editing">
  >;
  tagSummaries?: TagSummary[];
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
  isSaving,
  tagSummaries = [],
}: JobsiteFormViewProps) {
  return (
    <Holds
      background={"white"}
      className="w-full h-full rounded-[10px] p-3 px-5 relative"
    >
      {/* Loading overlay - only show when saving */}
      {isSaving && (
        <Holds className="w-full h-full justify-center items-center absolute left-0 top-0 z-50 bg-white bg-opacity-80 rounded-[10px]">
          <Spinner size={80} />
        </Holds>
      )}

      {/* Basic Information Section */}
      <JobsiteBasicFields
        tagSummaries={tagSummaries}
        formData={formData}
        changedFields={changedFields}
        onInputChange={onInputChange}
        onRevertField={onRevertField}
      />
    </Holds>
  );
}
