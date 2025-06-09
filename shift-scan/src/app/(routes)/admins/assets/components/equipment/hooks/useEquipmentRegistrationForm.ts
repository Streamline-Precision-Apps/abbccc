import { useState, useCallback, useEffect } from "react";

// Define the shape of the form data, same as NewEquipment in the form
export type NewEquipment = {
  name: string;
  description?: string;
  equipmentTag: string;
  status?: string;
  isActive: boolean;
  inUse: boolean;
  overWeight: boolean | null;
  currentWeight: number | null;
  equipmentVehicleInfo?: {
    make: string | null;
    model: string | null;
    year: string | null;
    licensePlate: string | null;
    registrationExpiration: Date | null;
    mileage: number | null;
  };
};

// Helper for validation (can be moved to a utils file if preferred)
const getValidationErrors = (formData: NewEquipment) => {
  const errors: Record<string, string> = {};
  if (!formData.name.trim()) errors.name = "Equipment Name is required.";
  if (!formData.equipmentTag.trim())
    errors.equipmentTag = "Equipment Tag is required.";

  const isVehicle = ["TRUCK", "TRAILER", "VEHICLE"].includes(
    formData.equipmentTag
  );

  if (isVehicle) {
    if (!formData.equipmentVehicleInfo?.make?.trim())
      errors.make = "Make is required for vehicles.";
    if (!formData.equipmentVehicleInfo?.model?.trim())
      errors.model = "Model is required for vehicles.";
    if (!formData.equipmentVehicleInfo?.year?.trim())
      errors.year = "Year is required for vehicles.";
    if (!formData.equipmentVehicleInfo?.licensePlate?.trim())
      errors.licensePlate = "License Plate is required for vehicles.";
    if (!formData.equipmentVehicleInfo?.registrationExpiration)
      errors.registrationExpiration =
        "Registration Expiration is required for vehicles.";
    if (
      formData.equipmentVehicleInfo?.mileage === null ||
      formData.equipmentVehicleInfo?.mileage === undefined ||
      formData.equipmentVehicleInfo.mileage < 0
    )
      errors.mileage = "Valid Mileage is required for vehicles.";
  }
  return errors;
};

export interface UseEquipmentRegistrationFormProps {
  initialFormData?: Partial<NewEquipment>;
  onSubmit: (equipment: NewEquipment) => Promise<void> | void; // Allow async or sync onSubmit
  onUnsavedChangesChange?: (hasChanges: boolean) => void;
  onValidityChange?: (isValid: boolean) => void;
}

export const useEquipmentRegistrationForm = ({
  initialFormData,
  onSubmit,
  onUnsavedChangesChange,
  onValidityChange,
}: UseEquipmentRegistrationFormProps) => {
  const [formData, setFormData] = useState<NewEquipment>(() => ({
    name: "",
    description: "",
    equipmentTag: "",
    status: "OPERATIONAL",
    isActive: true,
    inUse: false,
    overWeight: null,
    currentWeight: 0,
    equipmentVehicleInfo: {
      make: null,
      model: null,
      year: null,
      licensePlate: null,
      registrationExpiration: null,
      mileage: null,
    },
    ...initialFormData,
  }));

  const [hasVehicleInfo, setHasVehicleInfo] = useState(
    !!(
      initialFormData?.equipmentTag &&
      ["TRUCK", "TRAILER", "VEHICLE"].includes(initialFormData.equipmentTag)
    )
  );
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [triedSubmit, setTriedSubmit] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [hasChanged, setHasChanged] = useState(false);
  const [isFormEmpty, setIsFormEmpty] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Effect to check if the form is empty
  useEffect(() => {
    const { name, equipmentTag, equipmentVehicleInfo } = formData;
    let empty = true;
    if (name.trim() !== "" || equipmentTag.trim() !== "") {
      empty = false;
    }

    if (hasVehicleInfo && equipmentVehicleInfo) {
      if (
        equipmentVehicleInfo.make?.trim() ||
        equipmentVehicleInfo.model?.trim() ||
        equipmentVehicleInfo.year?.trim() ||
        equipmentVehicleInfo.licensePlate?.trim() ||
        equipmentVehicleInfo.registrationExpiration ||
        (equipmentVehicleInfo.mileage !== null &&
          equipmentVehicleInfo.mileage !== undefined)
      ) {
        empty = false;
      }
    }
    // Consider other fields if they have non-default initial values that differ from "empty"
    // For example, if description started as null and now has text, it's not empty.
    // Current logic focuses on core required fields for "emptiness".
    if (formData.description?.trim()) empty = false;
    if (formData.currentWeight !== 0 && formData.currentWeight !== null)
      empty = false;
    if (formData.overWeight !== null) empty = false;

    setIsFormEmpty(empty);
  }, [formData, hasVehicleInfo]);

  // Effect to validate form data and notify parent of validity
  useEffect(() => {
    const currentErrors = getValidationErrors(formData);
    setErrors(currentErrors);
    if (onValidityChange) {
      onValidityChange(Object.keys(currentErrors).length === 0);
    }
  }, [formData, onValidityChange]);

  // Effect to notify parent about unsaved changes
  useEffect(() => {
    if (onUnsavedChangesChange) {
      onUnsavedChangesChange(hasChanged);
    }
  }, [hasChanged, onUnsavedChangesChange]);

  const handleInputChange = useCallback(
    (
      e: React.ChangeEvent<
        HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
      >
    ) => {
      const { name, value, type } = e.target;
      let processedValue: string | boolean | number | null = value;

      if (type === "checkbox") {
        processedValue = (e.target as HTMLInputElement).checked;
      } else if (type === "number") {
        processedValue = value === "" ? null : parseFloat(value);
      } else if (name === "overWeight") {
        // Handle select for overWeight specifically
        if (value === "true") {
          processedValue = true;
        } else if (value === "false") {
          processedValue = false;
        } else {
          processedValue = null; // Or some default/empty state you prefer
        }
      }

      setFormData((prev) => ({ ...prev, [name]: processedValue }));
      if (!hasChanged) setHasChanged(true);
    },
    [hasChanged]
  );

  const handleVehicleInfoChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value, type } = e.target;
      let processedValue: string | number | Date | null = value;

      if (type === "date" && value) {
        // Ensure the date is correctly parsed, considering timezone issues if any
        const [year, month, day] = value.split("-").map(Number);
        processedValue = new Date(Date.UTC(year, month - 1, day));
      } else if (type === "number") {
        processedValue = value === "" ? null : parseFloat(value);
      }

      if (formData.equipmentVehicleInfo === undefined) {
        setFormData((prev) => ({
          ...prev,
          equipmentVehicleInfo: {
            make: null,
            model: null,
            year: null,
            licensePlate: null,
            registrationExpiration: null,
            mileage: null,
          },
        }));
      } else {
        setFormData((prev) => ({
          ...prev,
          equipmentVehicleInfo: {
            make: prev.equipmentVehicleInfo?.make ?? null,
            model: prev.equipmentVehicleInfo?.model ?? null,
            year: prev.equipmentVehicleInfo?.year ?? null,
            licensePlate: prev.equipmentVehicleInfo?.licensePlate ?? null,
            registrationExpiration:
              prev.equipmentVehicleInfo?.registrationExpiration ?? null,
            mileage: prev.equipmentVehicleInfo?.mileage ?? null,
            [name]: processedValue,
          },
        }));
      }
      if (!hasChanged) setHasChanged(true);
    },
    [hasChanged]
  );

  const handleEquipmentTagChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      const { value } = e.target;
      setFormData((prev) => ({ ...prev, equipmentTag: value }));
      const requiresVehicleInfo = ["TRUCK", "TRAILER", "VEHICLE"].includes(
        value
      );
      setHasVehicleInfo(requiresVehicleInfo);
      if (!requiresVehicleInfo) {
        setFormData((prev) => ({
          ...prev,
          equipmentVehicleInfo: {
            make: null,
            model: null,
            year: null,
            licensePlate: null,
            registrationExpiration: null,
            mileage: null,
          },
        }));
      }
      if (!hasChanged) setHasChanged(true);
    },
    [hasChanged]
  );

  const handleBlur = useCallback(
    (
      e: React.FocusEvent<
        HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
      >
    ) => {
      const { name } = e.target;
      setTouched((prev) => ({ ...prev, [name]: true }));
    },
    []
  );

  const resetForm = useCallback(() => {
    setFormData(() => ({
      name: "",
      description: "",
      equipmentTag: "",
      status: "OPERATIONAL",
      isActive: true,
      inUse: false,
      overWeight: null,
      currentWeight: 0,
      equipmentVehicleInfo: {
        make: null,
        model: null,
        year: null,
        licensePlate: null,
        registrationExpiration: null,
        mileage: null,
      },
      ...initialFormData,
    }));
    setTouched({});
    setErrors({});
    setTriedSubmit(false);
    setHasChanged(false);
    setHasVehicleInfo(
      !!(
        initialFormData?.equipmentTag &&
        ["TRUCK", "TRAILER", "VEHICLE"].includes(initialFormData.equipmentTag)
      )
    );
    // Ensure isFormEmpty is also reset based on initial/empty state
    // This might need a more direct way to set based on the truly empty form if initialFormData can make it non-empty
    setIsFormEmpty(true); // Assuming reset means it becomes empty
  }, [initialFormData]);

  const handleSubmit = useCallback(async () => {
    setTriedSubmit(true);
    const currentErrors = getValidationErrors(formData);
    setErrors(currentErrors);
    if (Object.keys(currentErrors).length === 0) {
      setIsSubmitting(true);
      try {
        await onSubmit(formData);
        setHasChanged(false); // Reset after successful submit
        resetForm(); // Now resetForm is defined before being used here
      } catch (error) {
        // Handle submission error (e.g., display a notification)
        console.error("Submission failed:", error);
        // Optionally, set an error state here to display in the UI
      } finally {
        setIsSubmitting(false);
      }
    }
  }, [formData, onSubmit, resetForm]);

  return {
    formData,
    setFormData,
    errors,
    touched,
    triedSubmit,
    hasVehicleInfo,
    hasChanged,
    isFormEmpty,
    isSubmitting,
    handleInputChange,
    handleVehicleInfoChange,
    handleEquipmentTagChange,
    handleBlur,
    handleSubmit,
    resetForm, // Expose reset function
    setTriedSubmit,
    setHasChanged,
  };
};
