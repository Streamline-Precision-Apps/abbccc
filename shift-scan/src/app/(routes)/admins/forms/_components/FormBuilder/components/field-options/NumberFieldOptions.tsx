"use client";

import { Input } from "@/components/ui/input";
import { FormField } from "../../types";
import { Label } from "@/components/ui/label";
import { Dispatch, SetStateAction } from "react";

interface NumberFieldOptionsProps {
  field: FormField;
  updateField: (fieldId: string, updatedProperties: Partial<FormField>) => void;
  validationErrors: Record<string, { minError?: string; maxError?: string }>;
  setValidationErrors: Dispatch<
    SetStateAction<
      Record<
        string,
        {
          minError?: string;
          maxError?: string;
        }
      >
    >
  >;
}

export const NumberFieldOptions: React.FC<NumberFieldOptionsProps> = ({
  field,
  updateField,
  validationErrors,
  setValidationErrors,
}) => {
  return (
    <div>
      <div className="flex flex-col gap-2 pb-2">
        <p className="text-sm font-semibold ">
          Number Range
          <span className="bg-blue-100 text-blue-600 px-2 py-0.5 rounded-lg ml-1 text-xs">
            Optional
          </span>
        </p>
        <p className="text-xs text-gray-500">
          Set the minimum and/or maximum number Ranges for this field.
        </p>
      </div>

      <div className="flex flex-row gap-2 p-2">
        <div className="flex flex-col">
          <Label className="text-xs">Min Value</Label>
          <Input
            type="number"
            value={field.minLength || ""}
            onChange={(e) => {
              const value = parseInt(e.target.value);
              const errors = {
                ...(validationErrors[field.id] || {}),
              };

              // Clear existing error
              delete errors.minError;

              if (value < 0) {
                errors.minError = "Cannot be negative";
              } else if (
                field.maxLength !== undefined &&
                value > field.maxLength
              ) {
                errors.minError = "Cannot be greater than max";
              } else {
                updateField(field.id, {
                  minLength: value || undefined,
                });
              }

              setValidationErrors({
                ...validationErrors,
                [field.id]: errors,
              });
            }}
            min={0}
            className={`mt-1 bg-white rounded-lg text-xs w-fit ${
              validationErrors[field.id]?.minError ? "border-red-500" : ""
            }`}
            placeholder="Enter min value"
          />
          {validationErrors[field.id]?.minError && (
            <p className="text-xs text-red-500 mt-1">
              {validationErrors[field.id]?.minError}
            </p>
          )}
        </div>
        <div className="flex flex-col">
          <Label className="text-xs">Max Value</Label>
          <Input
            type="number"
            value={field.maxLength || ""}
            onChange={(e) => {
              const value = parseInt(e.target.value);
              const errors = {
                ...(validationErrors[field.id] || {}),
              };

              // Clear existing error
              delete errors.maxError;

              if (value < 0) {
                errors.maxError = "Cannot be negative";
              } else if (
                field.minLength !== undefined &&
                value < field.minLength
              ) {
                errors.maxError = "Cannot be less than min";
              } else {
                updateField(field.id, {
                  maxLength: value || undefined,
                });
              }

              setValidationErrors({
                ...validationErrors,
                [field.id]: errors,
              });
            }}
            min={0}
            className={`mt-1 bg-white rounded-lg text-xs w-fit ${
              validationErrors[field.id]?.maxError ? "border-red-500" : ""
            }`}
            placeholder="Enter max value"
          />

          {validationErrors[field.id]?.maxError && (
            <p className="text-xs text-red-500 mt-1">
              {validationErrors[field.id]?.maxError}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
