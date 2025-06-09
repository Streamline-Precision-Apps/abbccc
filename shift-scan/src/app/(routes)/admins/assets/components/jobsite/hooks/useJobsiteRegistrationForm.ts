"use client";
import { useState, useEffect, useCallback } from "react";

// Define the shape of the form data
export interface NewJobsiteData {
  name: string;
  clientId: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  description: string;
  isActive: boolean; // Default to true
  // approvalStatus: string; // Assuming this might not be set by user directly on creation or has a default
  CCTags?: Array<{ id: string; name: string }>; // Optional
}

// Initial state for the form
const initialFormData: NewJobsiteData = {
  name: "",
  clientId: "",
  address: "",
  city: "",
  state: "",
  zipCode: "",
  country: "US", // Default country
  description: "",
  isActive: true,
  CCTags: [],
};

// Validation logic for the form
const getValidationErrors = (data: NewJobsiteData): Record<string, string> => {
  const errors: Record<string, string> = {};
  if (!data.name.trim()) errors.name = "Jobsite Name is required.";
  if (!data.clientId) errors.clientId = "Client is required."; // Assuming clientId is a string ID
  if (!data.address.trim()) errors.address = "Street Address is required.";
  if (!data.city.trim()) errors.city = "City is required.";
  if (!data.state.trim()) errors.state = "State is required.";
  if (!data.zipCode.trim()) errors.zipCode = "Zip Code is required.";
  if (!data.country.trim()) errors.country = "Country is required.";
  if (!data.description.trim()) errors.description = "Description is required.";
  // Add more specific validations if needed (e.g., zip code format)
  return errors;
};

interface UseJobsiteRegistrationFormProps {
  onSubmit: (formData: NewJobsiteData) => Promise<any>; // The actual submission function
  onUnsavedChangesChange?: (hasChanges: boolean) => void;
}

export const useJobsiteRegistrationForm = ({
  onSubmit,
  onUnsavedChangesChange,
}: UseJobsiteRegistrationFormProps) => {
  const [formData, setFormData] = useState<NewJobsiteData>(initialFormData);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [triedSubmit, setTriedSubmit] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasChanged, setHasChanged] = useState(false);
  const [isFormEmpty, setIsFormEmpty] = useState(true);

  // Effect to update isFormEmpty
  useEffect(() => {
    const isEmpty = Object.values(formData).every(
      (value) => value === "" || value === null || value === undefined
    );
    setIsFormEmpty(isEmpty);
  }, [formData]);

  // Effect to track overall form changes for onUnsavedChangesChange
  useEffect(() => {
    const hasChanges =
      JSON.stringify(formData) !== JSON.stringify(initialFormData);
    setHasChanged(hasChanges);
    onUnsavedChangesChange?.(hasChanges);
  }, [formData, onUnsavedChangesChange]);

  const handleInputChange = useCallback(
    (
      event: React.ChangeEvent<
        HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
      >
    ) => {
      const { name, value, type } = event.target;
      let processedValue:
        | string
        | boolean
        | Array<{ id: string; name: string }> = value;

      if (type === "checkbox") {
        processedValue = (event.target as HTMLInputElement).checked;
      }

      setFormData((prev) => ({ ...prev, [name]: processedValue }));
      setTouched((prev) => ({ ...prev, [name]: true }));
      const validationErrors = getValidationErrors({
        ...formData,
        [name]: processedValue,
      });
      setErrors(validationErrors);
    },
    [formData]
  );

  const handleCCTagsChange = useCallback(
    (tags: Array<{ id: string; name: string }>) => {
      setFormData((prev) => ({ ...prev, CCTags: tags }));
      setTouched((prev) => ({ ...prev, CCTags: true }));
      const validationErrors = getValidationErrors({
        ...formData,
        CCTags: tags,
      });
      setErrors(validationErrors);
    },
    [formData]
  );

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

  const resetForm = useCallback(() => {
    setFormData(initialFormData);
    setErrors({});
    setTouched({});
    setTriedSubmit(false);
    setHasChanged(false);
  }, []);

  const handleSubmit = useCallback(
    async (event?: React.FormEvent<HTMLFormElement>) => {
      if (event) event.preventDefault();
      setTriedSubmit(true);
      const validationErrors = getValidationErrors(formData);
      setErrors(validationErrors);

      if (Object.keys(validationErrors).length === 0) {
        setIsSubmitting(true);
        try {
          await onSubmit(formData);
          // resetForm(); // Reset form on successful submission - this will be called by the parent
          return true; // Indicate success
        } catch (error) {
          console.error("Submission failed:", error);
          // Handle submission error (e.g., display a message to the user)
          // setErrors({ form: "Submission failed. Please try again." });
          return false; // Indicate failure
        } finally {
          setIsSubmitting(false);
        }
      }
      return false; // Indicate validation failure
    },
    [formData, onSubmit]
  );

  return {
    formData,
    errors,
    touched,
    triedSubmit,
    isSubmitting,
    isFormEmpty,
    hasChanged,
    handleInputChange,
    handleCCTagsChange,
    handleBlur,
    handleSubmit,
    resetForm,
    setFormData, // Exposing setFormData for more complex scenarios if needed (e.g. setting CCTags)
    setErrors, // Exposing setErrors for potential external error setting
  };
};
