"use client";
import React, { useState, useCallback, useMemo, useEffect } from "react";
import { Buttons } from "@/components/(reusable)/buttons";
import { Grids } from "@/components/(reusable)/grids";
import { Holds } from "@/components/(reusable)/holds";
import { Texts } from "@/components/(reusable)/texts";
import CostCodeBasicFields from "./CostCodeBasicFields";
import DeleteConfirmationModal from "../../shared/DeleteConfirmationModal";
import { Titles } from "@/components/(reusable)/titles";
import { CostCodeFormViewProps } from "../types";
import { formatCostCodeName } from "../utils/formatters";
import { CheckBox } from "@/components/(inputs)/checkBox";
import LocaleToggleSwitch from "@/components/(inputs)/toggleSwitch";
import { Tag, TagSummary } from "../../../types";
import Spinner from "@/components/(animations)/spinner";

/**
 * Main form view for cost code editing
 * Includes all form sections and action buttons
 *
 * @param props The component props from CostCodeFormViewProps interface
 * @returns A form view component for cost code editing
 */
function CostCodeFormView({
  formData,
  changedFields,
  onInputChange,
  onRevertField,
  onRegisterNew,
  onDiscardChanges,
  onSaveChanges,
  onDeleteCostCode,
  closeForm,
  hasUnsavedChanges,
  isSaving,
  isDeleting,
  successfullyUpdated,
  error,
  tagSummaries,
}: CostCodeFormViewProps) {
  const [successfullyEdited, setSuccessfullyEdited] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  // Format the cost code display name using utility function
  const formattedCostCodeName = useMemo(() => {
    if (!formData.name) return "Cost Code Information";
    return formatCostCodeName(formData.name);
  }, [formData.name]);

  // Memoized handlers to avoid unnecessary re-renders
  const handleDeleteClick = useCallback(() => {
    setDeleteError(null);
    setShowDeleteModal(true);
  }, []);

  const handleDeleteConfirm = useCallback(async () => {
    const result = await onDeleteCostCode();
    if (!result.success) {
      setDeleteError(result.error || "Failed to delete cost code");
    } else {
      setShowDeleteModal(false);
    }
  }, [onDeleteCostCode]);

  const handleDeleteCancel = useCallback(() => {
    setShowDeleteModal(false);
    setDeleteError(null);
  }, []);

  /**
   * Handles toggling a tag for the cost code
   *
   * @param tagId The ID of the tag to toggle
   * @param tagName The name of the tag (for creating the tag object)
   */
  const handleTagToggle = useCallback(
    (tagId: string, tagName: string) => {
      // Get the current CCTags array or initialize empty if undefined
      const currentTags = formData.CCTags || [];

      // Check if the tag is already assigned
      const tagIndex = currentTags.findIndex((tag) => tag.id === tagId);

      // Create a new array of tags based on the toggle action
      const newTags =
        tagIndex >= 0
          ? // Remove the tag if it exists
            [
              ...currentTags.slice(0, tagIndex),
              ...currentTags.slice(tagIndex + 1),
            ]
          : // Add the tag if it doesn't exist
            [...currentTags, { id: tagId, name: tagName }];

      // Update the form data with the new tags array
      onInputChange("CCTags", newTags);
    },
    [formData.CCTags, onInputChange]
  );

  return (
    <Holds background={"white"} className="w-full h-full relative">
      {isDeleting && (
        <Holds
          background={"white"}
          className="absolute w-full h-full animate-pulse bg-opacity-80 z-50 flex flex-col items-center justify-center rounded-[10px]"
        >
          <Spinner size={100} />
        </Holds>
      )}
      <Grids className="w-full h-full grid-rows-[50px_1fr] p-4">
        <Holds className="w-full h-full">
          <Titles position="left" size="h5" className="font-bold mb-2">
            {formattedCostCodeName}
          </Titles>
        </Holds>

        <Grids
          cols="2"
          gap="4"
          className="w-full h-full bg-white rounded-[10px]"
        >
          <Holds className="col-span-1 h-full">
            <CostCodeBasicFields
              formData={formData}
              changedFields={changedFields}
              onInputChange={onInputChange}
              onRevertField={onRevertField}
            />
          </Holds>

          <Holds className="col-span-1 h-full">
            {/* Cost Code Groups Section - Placeholder for future implementation */}
            <Texts position={"left"} size="xs" className="font-bold mb-2">
              Cost Code Groups
            </Texts>
            <Holds className="h-full border-[3px] border-black p-3 rounded-[10px]">
              {tagSummaries.map((tag, index) => (
                <Holds
                  position={"row"}
                  key={index}
                  className="w-full gap-3 mt-2 first:mt-0"
                >
                  <Holds
                    background={"lightBlue"}
                    className="w-full h-[40px] rounded-[10px] flex items-center justify-center"
                  >
                    <Titles size="md">{tag.name}</Titles>
                  </Holds>

                  <Holds className="w-fit h-fit justify-center items-center">
                    <CheckBox
                      shadow={false}
                      checked={
                        Array.isArray(formData.CCTags)
                          ? formData.CCTags.some((cc) => cc.id === tag.id)
                          : false
                      }
                      onChange={() => handleTagToggle(tag.id, tag.name)}
                      id={tag.id}
                      name={tag.name}
                      height={35}
                      width={35}
                    />
                  </Holds>
                </Holds>
              ))}
            </Holds>
          </Holds>
        </Grids>
      </Grids>
      <DeleteConfirmationModal
        isOpen={showDeleteModal}
        onCancel={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        itemName={formData.name}
        itemType="cost code"
      />
    </Holds>
  );
}

// Export as memoized component to prevent unnecessary re-renders
export default React.memo(CostCodeFormView);
