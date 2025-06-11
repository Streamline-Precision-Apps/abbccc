import { EditableFields } from "@/components/(reusable)/EditableField";
import { Holds } from "@/components/(reusable)/holds";
import { Equipment } from "../../../types";

interface EquipmentBasicFieldsProps {
  formData: Equipment | null;
  changedFields: Set<string>;
  isSaving: boolean;
  onInputChange: (fieldName: string, value: string | number | boolean) => void;
  onRevertField: (fieldName: string) => void;
}

/**
 * Component for rendering basic equipment fields
 * Includes name, code, status, weight, and tag fields
 */
export default function EquipmentBasicFields({
  formData,
  changedFields,
  isSaving,
  onInputChange,
  onRevertField,
}: EquipmentBasicFieldsProps) {
  const stateOptions = [
    { label: "Available", value: "AVAILABLE" },
    { label: "In Use", value: "IN_USE" },
    { label: "Maintenance", value: "MAINTENANCE" },
    { label: "Needs Repair", value: "NEEDS_REPAIR" },
    { label: "Retired", value: "RETIRED" },
  ];

  const approvalStatusOptions = [
    { label: "Pending", value: "PENDING" },
    { label: "Approved", value: "APPROVED" },
    { label: "Rejected", value: "REJECTED" },
    { label: "Changes Requested", value: "CHANGES_REQUESTED" },
  ];

  const overWeightOptions = [
    { label: "True", value: "true" },
    { label: "False", value: "false" },
  ];

  return (
    <Holds className="space-y-3">
      <Holds>
        <label htmlFor="EquipmentName" className="text-sm">
          Equipment Name
        </label>
        <EditableFields
          type="text"
          name="EquipmentName"
          value={formData?.name || ""}
          onChange={(e) => onInputChange("name", e.target.value)}
          isChanged={changedFields.has("name")}
          onRevert={() => onRevertField("name")}
          variant={changedFields.has("name") ? "edited" : "default"}
          size="sm"
          disable={isSaving}
        />
      </Holds>
      <Holds>
        <label htmlFor="EquipmentCode" className="text-sm">
          Equipment Code
        </label>
        <EditableFields
          type="text"
          name="EquipmentCode"
          onChange={(e) => onInputChange("qrId", e.target.value)}
          value={formData?.qrId || ""}
          isChanged={false}
          readonly={true}
          disable={true}
          variant="default"
          size="sm"
        />
      </Holds>
      <Holds>
        <label htmlFor="EquipmentState" className="text-sm">
          Equipment State
        </label>
        <EditableFields
          formDatatype="select"
          name="EquipmentState"
          value={formData?.state || ""}
          onChange={(e) => onInputChange("state", e.target.value)}
          isChanged={changedFields.has("state")}
          onRevert={() => onRevertField("state")}
          variant={changedFields.has("state") ? "edited" : "default"}
          size="sm"
          options={stateOptions}
        />
      </Holds>

      <Holds>
        <label htmlFor="EquipmentApprovalStatus" className="text-sm">
          Approval Status
        </label>
        <EditableFields
          formDatatype="select"
          name="EquipmentApprovalStatus"
          value={formData?.approvalStatus || ""}
          onChange={(e) => onInputChange("approvalStatus", e.target.value)}
          isChanged={changedFields.has("approvalStatus")}
          onRevert={() => onRevertField("approvalStatus")}
          variant={changedFields.has("approvalStatus") ? "edited" : "default"}
          size="sm"
          options={approvalStatusOptions}
        />
      </Holds>

      <Holds>
        <label htmlFor="CurrentWeight" className="text-sm">
          Current Weight
        </label>
        <EditableFields
          type="number"
          name="CurrentWeight"
          value={formData?.currentWeight?.toString() || ""}
          onChange={(e) =>
            onInputChange("currentWeight", Number(e.target.value))
          }
          isChanged={changedFields.has("currentWeight")}
          onRevert={() => onRevertField("currentWeight")}
          variant={changedFields.has("currentWeight") ? "edited" : "default"}
          min={1}
          size="sm"
        />
      </Holds>

      <Holds>
        <label htmlFor="OverweightEquipment" className="text-sm">
          Overweight Equipment
        </label>
        <EditableFields
          formDatatype="select"
          name="OverweightEquipment"
          value={formData?.overWeight ? "true" : "false"}
          onChange={(e) =>
            onInputChange("overWeight", e.target.value === "true")
          }
          isChanged={changedFields.has("overWeight")}
          onRevert={() => onRevertField("overWeight")}
          variant={changedFields.has("overWeight") ? "edited" : "default"}
          size="sm"
          options={overWeightOptions}
        />
      </Holds>

      <Holds>
        <label htmlFor="EquipmentTag" className="text-sm">
          Equipment Tag
        </label>
        <EditableFields
          formDatatype="select"
          options={[
            { label: "Truck", value: "TRUCK" },
            { label: "Trailer", value: "TRAILER" },
            { label: "Vehicle", value: "VEHICLE" },
            { label: "Equipment", value: "EQUIPMENT" },
            { label: "Other", value: "OTHER" },
          ]}
          type="text"
          name="EquipmentTag"
          value={formData?.equipmentTag || ""}
          onChange={(e) => onInputChange("equipmentTag", e.target.value)}
          isChanged={changedFields.has("equipmentTag")}
          onRevert={() => onRevertField("equipmentTag")}
          variant={changedFields.has("equipmentTag") ? "edited" : "default"}
          size="sm"
        />
      </Holds>
      {formData?.equipmentTag !== "EQUIPMENT" && (
        <>
          <Holds>
            <label htmlFor="VehicleMake" className="text-sm">
              Make
            </label>
            <EditableFields
              type="text"
              name="make"
              value={formData?.equipmentVehicleInfo?.make || ""}
              onChange={(e) =>
                onInputChange("equipmentVehicleInfo.make", e.target.value)
              }
              isChanged={changedFields.has("equipmentVehicleInfo.make")}
              onRevert={() => onRevertField("equipmentVehicleInfo.make")}
              variant={
                changedFields.has("equipmentVehicleInfo.make")
                  ? "edited"
                  : "default"
              }
              size="sm"
            />
          </Holds>
          <Holds>
            <label htmlFor="model" className="text-sm">
              Model
            </label>
            <EditableFields
              type="text"
              name="model"
              value={formData?.equipmentVehicleInfo?.model || ""}
              onChange={(e) =>
                onInputChange("equipmentVehicleInfo.model", e.target.value)
              }
              isChanged={changedFields.has("equipmentVehicleInfo.model")}
              onRevert={() => onRevertField("equipmentVehicleInfo.model")}
              variant={
                changedFields.has("equipmentVehicleInfo.model")
                  ? "edited"
                  : "default"
              }
              size="sm"
            />
          </Holds>
          <Holds>
            <label htmlFor="VehicleYear" className="text-sm">
              Vehicle Year
            </label>
            <EditableFields
              type="number"
              name="VehicleYear"
              value={formData?.equipmentVehicleInfo?.year?.toString() || ""}
              onChange={(e) =>
                onInputChange(
                  "equipmentVehicleInfo.year",
                  Number(e.target.value)
                )
              }
              isChanged={changedFields.has("equipmentVehicleInfo.year")}
              onRevert={() => onRevertField("equipmentVehicleInfo.year")}
              variant={
                changedFields.has("equipmentVehicleInfo.year")
                  ? "edited"
                  : "default"
              }
              size="sm"
            />
          </Holds>
          <Holds>
            <label htmlFor="" className="text-sm">
              license Plate
            </label>
            <EditableFields
              type="text"
              name="licensePlate"
              value={formData?.equipmentVehicleInfo?.licensePlate || ""}
              onChange={(e) =>
                onInputChange(
                  "equipmentVehicleInfo.licensePlate",
                  e.target.value
                )
              }
              isChanged={changedFields.has("equipmentVehicleInfo.licensePlate")}
              onRevert={() =>
                onRevertField("equipmentVehicleInfo.licensePlate")
              }
              variant={
                changedFields.has("equipmentVehicleInfo.licensePlate")
                  ? "edited"
                  : "default"
              }
              size="sm"
            />
          </Holds>
          <Holds>
            <label htmlFor="registrationExpiration" className="text-sm">
              Registration Expiration
            </label>
            <EditableFields
              type="date"
              name="registrationExpiration"
              value={
                formData?.equipmentVehicleInfo?.registrationExpiration?.toString() ||
                ""
              }
              onChange={(e) =>
                onInputChange(
                  "equipmentVehicleInfo.registrationExpiration",
                  e.target.value
                )
              }
              isChanged={changedFields.has(
                "equipmentVehicleInfo.registrationExpiration"
              )}
              onRevert={() =>
                onRevertField("equipmentVehicleInfo.registrationExpiration")
              }
              variant={
                changedFields.has("equipmentVehicleInfo.registrationExpiration")
                  ? "edited"
                  : "default"
              }
              size="sm"
            />
          </Holds>
          <Holds>
            <label htmlFor="mileage" className="text-sm">
              Mileage
            </label>
            <EditableFields
              type="number"
              name="mileage"
              value={formData?.equipmentVehicleInfo?.mileage?.toString() || ""}
              onChange={(e) =>
                onInputChange(
                  "equipmentVehicleInfo.mileage",
                  Number(e.target.value)
                )
              }
              isChanged={changedFields.has("equipmentVehicleInfo.mileage")}
              onRevert={() => onRevertField("equipmentVehicleInfo.mileage")}
              variant={
                changedFields.has("equipmentVehicleInfo.mileage")
                  ? "edited"
                  : "default"
              }
              size="sm"
            />
          </Holds>
        </>
      )}
    </Holds>
  );
}
