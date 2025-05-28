"use client";
import { Buttons } from "@/components/(reusable)/buttons";
import { Grids } from "@/components/(reusable)/grids";
import { Holds } from "@/components/(reusable)/holds";
import { Inputs } from "@/components/(reusable)/inputs";
import { Labels } from "@/components/(reusable)/labels";
import { Selects } from "@/components/(reusable)/selects";
import React from "react";
import { Jobsite } from "../../../types";

interface JobsiteBasicFieldsProps {
  formData: Jobsite;
  changedFields: Set<string>;
  onInputChange: (fieldName: string, value: string | boolean) => void;
  onRevertField: (fieldName: string) => void;
}

/**
 * Basic jobsite information fields component
 * Handles name, description, status, and basic details
 */
export default function JobsiteBasicFields({
  formData,
  changedFields,
  onInputChange,
  onRevertField,
}: JobsiteBasicFieldsProps) {
  const isFieldChanged = (fieldName: string) => changedFields.has(fieldName);

  return (
    <Holds background="white" className="w-full h-full rounded-[10px] p-4">
      <Grids cols="2" gap="4" className="w-full h-full">
        {/* Jobsite Name */}
        <Holds className="col-span-1">
          <Labels size="p4" className="mb-2 font-semibold">
            Jobsite Name *
          </Labels>
          <Holds className="relative">
            <Inputs
              type="text"
              value={formData.name}
              onChange={(e) => onInputChange("name", e.target.value)}
              className={`w-full ${
                isFieldChanged("name") ? "border-yellow-400 bg-yellow-50" : ""
              }`}
              placeholder="Enter jobsite name"
            />
            {isFieldChanged("name") && (
              <Buttons
                onClick={() => onRevertField("name")}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-xs bg-gray-200 hover:bg-gray-300"
              >
                Revert
              </Buttons>
            )}
          </Holds>
        </Holds>

        {/* QR ID - Read Only */}
        <Holds className="col-span-1">
          <Labels size="p4" className="mb-2 font-semibold">
            QR ID
          </Labels>
          <Inputs
            type="text"
            value={formData.qrId}
            disabled={true}
            className="w-full bg-gray-100"
            placeholder="Auto-generated"
          />
        </Holds>

        {/* Status */}
        <Holds className="col-span-1">
          <Labels size="p4" className="mb-2 font-semibold">
            Status *
          </Labels>
          <Holds className="relative">
            <Selects
              value={formData.isActive ? "active" : "inactive"}
              onChange={(e) =>
                onInputChange("isActive", e.target.value === "active")
              }
              className={`w-full ${
                isFieldChanged("isActive")
                  ? "border-yellow-400 bg-yellow-50"
                  : ""
              }`}
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </Selects>
            {isFieldChanged("isActive") && (
              <Buttons
                onClick={() => onRevertField("isActive")}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-xs bg-gray-200 hover:bg-gray-300"
              >
                Revert
              </Buttons>
            )}
          </Holds>
        </Holds>

        {/* Country */}
        <Holds className="col-span-1">
          <Labels size="p4" className="mb-2 font-semibold">
            Country
          </Labels>
          <Holds className="relative">
            <Inputs
              type="text"
              value={formData.country || "US"}
              onChange={(e) => onInputChange("country", e.target.value)}
              className={`w-full ${
                isFieldChanged("country")
                  ? "border-yellow-400 bg-yellow-50"
                  : ""
              }`}
              placeholder="Country"
            />
            {isFieldChanged("country") && (
              <Buttons
                onClick={() => onRevertField("country")}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-xs bg-gray-200 hover:bg-gray-300"
              >
                Revert
              </Buttons>
            )}
          </Holds>
        </Holds>

        {/* Description */}
        <Holds className="col-span-2">
          <Labels size="p4" className="mb-2 font-semibold">
            Description *
          </Labels>
          <Holds className="relative">
            <Inputs
              type="text"
              value={formData.description || ""}
              onChange={(e) => onInputChange("description", e.target.value)}
              className={`w-full ${
                isFieldChanged("description")
                  ? "border-yellow-400 bg-yellow-50"
                  : ""
              }`}
              placeholder="Enter jobsite description"
            />
            {isFieldChanged("description") && (
              <Buttons
                onClick={() => onRevertField("description")}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-xs bg-gray-200 hover:bg-gray-300"
              >
                Revert
              </Buttons>
            )}
          </Holds>
        </Holds>
      </Grids>
    </Holds>
  );
}
