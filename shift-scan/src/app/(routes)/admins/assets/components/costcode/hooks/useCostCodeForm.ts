"use client";
import { useState, useEffect, useMemo, useCallback } from "react";
import { CostCode } from "../../../types";
import {
  createCostCode,
  updateCostCode,
  deleteCostCode,
} from "@/actions/AssetActions";

/**
 * Props for the useCostCodeForm hook
 */
export interface UseCostCodeFormProps {
  /** The currently selected cost code or null if none is selected */
  selectCostCode: CostCode | null;
  /** Function to update the selected cost code */
  setSelectCostCode: React.Dispatch<React.SetStateAction<CostCode | null>>;
  /** Function to update whether there are unsaved changes */
  setHasUnsavedChanges: React.Dispatch<React.SetStateAction<boolean>>;
  /** Function to update whether the registration form is open */
  setIsRegistrationFormOpen: React.Dispatch<React.SetStateAction<boolean>>;
  /** Function to refresh the list of cost codes */
  refreshCostCodes?: () => Promise<void>;
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
  /** Function to handle input changes */
  handleInputChange: (
    fieldName: keyof CostCode,
    value: string | boolean
  ) => void;
  /** Function to save changes */
  handleSaveChanges: () => Promise<CostCodeOperationResult>;
  /** Function to discard changes */
  handleDiscardChanges: () => void;
  /** Function to submit a new cost code */
  handleNewCostCodeSubmit: (
    newCostCode: NewCostCodeData
  ) => Promise<CostCodeOperationResult>;
  /** Function to revert a field to its original value */
  handleRevertField: (fieldName: keyof CostCode) => void;
  /** Function to delete a cost code */
  handleDeleteCostCode: () => Promise<CostCodeOperationResult>;
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
  setIsRegistrationFormOpen,
  refreshCostCodes,
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
   * @param value - The new value for the field
   */
  const handleInputChange = useCallback(
    (fieldName: keyof CostCode, value: string | boolean): void => {
      setSuccessfullyUpdated(false);

      if (!formData || !originalData) return;

      const newFormData = { ...formData, [fieldName]: value };
      setFormData(newFormData);

      // Track changed fields by comparing with original data
      const newChangedFields = new Set(changedFields);

      // Handle deep equality comparison for different field types
      let hasChanged = false;
      if (
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
        const changedData: Partial<Pick<CostCode, "name" | "isActive">> = {};

        changedFields.forEach((fieldName) => {
          if (fieldName === "name" && formData.name !== undefined) {
            changedData.name = formData.name;
          } else if (
            fieldName === "isActive" &&
            formData.isActive !== undefined
          ) {
            changedData.isActive = formData.isActive;
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
   * Submits a new cost code
   *
   * @param newCostCode - Data for the new cost code
   * @returns Promise resolving to an object with success state and optional error
   */
  const handleNewCostCodeSubmit = useCallback(
    async (newCostCode: NewCostCodeData): Promise<CostCodeOperationResult> => {
      setIsSaving(true);
      try {
        // Call the server action to create a new cost code
        const result = await createCostCode(newCostCode);

        if (!result.success) {
          return {
            success: false,
            error: result.error || "Failed to create cost code",
          };
        }

        setSelectCostCode(null);
        setFormData(null);
        setOriginalData(null);
        setChangedFields(new Set());

        // Refresh the cost codes list
        if (refreshCostCodes) {
          await refreshCostCodes();
        }

        return { success: true };
      } catch (error: any) {
        console.error("Failed to create cost code:", error);
        return {
          success: false,
          error:
            error?.message ||
            "An unexpected error occurred while creating the cost code",
        };
      } finally {
        setIsSaving(false);
      }
    },
    [refreshCostCodes, setSelectCostCode]
  );

  /**
   * Deletes the current cost code
   *
   * @returns Promise resolving to an object with success state and optional error
   */
  const handleDeleteCostCode =
    useCallback(async (): Promise<CostCodeOperationResult> => {
      if (!formData) {
        return { success: false, error: "No cost code selected" };
      }

      setIsDeleting(true);
      try {
        // Call the server action to delete the cost code
        const result = await deleteCostCode(formData.id);

        if (!result.success) {
          throw new Error(result.error || "Failed to delete cost code");
        }

        // Clear the selected cost code and refresh the list
        setSelectCostCode(null);
        setFormData(null);
        setOriginalData(null);
        setChangedFields(new Set());

        // Refresh the cost codes list
        if (refreshCostCodes) {
          await refreshCostCodes();
        }

        return { success: true };
      } catch (error) {
        console.error("Failed to delete cost code:", error);
        const errorMessage =
          error instanceof Error ? error.message : "Unknown error occurred";
        return { success: false, error: errorMessage };
      } finally {
        setIsDeleting(false);
      }
    }, [formData, refreshCostCodes, setSelectCostCode]);

  return {
    formData,
    changedFields,
    hasUnsavedChanges,
    error,
    isSaving,
    isDeleting,
    successfullyUpdated,
    handleInputChange,
    handleSaveChanges,
    handleDiscardChanges,
    handleNewCostCodeSubmit,
    handleRevertField,
    handleDeleteCostCode,
  };
}
