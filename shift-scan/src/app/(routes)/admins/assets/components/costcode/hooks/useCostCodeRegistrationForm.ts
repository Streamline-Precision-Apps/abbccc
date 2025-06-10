"use client";

import { createCostCode } from "@/actions/AssetActions";
import {
  useState,
  useEffect,
  useCallback,
  useMemo,
  ChangeEvent,
  SetStateAction,
  Dispatch,
} from "react";

/**
 * Cost code registration form data shape
 */
export interface NewCostCodeData {
  cCNumber: string;
  cCName: string;
  isActive: boolean;
  CCTags: Array<{ id: string; name: string }>;
}

/**
 * Initial state for the cost code registration form
 */
const initialFormData: NewCostCodeData = {
  cCNumber: "#",
  cCName: "",
  isActive: true,
  CCTags: [] as Array<{ id: string; name: string }>,
};

/**
 * Validate cost code registration form data
 * @param data - The form data to validate
 * @returns Record of field errors
 */
const getValidationErrors = (data: NewCostCodeData): Record<string, string> => {
  const errors: Record<string, string> = {};
  if (!data.cCNumber || data.cCNumber.trim() === "#")
    errors.cCNumber = "Cost Code Number is required.";
  if (!data.cCName || !data.cCName.trim())
    errors.cCName = "Cost Code Name is required.";
  if (!data.CCTags || data.CCTags.length === 0)
    errors.CCTags = "At least one cost code group must be selected.";
  return errors;
};

/**
 * Hook for managing cost code registration form state and logic
 * @param props - Hook options
 */

/**
 * Hook for managing cost code registration form state and logic
 * @param setHasUnsavedChanges - Callback to notify parent of unsaved changes
 */
export const useCostcodeRegistrationForm = ({
  setHasUnsavedChanges,
  refreshCostCodes,
}: {
  setHasUnsavedChanges: Dispatch<SetStateAction<boolean>>;
  refreshCostCodes: () => Promise<void>;
}) => {
  const [formData, setFormData] = useState<NewCostCodeData>(initialFormData);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasChanged, setHasChanged] = useState(false);
  const [successfullyRegisteredMessage, setSuccessfullyRegisteredMessage] =
    useState<string | null>(null);
  const [registrationError, setRegistrationError] = useState<string | null>(
    null
  );

  // Track unsaved changes

  // Track if form has meaningful unsaved changes
  // Only consider it a change if user has entered actual content beyond the initial "#" or groups selected

  const hasUnsavedChanges = useMemo(() => {
    return (
      (formData.cCNumber.trim() !== "#" && formData.cCNumber.trim() !== "") ||
      formData.cCName.trim() !== "" ||
      formData.isActive !== true ||
      formData.CCTags.length > 0
    );
  }, [formData.cCName, formData.cCNumber, formData.isActive, formData.CCTags]);

  // Notify parent of unsaved changes
  useEffect(() => {
    setHasChanged(hasUnsavedChanges);
    if (setHasUnsavedChanges) {
      setHasUnsavedChanges(hasUnsavedChanges);
    }
  }, [hasUnsavedChanges, setHasUnsavedChanges]);

  // Validate on formData change
  useEffect(() => {
    setErrors(getValidationErrors(formData));
  }, [formData]);

  // Validation function for required fields
  const validate = useCallback(
    (data = formData) => {
      const errs: Record<string, string> = {};
      if (!data.cCNumber || data.cCNumber.trim() === "#") {
        errs.cCNumber = "Cost Code Number is required.";
      }
      if (!data.cCName || !data.cCName.trim()) {
        errs.cCName = "Cost Code Name is required.";
      }
      if (!data.CCTags || data.CCTags.length === 0) {
        errs.CCTags = "At least one cost code group must be selected.";
      }
      return errs;
    },
    [formData]
  );
  /**
   * Check if the form is complete
   */
  const isComplete = useMemo(() => {
    return (
      formData.cCNumber &&
      formData.cCNumber.trim() !== "#" &&
      formData.cCName &&
      formData.cCName.trim() !== ""
    );
  }, [formData.cCNumber, formData.cCName]);

  // Update errors on formData change
  useEffect(() => {
    setErrors(validate(formData));
  }, [formData, validate]);

  /**
   * Handle input changes for text/select fields
   */
  // Memoized handler for input changes
  const handleInputChange = useCallback(
    (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      const { name, value } = e.target;

      if (name === "cCNumber") {
        let formattedValue = value;
        if (!formattedValue.startsWith("#")) {
          formattedValue = "#" + formattedValue.replace(/^#+/, "");
        }
        formattedValue = "#" + formattedValue.slice(1).replace(/[^\d.]/g, "");
        setFormData((prev) => ({ ...prev, [name]: formattedValue }));
      } else if (name === "isActive") {
        setFormData((prev) => ({ ...prev, [name]: value === "Active" }));
      } else {
        setFormData((prev) => ({ ...prev, [name]: value }));
      }
    },
    []
  );

  /**
   * Mark a field as touched
   */
  // onBlur handler to mark field as touched
  const handleBlur = useCallback(
    (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) => {
      const { name } = e.target;
      setTouched((prev) => ({ ...prev, [name]: true }));
    },
    []
  );

  /**
   * Toggle a cost code group/tag
   */
  // Handler for toggling tags/groups
  const handleTagToggle = useCallback(
    (tagId: string, tagName: string) => {
      // Get the current CCTags array
      const currentTags = formData.CCTags;

      // Check if the tag is already selected
      const tagIndex = currentTags.findIndex((tag) => tag.id === tagId);

      // Create a new array based on the toggle action
      const newTags =
        tagIndex >= 0
          ? // Remove if it exists
            [
              ...currentTags.slice(0, tagIndex),
              ...currentTags.slice(tagIndex + 1),
            ]
          : // Add if it doesn't exist
            [...currentTags, { id: tagId, name: tagName }];

      // Update the form data
      setFormData((prev) => ({
        ...prev,
        CCTags: newTags,
      }));
    },
    [formData.CCTags]
  );

  /**
   * Check if the form is valid
   */
  const isFormValid = useMemo(() => {
    const errs = getValidationErrors(formData);
    return Object.keys(errs).length === 0;
  }, [formData]);

  /**
   * Reset the form to initial state
   */

  const resetForm = useCallback(() => {
    setFormData(initialFormData);
    setTouched({});
    setErrors({});
    setTimeout(() => {
      setSuccessfullyRegisteredMessage(null);
      setRegistrationError(null);
    }, 3000); // Reset success/error state after next render
  }, []);

  /**
   * Submit the form (async, independent)
   */

  const handleSubmit = useCallback(async (): Promise<void> => {
    try {
      setIsSubmitting(true);
      setSuccessfullyRegisteredMessage(null);
      setRegistrationError(null);
      const result = await createCostCode(formData);
      if (!result.success) {
        throw new Error(result.error || "Unknown error occurred");
      }
      await refreshCostCodes();
      setSuccessfullyRegisteredMessage("Cost code registered successfully!");
      resetForm();
    } catch (error) {
      console.error("Failed to register cost code:", error);
      setRegistrationError("Failed to register cost code");
    } finally {
      setIsSubmitting(false);
    }
  }, [formData, resetForm]);

  return {
    formData,
    setFormData,
    errors,
    touched,
    isSubmitting,
    hasChanged,
    isFormValid,
    successfullyRegistered: successfullyRegisteredMessage,
    registrationError,
    handleInputChange,
    handleBlur,
    handleTagToggle,
    resetForm,
    handleSubmit,
  };
};
