import {
  useState,
  useEffect,
  useCallback,
  SetStateAction,
  Dispatch,
} from "react";
import { useSession } from "next-auth/react";
import {
  updateEquipmentAsset,
  registerEquipment,
} from "@/actions/AssetActions";
import { Equipment } from "../../../types";

interface UseEquipmentFormProps {
  selectEquipment: Equipment | null;
  setSelectEquipment: React.Dispatch<React.SetStateAction<Equipment | null>>;
  onUnsavedChangesChange?: (hasChanges: boolean) => void;
  setIsRegistrationFormOpen: Dispatch<SetStateAction<boolean>>;
}

interface UseEquipmentFormReturn {
  formData: Equipment | null;
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
  handleNewEquipmentSubmit: (newEquipment: any) => Promise<void>;
}

/**
 * Custom hook for managing equipment form state and operations
 * Handles form data, change tracking, save/discard operations, and new equipment registration
 */
export const useEquipmentForm = ({
  selectEquipment,
  setSelectEquipment,
  onUnsavedChangesChange,
}: UseEquipmentFormProps): UseEquipmentFormReturn => {
  const [formData, setFormData] = useState<Equipment | null>(null);
  const [changedFields, setChangedFields] = useState<Set<string>>(new Set());
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [successfullyUpdated, setSuccessfullyUpdated] = useState(false);

  const { data: session } = useSession();

  // Initialize form data when selectEquipment changes
  useEffect(() => {
    if (selectEquipment) {
      setFormData({ ...selectEquipment });
      setChangedFields(new Set());
      setHasUnsavedChanges(false);
    }
  }, [selectEquipment]);

  // Notify parent component when unsaved changes state changes
  useEffect(() => {
    onUnsavedChangesChange?.(hasUnsavedChanges);
  }, [hasUnsavedChanges, onUnsavedChangesChange]);

  /**
   * Generic handler for input changes with nested field support
   */
  const handleInputChange = useCallback(
    (fieldName: string, value: string | number | boolean | Date) => {
      if (!formData || !selectEquipment) return;

      setFormData((prev: Equipment | null) => {
        if (!prev) return prev;

        // Handle nested vehicle info fields
        if (fieldName.startsWith("vehicle.")) {
          const vehicleField = fieldName.replace("vehicle.", "");
          return {
            ...prev,
            equipmentVehicleInfo: {
              make: null,
              model: null,
              year: null,
              licensePlate: null,
              registrationExpiration: null,
              mileage: null,
              ...prev.equipmentVehicleInfo,
              [vehicleField]: value,
            },
          };
        }

        return { ...prev, [fieldName]: value };
      });

      // Track field changes
      const newChangedFields = new Set(changedFields);
      let originalValue;

      if (fieldName.startsWith("vehicle.")) {
        const vehicleField = fieldName.replace("vehicle.", "");
        originalValue =
          selectEquipment.equipmentVehicleInfo?.[
            vehicleField as keyof typeof selectEquipment.equipmentVehicleInfo
          ];
      } else {
        originalValue = selectEquipment[fieldName as keyof Equipment];
      }

      if (value !== originalValue) {
        newChangedFields.add(fieldName);
      } else {
        newChangedFields.delete(fieldName);
      }

      setChangedFields(newChangedFields);
      setHasUnsavedChanges(newChangedFields.size > 0);
    },
    [formData, selectEquipment, changedFields]
  );

  /**
   * Save equipment changes to the server
   */
  const handleSaveChanges = useCallback(async () => {
    if (!formData || !hasUnsavedChanges || isSaving) return;

    setIsSaving(true);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("id", formData.id);
      formDataToSend.append("name", formData.name);
      formDataToSend.append("description", formData.description || "");
      formDataToSend.append("equipmentTag", formData.equipmentTag);
      formDataToSend.append("status", formData.status || "");
      formDataToSend.append("currentWeight", formData.currentWeight.toString());
      formDataToSend.append("overWeight", formData.overWeight.toString());

      // Add vehicle information if it exists
      if (formData.equipmentVehicleInfo) {
        const vehicleInfo = formData.equipmentVehicleInfo;
        formDataToSend.append("make", vehicleInfo.make || "");
        formDataToSend.append("model", vehicleInfo.model || "");
        formDataToSend.append("year", vehicleInfo.year || "");
        formDataToSend.append("licensePlate", vehicleInfo.licensePlate || "");
        formDataToSend.append(
          "mileage",
          vehicleInfo.mileage?.toString() || "0"
        );

        if (vehicleInfo.registrationExpiration) {
          const dateValue =
            vehicleInfo.registrationExpiration instanceof Date
              ? vehicleInfo.registrationExpiration.toISOString().split("T")[0]
              : String(vehicleInfo.registrationExpiration);
          formDataToSend.append("registrationExpiration", dateValue);
        }
      }

      const result = await updateEquipmentAsset(formDataToSend);

      // Reset change tracking after successful save
      setChangedFields(new Set());
      setHasUnsavedChanges(false);

      // Update selected equipment with server response
      if (result.data) {
        const updatedEquipment: Equipment = {
          id: result.data.id,
          qrId: result.data.qrId || "",
          name: result.data.name,
          description: result.data.description || "",
          equipmentTag: result.data.equipmentTag,
          status: result.data.status || "",
          isActive: result.data.isActive ?? true,
          inUse: result.data.inUse ?? false,
          overWeight: result.data.overWeight ?? false,
          currentWeight: result.data.currentWeight ?? 0,
          equipmentVehicleInfo: result.data.equipmentVehicleInfo || undefined,
        };
        setSelectEquipment(updatedEquipment);
      } else {
        setSelectEquipment({ ...formData });
      }

      setSuccessfullyUpdated(true);
      setTimeout(() => setSuccessfullyUpdated(false), 3000);
    } catch (error) {
      console.error("Error saving equipment:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error occurred";
      alert(`Failed to save equipment: ${errorMessage}`);
    } finally {
      setIsSaving(false);
    }
  }, [formData, hasUnsavedChanges, isSaving, setSelectEquipment]);

  /**
   * Discard all changes and revert to original data
   */
  const handleDiscardChanges = useCallback(() => {
    if (selectEquipment) {
      if (
        hasUnsavedChanges &&
        !confirm(
          "Are you sure you want to discard all changes? This action cannot be undone."
        )
      ) {
        return;
      }
      setFormData({ ...selectEquipment });
      setChangedFields(new Set());
      setHasUnsavedChanges(false);
    }
  }, [selectEquipment, hasUnsavedChanges]);

  /**
   * Revert a specific field to its original value
   */
  const handleRevertField = useCallback(
    (fieldName: string) => {
      if (!selectEquipment || !formData) return;

      setFormData((prev: Equipment | null) => {
        if (!prev) return prev;

        if (fieldName.startsWith("vehicle.")) {
          const vehicleField = fieldName.replace("vehicle.", "");
          const originalVehicleValue =
            selectEquipment.equipmentVehicleInfo?.[
              vehicleField as keyof typeof selectEquipment.equipmentVehicleInfo
            ];

          return {
            ...prev,
            equipmentVehicleInfo: {
              make: null,
              model: null,
              year: null,
              licensePlate: null,
              registrationExpiration: null,
              mileage: null,
              ...prev.equipmentVehicleInfo,
              [vehicleField]: originalVehicleValue,
            },
          };
        }

        const originalValue = selectEquipment[fieldName as keyof Equipment];
        return { ...prev, [fieldName]: originalValue };
      });

      const newChangedFields = new Set(changedFields);
      newChangedFields.delete(fieldName);
      setChangedFields(newChangedFields);
      setHasUnsavedChanges(newChangedFields.size > 0);
    },
    [selectEquipment, formData, changedFields]
  );

  /**
   * Handle registration of new equipment
   */
  const handleNewEquipmentSubmit = useCallback(
    async (newEquipment: any) => {
      if (!session?.user?.id) {
        console.error("User session not found");
        alert("Please log in to register equipment.");
        return;
      }

      try {
        setIsSaving(true);
        const result = await registerEquipment(newEquipment, session.user.id);

        if (result.success && result.data) {
          const equipmentToSelect: Equipment = {
            id: result.data.id,
            qrId: result.data.qrId,
            name: result.data.name,
            description: result.data.description,
            equipmentTag: result.data.equipmentTag,
            status: result.data.status,
            isActive: result.data.isActive,
            inUse: result.data.inUse,
            overWeight: result.data.overWeight || false,
            currentWeight: result.data.currentWeight || 0,
            equipmentVehicleInfo:
              (result.data as any).equipmentVehicleInfo || undefined,
          };
          setSelectEquipment(equipmentToSelect);

          setSuccessfullyUpdated(true);
          setTimeout(() => setSuccessfullyUpdated(false), 3000);
        } else {
          console.error("Equipment registration failed:", result.error);
          alert(`Failed to register equipment: ${result.error}`);
        }
      } catch (error) {
        console.error("Error creating equipment:", error);
        alert("An unexpected error occurred while registering the equipment.");
      } finally {
        setIsSaving(false);
      }
    },
    [session, setSelectEquipment]
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
    handleNewEquipmentSubmit,
  };
};
