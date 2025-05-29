"use client";
import { Buttons } from "@/components/(reusable)/buttons";
import { Grids } from "@/components/(reusable)/grids";
import { Holds } from "@/components/(reusable)/holds";
import { Inputs } from "@/components/(reusable)/inputs";
import { Selects } from "@/components/(reusable)/selects";
import { EditableFields } from "@/components/(reusable)/EditableField";
import React from "react";
import { Jobsite } from "../../../types";
import { COUNTRIES } from "../../../constants/countries";
import { Titles } from "@/components/(reusable)/titles";

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
      <Grids className="w-full h-full grid-rows-[50px_1fr]">
        <Holds className="w-full h-full flex justify-center">
          <Titles position={"left"} size="h4" className="">
            {formData.name}
          </Titles>
        </Holds>
        <Grids className="w-full h-full grid-cols-[1fr_1fr] gap-4">
          <Holds className="w-full h-full col-span-1 overflow-y-scroll no-scrollbar">
            <Holds>
              <label htmlFor="name" className="text-xs font-medium mb-1">
                Jobsite Name *
              </label>
              <EditableFields
                formDatatype="input"
                type="text"
                name="name"
                value={formData.name}
                onChange={(e) => onInputChange("name", e.target.value)}
                isChanged={isFieldChanged("name")}
                onRevert={() => onRevertField("name")}
                variant={isFieldChanged("name") ? "edited" : "default"}
                size="sm"
                className="mb-3"
              />

              <label htmlFor="clientName" className="text-xs font-medium mb-1">
                Client
              </label>
              <EditableFields
                formDatatype="input"
                name="clientName"
                type="text"
                value={formData.Client || ""}
                onChange={(e) => onInputChange("client", e.target.value)}
                isChanged={isFieldChanged("client")}
                onRevert={() => onRevertField("client")}
                variant={isFieldChanged("client") ? "edited" : "default"}
                size="sm"
                className="mb-3"
              />

              <label htmlFor="address" className="text-xs font-medium mb-1">
                Street Address
              </label>
              <EditableFields
                formDatatype="input"
                type="text"
                name="address"
                value={formData.address || ""}
                onChange={(e) => onInputChange("address", e.target.value)}
                placeholder="Enter street address"
                isChanged={isFieldChanged("address")}
                onRevert={() => onRevertField("address")}
                variant={isFieldChanged("address") ? "edited" : "default"}
                size="sm"
                className="mb-3"
              />

              <label htmlFor="city" className="text-xs font-medium mb-1">
                City
              </label>
              <EditableFields
                formDatatype="input"
                type="text"
                name="city"
                value={formData.city || ""}
                onChange={(e) => onInputChange("city", e.target.value)}
                placeholder="Enter city"
                isChanged={isFieldChanged("city")}
                onRevert={() => onRevertField("city")}
                variant={isFieldChanged("city") ? "edited" : "default"}
                size="sm"
                className="mb-3"
              />

              <label htmlFor="state" className="text-xs font-medium mb-1">
                State
              </label>
              <EditableFields
                formDatatype="input"
                type="text"
                name="state"
                value={formData.state || ""}
                onChange={(e) => onInputChange("state", e.target.value)}
                placeholder="Enter state"
                isChanged={isFieldChanged("state")}
                onRevert={() => onRevertField("state")}
                variant={isFieldChanged("state") ? "edited" : "default"}
                size="sm"
                className="mb-3"
              />

              <label htmlFor="zipCode" className="text-xs font-medium mb-1">
                Zip Code
              </label>
              <EditableFields
                formDatatype="input"
                type="text"
                name="zipCode"
                value={formData.zipCode || ""}
                onChange={(e) => onInputChange("zipCode", e.target.value)}
                placeholder="Enter zip code"
                isChanged={isFieldChanged("zipCode")}
                onRevert={() => onRevertField("zipCode")}
                variant={isFieldChanged("zipCode") ? "edited" : "default"}
                size="sm"
                className="mb-3"
              />

              <label htmlFor="country" className="text-xs font-medium mb-1">
                Country
              </label>
              <EditableFields
                formDatatype="select"
                name="country"
                value={formData.country || "US"}
                onChange={(e) => onInputChange("country", e.target.value)}
                isChanged={isFieldChanged("country")}
                onRevert={() => onRevertField("country")}
                variant={isFieldChanged("country") ? "edited" : "default"}
                size="sm"
                options={COUNTRIES.map((country) => ({
                  label: country.name,
                  value: country.code,
                }))}
                className="mb-3"
              />

              <label htmlFor="description" className="text-xs font-medium mb-1">
                Jobsite Description *
              </label>
              <EditableFields
                formDatatype="textarea"
                name="description"
                value={formData.description || ""}
                onChange={(e) => onInputChange("description", e.target.value)}
                placeholder="Enter jobsite description"
                isChanged={isFieldChanged("description")}
                onRevert={() => onRevertField("description")}
                variant={isFieldChanged("description") ? "edited" : "default"}
                size="sm"
                rows={3}
                className="mb-3"
              />

              <label htmlFor="status" className="text-xs font-medium mb-1">
                Status
              </label>
              <EditableFields
                formDatatype="select"
                name="status"
                value={formData.isActive ? "active" : "inactive"}
                onChange={(e) =>
                  onInputChange("isActive", e.target.value === "active")
                }
                isChanged={isFieldChanged("isActive")}
                onRevert={() => onRevertField("isActive")}
                variant={isFieldChanged("isActive") ? "edited" : "default"}
                size="sm"
                options={[
                  { label: "Active", value: "active" },
                  { label: "Inactive", value: "inactive" },
                ]}
                className="mb-3"
              />
            </Holds>
          </Holds>
          {/* Jobsite Name */}
          <Holds className="w-full h-full col-span-1 overflow-y-scroll no-scrollbar">
            <label htmlFor="costCodeGroups" className="text-xs font-medium">
              Cost Code Groups
            </label>
            <Holds className="w-full h-full p-3 border-black border-[3px] rounded-[10px]"></Holds>
          </Holds>
        </Grids>
      </Grids>
    </Holds>
  );
}
