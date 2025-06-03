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
      <label htmlFor="CostCodeNumber" className="text-sm">
        Cost Code Number
      </label>
      <EditableFields
        type="text"
        name="CostCodeNumber"
        value={formData?.name ? formData.name.split(" ")[0] : ""}
        onChange={() => {}} // Read-only display
        isChanged={false}
        onRevert={() => {}}
        variant="default"
        size="sm"
        className="mb-2"
        disable={true}
      />

      <label htmlFor="CostCodeName" className="text-sm">
        Cost Code Name
      </label>
      <EditableFields
        type="text"
        name="CostCodeName"
        value={
          formData?.name ? formData.name.split(" ").slice(1).join(" ") : ""
        }
        onChange={(e) => {
          // Reconstruct the full name with the number part
          const numberPart = formData?.name ? formData.name.split(" ")[0] : "#";
          const newFullName = `${numberPart} ${e.target.value}`;
          onInputChange("name", newFullName);
        }}
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
