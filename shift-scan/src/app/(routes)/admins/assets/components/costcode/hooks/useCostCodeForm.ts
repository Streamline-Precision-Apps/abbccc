"use client";
import { useState, useEffect, useMemo } from "react";
import { CostCode } from "../../../types";
import {
  createCostCode,
  updateCostCode,
  deleteCostCode,
} from "@/actions/AssetActions";

interface UseCostCodeFormProps {
  selectCostCode: CostCode | null;
  setSelectCostCode: React.Dispatch<React.SetStateAction<CostCode | null>>;
  onUnsavedChangesChange?: (hasChanges: boolean) => void;
  setIsRegistrationFormOpen: React.Dispatch<React.SetStateAction<boolean>>;
  refreshCostCodes?: () => Promise<void>;
}

/**
 * Custom hook for managing cost code form state
 * Handles form data, changes tracking, saving, and reverting
 */
export function useCostCodeForm({
  selectCostCode,
  setSelectCostCode,
  onUnsavedChangesChange,
  setIsRegistrationFormOpen,
  refreshCostCodes,
}: UseCostCodeFormProps) {
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

  // Update parent component about unsaved changes
  const hasUnsavedChanges = useMemo(
    () => changedFields.size > 0,
    [changedFields]
  );

  useEffect(() => {
    onUnsavedChangesChange?.(hasUnsavedChanges);
  }, [hasUnsavedChanges, onUnsavedChangesChange]);

  // Handler for input changes
  const handleInputChange = (
    fieldName: keyof CostCode,
    value: string | boolean
  ) => {
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
  };

  // Handle reverting a field to its original value
  const handleRevertField = (fieldName: keyof CostCode) => {
    if (!formData || !originalData) return;

    const newFormData = { ...formData, [fieldName]: originalData[fieldName] };
    setFormData(newFormData);

    const newChangedFields = new Set(changedFields);
    newChangedFields.delete(fieldName);
    setChangedFields(newChangedFields);
  };

  // Save changes to cost code
  const handleSaveChanges = async () => {
    if (!formData || !hasUnsavedChanges) return;

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
        throw new Error(result.error || "Failed to update cost code");
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
    } catch (error) {
      console.error("Failed to save cost code changes:", error);
    } finally {
      setIsSaving(false);
    }
  };

  // Discard all changes
  const handleDiscardChanges = () => {
    if (originalData) {
      setFormData({ ...originalData });
      setChangedFields(new Set());
    }
  };

  // Create a new cost code
  const handleNewCostCodeSubmit = async (newCostCode: {
    cCNumber: string;
    cCName: string;
    isActive: boolean;
  }): Promise<boolean> => {
    setIsSaving(true);
    try {
      // Call the server action to create a new cost code
      const result = await createCostCode(newCostCode);

      if (!result.success) {
        throw new Error(result.error || "Failed to create cost code");
      }

      setSelectCostCode(null);
      setFormData(null);
      setOriginalData(null);
      setChangedFields(new Set());

      // Refresh the cost codes list
      if (refreshCostCodes) {
        await refreshCostCodes();
      }

      return true; // Return success
    } catch (error) {
      console.error("Failed to create cost code:", error);
      return false; // Return failure
    } finally {
      setIsSaving(false);
    }
  };

  // Delete cost code
  const handleDeleteCostCode = async (): Promise<{
    success: boolean;
    error?: string;
  }> => {
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
  };

  return {
    formData,
    changedFields,
    hasUnsavedChanges,
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
