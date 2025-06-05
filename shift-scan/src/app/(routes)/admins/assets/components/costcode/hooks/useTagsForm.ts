"use client";
import { useState, useEffect, useMemo, useCallback } from "react";
import { CostCode, CostCodeSummary, Tag } from "../../../types";
import { form } from "@nextui-org/theme";
import { set } from "date-fns";
import { deleteTag, updateTags } from "@/actions/AssetActions";

/**
 * Props for the useTagsForm hook
 */
export interface UseTagsFormProps {
  /** The currently selected tag or null if none is selected */
  selectTag: Tag | null;
  /** Function to update the selected tag */
  setSelectTag: React.Dispatch<React.SetStateAction<Tag | null>>;
  /** Function to update whether there are unsaved changes */
  setHasUnsavedChanges: React.Dispatch<React.SetStateAction<boolean>>;
  /** Function to refresh the list of tags */
  refreshTags?: () => Promise<void>;
  /** Callback for deletion success */
  onDeletionSuccess?: (message: string) => void;
}

/**
 * Result type for tag operations like save, create, delete
 */
export interface TagOperationResult {
  success: boolean;
  error?: string;
}
/**
 * Data structure for creating a new tag
 */
export interface NewTagData {
  name: string;
  description: string;
  CostCodes?: Array<{ id: string; name: string }>;
}

/**
 * Custom hook for managing tag form data and operations
 */
export interface UseTagsFormReturn {
  formData: Tag | null;
  changedFields: Set<keyof Tag>;
  hasUnsavedChanges: boolean;
  error: string | null;
  isSaving: boolean;
  isDeleting: boolean;
  successfullyUpdated: boolean;
  handleInputChange: (
    fieldName: keyof Tag,
    value: string | Array<{ id: string; name: string }>
  ) => void;
  handleSaveChanges: () => Promise<TagOperationResult>;
  handleDiscardChanges: () => void;
  handleRevertField: (fieldName: keyof Tag) => void;
  handleDeleteTag: () => Promise<TagOperationResult>;
  handleCostCodeToggle: (costCodeId: string, costCodeName: string) => void;
  handleCostCodeToggleAll: (
    costCodes: CostCodeSummary[],
    selectAll: boolean
  ) => void;
}

/**
 * Custom hook for managing tag form state
 * Handles form data, changes tracking, saving, and reverting
 *
 * @param props - Configuration props for the hook
 * @returns Object containing form state and handler functions
 */
export function useTagsForm({
  selectTag,
  setSelectTag,
  setHasUnsavedChanges,
  refreshTags,
  onDeletionSuccess,
}: UseTagsFormProps): UseTagsFormReturn {
  const [formData, setFormData] = useState<Tag | null>(null);
  const [originalData, setOriginalData] = useState<Tag | null>(null);
  const [changedFields, setChangedFields] = useState<Set<keyof Tag>>(new Set());
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const [successfullyUpdated, setSuccessfullyUpdated] =
    useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Initialize form data when selected tag changes
  useEffect(() => {
    if (selectTag) {
      setFormData({ ...selectTag });
      setOriginalData({ ...selectTag });
      setChangedFields(new Set());
      setSuccessfullyUpdated(false);
    } else {
      setFormData(null);
      setOriginalData(null);
      setChangedFields(new Set());
    }
  }, [selectTag]);

  // Memoized calculation of whether there are unsaved changes
  const hasUnsavedChanges = useMemo(
    () => changedFields.size > 0,
    [changedFields]
  );

  // Notify parent component about unsaved changes
  useEffect(() => {
    setHasUnsavedChanges(hasUnsavedChanges);
  }, [hasUnsavedChanges, setHasUnsavedChanges]);

  /**
   * Updates form data when a field is changed and tracks the change
   *
   * @param fieldName - The name of the field being changed
   * @param value - The new value for the field (string or array of cost code objects)
   */
  const handleInputChange = useCallback(
    (
      fieldName: keyof Tag,
      value: string | Array<{ id: string; name: string }>
    ): void => {
      setSuccessfullyUpdated(false);

      if (!formData || !originalData) return;

      const newFormData = { ...formData, [fieldName]: value };
      setFormData(newFormData);

      // Track changed fields by comparing with original data
      const newChangedFields = new Set(changedFields);

      let hasChanged = false;

      if (fieldName === "CostCodes") {
        const originalCostCodes = (originalData.CostCodes || []) as Array<{
          id: string;
          name: string;
        }>;
        const newCostCodes = (value || []) as Array<{
          id: string;
          name: string;
        }>;

        if (originalCostCodes.length !== newCostCodes.length) {
          hasChanged = true;
        } else {
          const originalIds = new Set(originalCostCodes.map((tag) => tag.id));
          const newIds = new Set(newCostCodes.map((tag) => tag.id));

          hasChanged =
            originalIds.size !== newIds.size ||
            [...originalIds].some((id) => !newIds.has(id));
        }
      } else if (
        typeof value === "boolean" &&
        typeof originalData[fieldName] === "boolean"
      ) {
        hasChanged = value !== originalData[fieldName];
      } else {
        hasChanged = String(value) !== String(originalData[fieldName]);
      }

      if (hasChanged) {
        newChangedFields.add(fieldName);
      } else {
        newChangedFields.delete(fieldName);
      }
      setChangedFields(newChangedFields);
    },
    [formData, originalData, changedFields] // Empty dependency array since we don't use any external values
  );
  /**
   * Reverts a field to its original value
   *
   * @param fieldName - The name of the field to revert
   */
  const handleRevertField = useCallback(
    (fieldName: keyof Tag): void => {
      if (!formData || !originalData) return;

      const newFormData = { ...formData, [fieldName]: originalData[fieldName] };
      setFormData(newFormData);

      const newChangedFields = new Set(changedFields);
      newChangedFields.delete(fieldName);
      setChangedFields(newChangedFields);
    },
    [formData, originalData, changedFields]
  );

  /**
   * Discards all changes made to the form data
   */
  const handleDiscardChanges = useCallback((): void => {
    if (originalData) {
      setFormData({ ...originalData });
      setChangedFields(new Set());
    }
  }, [originalData]);

  /**
   * Handles cost code toggling for the tag
   *
   * @param costCodeId - The ID of the cost code to toggle
   * @param costCodeName - The name of the cost code for display
   */
  const handleCostCodeToggle = useCallback(
    (costCodeId: string, costCodeName: string) => {
      if (!formData) return;

      // Get the current cost codes array or initialize empty if undefined
      const currentCostCodes = formData.CostCodes || [];

      // Check if the cost code is already assigned
      const costCodeIndex = currentCostCodes.findIndex(
        (code) => code.id === costCodeId
      );

      // Create a new array based on the toggle action
      const newCostCodes =
        costCodeIndex >= 0
          ? // Remove if it exists
            [
              ...currentCostCodes.slice(0, costCodeIndex),
              ...currentCostCodes.slice(costCodeIndex + 1),
            ]
          : // Add if it doesn't exist
            [...currentCostCodes, { id: costCodeId, name: costCodeName }];

      // Update the form data - this will track the change for saving
      handleInputChange("CostCodes", newCostCodes);

      // Note: Do NOT update selectTag here as it will trigger useEffect and reset formData
      // The UI should use formData for display, not selectTag
    },
    [formData, handleInputChange]
  );

  /**
   * Toggles all cost codes on or off for the tag
   *
   * @param costCodes - The array of all available cost codes
   * @param selectAll - Whether to select all (true) or deselect all (false)
   */
  const handleCostCodeToggleAll = useCallback(
    (costCodes: CostCodeSummary[], selectAll: boolean) => {
      if (!formData) return;

      let newCostCodes: Array<{ id: string; name: string }> = [];

      if (selectAll) {
        // Add all cost codes (filtering out any that might already be in the list)
        const currentCostCodeIds = new Set(
          (formData.CostCodes || []).map((cc) => cc.id)
        );

        // Create a new array with all cost codes
        newCostCodes = [
          ...(formData.CostCodes || []), // Keep existing ones
          ...costCodes
            .filter((cc) => !currentCostCodeIds.has(cc.id)) // Only add ones not already in the list
            .map((cc) => ({ id: cc.id, name: cc.name })),
        ];
      } else {
        // Remove all cost codes (empty array)
        newCostCodes = [];
      }

      // Update the form data - this will track the change for saving
      handleInputChange("CostCodes", newCostCodes);

      // Note: Do NOT update selectTag here as it will trigger useEffect and reset formData
      // The UI should use formData for display, not selectTag
    },
    [formData, handleInputChange]
  );

  /**
   * Saves changes to the selected tag
   */
  const handleSaveChanges =
    useCallback(async (): Promise<TagOperationResult> => {
      if (!formData || !formData.id || changedFields.size === 0) {
        return { success: false, error: "No changes to save" };
      }
      setError(null);
      setIsSaving(true);
      try {
        const changedData: Partial<
          Pick<Tag, "name" | "description" | "CostCodes">
        > = {};

        // Collect all changed fields into the update payload
        changedFields.forEach((fieldName) => {
          if (fieldName === "name" && formData.name !== undefined) {
            changedData.name = formData.name;
          } else if (
            fieldName === "description" &&
            formData.description !== undefined
          ) {
            changedData.description = formData.description;
          } else if (
            fieldName === "CostCodes" &&
            formData.CostCodes !== undefined
          ) {
            // For CostCodes, we always send the complete array to let
            // the server correctly determine which to connect/disconnect
            changedData.CostCodes = formData.CostCodes;
          }
        });

        // Call the server action with the updated data
        const result = await updateTags(formData.id, changedData);

        // Handle failure response
        if (!result || !result.success) {
          const errorMessage = result?.error || "Failed to update tag";
          setError(errorMessage);
          return {
            success: false,
            error: errorMessage,
          };
        }

        // Ensure we have valid data in the response
        if (!result.data) {
          setError("Server returned success but no tag data");
          return {
            success: false,
            error: "Server returned success but no tag data",
          };
        }

        const updatedTag = result.data as Tag;

        // Update local state with server response
        setFormData(updatedTag);
        setOriginalData(updatedTag);
        setChangedFields(new Set());
        setSelectTag(updatedTag);
        setSuccessfullyUpdated(true);

        // Refresh the list of tags
        if (refreshTags) {
          await refreshTags();
        }

        return { success: true };
      } catch (error) {
        console.error("Error saving tag changes:", error);
        const errorMessage =
          error instanceof Error ? error.message : "An unknown error occurred";
        setError(errorMessage);
        return { success: false, error: errorMessage };
      } finally {
        setIsSaving(false);
        setTimeout(() => {
          setSuccessfullyUpdated(false);
          setError(null);
        }, 4000);
      }
    }, [formData, changedFields, refreshTags, setSelectTag]);

  /**
   * Deletes the selected tag
   * Calls the deleteTag server action and handles state updates
   *
   * @returns Promise with the result of the operation
   */
  const handleDeleteTag = useCallback(async (): Promise<TagOperationResult> => {
    try {
      if (!formData || !formData.id) {
        return { success: false, error: "No tag selected" };
      }

      setIsDeleting(true);
      setError(null);

      const result = await deleteTag(formData.id);

      if (!result || !result.success) {
        const errorMessage = result?.error || "Failed to delete tag";
        setError(errorMessage);
        return {
          success: false,
          error: errorMessage,
        };
      }

      // Refresh the list of tags and reset selection
      if (refreshTags) {
        await refreshTags();
      }

      // Clear selections and form state after successful deletion
      setSelectTag(null);
      setFormData(null);
      setOriginalData(null);
      setChangedFields(new Set());
      setSuccessfullyUpdated(false);

      // Call deletion success callback if provided
      if (onDeletionSuccess) {
        onDeletionSuccess(result.message || "Group deleted successfully");
      }

      return { success: true };
    } catch (error) {
      console.error("Error deleting tag:", error);
      const errorMessage =
        error instanceof Error ? error.message : "An unknown error occurred";
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsDeleting(false);
    }
  }, [formData, refreshTags, setSelectTag, setFormData, setOriginalData]);

  return {
    formData,
    changedFields,
    hasUnsavedChanges,
    isSaving,
    isDeleting,
    successfullyUpdated,
    error,
    handleInputChange,
    handleRevertField,
    handleDiscardChanges,
    handleSaveChanges,
    handleDeleteTag,
    handleCostCodeToggle,
    handleCostCodeToggleAll,
  };
}
