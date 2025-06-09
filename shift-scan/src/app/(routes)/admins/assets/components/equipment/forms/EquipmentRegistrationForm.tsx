"use client";
import { Grids } from "@/components/(reusable)/grids";
import { Holds } from "@/components/(reusable)/holds";
import { Inputs } from "@/components/(reusable)/inputs";
import { Selects } from "@/components/(reusable)/selects";
import { TextAreas } from "@/components/(reusable)/textareas";
import { Texts } from "@/components/(reusable)/texts";
import React, { useState, useEffect } from "react";
import ValidationMessage from "../../shared/ValidationMessage";
// Helper for validation
const getValidationErrors = (formData: NewEquipment) => {
  const errors: Record<string, string> = {};
  if (!formData.name.trim()) errors.name = "Equipment Name is required.";
  if (!formData.equipmentTag.trim())
    errors.equipmentTag = "Equipment Type is required.";
  if (
    formData.equipmentTag === "TRUCK" ||
    formData.equipmentTag === "TRAILER" ||
    formData.equipmentTag === "VEHICLE"
  ) {
    const vehicle = formData.equipmentVehicleInfo ?? {
      make: "",
      model: "",
      year: "",
      licensePlate: "",
      registrationExpiration: null,
      mileage: "",
    };
    if (!vehicle.make || !vehicle.make.toString().trim())
      errors.make = "Vehicle Make is required.";
    if (!vehicle.model || !vehicle.model.toString().trim())
      errors.model = "Vehicle Model is required.";
    if (!vehicle.year || !vehicle.year.toString().trim())
      errors.year = "Vehicle Year is required.";
    if (!vehicle.licensePlate || !vehicle.licensePlate.toString().trim())
      errors.licensePlate = "License Plate is required.";
    if (
      vehicle.mileage === null ||
      vehicle.mileage === undefined ||
      vehicle.mileage === "" ||
      isNaN(Number(vehicle.mileage))
    )
      errors.mileage = "Vehicle Mileage is required.";
  }
  return errors;
};
import SafetyDocumentsAndPolicies from "./SafetyDocumentsAndPolicies";

type NewEquipment = {
  name: string;
  description?: string;
  equipmentTag: string;
  status?: string;
  isActive: boolean;
  inUse: boolean;
  overWeight: boolean | null;
  currentWeight: number;
  equipmentVehicleInfo?: {
    make: string | null;
    model: string | null;
    year: string | null;
    licensePlate: string | null;
    registrationExpiration: Date | null;
    mileage: number | null;
  };
};

interface EquipmentRegistrationFormProps {
  onSubmit: (equipment: NewEquipment) => void;
  onCancel: () => void;
  onUnsavedChangesChange?: (hasChanges: boolean) => void;
}

export default function EquipmentRegistrationForm({
  onSubmit,
  onCancel,
  onUnsavedChangesChange,
}: EquipmentRegistrationFormProps) {
  const [formData, setFormData] = useState<NewEquipment>({
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
  });

  const [hasVehicleInfo, setHasVehicleInfo] = useState(false);
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [triedSubmit, setTriedSubmit] = useState(false);

  // Track if form has unsaved changes
  const hasUnsavedChanges =
    formData.name.trim() !== "" ||
    (formData.description?.trim() || "") !== "" ||
    formData.equipmentTag !== "" ||
    formData.currentWeight !== 0 ||
    formData.overWeight !== null ||
    (formData.equipmentVehicleInfo?.make?.trim() || "") !== "" ||
    (formData.equipmentVehicleInfo?.model?.trim() || "") !== "" ||
    (formData.equipmentVehicleInfo?.year?.trim() || "") !== "" ||
    (formData.equipmentVehicleInfo?.licensePlate?.trim() || "") !== "" ||
    formData.equipmentVehicleInfo?.registrationExpiration !== null ||
    (formData.equipmentVehicleInfo?.mileage || 0) > 0;

  // Notify parent component when unsaved changes state changes
  useEffect(() => {
    onUnsavedChangesChange?.(hasUnsavedChanges);
  }, [hasUnsavedChanges, onUnsavedChangesChange]);

  const handleInputChange = (
    fieldName: string,
    value: string | number | boolean | Date
  ) => {
    setFormData((prev) => {
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
    setTouched((prev) => ({ ...prev, [fieldName]: true }));
  };

  const handleBlur = (fieldName: string) => {
    setTouched((prev) => ({ ...prev, [fieldName]: true }));
  };

  const handleSubmit = () => {
    setTriedSubmit(true);
    const errors = getValidationErrors(formData);
    if (Object.keys(errors).length > 0) {
      // Mark all fields as touched to show errors
      setTouched((prev) => ({
        ...prev,
        name: true,
        equipmentTag: true,
        make: true,
        model: true,
        year: true,
        licensePlate: true,
        mileage: true,
      }));
      return;
    }
    // If no vehicle info is needed, remove it from the submission
    const submissionData = {
      ...formData,
      equipmentVehicleInfo:
        formData.equipmentTag === "TRUCK" ||
        formData.equipmentTag === "TRAILER" ||
        formData.equipmentTag === "VEHICLE"
          ? formData.equipmentVehicleInfo
          : undefined,
    };
    onSubmit(submissionData);
  };

  const validationErrors = getValidationErrors(formData);
  const showError = (field: string) =>
    (touched[field] || triedSubmit) && validationErrors[field];

  return (
    <div className="w-full h-full flex flex-col">
      <Grids className="w-full flex-1 grid-cols-[1fr_1fr] gap-4 overflow-hidden">
        <div className="flex flex-col overflow-y-auto overflow-x-hidden no-scrollbar">
          <label htmlFor="EquipmentName" className="text-sm font-medium">
            Equipment Name <span className="text-red-500">*</span>
          </label>
          <Inputs
            type="text"
            name="EquipmentName"
            value={formData.name}
            onChange={(e) => handleInputChange("name", e.target.value)}
            onBlur={() => handleBlur("name")}
            className="w-full text-xs"
            variant={"validationMessage"}
            required
          />
          <ValidationMessage
            message={showError("name") ? validationErrors.name : undefined}
          />
          <label htmlFor="EquipmentDescription" className="text-sm font-medium">
            Equipment Description
          </label>
          <TextAreas
            name="EquipmentDescription"
            value={formData.description || ""}
            onChange={(e) => handleInputChange("description", e.target.value)}
            rows={4}
            className="w-full text-xs min-h-[96px] mb-5"
            placeholder="Enter equipment description..."
            style={{ resize: "none" }}
          />

          <label htmlFor="CurrentWeight" className="text-sm font-medium">
            Current Weight <span className="italic">{`(lbs)`}</span>
          </label>
          <Inputs
            type="number"
            name="CurrentWeight"
            value={formData.currentWeight}
            onChange={(e) =>
              handleInputChange("currentWeight", Number(e.target.value))
            }
            placeholder="0"
            className="text-xs mb-5 "
          />

          <label htmlFor="OverweightEquipment" className="text-sm font-medium">
            Overweight Equipment
          </label>
          <Selects
            name="OverweightEquipment"
            value={
              formData.overWeight === true
                ? "true"
                : formData.overWeight === false
                ? "false"
                : ""
            }
            onChange={(e) =>
              handleInputChange("overWeight", e.target.value === "true")
            }
            className="text-center text-xs mb-5"
          >
            <option value="">Select Weight Status</option>
            <option value="false">No</option>
            <option value="true">Yes</option>
          </Selects>
          <label htmlFor="EquipmentStatus" className="text-sm font-medium">
            Equipment Type <span className="text-red-500">*</span>
          </label>
          <Selects
            name="EquipmentStatus"
            value={formData.equipmentTag}
            onChange={(e) => handleInputChange("equipmentTag", e.target.value)}
            onBlur={() => handleBlur("equipmentTag")}
            className="text-xs mb-0"
            variant={"validationMessage"}
            required
          >
            <option value="">Select Equipment Type</option>
            <option value="TRUCK">Truck</option>
            <option value="TRAILER">Trailer</option>
            <option value="VEHICLE">Vehicle</option>
            <option value="EQUIPMENT">Equipment</option>
          </Selects>
          <ValidationMessage
            message={
              showError("equipmentTag")
                ? validationErrors.equipmentTag
                : undefined
            }
          />
          {formData.equipmentTag !== "EQUIPMENT" &&
            formData.equipmentTag !== "" && (
              <>
                <label htmlFor="VehicleMake" className="text-sm font-medium">
                  Vehicle Make <span className="text-red-500">*</span>
                </label>
                <Inputs
                  type="text"
                  name="VehicleMake"
                  value={formData.equipmentVehicleInfo?.make || ""}
                  onChange={(e) =>
                    handleInputChange("vehicle.make", e.target.value)
                  }
                  onBlur={() => handleBlur("make")}
                  placeholder="Make"
                  className="text-xs"
                  variant={"validationMessage"}
                  required
                />
                <ValidationMessage
                  message={
                    showError("make") ? validationErrors.make : undefined
                  }
                />
                <label htmlFor="VehicleModel" className="text-sm font-medium">
                  Vehicle Model <span className="text-red-500">*</span>
                </label>
                <Inputs
                  type="text"
                  name="VehicleModel"
                  value={formData.equipmentVehicleInfo?.model || ""}
                  onChange={(e) =>
                    handleInputChange("vehicle.model", e.target.value)
                  }
                  onBlur={() => handleBlur("model")}
                  placeholder="Model"
                  className="text-xs"
                  variant={"validationMessage"}
                  required
                />
                <ValidationMessage
                  message={
                    showError("model") ? validationErrors.model : undefined
                  }
                />
                <label htmlFor="VehicleYear" className="text-sm font-medium">
                  Vehicle Year <span className="text-red-500">*</span>
                </label>
                <Inputs
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]{4}"
                  maxLength={4}
                  name="VehicleYear"
                  value={formData.equipmentVehicleInfo?.year || ""}
                  onChange={(e) =>
                    handleInputChange("vehicle.year", e.target.value)
                  }
                  onBlur={() => handleBlur("year")}
                  placeholder="YYYY"
                  className="text-xs"
                  variant={"validationMessage"}
                  required
                />
                <ValidationMessage
                  message={
                    showError("year") ? validationErrors.year : undefined
                  }
                />
                <label
                  htmlFor="VehicleLicensePlate"
                  className="text-sm font-medium"
                >
                  License Plate <span className="text-red-500">*</span>
                </label>
                <Inputs
                  type="text"
                  name="VehicleLicensePlate"
                  value={formData.equipmentVehicleInfo?.licensePlate || ""}
                  onChange={(e) =>
                    handleInputChange("vehicle.licensePlate", e.target.value)
                  }
                  onBlur={() => handleBlur("licensePlate")}
                  placeholder="License Plate"
                  className="text-xs mb-0"
                  variant={"validationMessage"}
                  required
                />
                <ValidationMessage
                  message={
                    showError("licensePlate")
                      ? validationErrors.licensePlate
                      : undefined
                  }
                />

                <label htmlFor="VehicleMileage" className="text-sm font-medium">
                  Vehicle Mileage <span className="text-red-500">*</span>
                </label>
                <Inputs
                  type="number"
                  name="VehicleMileage"
                  value={formData.equipmentVehicleInfo?.mileage || ""}
                  onChange={(e) =>
                    handleInputChange("vehicle.mileage", Number(e.target.value))
                  }
                  onBlur={() => handleBlur("mileage")}
                  placeholder="Mileage"
                  className="text-xs"
                  variant={"validationMessage"}
                  required
                />
                <ValidationMessage
                  message={
                    showError("mileage") ? validationErrors.mileage : undefined
                  }
                />
                <label
                  htmlFor="VehicleRegistration"
                  className="text-sm font-medium"
                >
                  Registration Expiration
                </label>
                <Inputs
                  type="date"
                  name="VehicleRegistration"
                  value={
                    formData.equipmentVehicleInfo?.registrationExpiration
                      ? new Date(
                          formData.equipmentVehicleInfo.registrationExpiration
                        )
                          .toISOString()
                          .split("T")[0]
                      : ""
                  }
                  onChange={(e) =>
                    handleInputChange(
                      "vehicle.registrationExpiration",
                      new Date(e.target.value)
                    )
                  }
                  className="text-xs"
                />
              </>
            )}
        </div>

        <Holds className="h-full col-span-1 overflow-y-auto ">
          <Texts position={"left"} size={"sm"} className="font-bold">
            Safety Documents & Policies
          </Texts>

          <Holds className="w-full h-full border-[3px] rounded-[10px] border-black p-2">
            <Texts
              size={"xs"}
              text={"italic"}
              className="text-center text-gray-500 "
            >
              Connect your Safety document and policy to your equipment to help
              workers know which documents are required to operate the
              equipment.
              <br />
              <br />
            </Texts>
            <Texts size={"xs"} className="text-center">
              Coming Soon!
            </Texts>
            {/* Safety Documents and Policies 
            <SafetyDocumentsAndPolicies />
            */}
          </Holds>
        </Holds>
      </Grids>
    </div>
  );
}
