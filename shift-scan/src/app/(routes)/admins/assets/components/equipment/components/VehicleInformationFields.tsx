import { EditableFields } from "@/components/(reusable)/EditableField";
import { Equipment } from "../../../types";

interface VehicleInformationFieldsProps {
  formData: Equipment | null;
  changedFields: Set<string>;
  onInputChange: (fieldName: string, value: string | number | Date) => void;
  onRevertField: (fieldName: string) => void;
  /** Whether the form is currently saving */
  isSaving?: boolean;
}

/**
 * Component for rendering vehicle-specific information fields
 * Only displays when equipment has vehicle information
 */
export default function VehicleInformationFields({
  formData,
  changedFields,
  onInputChange,
  onRevertField,
  isSaving = false,
}: VehicleInformationFieldsProps) {
  if (!formData?.equipmentVehicleInfo) {
    return null;
  }

  return (
    <>
      <label htmlFor="VehicleMake" className="text-sm">
        Vehicle Make
      </label>
      <EditableFields
        type="text"
        name="VehicleMake"
        value={formData.equipmentVehicleInfo.make || ""}
        onChange={(e) => onInputChange("vehicle.make", e.target.value)}
        isChanged={changedFields.has("vehicle.make")}
        onRevert={() => onRevertField("vehicle.make")}
        variant={changedFields.has("vehicle.make") ? "edited" : "default"}
        size="sm"
        disable={isSaving}
      />

      <label htmlFor="VehicleModel" className="text-sm">
        Vehicle Model
      </label>
      <EditableFields
        type="text"
        name="VehicleModel"
        value={formData.equipmentVehicleInfo.model || ""}
        onChange={(e) => onInputChange("vehicle.model", e.target.value)}
        isChanged={changedFields.has("vehicle.model")}
        onRevert={() => onRevertField("vehicle.model")}
        variant={changedFields.has("vehicle.model") ? "edited" : "default"}
        size="sm"
        disable={isSaving}
      />

      <label htmlFor="VehicleYear" className="text-sm">
        Vehicle Year
      </label>
      <EditableFields
        type="text"
        name="VehicleYear"
        value={formData.equipmentVehicleInfo.year || ""}
        onChange={(e) => onInputChange("vehicle.year", e.target.value)}
        isChanged={changedFields.has("vehicle.year")}
        onRevert={() => onRevertField("vehicle.year")}
        variant={changedFields.has("vehicle.year") ? "edited" : "default"}
        size="sm"
        placeholder="YYYY"
        pattern="[0-9]{4}"
        maxLength={4}
        disable={isSaving}
      />

      <label htmlFor="VehicleLicensePlate" className="text-sm">
        License Plate
      </label>
      <EditableFields
        type="text"
        name="VehicleLicensePlate"
        value={formData.equipmentVehicleInfo.licensePlate || ""}
        onChange={(e) => onInputChange("vehicle.licensePlate", e.target.value)}
        isChanged={changedFields.has("vehicle.licensePlate")}
        onRevert={() => onRevertField("vehicle.licensePlate")}
        variant={
          changedFields.has("vehicle.licensePlate") ? "edited" : "default"
        }
        size="sm"
        disable={isSaving}
      />

      <label htmlFor="VehicleRegistration" className="text-sm">
        Registration Expiration
      </label>
      <EditableFields
        type="date"
        name="VehicleRegistration"
        value={
          formData.equipmentVehicleInfo.registrationExpiration
            ? new Date(formData.equipmentVehicleInfo.registrationExpiration)
                .toISOString()
                .split("T")[0]
            : ""
        }
        onChange={(e) =>
          onInputChange(
            "vehicle.registrationExpiration",
            new Date(e.target.value)
          )
        }
        isChanged={changedFields.has("vehicle.registrationExpiration")}
        onRevert={() => onRevertField("vehicle.registrationExpiration")}
        variant={
          changedFields.has("vehicle.registrationExpiration")
            ? "edited"
            : "default"
        }
        size="sm"
        disable={isSaving}
      />

      <label htmlFor="VehicleMileage" className="text-sm">
        Vehicle Mileage
      </label>
      <EditableFields
        type="number"
        name="VehicleMileage"
        value={formData.equipmentVehicleInfo.mileage?.toString() || ""}
        onChange={(e) =>
          onInputChange("vehicle.mileage", Number(e.target.value))
        }
        isChanged={changedFields.has("vehicle.mileage")}
        onRevert={() => onRevertField("vehicle.mileage")}
        variant={changedFields.has("vehicle.mileage") ? "edited" : "default"}
        size="sm"
        disable={isSaving}
      />
    </>
  );
}
