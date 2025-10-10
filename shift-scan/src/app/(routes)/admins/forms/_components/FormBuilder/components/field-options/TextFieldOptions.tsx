"use client";

import { Input } from "@/components/ui/input";
import { FormField } from "../../types";
import { Label } from "@/components/ui/label";

interface TextFieldOptionsProps {
  field: FormField;
  updateField: (fieldId: string, updatedProperties: Partial<FormField>) => void;
}

export const TextFieldOptions: React.FC<TextFieldOptionsProps> = ({
  field,
  updateField,
}) => {
  return (
    <div>
      <div className="flex flex-col gap-2 pb-2">
        <p className="text-sm font-semibold ">
          Character Limits
          <span className="bg-blue-100 text-blue-600 px-2 py-0.5 rounded-lg ml-1 text-xs">
            Optional
          </span>
        </p>
        <p className="text-xs text-gray-500">
          Specify the minimum and/or maximum number of characters for this
          field.
        </p>
      </div>

      <div className="flex flex-row gap-2 mt-2">
        <div className="flex flex-col">
          <Label className="text-xs font-normal">Min Length</Label>
          <Input
            type="number"
            value={field.minLength || ""}
            onChange={(e) =>
              updateField(field.id, {
                minLength: parseInt(e.target.value) || undefined,
              })
            }
            min={0}
            className="bg-white rounded-lg text-xs w-fit"
            placeholder="Enter min length"
          />
        </div>
        <div className="flex flex-col">
          <Label className="text-xs font-normal">Max Length</Label>
          <Input
            type="number"
            value={field.maxLength || ""}
            onChange={(e) =>
              updateField(field.id, {
                maxLength: parseInt(e.target.value) || undefined,
              })
            }
            min={0}
            className="bg-white rounded-lg text-xs w-fit"
            placeholder="Enter max length"
          />
        </div>
      </div>
    </div>
  );
};
