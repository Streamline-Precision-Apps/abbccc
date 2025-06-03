"use client";
import { Holds } from "@/components/(reusable)/holds";
import { EditableFields } from "@/components/(reusable)/EditableField";
import React, { useCallback, useMemo, ChangeEvent } from "react";
import { CostCodeBasicFieldsProps } from "../types";
import { CostCode } from "../../../types";
import {
  getCostCodeNumber,
  getCostCodeDescription,
  combineCostCodeName,
} from "../utils/formatters";

/**
 * Basic cost code information fields component
 * Handles name and active status
 *
 * @param props The component props from CostCodeBasicFieldsProps interface
 * @returns A form component for cost code basic fields
 */
function CostCodeBasicFields({
  formData,
  changedFields,
  onInputChange,
  onRevertField,
}: CostCodeBasicFieldsProps) {
  // Memoize helper function to check if a field has been changed
  const isFieldChanged = useCallback(
    (fieldName: keyof CostCode) => changedFields.has(fieldName),
    [changedFields]
  );

  // Use utility functions to extract number and name parts
  const numberPart = useMemo(
    () => getCostCodeNumber(formData?.name),
    [formData?.name]
  );

  const namePart = useMemo(
    () => getCostCodeDescription(formData?.name),
    [formData?.name]
  );

  // Memoize handlers for the cost code number input
  const handleCostCodeNumberChange = useCallback(
    (
      e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
    ) => {
      // Format cost code number with validation
      let formattedValue = e.target.value;

      // If user tries to delete the #, add it back
      if (!formattedValue.startsWith("#")) {
        formattedValue = "#" + formattedValue.replace(/^#+/, "");
      }

      // Remove any characters that aren't numbers, periods, or the initial #
      formattedValue = "#" + formattedValue.slice(1).replace(/[^\d.]/g, "");

      // Use utility function to combine parts
      const newFullName = combineCostCodeName(formattedValue, namePart);
      onInputChange("name", newFullName);
    },
    [namePart, onInputChange]
  );

  // Memoize handlers for the cost code name input
  const handleCostCodeNameChange = useCallback(
    (
      e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
    ) => {
      // Use utility function to combine parts
      const newFullName = combineCostCodeName(numberPart, e.target.value);
      onInputChange("name", newFullName);
    },
    [numberPart, onInputChange]
  );

  // Memoize handlers for the status select
  const handleStatusChange = useCallback(
    (
      e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
    ) => {
      onInputChange("isActive", e.target.value === "Active");
    },
    [onInputChange]
  );

  // Memoize the revert handler
  const handleRevertName = useCallback(() => {
    onRevertField("name");
  }, [onRevertField]);

  const handleRevertStatus = useCallback(() => {
    onRevertField("isActive");
  }, [onRevertField]);

  // Determine field variants based on changed state
  const nameVariant = isFieldChanged("name") ? "edited" : "default";
  const statusVariant = isFieldChanged("isActive") ? "edited" : "default";

  return (
    <Holds className="w-full">
      <label htmlFor="CostCodeNumber" className="text-sm">
        Cost Code Number
      </label>
      <EditableFields
        type="text"
        name="CostCodeNumber"
        value={numberPart}
        onChange={handleCostCodeNumberChange}
        isChanged={isFieldChanged("name")}
        onRevert={handleRevertName}
        variant={nameVariant}
        size="sm"
        className="mb-2"
      />

      <label htmlFor="CostCodeName" className="text-sm">
        Cost Code Name
      </label>
      <EditableFields
        type="text"
        name="CostCodeName"
        value={namePart}
        onChange={handleCostCodeNameChange}
        isChanged={isFieldChanged("name")}
        onRevert={handleRevertName}
        variant={nameVariant}
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
        onChange={handleStatusChange}
        isChanged={isFieldChanged("isActive")}
        onRevert={handleRevertStatus}
        variant={statusVariant}
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

// Memoize the component to prevent unnecessary re-renders
export default React.memo(CostCodeBasicFields);
