"use client";

import { Separator } from "@/components/ui/separator";
import { FormField } from "../../types";
import { TextFieldOptions } from "./TextFieldOptions";
import { NumberFieldOptions } from "./NumberFieldOptions";
import { DropdownFieldOptions } from "./DropdownFieldOptions";
import { TextareaFieldOptions } from "./TextareaFieldOptions";
import { RadioFieldOptions } from "./RadioFieldOptions";
import { MultiselectFieldOptions } from "./MultiselectFieldOptions";
import { SearchPersonFieldOptions } from "./SearchPersonFieldOptions";
import { SearchAssetFieldOptions } from "./SearchAssetFieldOptions";
import { Dispatch, SetStateAction } from "react";

interface FieldOptionsProps {
  field: FormField;
  updateField: (fieldId: string, updatedProperties: Partial<FormField>) => void;
  validationErrors: Record<string, { minError?: string; maxError?: string }>;
  setValidationErrors: Dispatch<
    SetStateAction<
      Record<
        string,
        {
          minError?: string;
          maxError?: string;
        }
      >
    >
  >;
}

export const FieldOptions: React.FC<FieldOptionsProps> = ({
  field,
  updateField,
  validationErrors,
  setValidationErrors,
}) => {
  // Render different options based on field type
  return (
    <>
      <Separator className="my-2" />
      {field.type === "TEXT" && (
        <TextFieldOptions field={field} updateField={updateField} />
      )}

      {field.type === "NUMBER" && (
        <NumberFieldOptions
          field={field}
          updateField={updateField}
          validationErrors={validationErrors}
          setValidationErrors={setValidationErrors}
        />
      )}

      {field.type === "DROPDOWN" && (
        <DropdownFieldOptions field={field} updateField={updateField} />
      )}

      {field.type === "TEXTAREA" && (
        <TextareaFieldOptions field={field} updateField={updateField} />
      )}

      {field.type === "RADIO" && (
        <RadioFieldOptions field={field} updateField={updateField} />
      )}

      {field.type === "MULTISELECT" && (
        <MultiselectFieldOptions field={field} updateField={updateField} />
      )}

      {field.type === "SEARCH_PERSON" && (
        <SearchPersonFieldOptions field={field} updateField={updateField} />
      )}

      {field.type === "SEARCH_ASSET" && (
        <SearchAssetFieldOptions field={field} updateField={updateField} />
      )}
    </>
  );
};
