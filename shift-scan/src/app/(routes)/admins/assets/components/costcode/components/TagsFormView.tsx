"use client";
import React, { useState, useCallback } from "react";
import { Buttons } from "@/components/(reusable)/buttons";
import { Grids } from "@/components/(reusable)/grids";
import { Holds } from "@/components/(reusable)/holds";
import { Inputs } from "@/components/(reusable)/inputs";
import { TextAreas } from "@/components/(reusable)/textareas";
import { Texts } from "@/components/(reusable)/texts";
import { CostCode, Tag, TagSummary } from "../../../types";
import DeleteConfirmationModal from "../../shared/DeleteConfirmationModal";
import Spinner from "@/components/(animations)/spinner";
import { TagOperationResult } from "../hooks/useTagsForm";

interface TagsFormViewProps {
  formData?: Tag | null;
  costCodes?: CostCode[];
  onDiscardChanges?: () => void;
  onSaveChanges?: () => Promise<{ success: boolean; error?: string }>;
  onToggleCostCode?: (costCodeId: string, costCodeName: string) => void;
  onInputChange: (
    fieldName: keyof Tag,
    value: string | Array<{ id: string; name: string }>
  ) => void;
  changedFields: Set<keyof Tag>;
  onRevertField: (fieldName: keyof Tag) => void;
  onRegisterNew: () => void;
  hasUnsavedChanges: boolean;
  isSaving: boolean;
  successfullyUpdated: boolean;
  isDeleting: boolean;
  error: string | null;
  onDeleteTag: () => Promise<TagOperationResult>;
  tagSummaries: TagSummary[];
  setCostCodeUIState: React.Dispatch<
    React.SetStateAction<
      "idle" | "creating" | "editing" | "editingGroups" | "creatingGroups"
    >
  >;
}

export default function TagsFormView({
  formData,
  onDeleteTag,
  onDiscardChanges,
  onSaveChanges,
  onInputChange,
  onRegisterNew,
  onToggleCostCode,
  setCostCodeUIState,
}: TagsFormViewProps) {
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const numberOfCostCodes = formData?.CostCodes?.length || 0;

  // Handle the delete button click
  const handleDeleteClick = useCallback(() => {
    setDeleteError(null);
    setShowDeleteModal(true);
  }, []);

  // Handle confirming deletion
  const handleDeleteConfirm = useCallback(async () => {
    if (!onDeleteTag) return;

    setIsDeleting(true);
    const result = await onDeleteTag();
    setIsDeleting(false);

    if (!result.success) {
      setDeleteError(result.error || "Failed to delete Tag");
      setTimeout(() => setDeleteError(null), 3000);
      console.error("Error deleting Tag:", result.error);
      return;
    }
    setShowDeleteModal(false);
    setCostCodeUIState("idle");
  }, [onDeleteTag]);

  // Handle cancelling deletion
  const handleDeleteCancel = useCallback(() => {
    setShowDeleteModal(false);
    setDeleteError(null);
  }, []);

  // Handle saving changes
  const handleSaveChanges = useCallback(async () => {
    if (!onSaveChanges) return;

    setIsSaving(true);
    const result = await onSaveChanges();
    setIsSaving(false);

    if (result.success) {
      setSuccessMessage("Changes saved successfully!");
      setTimeout(() => {
        setSuccessMessage(null);
        setCostCodeUIState("idle");
      }, 3000);
    }
    if (result.error) {
      setError(result.error);
      setTimeout(() => setError(null), 3000);
      console.error("Error saving changes:", result.error);
    }
  }, [onSaveChanges]);

  return (
    <Holds className="w-full h-full">
      <Grids className="w-full h-full grid-rows-[40px_200px_1fr] gap-4">
        <Holds
          position={"row"}
          background="white"
          className="w-full h-full flex justify-between p-4 items-center relative"
        >
          {successMessage && (
            <Holds
              background={"green"}
              className="absolute top-0 left-0 w-full h-full flex justify-center items-center"
            >
              <Texts size="sm">{successMessage}</Texts>
            </Holds>
          )}
          {error && (
            <Holds
              background={"red"}
              className="w-full h-full justify-center absolute left-0 top-0 z-50"
            >
              <Texts size="sm">{error}</Texts>
            </Holds>
          )}
          <Buttons
            shadow="none"
            background={"none"}
            className="w-fit h-auto"
            onClick={onRegisterNew}
          >
            <Texts size="sm" text="link">
              Create New Group
            </Texts>
          </Buttons>

          <Buttons
            shadow="none"
            background={"none"}
            className="w-fit h-auto"
            onClick={handleDeleteClick}
          >
            <Texts size="sm" text="link">
              {isDeleting ? <Spinner size={20} /> : "Delete Group"}
            </Texts>
          </Buttons>

          <Buttons
            shadow="none"
            background={"none"}
            className="w-fit h-auto"
            onClick={onDiscardChanges}
          >
            <Texts size="sm" text="link">
              Discard Changes
            </Texts>
          </Buttons>

          <Buttons
            shadow="none"
            background={"none"}
            className="w-fit h-auto"
            onClick={handleSaveChanges}
          >
            <Texts size="sm" text="link">
              {isSaving ? <Spinner size={20} /> : "Save Changes"}
            </Texts>
          </Buttons>
        </Holds>

        <Holds background="white" className="w-full h-full p-4 gap-4">
          <Holds className="">
            <label htmlFor="name" className="text-sm font-medium">
              Group Name
            </label>
            <Inputs
              id="name"
              name="name"
              value={formData?.name || ""}
              onChange={(e) => onInputChange("name", e.target.value)}
              className="w-1/2 text-sm"
            />
          </Holds>

          <Holds className="">
            <label htmlFor="description" className="text-sm font-medium">
              Group Description
            </label>
            <TextAreas
              id="description"
              name="description"
              value={formData?.description || ""}
              onChange={(e) => onInputChange("description", e.target.value)}
              className="w-full text-sm"
              style={{ resize: "none" }}
            />
          </Holds>
        </Holds>

        <Holds
          background="white"
          className="w-full h-full p-4 overflow-auto no-scrollbar"
        >
          <Grids className="w-full h-full grid-rows-[30px_1fr] gap-1">
            <Holds position={"row"} className="w-full h-full justify-between">
              <Texts position={"left"} size="md" className="font-medium">
                Cost Codes in Group
              </Texts>
              <Texts position={"right"} size="md">
                Cost Codes Count: <span>{numberOfCostCodes}</span>
              </Texts>
            </Holds>
            <Holds className="w-full h-full rounded-[10px] border-black border-[3px] p-4 overflow-auto no-scrollbar">
              {formData?.CostCodes && formData.CostCodes.length ? (
                formData.CostCodes.map((costCode) => (
                  <Holds
                    key={costCode.id}
                    className="flex justify-between items-center pb-2 border-b last:border-b-0"
                  >
                    <Holds className="flex gap-2">
                      <Texts position={"left"} size="p6">
                        {costCode.name}
                      </Texts>
                    </Holds>
                  </Holds>
                ))
              ) : (
                <Holds className="text-center justify-center items-center w-full h-full">
                  <Texts size="md" className="text-gray-500">
                    No cost codes selected
                  </Texts>
                  <Texts size="sm" className="text-gray-400 mt-2">
                    Use the sidebar to select cost codes for this group
                  </Texts>
                </Holds>
              )}
            </Holds>
          </Grids>
        </Holds>
      </Grids>

      <DeleteConfirmationModal
        isOpen={showDeleteModal}
        onConfirm={handleDeleteConfirm}
        onCancel={handleDeleteCancel}
        itemName={formData?.name || "this group"}
        itemType=""
      />
    </Holds>
  );
}
