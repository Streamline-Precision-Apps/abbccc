"use client";

import { useState, useCallback, useMemo } from "react";
import { CostCodeSummary } from "../../../types";

/**
 * Props for the useTagCreation hook
 */
export interface UseTagCreationProps {
  /** Function to refresh the list of tags after creation */
  refreshTags?: () => Promise<void>;
  /** Function to navigate back from creation mode */
  onCancel: () => void;
}

/**
 * Result type for tag creation operations
 */
export interface TagCreationResult {
  success: boolean;
  error?: string;
}

/**
 * Form data structure for creating a new tag
 */
export interface TagCreationFormData {
  name: string;
  description: string;
  costCodes: Array<{ id: string; name: string }>;
}

/**
 * Return type for the useTagCreation hook
 */
export interface UseTagCreationReturn {
  formData: TagCreationFormData;
  isSubmitting: boolean;
  error: string | null;
  successMessage: string | null;
  hasUnsavedChanges: boolean;
  handleNameChange: (name: string) => void;
  handleDescriptionChange: (description: string) => void;
  handleCostCodeToggle: (costCodeId: string, costCodeName: string) => void;
  handleCostCodeToggleAll: (
    costCodes: CostCodeSummary[],
    selectAll: boolean
  ) => void;
  handleSubmit: () => Promise<void>;
  handleCancel: () => void;
  clearForm: () => void;
}

/**
 * Custom hook for managing tag creation form state and operations
 * Handles form data, cost code selection, submission, and success handling
 *
 * @param props - Configuration props for the hook
 * @returns Object containing form state and handler functions
 */
export function useTagCreation({
  refreshTags,
  onCancel,
}: UseTagCreationProps): UseTagCreationReturn {
  const [formData, setFormData] = useState<TagCreationFormData>({
    name: "",
    description: "",
    costCodes: [],
  });

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Calculate if there are unsaved changes
  const hasUnsavedChanges = useMemo(() => {
    return (
      formData.name.trim() !== "" ||
      formData.description.trim() !== "" ||
      formData.costCodes.length > 0
    );
  }, [formData]);

  /**
   * Clear the form and reset all state
   */
  const clearForm = useCallback(() => {
    setFormData({
      name: "",
      description: "",
      costCodes: [],
    });
    setError(null);
    setSuccessMessage(null);
  }, []);

  /**
   * Handle name field changes
   */
  const handleNameChange = useCallback((name: string) => {
    setFormData((prev) => ({ ...prev, name }));
    setError(null);
  }, []);

  /**
   * Handle description field changes
   */
  const handleDescriptionChange = useCallback((description: string) => {
    setFormData((prev) => ({ ...prev, description }));
    setError(null);
  }, []);

  /**
   * Handle cost code toggling for the new tag
   */
  const handleCostCodeToggle = useCallback(
    (costCodeId: string, costCodeName: string) => {
      setFormData((prev) => {
        const currentCostCodes = prev.costCodes;
        const costCodeIndex = currentCostCodes.findIndex(
          (code) => code.id === costCodeId
        );

        const newCostCodes =
          costCodeIndex >= 0
            ? // Remove if it exists
              [
                ...currentCostCodes.slice(0, costCodeIndex),
                ...currentCostCodes.slice(costCodeIndex + 1),
              ]
            : // Add if it doesn't exist
              [...currentCostCodes, { id: costCodeId, name: costCodeName }];

        return { ...prev, costCodes: newCostCodes };
      });
      setError(null);
    },
    []
  );

  /**
   * Handle toggling all cost codes on or off
   */
  const handleCostCodeToggleAll = useCallback(
    (costCodes: CostCodeSummary[], selectAll: boolean) => {
      setFormData((prev) => ({
        ...prev,
        costCodes: selectAll
          ? costCodes.map((cc) => ({ id: cc.id, name: cc.name }))
          : [],
      }));
      setError(null);
    },
    []
  );

  /**
   * Handle form submission
   */
  const handleSubmit = useCallback(async () => {
    // Validate form
    if (!formData.name.trim()) {
      setError("Group name is required");
      return;
    }

    if (!formData.description.trim()) {
      setError("Group description is required");
      return;
    }

    if (formData.costCodes.length === 0) {
      setError("At least one cost code must be selected");
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);

      // TODO: Replace with actual API call
      // const result = await createTag({
      //   name: formData.name,
      //   description: formData.description,
      //   CostCodes: formData.costCodes,
      // });

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Show success message
      setSuccessMessage("Tag created successfully!");

      // Clear the form
      clearForm();

      // Refresh tags list
      if (refreshTags) {
        await refreshTags();
      }

      // Auto-hide success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage(null);
      }, 3000);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to create tag";
      setError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  }, [formData, refreshTags, clearForm]);

  /**
   * Handle cancel action
   */
  const handleCancel = useCallback(() => {
    if (hasUnsavedChanges) {
      // Could show a confirmation modal here
      const confirmed = window.confirm(
        "You have unsaved changes. Are you sure you want to cancel?"
      );
      if (!confirmed) return;
    }

    clearForm();
    onCancel();
  }, [hasUnsavedChanges, clearForm, onCancel]);

  return {
    formData,
    isSubmitting,
    error,
    successMessage,
    hasUnsavedChanges,
    handleNameChange,
    handleDescriptionChange,
    handleCostCodeToggle,
    handleCostCodeToggleAll,
    handleSubmit,
    handleCancel,
    clearForm,
  };
}
