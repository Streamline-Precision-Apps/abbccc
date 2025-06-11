"use client";
import { Grids } from "@/components/(reusable)/grids";
import { Holds } from "@/components/(reusable)/holds";
import { Inputs } from "@/components/(reusable)/inputs";
import { Labels } from "@/components/(reusable)/labels";
import { Buttons } from "@/components/(reusable)/buttons";
import React from "react";
import { Jobsite } from "../../../types";

interface JobsiteLocationFieldsProps {
  formData: Jobsite;
  changedFields: Set<string>;
  onInputChange: (fieldName: string, value: string) => void;
  onRevertField: (fieldName: string) => void;
}

/**
 * Jobsite location information fields component
 * Handles address, city, state, and zip code
 */
export default function JobsiteLocationFields({
  formData,
  changedFields,
  onInputChange,
  onRevertField,
}: JobsiteLocationFieldsProps) {
  const isFieldChanged = (fieldName: string) => changedFields.has(fieldName);

  return (
    <Holds background="white" className="w-full h-full rounded-[10px] p-4">
      <Grids cols="2" gap="4" className="w-full h-full">
        {/* Address */}
        <Holds className="col-span-2">
          <Labels size="p4" className="mb-2 font-semibold">
            Street Address
          </Labels>
          <Holds className="relative">
            <Inputs
              type="text"
              value={formData.address || ""}
              onChange={(e) => onInputChange("address", e.target.value)}
              className={`w-full ${
                isFieldChanged("address")
                  ? "border-yellow-400 bg-yellow-50"
                  : ""
              }`}
              placeholder="Enter street address"
            />
            {isFieldChanged("address") && (
              <Buttons
                onClick={() => onRevertField("address")}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-xs bg-gray-200 hover:bg-gray-300"
              >
                Revert
              </Buttons>
            )}
          </Holds>
        </Holds>

        {/* City */}
        <Holds className="col-span-1">
          <Labels size="p4" className="mb-2 font-semibold">
            City
          </Labels>
          <Holds className="relative">
            <Inputs
              type="text"
              value={formData.city || ""}
              onChange={(e) => onInputChange("city", e.target.value)}
              className={`w-full ${
                isFieldChanged("city") ? "border-yellow-400 bg-yellow-50" : ""
              }`}
              placeholder="Enter city"
            />
            {isFieldChanged("city") && (
              <Buttons
                onClick={() => onRevertField("city")}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-xs bg-gray-200 hover:bg-gray-300"
              >
                Revert
              </Buttons>
            )}
          </Holds>
        </Holds>

        {/* State */}
        <Holds className="col-span-1">
          <Labels size="p4" className="mb-2 font-semibold">
            State
          </Labels>
          <Holds className="relative">
            <Inputs
              type="text"
              value={formData.state || ""}
              onChange={(e) => onInputChange("state", e.target.value)}
              className={`w-full ${
                isFieldChanged("state") ? "border-yellow-400 bg-yellow-50" : ""
              }`}
              placeholder="Enter state"
            />
            {isFieldChanged("state") && (
              <Buttons
                onClick={() => onRevertField("state")}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-xs bg-gray-200 hover:bg-gray-300"
              >
                Revert
              </Buttons>
            )}
          </Holds>
        </Holds>

        {/* Zip Code */}
        <Holds className="col-span-1">
          <Labels size="p4" className="mb-2 font-semibold">
            Zip Code
          </Labels>
          <Holds className="relative">
            <Inputs
              type="text"
              value={formData.zipCode || ""}
              onChange={(e) => onInputChange("zipCode", e.target.value)}
              className={`w-full ${
                isFieldChanged("zipCode")
                  ? "border-yellow-400 bg-yellow-50"
                  : ""
              }`}
              placeholder="Enter zip code"
            />
            {isFieldChanged("zipCode") && (
              <Buttons
                onClick={() => onRevertField("zipCode")}
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
