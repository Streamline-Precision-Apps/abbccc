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
  onDeleteGroup?: () => Promise<{ success: boolean; error?: string }>;
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
  onDeleteCostCode: () => Promise<TagOperationResult>;
  tagSummaries: TagSummary[];
}

export default function TagsFormView({
  formData,
  onDeleteGroup,
  onDiscardChanges,
  onSaveChanges,
  onInputChange,
  onRegisterNew,
  onToggleCostCode,
}: TagsFormViewProps) {
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const numberOfCostCodes = formData?.CostCodes?.length || 0;

  // Handle the delete button click
  const handleDeleteClick = useCallback(() => {
    setDeleteError(null);
    setShowDeleteModal(true);
  }, []);

  // Handle confirming deletion
  const handleDeleteConfirm = useCallback(async () => {
    if (!onDeleteGroup) return;

    setIsDeleting(true);
    const result = await onDeleteGroup();
    setIsDeleting(false);

    if (!result.success) {
      setDeleteError(result.error || "Failed to delete group");
    } else {
      setShowDeleteModal(false);
    }
  }, [onDeleteGroup]);

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
      setTimeout(() => setSuccessMessage(null), 3000);
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
            <Holds className="absolute top-0 left-0 w-full h-full flex justify-center items-center">
              <Texts size="sm">{successMessage}</Texts>
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
              className="w-full text-sm"
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
                    <Buttons
                      shadow="none"
                      background={"none"}
                      className="w-fit h-auto text-red-500"
                      onClick={() =>
                        onToggleCostCode &&
                        onToggleCostCode(costCode.id, costCode.name)
                      }
                    >
                      <Texts size="p6" className="text-red-500">
                        Remove
                      </Texts>
                    </Buttons>
                  </Holds>
                ))
              ) : (
                <Holds className="w-full h-full flex justify-center items-center">
                  <Texts size="p6" className="text-gray-500">
                    No cost codes available
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
        itemType="group"
      />
    </Holds>
  );
}
