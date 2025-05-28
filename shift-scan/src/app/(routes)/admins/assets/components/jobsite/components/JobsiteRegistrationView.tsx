"use client";
import { Grids } from "@/components/(reusable)/grids";
import { Holds } from "@/components/(reusable)/holds";
import { Titles } from "@/components/(reusable)/titles";
import { Inputs } from "@/components/(reusable)/inputs";
import { Labels } from "@/components/(reusable)/labels";
import { Buttons } from "@/components/(reusable)/buttons";
import { Selects } from "@/components/(reusable)/selects";
import React, { useState } from "react";

interface JobsiteRegistrationViewProps {
  onSubmit: (newJobsite: any) => void;
  onCancel: () => void;
}

/**
 * Jobsite registration form component
 * Handles creation of new jobsites with required fields
 */
export default function JobsiteRegistrationView({
  onSubmit,
  onCancel,
}: JobsiteRegistrationViewProps) {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    country: "US",
    isActive: true,
  });

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
    <Holds className="w-full h-full col-start-3 col-end-11">
      <Holds background="white" className="w-full h-full rounded-[10px] p-6">
        <form onSubmit={handleSubmit} className="w-full h-full">
          <Grids rows="6" gap="4" className="w-full h-full">
            {/* Header */}
            <Holds className="row-span-1">
              <Titles size="h2" className="text-center mb-4">
                Register New Jobsite
              </Titles>
            </Holds>

            {/* Form Fields */}
            <Holds className="row-span-4">
              <Grids cols="2" gap="4" className="w-full h-full">
                {/* Jobsite Name */}
                <Holds className="col-span-1">
                  <Labels size="p4" className="mb-2 font-semibold">
                    Jobsite Name *
                  </Labels>
                  <Inputs
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    placeholder="Enter jobsite name"
                    required
                  />
                </Holds>

                {/* Status */}
                <Holds className="col-span-1">
                  <Labels size="p4" className="mb-2 font-semibold">
                    Status
                  </Labels>
                  <Selects
                    value={formData.isActive ? "active" : "inactive"}
                    onChange={(e) =>
                      handleInputChange("isActive", e.target.value === "active")
                    }
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </Selects>
                </Holds>

                {/* Description */}
                <Holds className="col-span-2">
                  <Labels size="p4" className="mb-2 font-semibold">
                    Description *
                  </Labels>
                  <Inputs
                    type="text"
                    value={formData.description}
                    onChange={(e) =>
                      handleInputChange("description", e.target.value)
                    }
                    placeholder="Enter jobsite description"
                    required
                  />
                </Holds>

                {/* Address */}
                <Holds className="col-span-2">
                  <Labels size="p4" className="mb-2 font-semibold">
                    Street Address
                  </Labels>
                  <Inputs
                    type="text"
                    value={formData.address}
                    onChange={(e) =>
                      handleInputChange("address", e.target.value)
                    }
                    placeholder="Enter street address"
                  />
                </Holds>

                {/* City */}
                <Holds className="col-span-1">
                  <Labels size="p4" className="mb-2 font-semibold">
                    City
                  </Labels>
                  <Inputs
                    type="text"
                    value={formData.city}
                    onChange={(e) => handleInputChange("city", e.target.value)}
                    placeholder="Enter city"
                  />
                </Holds>

                {/* State */}
                <Holds className="col-span-1">
                  <Labels size="p4" className="mb-2 font-semibold">
                    State
                  </Labels>
                  <Inputs
                    type="text"
                    value={formData.state}
                    onChange={(e) => handleInputChange("state", e.target.value)}
                    placeholder="Enter state"
                  />
                </Holds>

                {/* Zip Code */}
                <Holds className="col-span-1">
                  <Labels size="p4" className="mb-2 font-semibold">
                    Zip Code
                  </Labels>
                  <Inputs
                    type="text"
                    value={formData.zipCode}
                    onChange={(e) =>
                      handleInputChange("zipCode", e.target.value)
                    }
                    placeholder="Enter zip code"
                  />
                </Holds>

                {/* Country */}
                <Holds className="col-span-1">
                  <Labels size="p4" className="mb-2 font-semibold">
                    Country
                  </Labels>
                  <Inputs
                    type="text"
                    value={formData.country}
                    onChange={(e) =>
                      handleInputChange("country", e.target.value)
                    }
                    placeholder="Country"
                  />
                </Holds>
              </Grids>
            </Holds>

            {/* Action Buttons */}
            <Holds className="row-span-1">
              <Grids cols="4" gap="3" className="w-full">
                <Holds className="col-start-2 col-end-3">
                  <Buttons
                    type="button"
                    background="red"
                    onClick={onCancel}
                    className="w-full"
                  >
                    <Titles size="h4" className="text-white">
                      Cancel
                    </Titles>
                  </Buttons>
                </Holds>
                <Holds className="col-start-3 col-end-4">
                  <Buttons
                    type="submit"
                    background={isFormValid ? "green" : "darkGray"}
                    disabled={!isFormValid}
                    className="w-full"
                  >
                    <Titles size="h4" className="text-white">
                      Register Jobsite
                    </Titles>
                  </Buttons>
                </Holds>
              </Grids>
            </Holds>
          </Grids>
        </form>
      </Holds>
    </Holds>
  );
}
