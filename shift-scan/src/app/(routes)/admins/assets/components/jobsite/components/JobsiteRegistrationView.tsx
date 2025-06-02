"use client";
import { Grids } from "@/components/(reusable)/grids";
import { Holds } from "@/components/(reusable)/holds";
import { Titles } from "@/components/(reusable)/titles";
import { Inputs } from "@/components/(reusable)/inputs";
import { Labels } from "@/components/(reusable)/labels";
import { Buttons } from "@/components/(reusable)/buttons";
import { Selects } from "@/components/(reusable)/selects";
import React, { useState, useEffect } from "react";
import { Texts } from "@/components/(reusable)/texts";
import { COUNTRIES } from "../../../constants/countries";
import { Jobsite } from "@/app/(routes)/admins/assets/types/jobsite";

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
}

interface JobsiteRegistrationViewProps {
  onSubmit: (newJobsite: JobsiteRegistrationFormData) => void;
  onCancel: () => void;
  onUnsavedChangesChange?: (hasChanges: boolean) => void;
}

/**
 * Jobsite registration form component
 * Handles creation of new jobsites with required fields
 */
export default function JobsiteRegistrationView({
  onSubmit,
  onCancel,
  onUnsavedChangesChange,
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
    approvalStatus: "PENDING",
  });

  // Track if form has unsaved changes
  const hasUnsavedChanges =
    formData.name.trim() !== "" ||
    formData.clientId.trim() !== "" ||
    formData.address.trim() !== "" ||
    formData.city.trim() !== "" ||
    formData.state.trim() !== "" ||
    formData.zipCode.trim() !== "" ||
    formData.country !== "US" ||
    formData.description.trim() !== "";

  // Notify parent component when unsaved changes state changes
  useEffect(() => {
    onUnsavedChangesChange?.(hasUnsavedChanges);
  }, [hasUnsavedChanges, onUnsavedChangesChange]);

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const isFormValid = formData.name.trim() && formData.description.trim();

  return (
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
            className="w-full"
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
            className="w-full"
          >
            <Texts position={"right"} text={"link"} size="sm" className="">
              Cancel Registration
            </Texts>
          </Buttons>
        </Holds>

        <Holds background={"white"} className="w-full h-full p-3">
          <Grids className="w-full h-full grid-rows-[50px_1fr]">
            <Holds className="w-full h-full flex justify-center">
              <Titles position={"left"} size="h4" className="">
                New Jobsite
              </Titles>
            </Holds>

            <Grids className="w-full h-full grid-cols-[1fr_1fr] gap-4">
              <Holds className="w-full h-full col-span-1 overflow-y-scroll no-scrollbar">
                <Holds>
                  <label htmlFor="name" className="text-xs font-medium">
                    Jobsite Name *
                  </label>
                  <Inputs
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    required
                    className="text-sm mb-3"
                  />
                  <label htmlFor="clientId" className="text-xs font-medium">
                    Client
                  </label>
                  <Inputs
                    name="clientId"
                    type="text"
                    value={formData.clientId}
                    onChange={(e) =>
                      handleInputChange("clientId", e.target.value)
                    }
                    required
                    className="text-sm mb-3"
                  />

                  <label htmlFor="address" className="text-xs font-medium">
                    Street Address
                  </label>
                  <Inputs
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={(e) =>
                      handleInputChange("address", e.target.value)
                    }
                    placeholder="Enter street address"
                    className="text-sm mb-3"
                  />

                  <label htmlFor="city" className="text-xs font-medium">
                    City
                  </label>
                  <Inputs
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={(e) => handleInputChange("city", e.target.value)}
                    placeholder="Enter city"
                    className="text-sm mb-3"
                  />

                  <label htmlFor="state" className="text-xs font-medium">
                    State
                  </label>
                  <Inputs
                    type="text"
                    name="state"
                    value={formData.state}
                    onChange={(e) => handleInputChange("state", e.target.value)}
                    placeholder="Enter state"
                    className="text-sm mb-3"
                  />

                  <label htmlFor="zipCode" className="text-xs font-medium">
                    Zip Code
                  </label>
                  <Inputs
                    type="text"
                    name="zipCode"
                    value={formData.zipCode}
                    onChange={(e) =>
                      handleInputChange("zipCode", e.target.value)
                    }
                    placeholder="Enter zip code"
                    className="text-sm mb-3"
                  />

                  <label htmlFor="country" className="text-xs font-medium">
                    Country
                  </label>
                  <Selects
                    name="country"
                    value={formData.country}
                    onChange={(e) =>
                      handleInputChange("country", e.target.value)
                    }
                    className="mb-3 text-sm"
                  >
                    {COUNTRIES.map((country) => (
                      <option key={country.code} value={country.code}>
                        {country.name}
                      </option>
                    ))}
                  </Selects>
                  <label htmlFor="description" className="text-xs font-medium">
                    Jobsite Description *
                  </label>
                  <Inputs
                    type="text"
                    name="description"
                    value={formData.description}
                    onChange={(e) =>
                      handleInputChange("description", e.target.value)
                    }
                    placeholder="Enter jobsite description"
                    required
                    className="text-sm mb-3"
                  />
                  <label
                    htmlFor="approvalStatus"
                    className="text-xs font-medium"
                  >
                    Approval Status
                  </label>
                  <Inputs
                    type="text"
                    name="approvalStatus"
                    value={formData.approvalStatus}
                    readOnly
                    className="mb-3 text-gray-500 bg-gray-100"
                  />
                </Holds>
              </Holds>

              <Holds className="w-full h-full col-span-1 overflow-y-scroll no-scrollbar">
                <label htmlFor="costCodeGroups" className="text-xs font-medium">
                  Cost Code Groups
                </label>
                <Holds className="w-full h-full p-3 border-black border-[3px] rounded-[10px]"></Holds>
              </Holds>
            </Grids>
          </Grids>
        </Holds>
      </Grids>
    </form>
  );
}
