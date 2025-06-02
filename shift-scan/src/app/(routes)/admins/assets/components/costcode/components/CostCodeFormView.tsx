"use client";
import { Buttons } from "@/components/(reusable)/buttons";
import { Grids } from "@/components/(reusable)/grids";
import { Holds } from "@/components/(reusable)/holds";
import { Texts } from "@/components/(reusable)/texts";
import CostCodeBasicFields from "./CostCodeBasicFields";
import { CostCode } from "../../../types";
import { Titles } from "@/components/(reusable)/titles";

interface CostCodeFormViewProps {
  formData: CostCode;
  changedFields: Set<keyof CostCode>;
  onInputChange: (fieldName: keyof CostCode, value: string | boolean) => void;
  onRevertField: (fieldName: keyof CostCode) => void;
  onRegisterNew: () => void;
  onDiscardChanges: () => void;
  onSaveChanges: () => void;
  hasUnsavedChanges: boolean;
  isSaving: boolean;
  successfullyUpdated: boolean;
}

/**
 * Main form view for cost code editing
 * Includes all form sections and action buttons
 */
export default function CostCodeFormView({
  formData,
  changedFields,
  onInputChange,
  onRevertField,
  onRegisterNew,
  onDiscardChanges,
  onSaveChanges,
  hasUnsavedChanges,
  isSaving,
  successfullyUpdated,
}: CostCodeFormViewProps) {
  return (
    <Grids className="w-full h-full grid-rows-[40px_1fr] gap-4 ">
      <Holds
        position={"row"}
        background={"white"}
        className="w-full h-full gap-4 px-4 "
      >
        <Holds className="w-full">
          <Buttons
            background={"none"}
            shadow={"none"}
            onClick={onRegisterNew}
            disabled={hasUnsavedChanges}
            className="w-full h-auto px-2 "
          >
            <Texts position={"left"} size="xs" text="link">
              Register New
            </Texts>
          </Buttons>
        </Holds>
        {/* {hasUnsavedChanges && ( */}
        <Holds position={"row"} className="justify-between">
          <Buttons
            background={"none"}
            shadow={"none"}
            onClick={onDiscardChanges}
            disabled={isSaving}
            className="w-fit h-auto px-2"
          >
            <Texts size="xs" text="link">
              Discard Changes
            </Texts>
          </Buttons>
          <Buttons
            background={"none"}
            shadow={"none"}
            onClick={onSaveChanges}
            disabled={isSaving}
            className="w-fit h-auto px-2"
          >
            <Texts size="xs" text="link">
              Save Changes
            </Texts>
          </Buttons>
        </Holds>
      </Holds>
      <Holds background={"white"} className="w-full h-full">
        <Grids className="w-full h-full grid-rows-[50px_1fr] p-4">
          <Holds className="w-full h-full">
            <Titles position="left" size="h5" className="font-bold mb-2">
              {formData.name || "Cost Code Information"}
            </Titles>
          </Holds>

          <Grids
            cols="2"
            gap="4"
            className="w-full h-full bg-white rounded-[10px]"
          >
            <Holds className="col-span-1 h-full">
              <CostCodeBasicFields
                formData={formData}
                changedFields={changedFields}
                onInputChange={onInputChange}
                onRevertField={onRevertField}
              />
            </Holds>

            <Holds className="col-span-1 h-full">
              {/* Cost Code Groups Section - Placeholder for future implementation */}
              <Texts position={"left"} size="xs" className="font-bold mb-2">
                Cost Code Groups
              </Texts>
              <Holds className="h-full border-[3px] border-black p-3 rounded-[10px] mb-3"></Holds>
            </Holds>
          </Grids>
        </Grids>
      </Holds>

      {successfullyUpdated && (
        <Holds className="mt-4 bg-green-100 p-2 rounded-md">
          <Texts size="xs" text="green">
            Cost code updated successfully
          </Texts>
        </Holds>
      )}
    </Grids>
  );
}
