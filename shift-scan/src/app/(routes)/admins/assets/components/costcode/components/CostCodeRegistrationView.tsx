"use client";
import React, {
  useState,
  useEffect,
  useCallback,
  useMemo,
  ChangeEvent,
} from "react";
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
import { TagSummary } from "../../../types";

/**
 * Component for registering a new cost code
 *
 * @param props The component props from CostCodeRegistrationViewProps interface
 * @returns A form component for cost code registration
 */
function CostCodeRegistrationView({
  onSubmit,
  onCancel,
  setHasUnsavedChanges,
  tagSummaries = [], // Include available tags/groups
}: CostCodeRegistrationViewProps) {
  const [formData, setFormData] = useState({
    cCNumber: "#",
    cCName: "",
    isActive: true,
    CCTags: [] as Array<{ id: string; name: string }>,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successfullyRegistered, setSuccessfullyRegistered] = useState(false);
  const [registrationError, setRegistrationError] = useState<string | null>(
    null
  );

  // Track if form has meaningful unsaved changes
  // Only consider it a change if user has entered actual content beyond the initial "#" or groups selected
  const hasUnsavedChanges = useMemo(() => {
    return (
      (formData.cCNumber.trim() !== "#" && formData.cCNumber.trim() !== "") ||
      formData.cCName.trim() !== "" ||
      formData.isActive !== true ||
      formData.CCTags.length > 0
    );
  }, [formData.cCName, formData.cCNumber, formData.isActive, formData.CCTags]);

  // Update parent component with changes state
  useEffect(() => {
    setHasUnsavedChanges(hasUnsavedChanges);
  }, [hasUnsavedChanges, setHasUnsavedChanges]);

  // Format the preview text for display using utility function
  const previewText = useMemo(() => {
    if (formData.cCNumber.trim() !== "#" && formData.cCName.trim()) {
      return formatCostCodeName(
        combineCostCodeName(formData.cCNumber, formData.cCName)
      );
    }
    return null;
  }, [formData.cCNumber, formData.cCName]);

  // Memoized handler for input changes
  const handleInputChange = useCallback(
    (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      const { name, value } = e.target;

      if (name === "cCNumber") {
        // Format cCNumber to always start with # and only allow numbers and periods
        let formattedValue = value;

        // If user tries to delete the #, add it back
        if (!formattedValue.startsWith("#")) {
          formattedValue = "#" + formattedValue.replace(/^#+/, "");
        }

        // Remove any characters that aren't numbers, periods, or the initial #
        formattedValue = "#" + formattedValue.slice(1).replace(/[^\d.]/g, "");

        setFormData((prev) => ({
          ...prev,
          [name]: formattedValue,
        }));
      } else if (name === "isActive") {
        setFormData((prev) => ({
          ...prev,
          [name]: value === "Active",
        }));
      } else {
        setFormData((prev) => ({
          ...prev,
          [name]: value,
        }));
      }
    },
    []
  );

  // Handler for toggling tags/groups
  const handleTagToggle = useCallback(
    (tagId: string, tagName: string) => {
      // Get the current CCTags array
      const currentTags = formData.CCTags;

      // Check if the tag is already selected
      const tagIndex = currentTags.findIndex((tag) => tag.id === tagId);

      // Create a new array based on the toggle action
      const newTags =
        tagIndex >= 0
          ? // Remove if it exists
            [
              ...currentTags.slice(0, tagIndex),
              ...currentTags.slice(tagIndex + 1),
            ]
          : // Add if it doesn't exist
            [...currentTags, { id: tagId, name: tagName }];

      // Update the form data
      setFormData((prev) => ({
        ...prev,
        CCTags: newTags,
      }));
    },
    [formData.CCTags]
  );

  // Memoized submit handler
  const handleSubmit = useCallback(async () => {
    // Clear any existing notifications
    setSuccessfullyRegistered(false);
    setRegistrationError(null);
    setIsSubmitting(true);

    try {
      const result = await onSubmit(formData);

      if (result.success) {
        setSuccessfullyRegistered(true);
        // Reset form data
        setFormData({
          cCNumber: "#",
          cCName: "",
          isActive: true,
          CCTags: [],
        });

        // Hide the success message after 3 seconds
        setTimeout(() => {
          setSuccessfullyRegistered(false);
          setIsSubmitting(false);
        }, 3000);
      } else {
        // Display specific error message
        setRegistrationError(
          result.error || "Registration failed. Please try again."
        );
        setIsSubmitting(false);

        // Auto-dismiss error after 5 seconds
        setTimeout(() => {
          setRegistrationError(null);
        }, 5000);
      }
    } catch (error) {
      console.error("Error submitting cost code:", error);
      setRegistrationError(
        error instanceof Error
          ? error.message
          : "An unexpected error occurred. Please try again."
      );
      setIsSubmitting(false);

      // Auto-dismiss error after 5 seconds
      setTimeout(() => {
        setRegistrationError(null);
      }, 5000);
    }
  }, [formData, onSubmit]);

  // Determine if submit button should be disabled
  const isSubmitDisabled = useMemo(() => {
    return (
      isSubmitting ||
      !formData.cCName.trim() ||
      formData.cCNumber.trim() === "#"
    );
  }, [isSubmitting, formData.cCName, formData.cCNumber]);

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
              disabled={isSubmitDisabled || !hasUnsavedChanges}
              className="w-fit h-auto px-2"
            >
              <Texts
                size="sm"
                text="link"
                className={`${!hasUnsavedChanges ? "text-gray-500" : ""}`}
              >
                {isSubmitting ? "Registering..." : "Register Cost Code"}
              </Texts>
            </Buttons>

            <Buttons
              background={"none"}
              shadow={"none"}
              onClick={onCancel}
              disabled={isSubmitting}
              className="w-fit h-auto px-2"
            >
              <Texts position={"left"} size="sm" text="link">
                Cancel Registration
              </Texts>
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
                <label htmlFor="cCNumber" className="text-sm">
                  Cost Code Number<span className="text-red-500">*</span>
                </label>
                <Inputs
                  type="text"
                  name="cCNumber"
                  value={formData.cCNumber}
                  onChange={handleInputChange}
                  required
                  className=" w-full text-sm"
                />

                <label htmlFor="cCName" className="text-sm">
                  Cost Code Name*
                </label>
                <Inputs
                  type="text"
                  name="cCName"
                  value={formData.cCName}
                  onChange={handleInputChange}
                  required
                  className="w-full text-sm"
                />

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
