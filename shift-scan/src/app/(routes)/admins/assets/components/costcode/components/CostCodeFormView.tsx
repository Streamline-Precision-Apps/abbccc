"use client";
import React, { useState, useCallback, useMemo } from "react";
import { Buttons } from "@/components/(reusable)/buttons";
import { Grids } from "@/components/(reusable)/grids";
import { Holds } from "@/components/(reusable)/holds";
import { Texts } from "@/components/(reusable)/texts";
import CostCodeBasicFields from "./CostCodeBasicFields";
import DeleteCostCodeModal from "./DeleteCostCodeModal";
import { Titles } from "@/components/(reusable)/titles";
import { CostCodeFormViewProps } from "../types";
import { formatCostCodeName } from "../utils/formatters";

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
  hasUnsavedChanges,
  isSaving,
  isDeleting,
  successfullyUpdated,
  error,
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
   * Handles the save changes operation with proper error handling
   */
  const handleSaveChanges = useCallback(async () => {
    try {
      const result = await onSaveChanges();
      if (!result.success) {
        setSuccessfullyEdited(false);
        return;
      }
      setSuccessfullyEdited(true);
      setTimeout(() => setSuccessfullyEdited(false), 3000);
    } catch (error) {
      console.error("Error saving cost code:", error);
      setSuccessfullyEdited(false);
    }
  }, [onSaveChanges]);

  return (
    <Grids className="w-full h-full grid-rows-[40px_1fr] gap-4 ">
      <Holds
        position={"row"}
        background={"white"}
        className="w-full h-full gap-4 px-[5%] relative"
      >
        {successfullyEdited && (
          <Holds
            background={"green"}
            className="w-full h-full justify-center absolute left-0 top-0 z-50"
          >
            <Texts size="sm"> Cost Code successfully updated!</Texts>
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

        <Holds position={"row"} className="w-full justify-between">
          <Buttons
            background={"none"}
            shadow={"none"}
            onClick={onRegisterNew}
            disabled={hasUnsavedChanges}
            className="w-fit h-auto "
          >
            <Texts
              size="xs"
              text="link"
              className={hasUnsavedChanges ? "text-app-dark-gray" : ""}
            >
              Register New
            </Texts>
          </Buttons>

          <Buttons
            background={"none"}
            shadow={"none"}
            onClick={handleSaveChanges}
            disabled={isSaving || !hasUnsavedChanges}
            className="w-fit h-auto "
          >
            <Texts
              size="xs"
              text="link"
              className={hasUnsavedChanges ? "" : "text-app-dark-gray"}
            >
              {isSaving ? "Saving..." : "Save Changes"}
            </Texts>
          </Buttons>
          <Buttons
            background={"none"}
            shadow={"none"}
            onClick={hasUnsavedChanges ? onDiscardChanges : undefined}
            disabled={isSaving || !hasUnsavedChanges}
            className="w-fit h-auto "
          >
            <Texts
              size="xs"
              text="link"
              className={hasUnsavedChanges ? "" : "text-app-dark-gray"}
            >
              {"Discard Changes"}
            </Texts>
          </Buttons>
          <Buttons
            background={"none"}
            shadow={"none"}
            onClick={handleDeleteClick}
            disabled={hasUnsavedChanges || isDeleting}
            className="w-fit h-auto "
          >
            <Texts size="xs" text="link">
              {isDeleting ? "Deleting..." : "Delete"}
            </Texts>
          </Buttons>
        </Holds>
      </Holds>
      <Holds background={"white"} className="w-full h-full">
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
              <Holds className="h-full border-[3px] border-black p-3 rounded-[10px] mb-3"></Holds>
            </Holds>
          </Grids>
        </Grids>
      </Holds>

      {successfullyUpdated && (
        <Holds className="mt-4 bg-green-100 p-2 rounded-md">
          <Texts size="xs" text="green">
            Cost code updated successfully
          </Texts>
        </Holds>
      )}

      {deleteError && (
        <Holds className="mt-4 bg-red-100 p-2 rounded-md">
          <Texts size="xs" text="red">
            {deleteError}
          </Texts>
        </Holds>
      )}

      <DeleteCostCodeModal
        isOpen={showDeleteModal}
        onClose={handleDeleteCancel}
        onDelete={handleDeleteConfirm}
        costCodeName={formData.name}
        isDeleting={isDeleting}
      />
    </Grids>
  );
}

// Export as memoized component to prevent unnecessary re-renders
export default React.memo(CostCodeFormView);
