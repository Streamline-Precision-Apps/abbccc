"use client";
import { Grids } from "@/components/(reusable)/grids";
import { Holds } from "@/components/(reusable)/holds";
import { Inputs } from "@/components/(reusable)/inputs";
import { Selects } from "@/components/(reusable)/selects";
import { TextAreas } from "@/components/(reusable)/textareas";
import { Texts } from "@/components/(reusable)/texts";
import { useState, useEffect } from "react";
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
  };

  const handleSubmit = () => {
    if (!formData.name.trim() || !formData.equipmentTag.trim()) {
      alert("Please fill in all required fields (Name and Equipment Tag)");
      return;
    }

    // If no vehicle info is needed, remove it from the submission
    const submissionData = {
      ...formData,
      equipmentVehicleInfo: hasVehicleInfo
        ? formData.equipmentVehicleInfo
        : undefined,
    };

    onSubmit(submissionData);
  };

  return (
    <Holds className="w-full h-full">
      <Grids className="w-full h-full grid-cols-[1fr_1fr] gap-4">
        <Holds className="w-full h-full overflow-y-auto overflow-x-hidden">
          <label htmlFor="EquipmentName" className="text-xs font-medium">
            Equipment Name *
          </label>
          <Inputs
            type="text"
            name="EquipmentName"
            value={formData.name}
            onChange={(e) => handleInputChange("name", e.target.value)}
            className="w-full text-xs"
            required
          />
          <label htmlFor="EquipmentDescription" className="text-xs font-medium">
            Equipment Description
          </label>
          <TextAreas
            name="EquipmentDescription"
            value={formData.description || ""}
            onChange={(e) => handleInputChange("description", e.target.value)}
            rows={2}
            className="w-full text-xs"
            placeholder="Enter equipment description..."
            style={{ resize: "none" }}
          />
          <label htmlFor="CurrentWeight" className="text-xs font-medium">
            Current Weight
          </label>
          <Inputs
            type="number"
            name="CurrentWeight"
            value={formData.currentWeight}
            onChange={(e) =>
              handleInputChange("currentWeight", Number(e.target.value))
            }
            placeholder="0"
            className="text-xs"
          />

          <label htmlFor="OverweightEquipment" className="text-xs font-medium">
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
            className="text-center text-xs"
          >
            <option value="">Select Weight Status</option>
            <option value="false">No</option>
            <option value="true">Yes</option>
          </Selects>

          <label htmlFor="EquipmentStatus" className="text-xs font-medium">
            Equipment Type
          </label>
          <Selects
            name="EquipmentStatus"
            value={formData.equipmentTag}
            onChange={(e) => handleInputChange("equipmentTag", e.target.value)}
            className="text-xs"
          >
            <option value="">Select Equipment Type</option>
            <option value="TRUCK">Truck</option>
            <option value="TRAILER">Trailer</option>
            <option value="VEHICLE">Vehicle</option>
            <option value="EQUIPMENT">Equipment</option>
          </Selects>
          {formData.equipmentTag !== "EQUIPMENT" &&
            formData.equipmentTag !== "" && (
              <>
                <label htmlFor="VehicleMake" className="text-xs font-medium">
                  Vehicle Make
                </label>
                <Inputs
                  type="text"
                  name="VehicleMake"
                  value={formData.equipmentVehicleInfo?.make || ""}
                  onChange={(e) =>
                    handleInputChange("vehicle.make", e.target.value)
                  }
                  placeholder="Make"
                  className="text-xs"
                />
                <label htmlFor="VehicleModel" className="text-xs font-medium">
                  Vehicle Model
                </label>
                <Inputs
                  type="text"
                  name="VehicleModel"
                  value={formData.equipmentVehicleInfo?.model || ""}
                  onChange={(e) =>
                    handleInputChange("vehicle.model", e.target.value)
                  }
                  placeholder="Model"
                  className="text-xs"
                />
                <label htmlFor="VehicleYear" className="text-xs font-medium">
                  Vehicle Year
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
                  placeholder="YYYY"
                  className="text-xs"
                />
                <label
                  htmlFor="VehicleLicensePlate"
                  className="text-xs font-medium"
                >
                  License Plate
                </label>
                <Inputs
                  type="text"
                  name="VehicleLicensePlate"
                  value={formData.equipmentVehicleInfo?.licensePlate || ""}
                  onChange={(e) =>
                    handleInputChange("vehicle.licensePlate", e.target.value)
                  }
                  placeholder="License Plate"
                  className="text-xs"
                />
                <label
                  htmlFor="VehicleRegistration"
                  className="text-xs font-medium"
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
                <label htmlFor="VehicleMileage" className="text-xs font-medium">
                  Vehicle Mileage
                </label>
                <Inputs
                  type="number"
                  name="VehicleMileage"
                  value={formData.equipmentVehicleInfo?.mileage || ""}
                  onChange={(e) =>
                    handleInputChange("vehicle.mileage", Number(e.target.value))
                  }
                  placeholder="Mileage"
                  className="text-xs"
                />
              </>
            )}
        </Holds>

        <Holds className="w-full h-full">
          <Texts position={"left"} size={"sm"} className="font-bold">
            Safety Documents & Policies
          </Texts>
          <Holds className="w-full h-full border-[3px] rounded-[10px] border-black">
            <SafetyDocumentsAndPolicies />
          </Holds>
        </Holds>
      </Grids>
    </Holds>
  );
}
