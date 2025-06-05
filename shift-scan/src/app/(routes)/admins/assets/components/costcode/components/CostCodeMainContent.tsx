"use client";
import React, { Dispatch, SetStateAction, useState, useCallback } from "react";
import { Holds } from "@/components/(reusable)/holds";
import { CostCode, Tag, TagSummary, CostCodeSummary } from "../../../types";
import Spinner from "@/components/(animations)/spinner";
import CostCodeEmptyState from "./CostCodeEmptyState";
import CostCodeFormView from "./CostCodeFormView";
import CostCodeRegistrationView from "./CostCodeRegistrationView";
import { useCostCodeForm } from "../hooks/useCostCodeForm";
import TagsFormView from "./TagsFormView";
import TagsRegistrationView from "./TagRegistrationView";
import { useTagsForm } from "../hooks/useTagsForm";

interface CostCodeMainContentProps {
  assets: string;
  selectCostCode: CostCode | null;
  setSelectCostCode: Dispatch<SetStateAction<CostCode | null>>;
  refreshCostCodes: () => Promise<void>;
  refreshTags?: () => Promise<void>;
  CostCodeLoading: boolean;
  TagLoading: boolean;
  setSelectTag: React.Dispatch<React.SetStateAction<Tag | null>>;
  setHasUnsavedChanges: React.Dispatch<React.SetStateAction<boolean>>;
  costCodeUIState:
    | "idle"
    | "creating"
    | "editing"
    | "editingGroups"
    | "creatingGroups";
  setCostCodeUIState: React.Dispatch<
    React.SetStateAction<
      "idle" | "creating" | "editing" | "editingGroups" | "creatingGroups"
    >
  >;
  tagSummaries: TagSummary[];
  tagFormHook: ReturnType<typeof useTagsForm>;
  /** Callback to get creation handlers when in creation mode */
  onCreationHandlersReady?: (handlers: {
    handleCostCodeToggle: (costCodeId: string, costCodeName: string) => void;
    handleCostCodeToggleAll: (
      costCodes: CostCodeSummary[],
      selectAll: boolean
    ) => void;
    formData: { costCodes: Array<{ id: string; name: string }> };
  }) => void;
}

/**
 * Main content component for cost code management.
 * Handles cost code viewing, editing, and registration.
 */
const CostCodeMainContent: React.FC<CostCodeMainContentProps> = ({
  selectCostCode,
  setSelectCostCode,
  refreshCostCodes,
  refreshTags,
  CostCodeLoading,
  TagLoading,
  setHasUnsavedChanges,
  costCodeUIState,
  setCostCodeUIState,
  tagSummaries,
  setSelectTag,
  tagFormHook,
  onCreationHandlersReady,
}) => {
  // State to store creation handlers when in creation mode
  const [creationHandlers, setCreationHandlers] = useState<{
    handleCostCodeToggle: (costCodeId: string, costCodeName: string) => void;
    handleCostCodeToggleAll: (
      costCodes: CostCodeSummary[],
      selectAll: boolean
    ) => void;
    formData: { costCodes: Array<{ id: string; name: string }> };
  } | null>(null);

  // Handle creation hook readiness
  const handleCreationHookReady = useCallback(
    (handlers: {
      handleCostCodeToggle: (costCodeId: string, costCodeName: string) => void;
      handleCostCodeToggleAll: (
        costCodes: CostCodeSummary[],
        selectAll: boolean
      ) => void;
      formData: { costCodes: Array<{ id: string; name: string }> };
    }) => {
      setCreationHandlers(handlers);
      if (onCreationHandlersReady) {
        onCreationHandlersReady(handlers);
      }
    },
    [onCreationHandlersReady]
  );
  const costCodeFormHook = useCostCodeForm({
    selectCostCode,
    setSelectCostCode,
    setHasUnsavedChanges,
    refreshCostCodes,
  });

  return (
    <>
      {CostCodeLoading || TagLoading ? (
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
            onRegisterNewGroup={() => setCostCodeUIState("creatingGroups")}
          />
        </Holds>
      ) : costCodeUIState === "editingGroups" ? (
        <Holds className="w-full h-full col-start-3 col-end-7 sm:col-end-11 md:col-end-11 lg:col-end-11 xl:col-end-7">
          <TagsFormView
            formData={tagFormHook.formData}
            onDeleteCostCode={tagFormHook.handleDeleteTag}
            onSaveChanges={tagFormHook.handleSaveChanges}
            onDiscardChanges={tagFormHook.handleDiscardChanges}
            onRevertField={tagFormHook.handleRevertField}
            onInputChange={tagFormHook.handleInputChange}
            onToggleCostCode={tagFormHook.handleCostCodeToggle}
            hasUnsavedChanges={tagFormHook.hasUnsavedChanges}
            changedFields={tagFormHook.changedFields}
            isSaving={tagFormHook.isSaving}
            successfullyUpdated={tagFormHook.successfullyUpdated}
            isDeleting={tagFormHook.isDeleting}
            error={tagFormHook.error}
            onRegisterNew={() => {
              setCostCodeUIState("creatingGroups");
              setSelectTag(null);
            }}
            tagSummaries={tagSummaries}
          />
        </Holds>
      ) : costCodeUIState === "creatingGroups" ? (
        <Holds className="w-full h-full col-start-3 col-end-7 sm:col-end-11 md:col-end-11 lg:col-end-11 xl:col-end-7">
          <TagsRegistrationView
            refreshTags={refreshTags}
            onCancel={() => {
              setCostCodeUIState("idle");
              setSelectTag(null);
            }}
            onCreationHookReady={handleCreationHookReady}
          />
        </Holds>
      ) : null}
    </>
  );
};

export default CostCodeMainContent;
