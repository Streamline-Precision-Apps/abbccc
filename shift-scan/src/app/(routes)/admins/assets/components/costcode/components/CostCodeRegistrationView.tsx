"use client";
import React, { useMemo } from "react";
import { Buttons } from "@/components/(reusable)/buttons";
import { Grids } from "@/components/(reusable)/grids";
import { Holds } from "@/components/(reusable)/holds";
import { Inputs } from "@/components/(reusable)/inputs";
import { Selects } from "@/components/(reusable)/selects";
import { Texts } from "@/components/(reusable)/texts";
import { Titles } from "@/components/(reusable)/titles";

import { CostCodeRegistrationViewProps } from "../types";
import { formatCostCodeName, combineCostCodeName } from "../utils/formatters";
import { CheckBox } from "@/components/(inputs)/checkBox";
import { useCostcodeRegistrationForm } from "../hooks/useCostCodeRegistrationForm";

/**
 * Component for registering a new cost code
 *
 * @param props The component props from CostCodeRegistrationViewProps interface
 * @returns A form component for cost code registration
 */

function CostCodeRegistrationView({
  setHasUnsavedChanges,
  tagSummaries = [],
  refreshCostCodes,
}: CostCodeRegistrationViewProps) {
  // Use the custom form hook
  const {
    formData,
    errors,
    touched,
    isSubmitting,
    isFormValid,
    successfullyRegistered,
    registrationError,
    handleInputChange,
    handleBlur,
    handleTagToggle,
    handleSubmit,
    resetForm,
  } = useCostcodeRegistrationForm({ setHasUnsavedChanges, refreshCostCodes });

  // isComplete logic (matches hook's internal logic)
  const isComplete =
    formData.cCNumber &&
    formData.cCNumber.trim() !== "#" &&
    formData.cCName &&
    formData.cCName.trim() !== "";

  // Format the preview text for display using utility function
  const previewText = useMemo(() => {
    if (formData.cCNumber.trim() !== "#" && formData.cCName.trim()) {
      return formatCostCodeName(
        combineCostCodeName(formData.cCNumber, formData.cCName)
      );
    }
    return null;
  }, [formData.cCNumber, formData.cCName]);

  // Cancel handler resets the form
  const onCancel = () => {
    resetForm();
  };

  return (
    <Holds className="w-full h-full col-span-4">
      <Grids className="w-full h-full grid-rows-[40px_1fr] gap-4">
        <Holds
          position={"row"}
          background={"white"}
          className="w-full h-full gap-4 px-4 relative"
        >
          <Holds position={"row"} className=" justify-between">
            <Buttons
              background={"none"}
              shadow={"none"}
              onClick={handleSubmit}
              disabled={isSubmitting || !isComplete}
              className="w-fit h-auto px-2"
            >
              <Texts
                size="sm"
                text="link"
                className={`${!isComplete ? "text-gray-500" : ""}`}
              >
                {isSubmitting ? "Registering..." : "Register New"}
              </Texts>
            </Buttons>

            <Buttons
              background={"none"}
              shadow={"none"}
              onClick={onCancel}
              disabled={isSubmitting}
              className="w-fit h-auto px-2"
            >
              <img src="/statusDenied.svg" alt="Close" className="w-4 h-4" />
            </Buttons>

            {successfullyRegistered && (
              <Holds
                background={"green"}
                className="w-full h-full absolute top-0 left-0 justify-center items-center rounded-[10px] z-50"
              >
                <Texts size="sm">Cost Code successfully registered!</Texts>
              </Holds>
            )}

            {registrationError && (
              <Holds
                background={"red"}
                className="w-full h-full absolute top-0 left-0 justify-center items-center rounded-[10px] z-50"
              >
                <Texts size="sm">{registrationError}</Texts>
              </Holds>
            )}
          </Holds>
        </Holds>

        <Holds background={"white"} className="w-full h-full">
          <Grids className="w-full h-full grid-rows-[50px_1fr] p-4">
            <Holds className="w-full h-full">
              <Titles position="left" size="h5" className="font-bold mb-2">
                Register New Cost Code
              </Titles>
            </Holds>

            <Grids
              cols="2"
              gap="4"
              className="w-full h-full bg-white rounded-[10px]"
            >
              <Holds className="col-span-1 h-full">
                {/* Preview of how the cost code will appear */}
                <Holds
                  background={"lightGray"}
                  className="mb-3 rounded-[10px] "
                >
                  <Texts
                    position={"left"}
                    size="xs"
                    className="text-app-dark-gray"
                  >
                    Preview:
                  </Texts>
                  {previewText && (
                    <Texts size="md" className="font-medium">
                      {previewText}
                    </Texts>
                  )}
                </Holds>

                <label
                  htmlFor="cCNumber"
                  className={`text-sm${
                    touched.cCNumber && errors.cCNumber ? " text-red-500" : ""
                  }`}
                >
                  Cost Code Number<span className="text-red-500">*</span>
                </label>
                <Inputs
                  type="text"
                  name="cCNumber"
                  value={formData.cCNumber}
                  onChange={handleInputChange}
                  onBlur={handleBlur}
                  required
                  className="w-full text-sm"
                />
                {touched.cCNumber && errors.cCNumber && (
                  <Texts size="xs" className="text-red-500 mb-2">
                    {errors.cCNumber}
                  </Texts>
                )}

                <label
                  htmlFor="cCName"
                  className={`text-sm${
                    touched.cCName && errors.cCName ? " text-red-500" : ""
                  }`}
                >
                  Cost Code Name*
                </label>
                <Inputs
                  type="text"
                  name="cCName"
                  value={formData.cCName}
                  onChange={handleInputChange}
                  onBlur={handleBlur}
                  required
                  className="w-full text-sm"
                />
                {touched.cCName && errors.cCName && (
                  <Texts size="xs" className="text-red-500 mb-2">
                    {errors.cCName}
                  </Texts>
                )}

                <label htmlFor="isActive" className="text-sm ">
                  Status
                </label>
                <Selects
                  name="isActive"
                  value={formData.isActive ? "Active" : "Inactive"}
                  onChange={handleInputChange}
                  className="w-full text-sm"
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </Selects>
              </Holds>

              <Holds className="col-span-1 h-full">
                <Texts position={"left"} size="xs" className="font-bold mb-2">
                  Cost Code Groups
                </Texts>
                <Holds className="h-full border-[3px] border-black p-3 rounded-[10px] overflow-y-auto">
                  {tagSummaries.length > 0 ? (
                    tagSummaries.map((tag, index) => (
                      <Holds
                        position={"row"}
                        key={index}
                        className="w-full gap-3 mt-2 first:mt-0"
                      >
                        <Holds
                          background={"lightBlue"}
                          className="w-full h-[40px] rounded-[10px] flex items-center justify-center"
                        >
                          <Titles size="md">{tag.name}</Titles>
                        </Holds>

                        <Holds className="w-fit h-fit justify-center items-center">
                          <CheckBox
                            shadow={false}
                            checked={formData.CCTags.some(
                              (t) => t.id === tag.id
                            )}
                            onChange={() => handleTagToggle(tag.id, tag.name)}
                            id={tag.id}
                            name={tag.name}
                            height={35}
                            width={35}
                          />
                        </Holds>
                      </Holds>
                    ))
                  ) : (
                    <Texts size="xs" className="text-gray-500">
                      No cost code groups available. Create groups in the groups
                      management section.
                    </Texts>
                  )}
                  {touched.CCTags && errors.CCTags && (
                    <Texts size="xs" className="text-red-500 mt-2">
                      {errors.CCTags}
                    </Texts>
                  )}
                </Holds>
              </Holds>
            </Grids>
          </Grids>
        </Holds>
      </Grids>
    </Holds>
  );
}

// Export as memoized component to prevent unnecessary re-renders
export default React.memo(CostCodeRegistrationView);
