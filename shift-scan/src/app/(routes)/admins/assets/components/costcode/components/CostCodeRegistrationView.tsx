"use client";
import { Buttons } from "@/components/(reusable)/buttons";
import { Grids } from "@/components/(reusable)/grids";
import { Holds } from "@/components/(reusable)/holds";
import { Inputs } from "@/components/(reusable)/inputs";
import { Selects } from "@/components/(reusable)/selects";
import { Texts } from "@/components/(reusable)/texts";
import { Titles } from "@/components/(reusable)/titles";
import { useState, useEffect } from "react";

interface CostCodeRegistrationViewProps {
  onSubmit: (formData: { name: string; isActive: boolean }) => void;
  onCancel: () => void;
  onUnsavedChangesChange?: (hasChanges: boolean) => void;
}

/**
 * Registration form for new cost codes
 */
export default function CostCodeRegistrationView({
  onSubmit,
  onCancel,
  onUnsavedChangesChange,
}: CostCodeRegistrationViewProps) {
  const [formData, setFormData] = useState({
    name: "",
    isActive: true,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Track if form has unsaved changes
  const hasUnsavedChanges =
    formData.name.trim() !== "" || formData.isActive !== true;

  // Notify parent component when unsaved changes state changes
  useEffect(() => {
    onUnsavedChangesChange?.(hasUnsavedChanges);
  }, [hasUnsavedChanges, onUnsavedChangesChange]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    if (name === "isActive") {
      setFormData({
        ...formData,
        [name]: value === "Active",
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleSubmit = () => {
    setIsSubmitting(true);
    onSubmit(formData);
  };

  return (
    <Grids className="w-full h-full grid-rows-[40px_1fr] gap-4">
      <Holds
        position={"row"}
        background={"white"}
        className="w-full h-full gap-4 px-4"
      >
        <Holds className="w-full">
          <Buttons
            background={"none"}
            shadow={"none"}
            onClick={onCancel}
            disabled={isSubmitting}
            className="w-full h-auto px-2"
          >
            <Texts position={"left"} size="xs" text="link">
              Cancel Registration
            </Texts>
          </Buttons>
        </Holds>
        <Holds position={"row"} className="justify-end">
          <Buttons
            background={"none"}
            shadow={"none"}
            onClick={handleSubmit}
            disabled={isSubmitting || !formData.name.trim()}
            className="w-fit h-auto px-2"
          >
            <Texts size="xs" text="link">
              Register Cost Code
            </Texts>
          </Buttons>
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
              <label htmlFor="name" className="text-sm">
                Cost Code Name*
              </label>
              <Inputs
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                className="mb-4 w-full text-sm"
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
              <Holds className="h-full border-[3px] border-black p-3 rounded-[10px] mb-3">
                <Texts size="xs" className="text-gray-500">
                  Cost code group management will be implemented in a future
                  update.
                </Texts>
              </Holds>
            </Holds>
          </Grids>
        </Grids>
      </Holds>
    </Grids>
  );
}
