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

      <label htmlFor="CurrentWeight" className="text-sm">
        Current Weight
      </label>
      <EditableFields
        type="number"
        name="CurrentWeight"
        value={formData?.currentWeight?.toString() || "0"}
        onChange={(e) => onInputChange("currentWeight", Number(e.target.value))}
        isChanged={changedFields.has("currentWeight")}
        onRevert={() => onRevertField("currentWeight")}
        variant={changedFields.has("currentWeight") ? "edited" : "default"}
        size="sm"
      />

      <label htmlFor="OverweightEquipment" className="text-sm">
        Overweight Equipment
      </label>
      <EditableFields
        formDatatype="select"
        name="OverweightEquipment"
        value={formData?.overWeight ? "true" : "false"}
        onChange={(e) => onInputChange("overWeight", e.target.value === "true")}
        isChanged={changedFields.has("overWeight")}
        onRevert={() => onRevertField("overWeight")}
        variant={changedFields.has("overWeight") ? "edited" : "default"}
        size="sm"
        options={overWeightOptions}
      />

      <label htmlFor="EquipmentTag" className="text-sm">
        Equipment Tag
      </label>
      <EditableFields
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
  );
}
