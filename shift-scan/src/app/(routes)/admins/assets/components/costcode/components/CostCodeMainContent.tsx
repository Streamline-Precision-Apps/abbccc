"use client";
import React, { Dispatch, SetStateAction, useState, useCallback } from "react";
import { Grids } from "@/components/(reusable)/grids";
import { Holds } from "@/components/(reusable)/holds";
import { CostCode, Tag, TagSummary, CostCodeSummary } from "../../../types";
import Spinner from "@/components/(animations)/spinner";
import {
  CostCodeHeaderActions,
  CostCodeFormView,
  CostCodeRegistrationView,
  CostCodeEmptyState,
  useCostCodeForm,
} from "../index";
import TagsFormView from "./TagsFormView";
import TagsRegistrationView from "./TagRegistrationView";
import { useTagsForm } from "../hooks/useTagsForm";
import { useTagCreation } from "../hooks/useTagCreation";
import DiscardChangesModal from "../../shared/DiscardChangesModal";
import DeleteConfirmationModal from "../../shared/DeleteConfirmationModal";

interface CostCodeMainContentProps {
  /** Assets data */
  assets: string;
  /** Currently selected cost code */
  selectCostCode: CostCode | null;
  /** Handler to set selected cost code */
  setSelectCostCode: Dispatch<SetStateAction<CostCode | null>>;
  /** Function to refresh cost code list */
  refreshCostCodes: () => Promise<void>;
  /** Function to refresh tags list */
  refreshTags?: () => Promise<void>;
  /** Cost code loading state */
  CostCodeLoading: boolean;
  /** Tag loading state */
  TagLoading: boolean;
  /** Handler to set selected tag */
  setSelectTag: React.Dispatch<React.SetStateAction<Tag | null>>;
  /** Setter for unsaved changes state */
  setHasUnsavedChanges: React.Dispatch<React.SetStateAction<boolean>>;
  /** Current UI state */
  costCodeUIState:
    | "idle"
    | "creating"
    | "editing"
    | "editingGroups"
    | "creatingGroups";
  /** UI state setter */
  setCostCodeUIState: React.Dispatch<
    React.SetStateAction<
      "idle" | "creating" | "editing" | "editingGroups" | "creatingGroups"
    >
  >;
  /** Available tag summaries */
  tagSummaries: TagSummary[];
  /** Tag form hook */
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
  /** Success message from tag deletion */
  deletionSuccessMessage: string | null;
  handleDeletionSuccess: (message: string) => void;
}

/**
 * Main content component for cost code management.
 * Handles cost code viewing, editing, and registration using decomposed components.
 *
 * This component follows the pattern of JobsiteMainContent and EquipmentMainContent for consistency.
 *
 * @param props - The component props
 * @returns JSX element containing the appropriate view based on current state
 */
export default function CostCodeMainContent({
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
  deletionSuccessMessage,
  handleDeletionSuccess,
}: CostCodeMainContentProps) {
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  // Get the cost code form hook with all handlers
  const costCodeFormHook = useCostCodeForm({
    selectCostCode,
    setSelectCostCode,
    setHasUnsavedChanges,
    refreshCostCodes,
    setCostCodeUIState,
    onDeletionSuccess: handleDeletionSuccess,
  });

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
      if (onCreationHandlersReady) {
        onCreationHandlersReady(handlers);
      }
    },
    [onCreationHandlersReady]
  );

  const onCancel = useCallback(() => {
    setCostCodeUIState("idle");
    setSelectTag(null);
  }, [setCostCodeUIState, setSelectTag]);

  const tagCreation = useTagCreation({
    refreshTags,
    onCancel,
  });

  // Handle opening registration form
  const handleOpenRegistration = () => {
    setCostCodeUIState("creating");
    setSelectCostCode(null);
  };

  const handleConfirmDiscard = () => {
    setShowConfirmModal(false);
    setCostCodeUIState("idle");
  };

  const handleCancelDiscard = () => {
    setShowConfirmModal(false);
  };

  // Show loading indicator when data is being fetched
  if (CostCodeLoading || TagLoading) {
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
      {costCodeUIState === "creating" ? (
        <CostCodeRegistrationView
          setHasUnsavedChanges={setHasUnsavedChanges}
          tagSummaries={tagSummaries}
          refreshCostCodes={refreshCostCodes}
        />
      ) : costCodeUIState === "editing" &&
        selectCostCode &&
        costCodeFormHook.formData ? (
        <Holds className="w-full h-full col-span-4">
          <Grids className="w-full h-full grid-rows-[40px_1fr] gap-4">
            <CostCodeHeaderActions
              hasUnsavedChanges={costCodeFormHook.hasUnsavedChanges}
              isSaving={costCodeFormHook.isSaving}
              successfullyUpdated={costCodeFormHook.successfullyUpdated}
              onRegisterNew={handleOpenRegistration}
              onDiscardChanges={costCodeFormHook.handleDiscardChanges}
              onSaveChanges={costCodeFormHook.handleSaveChanges}
              onDeleteCostCode={costCodeFormHook.handleDeleteCostCode}
            />

            <CostCodeFormView
              formData={costCodeFormHook.formData}
              changedFields={costCodeFormHook.changedFields}
              onInputChange={costCodeFormHook.handleInputChange}
              onRevertField={costCodeFormHook.handleRevertField}
              onRegisterNew={handleOpenRegistration}
              onDiscardChanges={costCodeFormHook.handleDiscardChanges}
              onSaveChanges={costCodeFormHook.handleSaveChanges}
              hasUnsavedChanges={costCodeFormHook.hasUnsavedChanges}
              isSaving={costCodeFormHook.isSaving}
              successfullyUpdated={costCodeFormHook.successfullyUpdated}
              isDeleting={costCodeFormHook.isDeleting}
              onDeleteCostCode={costCodeFormHook.handleDeleteCostCode}
              error={costCodeFormHook.error}
              tagSummaries={tagSummaries}
              closeForm={() => {
                setCostCodeUIState("idle");
                setSelectCostCode(null);
                setHasUnsavedChanges(false);
              }}
            />
          </Grids>
        </Holds>
      ) : costCodeUIState === "idle" ? (
        <Holds className="w-full h-full col-span-8">
          <CostCodeEmptyState
            onRegisterNew={handleOpenRegistration}
            onRegisterNewGroup={() => setCostCodeUIState("creatingGroups")}
            error={tagCreation.error}
            successMessage={deletionSuccessMessage || null}
          />
        </Holds>
      ) : costCodeUIState === "editingGroups" ? (
        <Holds className="w-full h-full col-span-4">
          <TagsFormView
            formData={tagFormHook.formData}
            onDeleteTag={tagFormHook.handleDeleteTag}
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
            setCostCodeUIState={setCostCodeUIState}
            closeForm={() => {
              setCostCodeUIState("idle");
              setSelectCostCode(null);
              setHasUnsavedChanges(false);
              setSelectTag(null);
            }}
          />
        </Holds>
      ) : costCodeUIState === "creatingGroups" ? (
        <TagsRegistrationView
          onCreationHookReady={handleCreationHookReady}
          tagCreation={tagCreation}
          closeForm={() => {
            setCostCodeUIState("idle");
            setHasUnsavedChanges(false);
          }}
        />
      ) : null}

      <DiscardChangesModal
        isOpen={showConfirmModal}
        confirmDiscardChanges={handleConfirmDiscard}
        cancelDiscard={handleCancelDiscard}
        message="You have unsaved changes. Are you sure you want to discard them?"
      />

      <DeleteConfirmationModal
        isOpen={costCodeFormHook.showDeleteConfirmModal}
        itemName={costCodeFormHook.formData?.name || ""}
        itemType="cost code"
        onConfirm={costCodeFormHook.confirmDeleteCostCode}
        onCancel={() => costCodeFormHook.setShowDeleteConfirmModal(false)}
      />
    </>
  );
}

// Export removed as we now use export default in the function declaration
