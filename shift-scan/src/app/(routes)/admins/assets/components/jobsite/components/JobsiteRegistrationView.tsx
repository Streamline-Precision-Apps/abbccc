"use client";
import { Grids } from "@/components/(reusable)/grids";
import { Holds } from "@/components/(reusable)/holds";
import { Titles } from "@/components/(reusable)/titles";
import { Inputs } from "@/components/(reusable)/inputs";
import { Buttons } from "@/components/(reusable)/buttons";
import { Selects } from "@/components/(reusable)/selects";
import React from "react";
import { Texts } from "@/components/(reusable)/texts";
import { COUNTRIES } from "../../../constants/countries";
import { ClientsSummary, TagSummary } from "../../../types";
import JobsiteCostCodeGroups from "./JobsiteCostCodeGroups";
import { US_STATES } from "@/data/stateValues";
import { TextAreas } from "@/components/(reusable)/textareas";
import { useJobsiteRegistrationForm } from "../hooks/useJobsiteRegistrationForm";

interface JobsiteRegistrationViewProps {
  tagSummaries?: TagSummary[];
  clients: ClientsSummary[];
  setJobsiteUIState: React.Dispatch<
    React.SetStateAction<"idle" | "creating" | "editing">
  >;
  refreshJobsites: (() => Promise<void>) | undefined;
  setShowConfirmModal: React.Dispatch<React.SetStateAction<boolean>>;
}

/**
 * Jobsite registration form component
 * Handles creation of new jobsites with required fields
 */

export default function JobsiteRegistrationView({
  tagSummaries = [],
  clients,
  setJobsiteUIState,
  refreshJobsites,
  setShowConfirmModal,
}: JobsiteRegistrationViewProps) {
  // Use the jobsite registration form hook
  const {
    formData,
    errors,
    touched,
    triedSubmit,
    updateField,
    isTagSelected,
    handleTagToggle,
    updateFieldTouched,
    handleSubmit,
    isSubmitting,
    isFormValid,
    successMessage,
    errorMessage,
    handleCancelRegistration,
  } = useJobsiteRegistrationForm({
    setJobsiteUIState,
    refreshJobsites,
    setShowConfirmModal,
  });

  // Helper function to show validation errors
  const showError = (field: string) =>
    (touched[field] || triedSubmit) && errors[field];

  return (
    <Holds className="w-full h-full col-span-4">
      <form onSubmit={handleSubmit} className="w-full h-full">
        <Grids gap="4" className="w-full h-full grid-rows-[40px_1fr]">
          {/* Header */}
          <Holds
            position={"row"}
            background={"white"}
            className="row-span-1 h-full w-full px-4 justify-between relative"
          >
            {successMessage && (
              <Holds
                background={"green"}
                className="absolute top-0 left-0 w-full h-full flex items-center justify-center"
              >
                <Texts position={"left"} size="sm">
                  {successMessage}
                </Texts>
              </Holds>
            )}

            {errorMessage && (
              <Holds
                background={"red"}
                className="absolute top-0 left-0 w-full h-full flex items-center justify-center"
              >
                <Texts position={"left"} size="sm">
                  {errorMessage}
                </Texts>
              </Holds>
            )}

            <Buttons
              type="submit"
              background={"none"}
              shadow={"none"}
              disabled={!isFormValid || isSubmitting}
              className="w-fit h-auto"
            >
              <Texts
                position={"left"}
                text={"link"}
                size="sm"
                className={`${isFormValid ? "" : "text-app-dark-gray"}`}
              >
                {isSubmitting ? `Submitting...` : "Submit New Jobsite"}
              </Texts>
            </Buttons>
            <Buttons
              type="button"
              background={"none"}
              shadow={"none"}
              onClick={handleCancelRegistration}
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
                    <label
                      htmlFor="name"
                      className={`text-xs ${
                        showError("name") ? "text-red-500" : ""
                      }`}
                    >
                      Name <span className="text-red-500">*</span>
                    </label>
                    <Inputs
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={(e) => updateField("name", e.target.value)}
                      onBlur={() => updateFieldTouched("name")}
                      required
                      className="text-sm"
                    />
                    <label
                      htmlFor="clientId"
                      className={`text-xs ${
                        showError("clientId") ? "text-red-500" : ""
                      }`}
                    >
                      Client <span className="text-red-500">*</span>
                    </label>
                    <Selects
                      name="clientId"
                      value={formData.clientId}
                      onChange={(e) => updateField("clientId", e.target.value)}
                      onBlur={() => updateFieldTouched("clientId")}
                      className="text-sm"
                    >
                      <option value="" disabled>
                        Select client
                      </option>
                      {clients.map((client) => (
                        <option key={client.id} value={client.id}>
                          {client.name}
                        </option>
                      ))}
                    </Selects>

                    <label
                      htmlFor="address"
                      className={`text-xs ${
                        showError("address") ? "text-red-500" : ""
                      }`}
                    >
                      Street Address <span className="text-red-500">*</span>
                    </label>
                    <Inputs
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={(e) => updateField("address", e.target.value)}
                      onBlur={() => updateFieldTouched("address")}
                      placeholder="Enter street address"
                      className="text-sm"
                    />

                    <label
                      htmlFor="city"
                      className={`text-xs ${
                        showError("city") ? "text-red-500" : ""
                      }`}
                    >
                      City <span className="text-red-500">*</span>
                    </label>
                    <Inputs
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={(e) => updateField("city", e.target.value)}
                      onBlur={() => updateFieldTouched("city")}
                      placeholder="Enter city"
                      className="text-sm"
                    />

                    <label
                      htmlFor="state"
                      className={`text-xs ${
                        showError("state") ? "text-red-500" : ""
                      }`}
                    >
                      State <span className="text-red-500">*</span>
                    </label>
                    <Selects
                      name="state"
                      value={formData.state}
                      onChange={(e) => updateField("state", e.target.value)}
                      onBlur={() => updateFieldTouched("state")}
                      className="text-sm"
                    >
                      <option value="">Select state</option>
                      {US_STATES.map((state) => (
                        <option key={state.code} value={state.name}>
                          {state.name}
                        </option>
                      ))}
                    </Selects>

                    <label
                      htmlFor="zipCode"
                      className={`text-xs ${
                        showError("zipCode") ? "text-red-500" : ""
                      }  `}
                    >
                      Zip Code <span className="text-red-500">*</span>
                    </label>
                    <Inputs
                      type="text"
                      name="zipCode"
                      value={formData.zipCode}
                      onChange={(e) => updateField("zipCode", e.target.value)}
                      onBlur={() => updateFieldTouched("zipCode")}
                      required
                      placeholder="Enter zip code"
                      className="text-sm "
                    />

                    <label
                      htmlFor="country"
                      className={`text-sm ${
                        showError("country") ? "text-red-500" : ""
                      }`}
                    >
                      Country <span className="text-red-500">*</span>
                    </label>
                    <Selects
                      name="country"
                      value={formData.country}
                      onChange={(e) => updateField("country", e.target.value)}
                      onBlur={() => updateFieldTouched("country")}
                      className="text-sm"
                    >
                      {COUNTRIES.map((country) => (
                        <option key={country.code} value={country.code}>
                          {country.name}
                        </option>
                      ))}
                    </Selects>

                    <label
                      htmlFor="description"
                      className={`text-xs ${
                        showError("description") ? "text-red-500" : ""
                      }`}
                    >
                      Jobsite Description{" "}
                      <span className="text-red-500">*</span>
                    </label>
                    <TextAreas
                      rows={3}
                      name="description"
                      value={formData.description}
                      onChange={(e) =>
                        updateField("description", e.target.value)
                      }
                      onBlur={() => updateFieldTouched("description")}
                      placeholder="Enter jobsite description"
                      required
                      className="text-sm"
                      style={{ resize: "none" }}
                    />
                    <label
                      htmlFor="approvalStatus"
                      className={`text-xs ${
                        showError("approvalStatus") ? "text-red-500" : ""
                      }`}
                    >
                      Jobsite Status <span className="text-red-500">*</span>
                    </label>
                    <Selects
                      name="approvalStatus"
                      value={formData.isActive ? "Active" : "Inactive"}
                      className="text-center"
                      onChange={(e) =>
                        updateField("isActive", e.target.value === "Active")
                      }
                      onBlur={() => updateFieldTouched("approvalStatus")}
                    >
                      <option value="Active">Active</option>
                      <option value="Inactive">Inactive</option>
                    </Selects>
                  </Holds>
                </Holds>

                <Holds className="w-full h-full col-span-1 overflow-y-scroll no-scrollbar">
                  <label htmlFor="costCodeGroups" className="text-xs ">
                    Cost Code Groups <span className="text-red-500">*</span>
                  </label>
                  <Holds className="w-full h-full p-3 border-black border-[3px] rounded-[10px]">
                    <JobsiteCostCodeGroups
                      tagSummaries={tagSummaries}
                      isTagSelected={isTagSelected}
                      handleTagToggle={handleTagToggle}
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
