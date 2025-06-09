"use client";
import { Grids } from "@/components/(reusable)/grids";
import { Holds } from "@/components/(reusable)/holds";
import { Titles } from "@/components/(reusable)/titles";
import { Inputs } from "@/components/(reusable)/inputs";
import { Buttons } from "@/components/(reusable)/buttons";
import { Selects } from "@/components/(reusable)/selects";
import React, { useState, useEffect } from "react";
import ValidationMessage from "../../shared/ValidationMessage";
import { Texts } from "@/components/(reusable)/texts";
import { COUNTRIES } from "../../../constants/countries";
import { ClientsSummary, TagSummary } from "../../../types";
import JobsiteCostCodeGroups from "./JobsiteCostCodeGroups";
import { US_STATES } from "@/data/stateValues";
import { TextAreas } from "@/components/(reusable)/textareas";

interface JobsiteRegistrationFormData {
  name: string;
  clientId: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  description: string;
  isActive: boolean;
  approvalStatus: string;
  CCTags?: Array<{ id: string; name: string }>;
}

interface JobsiteRegistrationViewProps {
  onSubmit: (newJobsite: JobsiteRegistrationFormData) => void;
  onCancel: () => void;
  onUnsavedChangesChange?: (hasChanges: boolean) => void;
  tagSummaries?: TagSummary[];
  clients: ClientsSummary[];
}

/**
 * Jobsite registration form component
 * Handles creation of new jobsites with required fields
 */

export default function JobsiteRegistrationView({
  onSubmit,
  onCancel,
  onUnsavedChangesChange,
  tagSummaries = [],
  clients,
}: JobsiteRegistrationViewProps) {
  const [formData, setFormData] = useState({
    name: "",
    clientId: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    country: "US",
    description: "",
    isActive: true,
    approvalStatus: "",
    CCTags: [],
  });
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [triedSubmit, setTriedSubmit] = useState(false);

  // Validation logic
  const getValidationErrors = (data: typeof formData) => {
    const errors: Record<string, string> = {};
    if (!data.name.trim()) errors.name = "Jobsite Name is required.";
    if (!data.clientId.trim()) errors.clientId = "Client is required.";
    if (!data.address.trim()) errors.address = "Street Address is required.";
    if (!data.city.trim()) errors.city = "City is required.";
    if (!data.state.trim()) errors.state = "State is required.";
    if (!data.zipCode.trim()) errors.zipCode = "Zip Code is required.";
    if (!data.country.trim()) errors.country = "Country is required.";
    if (!data.description.trim())
      errors.description = "Description is required.";
    // Optionally: add regex for zip, city, address, etc.
    return errors;
  };
  const validationErrors = getValidationErrors(formData);
  const showError = (field: string) =>
    (touched[field] || triedSubmit) && validationErrors[field];

  // Track if form has unsaved changes
  const hasUnsavedChanges =
    formData.name.trim() !== "" ||
    formData.clientId.trim() !== "" ||
    formData.address.trim() !== "" ||
    formData.city.trim() !== "" ||
    formData.state.trim() !== "" ||
    formData.zipCode.trim() !== "" ||
    formData.country !== "US" ||
    formData.description.trim() !== "" ||
    (formData.CCTags && formData.CCTags.length > 0);

  // Notify parent component when unsaved changes state changes
  useEffect(() => {
    onUnsavedChangesChange?.(hasUnsavedChanges);
  }, [hasUnsavedChanges, onUnsavedChangesChange]);

  const handleInputChange = (
    field: string,
    value:
      | string
      | number
      | boolean
      | Date
      | Array<{ id: string; name: string }>
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  const handleBlur = (field: string) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setTriedSubmit(true);
    const errors = getValidationErrors(formData);
    if (Object.keys(errors).length > 0) {
      setTouched({
        name: true,
        clientId: true,
        address: true,
        city: true,
        state: true,
        zipCode: true,
        country: true,
        description: true,
      });
      return;
    }
    console.log("Form submitted:", formData);
    onSubmit(formData);
  };

  const isFormValid = Object.keys(getValidationErrors(formData)).length === 0;

  return (
    <Holds className="w-full h-full col-span-4">
      <form onSubmit={handleSubmit} className="w-full h-full">
        <Grids gap="4" className="w-full h-full grid-rows-[40px_1fr]">
          {/* Header */}
          <Holds
            position={"row"}
            background={"white"}
            className="row-span-1 h-full w-full px-4 justify-between"
          >
            <Buttons
              type="submit"
              background={"none"}
              shadow={"none"}
              disabled={!isFormValid}
              className="w-fit h-auto"
            >
              <Texts position={"left"} text={"link"} size="sm" className="">
                Submit New Jobsite
              </Texts>
            </Buttons>
            <Buttons
              type="button"
              background={"none"}
              shadow={"none"}
              onClick={onCancel}
              className="w-fit h-auto"
            >
              <img src="/statusDenied.svg" alt="Close" className="w-4 h-4" />
            </Buttons>
          </Holds>

          <Holds
            background={"white"}
            className="w-full h-full p-3 overflow-y-scroll no-scrollbar"
          >
            <Grids className="w-full h-full grid-rows-[50px_1fr]">
              <Holds className="w-full h-full flex justify-center">
                <Titles position={"left"} size="h4" className="">
                  New Jobsite
                </Titles>
              </Holds>

              <Grids className="w-full h-full grid-cols-[1fr_1fr] gap-4 overflow-y-scroll no-scrollbar ">
                <Holds className="w-full h-full col-span-1 overflow-y-scroll no-scrollbar">
                  <Holds>
                    <label htmlFor="name" className="text-xs">
                      Name <span className="text-red-500">*</span>
                    </label>
                    <Inputs
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={(e) =>
                        handleInputChange("name", e.target.value)
                      }
                      onBlur={() => handleBlur("name")}
                      required
                      className="text-sm"
                      variant={"validationMessage"}
                    />
                    <ValidationMessage
                      message={
                        showError("name") ? validationErrors.name : undefined
                      }
                    />
                    <label htmlFor="clientId" className="text-xs font-medium">
                      Client <span className="text-red-500">*</span>
                    </label>
                    <Selects
                      name="clientId"
                      value={formData.clientId}
                      onChange={(e) =>
                        handleInputChange("clientId", e.target.value)
                      }
                      onBlur={() => handleBlur("clientId")}
                      className="text-sm mb-0"
                      variant={"validationMessage"}
                    >
                      <option value="" disabled>
                        Select a client...
                      </option>
                      {clients.map((client) => (
                        <option key={client.id} value={client.id}>
                          {client.name}
                        </option>
                      ))}
                    </Selects>

                    <ValidationMessage
                      message={
                        showError("clientId")
                          ? validationErrors.clientId
                          : undefined
                      }
                    />

                    <label htmlFor="address" className="text-xs font-medium">
                      Street Address <span className="text-red-500">*</span>
                    </label>
                    <Inputs
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={(e) =>
                        handleInputChange("address", e.target.value)
                      }
                      onBlur={() => handleBlur("address")}
                      placeholder="Enter street address"
                      className="text-sm"
                      variant={"validationMessage"}
                    />
                    <ValidationMessage
                      message={
                        showError("address")
                          ? validationErrors.address
                          : undefined
                      }
                    />

                    <label htmlFor="city" className="text-xs font-medium">
                      City <span className="text-red-500">*</span>
                    </label>
                    <Inputs
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={(e) =>
                        handleInputChange("city", e.target.value)
                      }
                      onBlur={() => handleBlur("city")}
                      placeholder="Enter city"
                      className="text-sm"
                      variant={"validationMessage"}
                    />
                    <ValidationMessage
                      message={
                        showError("city") ? validationErrors.city : undefined
                      }
                    />

                    <label htmlFor="state" className="text-xs font-medium">
                      State <span className="text-red-500">*</span>
                    </label>
                    <Selects
                      name="state"
                      value={formData.state}
                      onChange={(e) =>
                        handleInputChange("state", e.target.value)
                      }
                      onBlur={() => handleBlur("state")}
                      className="text-sm"
                      variant={"validationMessage"}
                    >
                      <option value="">Select state</option>
                      {US_STATES.map((state) => (
                        <option key={state.code} value={state.name}>
                          {state.name}
                        </option>
                      ))}
                    </Selects>
                    <ValidationMessage
                      message={
                        showError("state") ? validationErrors.state : undefined
                      }
                    />

                    <label htmlFor="zipCode" className="text-xs font-medium">
                      Zip Code <span className="text-red-500">*</span>
                    </label>
                    <Inputs
                      type="text"
                      name="zipCode"
                      value={formData.zipCode}
                      onChange={(e) =>
                        handleInputChange("zipCode", e.target.value)
                      }
                      onBlur={() => handleBlur("zipCode")}
                      placeholder="Enter zip code"
                      className="text-sm "
                      variant={"validationMessage"}
                    />
                    <ValidationMessage
                      message={
                        showError("zipCode")
                          ? validationErrors.zipCode
                          : undefined
                      }
                    />

                    <label htmlFor="country" className="text-sm">
                      Country <span className="text-red-500">*</span>
                    </label>
                    <Selects
                      name="country"
                      value={formData.country}
                      onChange={(e) =>
                        handleInputChange("country", e.target.value)
                      }
                      onBlur={() => handleBlur("country")}
                      className="text-sm mb-5"
                    >
                      {COUNTRIES.map((country) => (
                        <option key={country.code} value={country.code}>
                          {country.name}
                        </option>
                      ))}
                    </Selects>

                    <label
                      htmlFor="description"
                      className="text-xs font-medium"
                    >
                      Jobsite Description{" "}
                      <span className="text-red-500">*</span>
                    </label>
                    <TextAreas
                      rows={3}
                      name="description"
                      value={formData.description}
                      onChange={(e) =>
                        handleInputChange("description", e.target.value)
                      }
                      onBlur={() => handleBlur("description")}
                      placeholder="Enter jobsite description"
                      required
                      className="text-sm"
                      variant={"validationMessage"}
                      style={{ resize: "none" }}
                    />
                    <ValidationMessage
                      message={
                        showError("description")
                          ? validationErrors.description
                          : undefined
                      }
                    />
                    <label
                      htmlFor="approvalStatus"
                      className="text-xs font-medium"
                    >
                      Jobsite Status <span className="text-red-500">*</span>
                    </label>
                    <Selects
                      name="approvalStatus"
                      value={formData.isActive ? "Active" : "Inactive"}
                      className="text-center"
                    >
                      <option value="Active">Active</option>
                      <option value="Inactive">Inactive</option>
                    </Selects>
                  </Holds>
                </Holds>

                <Holds className="w-full h-full col-span-1 overflow-y-scroll no-scrollbar">
                  <label
                    htmlFor="costCodeGroups"
                    className="text-xs font-medium"
                  >
                    Cost Code Groups <span className="text-red-500">*</span>
                  </label>
                  <Holds className="w-full h-full p-3 border-black border-[3px] rounded-[10px]">
                    <JobsiteCostCodeGroups
                      formData={formData}
                      tagSummaries={tagSummaries}
                      onInputChange={handleInputChange}
                    />
                  </Holds>
                </Holds>
              </Grids>
            </Grids>
          </Holds>
        </Grids>
      </form>
    </Holds>
  );
}
