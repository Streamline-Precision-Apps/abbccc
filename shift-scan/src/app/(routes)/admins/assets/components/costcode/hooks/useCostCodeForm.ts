"use client";
import {
  useState,
  useEffect,
  useMemo,
  useCallback,
  Dispatch,
  SetStateAction,
} from "react";
import { CostCode } from "../../../types";
import { updateCostCode, deleteCostCode } from "@/actions/AssetActions";

/**
 * Props for the useCostCodeForm hook
 */
export interface UseCostCodeFormProps {
  /** The currently selected cost code or null if none is selected */
  selectCostCode: CostCode | null;
  /** Function to update the selected cost code */
  setSelectCostCode: Dispatch<SetStateAction<CostCode | null>>;
  /** Function to update whether there are unsaved changes */
  setHasUnsavedChanges: Dispatch<SetStateAction<boolean>>;
  /** Function to refresh the list of cost codes */
  refreshCostCodes?: () => Promise<void>;
  /** Function to set Ui after deletion */
  setCostCodeUIState: React.Dispatch<
    React.SetStateAction<
      "idle" | "creating" | "editing" | "editingGroups" | "creatingGroups"
    >
  >;
  /** Callback for deletion success */
  onDeletionSuccess?: (msg: string) => void;
  /** Callback for deletion error */
  onDeletionError?: (msg: string) => void;
}

/**
 * Result type for cost code operations like save, create, delete
 */
export interface CostCodeOperationResult {
  success: boolean;
  error?: string;
}

/**
 * Data structure for new cost code submission
 */
export interface NewCostCodeData {
  cCNumber: string;
  cCName: string;
  isActive: boolean;
}

/**
 * Return type for the useCostCodeForm hook
 */
export interface UseCostCodeFormReturn {
  /** The current form data */
  formData: CostCode | null;
  /** Set of fields that have been changed from their original values */
  changedFields: Set<keyof CostCode>;
  /** Whether there are any unsaved changes */
  hasUnsavedChanges: boolean;
  /** Any error message from the last operation */
  error: string | null;
  /** Whether a save operation is in progress */
  isSaving: boolean;
  /** Whether a delete operation is in progress */
  isDeleting: boolean;
  /** Whether the last update was successful */
  successfullyUpdated: boolean;
  /** Whether the delete confirmation modal is visible */
  showDeleteConfirmModal: boolean;
  /** Function to set the visibility of delete confirmation modal */
  setShowDeleteConfirmModal: (isVisible: boolean) => void;
  /** Function to handle input changes */
  handleInputChange: (
    fieldName: keyof CostCode,
    value: string | boolean | Array<{ id: string; name: string }>
  ) => void;
  /** Function to save changes */
  handleSaveChanges: () => Promise<CostCodeOperationResult>;
  /** Function to discard changes */
  handleDiscardChanges: () => void;
  /** Function to revert a field to its original value */
  handleRevertField: (fieldName: keyof CostCode) => void;
  /** Function to delete a cost code */
  handleDeleteCostCode: () => Promise<CostCodeOperationResult>;
  /** Function to confirm the deletion after modal confirmation */
  confirmDeleteCostCode: () => Promise<void>;
}

/**
 * Custom hook for managing cost code form state
 * Handles form data, changes tracking, saving, and reverting
 *
 * @param props - Configuration props for the hook
 * @returns Object containing form state and handler functions
 */
export function useCostCodeForm({
  selectCostCode,
  setSelectCostCode,
  setHasUnsavedChanges,
  refreshCostCodes,
  setCostCodeUIState,
  onDeletionSuccess,
  onDeletionError,
}: UseCostCodeFormProps): UseCostCodeFormReturn {
  // Form state
  const [formData, setFormData] = useState<CostCode | null>(null);
  const [originalData, setOriginalData] = useState<CostCode | null>(null);
  const [changedFields, setChangedFields] = useState<Set<keyof CostCode>>(
    new Set()
  );
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const [successfullyUpdated, setSuccessfullyUpdated] =
    useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [showDeleteConfirmModal, setShowDeleteConfirmModal] =
    useState<boolean>(false);

  // Initialize form data when selected cost code changes
  useEffect(() => {
    if (selectCostCode) {
      setFormData({ ...selectCostCode });
      setOriginalData({ ...selectCostCode });
      setChangedFields(new Set());
      setSuccessfullyUpdated(false);
    } else {
      setFormData(null);
      setOriginalData(null);
      setChangedFields(new Set());
    }
  }, [selectCostCode]);

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
   * @param value - The new value for the field (string, boolean, or array of tag objects)
   */
  const handleInputChange = useCallback(
    (
      fieldName: keyof CostCode,
      value: string | boolean | Array<{ id: string; name: string }>
    ): void => {
      setSuccessfullyUpdated(false);

      if (!formData || !originalData) return;

      const newFormData = { ...formData, [fieldName]: value };
      setFormData(newFormData);

      // Track changed fields by comparing with original data
      const newChangedFields = new Set(changedFields);

      // Handle deep equality comparison for different field types
      let hasChanged = false;

      if (fieldName === "CCTags") {
        // Handle array comparisons for tags
        const originalTags = (originalData[fieldName] || []) as Array<{
          id: string;
          name: string;
        }>;
        const newTags = (value || []) as Array<{ id: string; name: string }>;

        // Compare arrays by checking if they have the same elements
        if (originalTags.length !== newTags.length) {
          hasChanged = true;
        } else {
          // Check if all tags in the original are present in the new array
          const originalIds = new Set(originalTags.map((tag) => tag.id));
          const newIds = new Set(newTags.map((tag) => tag.id));

          // Compare sets of IDs
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
    [formData, originalData, changedFields]
  );

  /**
   * Reverts a field to its original value
   *
   * @param fieldName - The name of the field to revert
   */
  const handleRevertField = useCallback(
    (fieldName: keyof CostCode): void => {
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
   * Saves changes to the cost code
   *
   * @returns Promise resolving to an object with success state and optional error
   */
  const handleSaveChanges =
    useCallback(async (): Promise<CostCodeOperationResult> => {
      if (!formData || !hasUnsavedChanges)
        return { success: false, error: "No changes to save" };

      setIsSaving(true);
      try {
        // Extract only the changed fields to send to the server action
        const changedData: Partial<
          Pick<CostCode, "name" | "isActive" | "CCTags">
        > = {};

        changedFields.forEach((fieldName) => {
          if (fieldName === "name" && formData.name !== undefined) {
            changedData.name = formData.name;
          } else if (
            fieldName === "isActive" &&
            formData.isActive !== undefined
          ) {
            changedData.isActive = formData.isActive;
          } else if (fieldName === "CCTags" && formData.CCTags !== undefined) {
            changedData.CCTags = formData.CCTags;
          }
        });

        // Call the server action to update the cost code
        const result = await updateCostCode(formData.id, changedData);

        if (!result.success) {
          setError(result.error || "Failed to update cost code");
          return {
            success: false,
            error: result.error || "Failed to update cost code",
          };
        }

        // Update the form data with the response
        const updatedCostCode = result.data;
        if (updatedCostCode) {
          setFormData(updatedCostCode);
          setOriginalData(updatedCostCode);
          setChangedFields(new Set());
          setSelectCostCode(updatedCostCode);
          setSuccessfullyUpdated(true);

          // Refresh the cost codes list
          if (refreshCostCodes) {
            await refreshCostCodes();
          }
        }

        return { success: true };
      } catch (error) {
        console.error("Failed to save cost code changes:", error);
        const errorMessage =
          error instanceof Error ? error.message : "Failed to save changes";
        setError(errorMessage);
        return { success: false, error: errorMessage };
      } finally {
        setIsSaving(false);
        setTimeout(() => {
          setSuccessfullyUpdated(false);
          setError(null);
        }, 4000);
      }
    }, [
      formData,
      changedFields,
      hasUnsavedChanges,
      refreshCostCodes,
      setSelectCostCode,
    ]);

  /**
   * Discards all changes and reverts to the original data
   */
  const handleDiscardChanges = useCallback((): void => {
    if (originalData) {
      setFormData({ ...originalData });
      setChangedFields(new Set());
    }
  }, [originalData]);

  /**
   * Initiates the delete process by showing the confirmation modal.
   * Only works if a cost code is selected.
   * @returns Promise resolving to an object with success state and optional error
   */
  const handleDeleteCostCode =
    useCallback(async (): Promise<CostCodeOperationResult> => {
      if (!formData) {
        const msg = "No cost code selected";
        setError(msg);
        if (onDeletionError) onDeletionError(msg);
        return { success: false, error: msg };
      }
      setShowDeleteConfirmModal(true);
      return { success: true };
    }, [formData, onDeletionError]);

  /**
   * Executes the actual deletion after user confirms in the modal.
   * Handles server action, state cleanup, and banner messaging.
   * @returns Promise resolving to an object with success state and optional error
   */
  const confirmDeleteCostCode = useCallback(async (): Promise<void> => {
    if (!formData) {
      throw new Error("No cost code selected for deletion");
    }
    setShowDeleteConfirmModal(false);
    setIsDeleting(true); // Set loading state for deletion
    try {
      const result = await deleteCostCode(formData.id);
      if (!result.success) {
        throw new Error(result.error || "Failed to delete cost code");
      }

      // Clean up state
      await Promise.all([
        // Close modal and reset UI (state updates are synchronous)
        new Promise<void>((resolve) => {
          setSelectCostCode(null);
          setCostCodeUIState("idle");
          setIsDeleting(false);
          onDeletionSuccess?.("Cost code deleted successfully");
          resolve();
        }),
        // Refresh data (if needed)
        refreshCostCodes?.(), // Optional chaining in case it's undefined
      ]);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error occurred";
      setError(errorMessage);
    }
  }, [
    formData,
    refreshCostCodes,
    setSelectCostCode,
    setCostCodeUIState,
    onDeletionSuccess,
    onDeletionError,
  ]);

  return {
    formData,
    changedFields,
    hasUnsavedChanges,
    error,
    isSaving,
    isDeleting,
    successfullyUpdated,
    showDeleteConfirmModal,
    setShowDeleteConfirmModal,
    handleInputChange,
    handleSaveChanges,
    handleDiscardChanges,
    handleRevertField,
    handleDeleteCostCode,
    confirmDeleteCostCode,
  };
}
