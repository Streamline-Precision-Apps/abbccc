import {
  useState,
  useEffect,
  useCallback,
  SetStateAction,
  Dispatch,
} from "react";
import { useSession } from "next-auth/react";
import { Jobsite } from "../../../types";

export interface UseJobsiteFormProps {
  selectJobsite: Jobsite | null;
  setSelectJobsite: React.Dispatch<React.SetStateAction<Jobsite | null>>;
  onUnsavedChangesChange?: (hasChanges: boolean) => void;
  setIsRegistrationFormOpen: Dispatch<SetStateAction<boolean>>;
}

export interface UseJobsiteFormReturn {
  formData: Jobsite | null;
  changedFields: Set<string>;
  hasUnsavedChanges: boolean;
  isSaving: boolean;
  successfullyUpdated: boolean;
  handleInputChange: (
    fieldName: string,
    value: string | number | boolean | Date
  ) => void;
  handleSaveChanges: () => Promise<void>;
  handleDiscardChanges: () => void;
  handleRevertField: (fieldName: string) => void;
  handleNewJobsiteSubmit: (newJobsite: any) => Promise<void>;
}

/**
 * Custom hook for managing jobsite form state and operations
 * Handles form data, change tracking, save/discard operations, and new jobsite registration
 */
export const useJobsiteForm = ({
  selectJobsite,
  setSelectJobsite,
  onUnsavedChangesChange,
  setIsRegistrationFormOpen,
}: UseJobsiteFormProps): UseJobsiteFormReturn => {
  const [formData, setFormData] = useState<Jobsite | null>(null);
  const [changedFields, setChangedFields] = useState<Set<string>>(new Set());
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [successfullyUpdated, setSuccessfullyUpdated] = useState(false);

  const { data: session } = useSession();

  // Initialize form data when selectJobsite changes
  useEffect(() => {
    if (selectJobsite) {
      setFormData({ ...selectJobsite });
      setChangedFields(new Set());
      setHasUnsavedChanges(false);
    }
  }, [selectJobsite]);

  // Notify parent component when unsaved changes state changes
  useEffect(() => {
    onUnsavedChangesChange?.(hasUnsavedChanges);
  }, [hasUnsavedChanges, onUnsavedChangesChange]);

  /**
   * Generic handler for input changes
   */
  const handleInputChange = useCallback(
    (fieldName: string, value: string | number | boolean | Date) => {
      if (!formData || !selectJobsite) return;

      setFormData((prev: Jobsite | null) => {
        if (!prev) return prev;
        return { ...prev, [fieldName]: value };
      });

      // Track field changes
      const newChangedFields = new Set(changedFields);
      const originalValue = selectJobsite[fieldName as keyof Jobsite];

      if (value !== originalValue) {
        newChangedFields.add(fieldName);
      } else {
        newChangedFields.delete(fieldName);
      }

      setChangedFields(newChangedFields);
      setHasUnsavedChanges(newChangedFields.size > 0);
    },
    [formData, selectJobsite, changedFields]
  );

  /**
   * Save jobsite changes to the server
   */
  const handleSaveChanges = useCallback(async () => {
    if (!formData || !hasUnsavedChanges || isSaving) return;

    setIsSaving(true);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("id", formData.id);
      formDataToSend.append("name", formData.name);
      formDataToSend.append("description", formData.description || "");
      formDataToSend.append("address", formData.address || "");
      formDataToSend.append("city", formData.city || "");
      formDataToSend.append("state", formData.state || "");
      formDataToSend.append("zipCode", formData.zipCode || "");
      formDataToSend.append("country", formData.country || "");
      formDataToSend.append("isActive", formData.isActive.toString());

      // TODO: Replace with actual jobsite update action when available
      // const result = await updateJobsiteAsset(formDataToSend);

      console.log("Jobsite form data to save:", formDataToSend);

      // Simulated success for now
      setSelectJobsite(formData);
      setChangedFields(new Set());
      setHasUnsavedChanges(false);
      setSuccessfullyUpdated(true);

      // Reset success state after 3 seconds
      setTimeout(() => setSuccessfullyUpdated(false), 3000);
    } catch (error) {
      console.error("Error saving jobsite:", error);
    } finally {
      setIsSaving(false);
    }
  }, [formData, hasUnsavedChanges, isSaving, setSelectJobsite]);

  /**
   * Discard all changes and reset to original data
   */
  const handleDiscardChanges = useCallback(() => {
    if (selectJobsite) {
      setFormData({ ...selectJobsite });
      setChangedFields(new Set());
      setHasUnsavedChanges(false);
    }
  }, [selectJobsite]);

  /**
   * Revert a specific field to its original value
   */
  const handleRevertField = useCallback(
    (fieldName: string) => {
      if (!selectJobsite || !formData) return;

      const originalValue = selectJobsite[fieldName as keyof Jobsite];
      setFormData((prev: Jobsite | null) => {
        if (!prev) return prev;
        return { ...prev, [fieldName]: originalValue };
      });

      const newChangedFields = new Set(changedFields);
      newChangedFields.delete(fieldName);
      setChangedFields(newChangedFields);
      setHasUnsavedChanges(newChangedFields.size > 0);
    },
    [selectJobsite, formData, changedFields]
  );

  /**
   * Handle new jobsite registration
   */
  const handleNewJobsiteSubmit = useCallback(
    async (newJobsite: any) => {
      try {
        // TODO: Replace with actual jobsite registration action when available
        // const result = await registerJobsite(newJobsite);

        console.log("New jobsite to register:", newJobsite);

        // Simulated success for now
        setIsRegistrationFormOpen(false);

        // TODO: Refresh jobsite list after registration
      } catch (error) {
        console.error("Error registering new jobsite:", error);
      }
    },
    [setIsRegistrationFormOpen]
  );

  return {
    formData,
    changedFields,
    hasUnsavedChanges,
    isSaving,
    successfullyUpdated,
    handleInputChange,
    handleSaveChanges,
    handleDiscardChanges,
    handleRevertField,
    handleNewJobsiteSubmit,
  };
};
