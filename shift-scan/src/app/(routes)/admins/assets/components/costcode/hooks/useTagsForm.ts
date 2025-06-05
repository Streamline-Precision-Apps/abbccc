"use client";
import { useState, useEffect, useMemo, useCallback } from "react";
import { CostCode, Tag } from "../../../types";

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
  handleNewTagSubmit: (newTag: NewTagData) => Promise<TagOperationResult>;
  handleRevertField: (fieldName: keyof Tag) => void;
  handleDeleteTag: () => Promise<TagOperationResult>;
  handleCostCodeToggle: (costCodeId: string, costCodeName: string) => void;
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
      console.log("handleInputChange", fieldName, value);
      setSuccessfullyUpdated(false);

      setFormData((prevData) => {
        if (!prevData) return null;

        return {
          ...prevData,
          [fieldName]: value,
        };
      });
      console.log("Updated formData:", formData);

      setChangedFields((prevChangedFields) => {
        const newChangedFields = new Set(prevChangedFields);
        newChangedFields.add(fieldName);
        return newChangedFields;
      });
    },
    [] // Empty dependency array since we don't use any external values
  );
  /**
   * Reverts a field to its original value
   *
   * @param fieldName - The name of the field to revert
   */
  const handleRevertField = useCallback(
    (fieldName: keyof Tag): void => {
      if (!formData || !originalData) return;

      // Reset the field to its original value
      setFormData({
        ...formData,
        [fieldName]: originalData[fieldName],
      });

      // Remove the field from the set of changed fields
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

      // Update the form data
      handleInputChange("CostCodes", newCostCodes);
    },
    [formData, handleInputChange]
  );

  /**
   * Saves changes to the selected tag
   */
  const handleSaveChanges =
    useCallback(async (): Promise<TagOperationResult> => {
      try {
        if (!formData || !formData.id || changedFields.size === 0) {
          return { success: false, error: "No changes to save" };
        }

        setIsSaving(true);
        setError(null);

        // Simulate a successful update for now
        // In a real implementation, you'd call an actual API
        await new Promise((resolve) => setTimeout(resolve, 1000));

        // Update the original data to reflect the saved changes
        setOriginalData({ ...formData });
        setChangedFields(new Set());
        setSuccessfullyUpdated(true);

        // Refresh the list of tags
        if (refreshTags) {
          await refreshTags();
        }

        setIsSaving(false);
        return { success: true };
      } catch (error) {
        setIsSaving(false);
        const errorMessage =
          error instanceof Error ? error.message : "An unknown error occurred";
        setError(errorMessage);
        return { success: false, error: errorMessage };
      }
    }, [formData, changedFields, refreshTags]);

  /**
   * Deletes the selected tag
   */
  const handleDeleteTag = useCallback(async (): Promise<TagOperationResult> => {
    try {
      if (!formData || !formData.id) {
        return { success: false, error: "No tag selected" };
      }

      setIsDeleting(true);
      setError(null);

      // Mock API call - replace with actual implementation
      // const result = await deleteTag(formData.id);

      // Simulate a successful deletion
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Refresh the list of tags and reset selection
      if (refreshTags) {
        await refreshTags();
      }

      setSelectTag(null);
      setIsDeleting(false);
      return { success: true };
    } catch (error) {
      setIsDeleting(false);
      const errorMessage =
        error instanceof Error ? error.message : "An unknown error occurred";
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  }, [formData, refreshTags, setSelectTag]);

  /**
   * Creates a new tag
   */
  const handleNewTagSubmit = useCallback(
    async (newTagData: NewTagData): Promise<TagOperationResult> => {
      try {
        setIsSaving(true);
        setError(null);

        // Mock API call - replace with actual implementation
        // const result = await createTag(newTagData);

        // Simulate a successful creation
        await new Promise((resolve) => setTimeout(resolve, 1000));

        // Refresh the list of tags
        if (refreshTags) {
          await refreshTags();
        }
        setIsSaving(false);
        return { success: true };
      } catch (error) {
        setIsSaving(false);
        const errorMessage =
          error instanceof Error ? error.message : "An unknown error occurred";
        setError(errorMessage);
        return { success: false, error: errorMessage };
      }
    },
    [refreshTags]
  );

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
    handleNewTagSubmit,
    handleDeleteTag,
    handleCostCodeToggle,
  };
}
