import {
  useState,
  useEffect,
  useCallback,
  SetStateAction,
  Dispatch,
} from "react";
import { Jobsite } from "../../../types";
import { updateJobsite, deleteJobsite } from "@/actions/AssetActions";

export interface UseJobsiteFormProps {
  selectJobsite: Jobsite | null;
  setSelectJobsite: Dispatch<SetStateAction<Jobsite | null>>;
  onUnsavedChangesChange?: (hasChanges: boolean) => void;
  setJobsiteUIState: Dispatch<SetStateAction<"idle" | "creating" | "editing">>;
  refreshJobsites?: () => Promise<void>;
}

export interface UseJobsiteFormReturn {
  formData: Jobsite | null;
  changedFields: Set<string>;
  hasUnsavedChanges: boolean;
  isSaving: boolean;
  successfullyUpdated: boolean;
  showDeleteConfirmModal: boolean;
  setShowDeleteConfirmModal: (show: boolean) => void;
  handleInputChange: (
    fieldName: string,
    value:
      | string
      | number
      | boolean
      | Date
      | Array<{ id: string; name: string }>
  ) => void;
  handleSaveChanges: () => Promise<void>;
  handleDiscardChanges: () => void;
  handleRevertField: (fieldName: string) => void;
  handleDeleteJobsite: () => void;
  confirmDeleteJobsite: () => Promise<void>;
  successMessage: string | null;
  errorMessage: string | null;
}

/**
 * Custom hook for managing jobsite form state and operations
 * Handles form data, change tracking, save/discard operations, and new jobsite registration
 */
export const useJobsiteForm = ({
  selectJobsite,
  setSelectJobsite,
  onUnsavedChangesChange,
  setJobsiteUIState,
  refreshJobsites,
}: UseJobsiteFormProps): UseJobsiteFormReturn => {
  const [formData, setFormData] = useState<Jobsite | null>(null);
  const [changedFields, setChangedFields] = useState<Set<string>>(new Set());
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [successfullyUpdated, setSuccessfullyUpdated] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

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
   * Deep comparison function for arrays with id/name objects
   */
  const arraysEqual = (arr1: any, arr2: any): boolean => {
    if (!Array.isArray(arr1) || !Array.isArray(arr2)) return false;
    if (arr1.length !== arr2.length) return false;

    const sortedArr1 = [...arr1].sort((a, b) => a.id.localeCompare(b.id));
    const sortedArr2 = [...arr2].sort((a, b) => a.id.localeCompare(b.id));

    return sortedArr1.every((item1, index) => {
      const item2 = sortedArr2[index];
      return item1.id === item2.id && item1.name === item2.name;
    });
  };

  /**
   * Generic handler for input changes
   */
  const handleInputChange = useCallback(
    (
      fieldName: string,
      value:
        | string
        | number
        | boolean
        | Date
        | Array<{ id: string; name: string }>
    ) => {
      if (!formData || !selectJobsite) return;

      setFormData((prev: Jobsite | null) => {
        if (!prev) return prev;
        return { ...prev, [fieldName]: value };
      });

      // Track field changes
      const newChangedFields = new Set(changedFields);
      const originalValue = selectJobsite[fieldName as keyof Jobsite];

      let hasChanged = false;

      // Special handling for array fields (like CCTags)
      if (Array.isArray(value) && Array.isArray(originalValue)) {
        hasChanged = !arraysEqual(value, originalValue);
      } else {
        hasChanged = value !== originalValue;
      }

      if (hasChanged) {
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
      formDataToSend.append("country", formData.country || "US");
      formDataToSend.append("comment", formData.comment || "");
      formDataToSend.append("isActive", formData.isActive.toString());
      formDataToSend.append("client", formData.clientId || "");
      formDataToSend.append("cCTags", JSON.stringify(formData.CCTags || []));

      // Call the actual update jobsite server action
      const result = await updateJobsite(formDataToSend);

      if (result.success && result.data) {
        // Update the selected jobsite with the returned data
        // Type assertion is safe here since we know the structure matches
        setSelectJobsite(result.data as unknown as Jobsite);
        setChangedFields(new Set());
        setHasUnsavedChanges(false);
        setSuccessfullyUpdated(true);

        // Refresh the jobsite list to show updated data
        if (refreshJobsites) {
          await refreshJobsites();
        }

        // Reset success state after 2 seconds
        setTimeout(() => setSuccessfullyUpdated(false), 2000);
      } else {
        throw new Error(result.error || "Failed to update jobsite");
      }
    } catch (error) {
      console.error("Error saving jobsite:", error);
      setErrorMessage(`Failed to save jobsite: ${error}`);
      setTimeout(() => setErrorMessage(""), 2000);
    } finally {
      setIsSaving(false);
    }
  }, [
    formData,
    hasUnsavedChanges,
    isSaving,
    setSelectJobsite,
    refreshJobsites,
  ]);

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
   * Tracks the state of the delete confirmation modal
   */
  const [showDeleteConfirmModal, setShowDeleteConfirmModal] = useState(false);

  /**
   * Opens the delete confirmation modal
   */
  const handleDeleteJobsite = useCallback(() => {
    if (!formData) return;
    setShowDeleteConfirmModal(true);
  }, [formData]);

  /**
   * Performs the actual jobsite deletion after confirmation
   */
  const confirmDeleteJobsite = useCallback(async () => {
    if (!formData) return;

    setIsSaving(true);
    setShowDeleteConfirmModal(false);

    try {
      const result = await deleteJobsite(formData.id);

      if (result.success) {
        // Reset selection and UI state
        setSelectJobsite(null);
        setSuccessMessage("Jobsite deleted successfully");
        setJobsiteUIState("idle");
        // Refresh jobsite list after deletion
        if (refreshJobsites) {
          await refreshJobsites();
        }

        setTimeout(() => setSuccessMessage(null), 2000);
      } else {
        throw new Error(result.error || "Failed to delete jobsite");
      }
    } catch (error) {
      console.error("Error deleting jobsite:", error);
      setErrorMessage(
        `Failed to delete jobsite: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
      setTimeout(() => setErrorMessage(null), 2000);
    } finally {
      setIsSaving(false);
    }
  }, [formData, setSelectJobsite, setJobsiteUIState, refreshJobsites]);

  return {
    formData,
    changedFields,
    hasUnsavedChanges,
    isSaving,
    successfullyUpdated,
    showDeleteConfirmModal,
    setShowDeleteConfirmModal,
    handleInputChange,
    handleSaveChanges,
    handleDiscardChanges,
    handleRevertField,
    handleDeleteJobsite,
    confirmDeleteJobsite,
    successMessage,
    errorMessage,
  };
};
