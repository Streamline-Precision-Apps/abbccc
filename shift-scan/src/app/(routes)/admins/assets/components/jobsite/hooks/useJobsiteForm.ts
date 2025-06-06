import {
  useState,
  useEffect,
  useCallback,
  SetStateAction,
  Dispatch,
} from "react";
import { useSession } from "next-auth/react";
import { Jobsite } from "../../../types";
import {
  updateJobsite,
  createJobsiteFromObject,
  deleteJobsite,
} from "@/actions/AssetActions";

export interface UseJobsiteFormProps {
  selectJobsite: Jobsite | null;
  setSelectJobsite: React.Dispatch<React.SetStateAction<Jobsite | null>>;
  onUnsavedChangesChange?: (hasChanges: boolean) => void;
  setJobsiteUIState: React.Dispatch<
    React.SetStateAction<"idle" | "creating" | "editing">
  >;
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
  handleNewJobsiteSubmit: (newJobsite: {
    name: string;
    clientId: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
    description: string;
    isActive: boolean;
    approvalStatus: string;
  }) => Promise<void>;
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

        // Reset success state after 3 seconds
        setTimeout(() => setSuccessfullyUpdated(false), 3000);
      } else {
        throw new Error(result.error || "Failed to update jobsite");
      }
    } catch (error) {
      console.error("Error saving jobsite:", error);
      // TODO: Add toast notification for error
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
   * Handle new jobsite registration
   */
  const handleNewJobsiteSubmit = useCallback(
    async (newJobsite: {
      name: string;
      description: string;
      address?: string;
      city?: string;
      state?: string;
      zipCode?: string;
      country?: string;
      comment?: string;
      isActive?: boolean;
      client?: string;
      CCTags?: Array<{ id: string; name: string }>;
    }) => {
      try {
        // Validate required fields
        if (!newJobsite.name?.trim()) {
          throw new Error("Jobsite name is required");
        }

        if (!newJobsite.description?.trim()) {
          throw new Error("Jobsite description is required");
        }

        // Call the actual create jobsite server action
        const result = await createJobsiteFromObject({
          name: newJobsite.name,
          description: newJobsite.description,
          address: newJobsite.address || "",
          city: newJobsite.city || "",
          state: newJobsite.state || "",
          zipCode: newJobsite.zipCode || "",
          country: newJobsite.country || "US",
          comment: newJobsite.comment || "",
          isActive: newJobsite.isActive ?? true,
          client: newJobsite.client || "",
          CCTags: newJobsite.CCTags || [],
        });

        if (result.success) {
          console.log("Jobsite created successfully:", result.data);
          setJobsiteUIState("idle");

          // Refresh jobsite list after registration
          if (refreshJobsites) {
            await refreshJobsites();
          }
        } else {
          throw new Error(result.error || "Failed to create jobsite");
        }
      } catch (error) {
        console.error("Error registering new jobsite:", error);
        // TODO: Add toast notification for error
      }
    },
    [setJobsiteUIState, refreshJobsites]
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
        setJobsiteUIState("idle");

        // Refresh jobsite list after deletion
        if (refreshJobsites) {
          await refreshJobsites();
        }

        // Show a success message (could be replaced with a toast notification)
        alert("Jobsite deleted successfully");
      } else {
        throw new Error(result.error || "Failed to delete jobsite");
      }
    } catch (error) {
      console.error("Error deleting jobsite:", error);
      alert(
        `Failed to delete jobsite: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
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
    handleNewJobsiteSubmit,
    handleDeleteJobsite,
    confirmDeleteJobsite,
  };
};
