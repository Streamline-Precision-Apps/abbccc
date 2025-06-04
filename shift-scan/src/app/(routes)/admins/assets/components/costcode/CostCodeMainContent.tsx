"use client";
import React, { Dispatch, SetStateAction, useState, useCallback } from "react";
import { Holds } from "@/components/(reusable)/holds";
import { CostCode, Tag, TagSummary } from "../../types";
import Spinner from "@/components/(animations)/spinner";
import CostCodeEmptyState from "./components/CostCodeEmptyState";
import CostCodeFormView from "./components/CostCodeFormView";
import CostCodeRegistrationView from "./components/CostCodeRegistrationView";
import DiscardChangesModal from "../shared/DiscardChangesModal";
import { useCostCodeForm } from "./hooks/useCostCodeForm";

interface CostCodeMainContentProps {
  assets: string;
  selectCostCode: CostCode | null;
  isRegistrationFormOpen: boolean;
  setIsRegistrationFormOpen: Dispatch<SetStateAction<boolean>>;
  isRegistrationGroupFormOpen: boolean;
  setIsRegistrationGroupFormOpen: Dispatch<SetStateAction<boolean>>;
  setSelectCostCode: Dispatch<SetStateAction<CostCode | null>>;
  refreshCostCodes: () => Promise<void>;
  loading?: boolean;
  selectTag: Tag | null;
  setSelectTag: React.Dispatch<React.SetStateAction<Tag | null>>;
  setHasUnsavedChanges: React.Dispatch<React.SetStateAction<boolean>>;
  costCodeUIState: "idle" | "creating" | "editing";
  setCostCodeUIState: React.Dispatch<
    React.SetStateAction<"idle" | "creating" | "editing">
  >;
  tagSummaries: TagSummary[];
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
  refreshCostCodes,
  loading = false,
  isRegistrationGroupFormOpen,
  setIsRegistrationGroupFormOpen,
  setHasUnsavedChanges,
  costCodeUIState,
  setCostCodeUIState,
  tagSummaries,
}) => {
  const costCodeFormHook = useCostCodeForm({
    selectCostCode,
    setSelectCostCode,
    setHasUnsavedChanges,
    setIsRegistrationFormOpen,
    refreshCostCodes,
  });

  return (
    <>
      {loading ? (
        <Holds
          background={"white"}
          className="w-full h-full col-start-3 col-end-7 sm:col-end-11 md:col-end-11 lg:col-end-11 xl:col-end-7 flex justify-center items-center animate-pulse"
        >
          <Spinner size={50} />
        </Holds>
      ) : costCodeUIState === "creating" ? (
        <Holds className="w-full h-full col-start-3 col-end-7 sm:col-end-11 md:col-end-11 lg:col-end-11 xl:col-end-7">
          <CostCodeRegistrationView
            onSubmit={costCodeFormHook.handleNewCostCodeSubmit}
            onCancel={() => {
              setCostCodeUIState("idle");
              setHasUnsavedChanges(false);
            }}
            setHasUnsavedChanges={setHasUnsavedChanges}
          />
        </Holds>
      ) : costCodeUIState === "editing" && costCodeFormHook.formData ? (
        <Holds className="w-full h-full col-start-3 col-end-7 sm:col-end-11 md:col-end-11 lg:col-end-11 xl:col-end-7">
          <CostCodeFormView
            formData={costCodeFormHook.formData}
            changedFields={costCodeFormHook.changedFields}
            onInputChange={costCodeFormHook.handleInputChange}
            onRevertField={costCodeFormHook.handleRevertField}
            onRegisterNew={() => {
              setCostCodeUIState("creating");
              setSelectCostCode(null);
            }}
            onDiscardChanges={costCodeFormHook.handleDiscardChanges}
            onSaveChanges={costCodeFormHook.handleSaveChanges}
            hasUnsavedChanges={costCodeFormHook.hasUnsavedChanges}
            isSaving={costCodeFormHook.isSaving}
            successfullyUpdated={costCodeFormHook.successfullyUpdated}
            isDeleting={costCodeFormHook.isDeleting}
            onDeleteCostCode={costCodeFormHook.handleDeleteCostCode}
            error={costCodeFormHook.error}
            tagSummaries={tagSummaries}
          />
        </Holds>
      ) : costCodeUIState === "idle" ? (
        <Holds className="w-full h-full col-start-3 col-end-11">
          <CostCodeEmptyState
            onRegisterNew={() => setCostCodeUIState("creating")}
            onRegisterNewGroup={() => setIsRegistrationGroupFormOpen(true)}
          />
        </Holds>
      ) : null}
    </>
  );
};

export default CostCodeMainContent;
