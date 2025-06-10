"use client";

import { useState, useCallback, useMemo, useEffect } from "react";
import { CostCodeSummary } from "../../../types";
import { createTag } from "@/actions/AssetActions";
import { NewTagData } from "./useTagsForm";

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
  errors: Record<string, string>;
  touched: Record<string, boolean>;
  isSubmitting: boolean;
  successMessage: string | null;
  errorMessage: string | null;
  hasUnsavedChanges: boolean;
  isFormEmpty: boolean;
  isFormValid: boolean;
  handleInputChange: (
    event: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => void;
  updateField: (
    fieldName: string,
    value: string | Array<{ id: string; name: string }>
  ) => void;
  handleNameChange: (name: string) => void;
  handleDescriptionChange: (description: string) => void;
  handleCostCodeToggle: (costCodeId: string, costCodeName: string) => void;
  handleCostCodeToggleAll: (
    costCodes: CostCodeSummary[],
    selectAll: boolean
  ) => void;
  handleBlur: (
    event: React.FocusEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => void;
  handleSubmit: () => Promise<void>;
  clearForm: () => void;
  setFormData: React.Dispatch<React.SetStateAction<TagCreationFormData>>;
  setErrors: React.Dispatch<React.SetStateAction<Record<string, string>>>;
  setSuccessMessage: React.Dispatch<React.SetStateAction<string | null>>;
  setErrorMessage: React.Dispatch<React.SetStateAction<string | null>>;
  updateFieldTouched: (fieldName: string) => void;
  showError: (field: string) => string | false;
}

const initialFormData: TagCreationFormData = {
  name: "",
  description: "",
  costCodes: [],
};

// Validation logic for the form

const getValidationErrors = (data: NewTagData): Record<string, string> => {
  const errors: Record<string, string> = {};
  if (!data.name.trim()) errors.name = "Tag Name is required.";
  if (!data.CostCodes || data.CostCodes.length === 0) {
    errors.costCodes = "At least one cost code must be selected.";
  }
  if (!data.description.trim()) errors.description = "Description is required.";
  return errors;
};

/**
 * Custom hook for managing tag creation form state and operations
 * Handles form data, cost code selection, submission, and success handling
 *
 * @param props - Configuration props for the hook
 * @returns Object containing form state and handler functions
 */
export function useTagCreation({
  refreshTags,
}: UseTagCreationProps): UseTagCreationReturn {
  const [formData, setFormData] =
    useState<TagCreationFormData>(initialFormData);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [hasChanged, setHasChanged] = useState(false);
  const [isFormEmpty, setIsFormEmpty] = useState(true);
  const [triedSubmit, setTriedSubmit] = useState(false);

  // Effect to update isFormEmpty
  useEffect(() => {
    const isEmpty =
      formData.name.trim() === "" &&
      formData.description.trim() === "" &&
      (!formData.costCodes || formData.costCodes.length === 0);
    setIsFormEmpty(isEmpty);
  }, [formData]);

  // Effect to track overall form changes
  useEffect(() => {
    const hasChanges =
      JSON.stringify(formData) !== JSON.stringify(initialFormData);
    setHasChanged(hasChanges);
  }, [formData]);

  // Calculate if there are unsaved changes
  const hasUnsavedChanges = useMemo(() => {
    return (
      formData.name.trim() !== "" ||
      formData.description.trim() !== "" ||
      (formData.costCodes && formData.costCodes.length > 0)
    );
  }, [formData]);

  /**
   * Handle input changes for all fields
   */
  const handleInputChange = useCallback(
    (
      event: React.ChangeEvent<
        HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
      >
    ) => {
      const { name, value } = event.target;
      setFormData((prev) => ({ ...prev, [name]: value }));
      setTouched((prev) => ({ ...prev, [name]: true }));
      setErrors(getValidationErrors({ ...formData, [name]: value }));
      setErrorMessage(null);
    },
    [formData]
  );

  /**
   * Helper function for direct field updates (used by child components)
   */
  const updateField = useCallback(
    (
      fieldName: string,
      value: string | Array<{ id: string; name: string }>
    ) => {
      setFormData((prev) => ({ ...prev, [fieldName]: value }));
      setTouched((prev) => ({ ...prev, [fieldName]: true }));
      setErrors(getValidationErrors({ ...formData, [fieldName]: value }));
      setErrorMessage(null);
    },
    [formData]
  );

  /**
   * Clear the form and reset all state
   */
  const clearForm = useCallback(() => {
    setFormData(initialFormData);
    setErrors({});
    setTouched({});
    setErrorMessage(null);
    setSuccessMessage(null);
    setTriedSubmit(false);
  }, []);

  /**
   * Handle name field changes
   */
  const handleNameChange = useCallback(
    (name: string) => {
      updateField("name", name);
    },
    [updateField]
  );

  /**
   * Handle description field changes
   */
  const handleDescriptionChange = useCallback(
    (description: string) => {
      updateField("description", description);
    },
    [updateField]
  );

  // Helper function for direct field blur (used by child components)
  const updateFieldTouched = useCallback(
    (fieldName: string) => {
      setTouched((prev) => ({ ...prev, [fieldName]: true }));
      const validationErrors = getValidationErrors(formData);
      setErrors(validationErrors);
    },
    [formData]
  );

  /**
   * Handle form field blurs
   */
  const handleBlur = useCallback(
    (
      event: React.FocusEvent<
        HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
      >
    ) => {
      const { name } = event.target;
      setTouched((prev) => ({ ...prev, [name]: true }));
      const validationErrors = getValidationErrors(formData);
      setErrors(validationErrors);
    },
    [formData]
  );

  // Helper function to show validation errors
  const showError = (field: string) =>
    (touched[field] || triedSubmit) && errors[field];

  /**
   * Check if the form is valid (all required fields filled and no validation errors)
   */
  const isFormValid = useMemo(() => {
    const validationErrors = getValidationErrors(formData);
    return Object.keys(validationErrors).length === 0;
  }, [formData]);

  /**
   * Handle cost code toggling for the new tag
   */
  const handleCostCodeToggle = useCallback(
    (costCodeId: string, costCodeName: string) => {
      setFormData((prev) => {
        const currentCostCodes = prev.costCodes || [];
        const costCodeIndex = currentCostCodes.findIndex(
          (code) => code.id === costCodeId
        );

        const newCostCodes =
          costCodeIndex >= 0
            ? [
                ...currentCostCodes.slice(0, costCodeIndex),
                ...currentCostCodes.slice(costCodeIndex + 1),
              ]
            : [...currentCostCodes, { id: costCodeId, name: costCodeName }];

        // Update touched and errors for costCodes
        setTouched((prevTouched) => ({ ...prevTouched, costCodes: true }));
        setErrors(getValidationErrors({ ...prev, CostCodes: newCostCodes }));
        return { ...prev, costCodes: newCostCodes };
      });
      setErrorMessage(null);
    },
    []
  );

  /**
   * Handle toggling all cost codes on or off
   */
  const handleCostCodeToggleAll = useCallback(
    (costCodes: CostCodeSummary[], selectAll: boolean) => {
      const newCostCodes = selectAll
        ? costCodes.map((cc) => ({ id: cc.id, name: cc.name }))
        : [];
      setFormData((prev) => ({ ...prev, costCodes: newCostCodes }));
      setTouched((prevTouched) => ({ ...prevTouched, CostCodes: true }));
      setErrors(getValidationErrors({ ...formData, CostCodes: newCostCodes }));
      setErrorMessage(null);
    },
    [formData]
  );

  /**
   * Handle form submission
   */
  const handleSubmit = useCallback(async () => {
    const validationErrors = getValidationErrors(formData);
    setErrors(validationErrors);
    setTouched({ name: true, description: true, costCodes: true });
    if (Object.keys(validationErrors).length > 0) {
      setErrorMessage("Please fix the errors above.");
      return;
    }

    if (formData.costCodes.length === 0) {
      setErrorMessage("At least one cost code must be selected");
      setTouched((prev) => ({ ...prev, costCodes: true }));
      return;
    }

    try {
      setIsSubmitting(true);
      setErrorMessage(null);
      setTriedSubmit(true);

      const result = await createTag({
        name: formData.name,
        description: formData.description,
        CostCodes: formData.costCodes,
      });

      if (result.success) {
        clearForm();
        setSuccessMessage(result.message || "Tag created successfully");
        if (refreshTags) {
          await refreshTags();
        }
        setTimeout(() => {
          setSuccessMessage(null);
        }, 3000);
      } else {
        setErrorMessage(result.error || "Failed to create tag");
        setTimeout(() => {
          setErrorMessage(null);
        }, 5000);
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to create tag";
      setErrorMessage(errorMessage);
      setTimeout(() => {
        setErrorMessage(null);
      }, 3000);
    } finally {
      setIsSubmitting(false);
    }
  }, [formData, refreshTags, clearForm]);

  return {
    formData,
    errors,
    touched,
    isSubmitting,
    successMessage,
    errorMessage,
    hasUnsavedChanges,
    isFormEmpty,
    isFormValid,
    handleInputChange,
    updateField,
    handleNameChange,
    handleDescriptionChange,
    handleCostCodeToggle,
    handleCostCodeToggleAll,
    handleBlur,
    handleSubmit,
    clearForm,
    setFormData,
    setErrors,
    setSuccessMessage,
    setErrorMessage,
    updateFieldTouched,
    showError,
  };
}
