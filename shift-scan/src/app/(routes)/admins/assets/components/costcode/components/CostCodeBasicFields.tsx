"use client";
import { Holds } from "@/components/(reusable)/holds";
import { EditableFields } from "@/components/(reusable)/EditableField";
import { CostCode } from "../../../types";

interface CostCodeBasicFieldsProps {
  formData: CostCode;
  changedFields: Set<keyof CostCode>;
  onInputChange: (fieldName: keyof CostCode, value: string | boolean) => void;
  onRevertField: (fieldName: keyof CostCode) => void;
}

/**
 * Basic cost code information fields component
 * Handles name and active status
 */
export default function CostCodeBasicFields({
  formData,
  changedFields,
  onInputChange,
  onRevertField,
}: CostCodeBasicFieldsProps) {
  const isFieldChanged = (fieldName: keyof CostCode) =>
    changedFields.has(fieldName);

  return (
    <Holds className="w-full">
      <label htmlFor="CostCodeName" className="text-sm">
        Cost Code Name
      </label>
      <EditableFields
        type="text"
        name="CostCodeName"
        value={formData?.name || ""}
        onChange={(e) => onInputChange("name", e.target.value)}
        isChanged={isFieldChanged("name")}
        onRevert={() => onRevertField("name")}
        variant={isFieldChanged("name") ? "edited" : "default"}
        size="sm"
        className="mb-2"
      />

      <label htmlFor="isActive" className="text-sm">
        Status
      </label>
      <EditableFields
        formDatatype="select"
        name="isActive"
        value={formData.isActive ? "Active" : "Inactive"}
        onChange={(e) => onInputChange("isActive", e.target.value === "Active")}
        isChanged={isFieldChanged("isActive")}
        onRevert={() => onRevertField("isActive")}
        variant={isFieldChanged("isActive") ? "edited" : "default"}
        size="sm"
        options={[
          { label: "Active", value: "Active" },
          { label: "Inactive", value: "Inactive" },
        ]}
        className="mb-2"
      />
    </Holds>
  );
}
