import { Label } from "@/components/ui/label";

import { useState } from "react";
import { SingleCombobox } from "@/components/ui/single-combobox";
import { FormIndividualTemplate } from "@/app/(routes)/admins/forms/[id]/_component/hooks/types";
import RenderCheckboxField from "@/app/(routes)/admins/forms/_components/RenderCheckboxField";
import RenderDateField from "@/app/(routes)/admins/forms/_components/RenderDateField";
import RenderDropdownField from "@/app/(routes)/admins/forms/_components/RenderDropdownField";
import RenderInputField from "@/app/(routes)/admins/forms/_components/RenderInputField";
import RenderMultiselectField from "@/app/(routes)/admins/forms/_components/RenderMultiselectField";
import RenderNumberField from "@/app/(routes)/admins/forms/_components/RenderNumberField";
import RenderRadioField from "@/app/(routes)/admins/forms/_components/RenderRadioField";
import RenderSearchPersonField, {
  Fields,
} from "@/app/(routes)/admins/forms/_components/RenderSearchPersonField";
import RenderTextArea from "@/app/(routes)/admins/forms/_components/RenderTextAreaField";
import RenderSearchAssetField from "./RenderSearchAssetField";
import RenderTimeField from "./RenderTimeField";

// Define a FormFieldValue type to represent all possible field values
type FormFieldValue =
  | string
  | Date
  | string[]
  | object
  | boolean
  | number
  | null;

export default function RenderFields({
  formTemplate,
  userOptions,
  submittedBy,
  setSubmittedBy,
  submittedByTouched,
  formData,
  handleFieldChange,
  clientOptions = [],
  equipmentOptions = [],
  jobsiteOptions = [],
  costCodeOptions = [],
  readOnly = false,
  hideSubmittedBy = false,
}: {
  formTemplate: FormIndividualTemplate;
  userOptions: { value: string; label: string }[];
  submittedBy: { id: string; firstName: string; lastName: string } | null;
  setSubmittedBy: (
    user: { id: string; firstName: string; lastName: string } | null
  ) => void;
  submittedByTouched: boolean;
  formData: Record<string, FormFieldValue>;
  handleFieldChange: (fieldId: string, value: FormFieldValue) => void;
  clientOptions: { value: string; label: string }[];
  equipmentOptions?: { value: string; label: string }[];
  jobsiteOptions?: { value: string; label: string }[];
  costCodeOptions?: { value: string; label: string }[];
  readOnly?: boolean;
  hideSubmittedBy?: boolean;
}) {
  const [touchedFields, setTouchedFields] = useState<Record<string, boolean>>(
    {}
  );

  const handleFieldTouch = (fieldId: string) => {
    setTouchedFields((prev) => ({ ...prev, [fieldId]: true }));
  };

  const handleFieldValidation = (field: Fields, value: FormFieldValue) => {
    if (
      field.required &&
      (value === null || value === undefined || value === "")
    ) {
      return `Required`;
    }
    return null;
  };

  // Helper function to get correctly typed value based on field type
  const getTypedValue = (
    field: Fields,
    rawValue: FormFieldValue
  ): FormFieldValue => {
    if (rawValue === null || rawValue === undefined) {
      switch (field.type) {
        case "TEXT":
        case "INPUT":
        case "TEXTAREA":
        case "DROPDOWN":
        case "RADIO":
        case "TIME":
        case "SEARCH_PERSON":
        case "SEARCH_ASSET":
          return "";
        case "NUMBER":
          return 0;
        case "CHECKBOX":
          return false;
        case "DATE":
        case "DATE_TIME":
          return null;
        case "MULTISELECT":
          return [];
        default:
          return "";
      }
    }
    return rawValue;
  };

  if (!formTemplate?.FormGrouping) return null;
  return (
    <>
      {!hideSubmittedBy && (
        <div className="mb-4">
          <Label className="text-sm font-medium mb-1 ">
            Submitted By <span className="text-red-500">*</span>
          </Label>
          <SingleCombobox
            options={userOptions}
            value={submittedBy?.id || ""}
            onChange={(val, option) => {
              if (!readOnly) {
                if (option) {
                  setSubmittedBy({
                    id: option.value,
                    firstName: option.label.split(" ")[0],
                    lastName: option.label.split(" ")[1],
                  });
                } else {
                  setSubmittedBy(null);
                }
              }
            }}
            placeholder="Select user"
            filterKeys={["value", "label"]}
            disabled={readOnly}
          />
          {submittedByTouched && !submittedBy?.id.trim() && (
            <span className="text-xs text-red-500">
              This field is required.
            </span>
          )}
        </div>
      )}
      {formTemplate.FormGrouping?.map((group) => (
        <div key={group.id} className="mb-4">
          <div className="flex flex-col gap-5">
            {group.Fields?.map((field: Fields) => {
              // Get properly typed value based on field type
              const rawValue = field.id in formData ? formData[field.id] : null;
              const value = getTypedValue(field, rawValue);
              const options = field.Options || [];
              const error = handleFieldValidation(field, value);

              switch (field.type) {
                case "TEXT":
                case "INPUT":
                  return (
                    <RenderInputField
                      key={field.id}
                      field={field}
                      value={value as string}
                      handleFieldChange={
                        readOnly
                          ? () => {}
                          : (id: string, val: string) => {
                              handleFieldChange(id, val);
                            }
                      }
                      handleFieldTouch={handleFieldTouch}
                      touchedFields={touchedFields}
                      error={error}
                    />
                  );
                case "TEXTAREA":
                  return (
                    <RenderTextArea
                      key={field.id}
                      field={field}
                      value={value as string}
                      handleFieldChange={
                        readOnly
                          ? () => {}
                          : (id: string, val: string) => {
                              handleFieldChange(id, val);
                            }
                      }
                      handleFieldTouch={handleFieldTouch}
                      touchedFields={touchedFields}
                      error={error}
                    />
                  );
                case "NUMBER":
                  return (
                    <RenderNumberField
                      key={field.id}
                      field={field}
                      value={value as string}
                      handleFieldChange={
                        readOnly
                          ? () => {}
                          : (id: string, val: string) => {
                              handleFieldChange(id, val);
                            }
                      }
                      handleFieldTouch={handleFieldTouch}
                      touchedFields={touchedFields}
                      error={error}
                    />
                  );
                case "DATE":
                case "DATE_TIME":
                  return (
                    <RenderDateField
                      key={field.id}
                      field={field}
                      value={value as string}
                      handleFieldChange={
                        readOnly
                          ? () => {}
                          : (id: string, val: string) => {
                              handleFieldChange(id, val);
                            }
                      }
                      handleFieldTouch={handleFieldTouch}
                      touchedFields={touchedFields}
                      error={error}
                    />
                  );
                case "TIME":
                  return (
                    <RenderTimeField
                      key={field.id}
                      field={field}
                      value={value as string}
                      handleFieldChange={
                        readOnly
                          ? () => {}
                          : (id: string, val: string) => {
                              handleFieldChange(id, val);
                            }
                      }
                      handleFieldTouch={handleFieldTouch}
                      touchedFields={touchedFields}
                      error={error}
                    />
                  );
                case "DROPDOWN":
                  return (
                    <RenderDropdownField
                      key={field.id}
                      field={field}
                      value={value as string}
                      options={options}
                      handleFieldChange={
                        readOnly
                          ? () => {}
                          : (id: string, val: string) => {
                              handleFieldChange(id, val);
                            }
                      }
                      handleFieldTouch={handleFieldTouch}
                      touchedFields={touchedFields}
                      error={error}
                    />
                  );
                case "RADIO":
                  return (
                    <RenderRadioField
                      key={field.id}
                      field={field}
                      value={value as string}
                      options={options}
                      handleFieldChange={
                        readOnly
                          ? () => {}
                          : (id: string, val: string) => {
                              handleFieldChange(id, val);
                            }
                      }
                      handleFieldTouch={handleFieldTouch}
                      touchedFields={touchedFields}
                      error={error}
                    />
                  );
                case "CHECKBOX":
                  return (
                    <RenderCheckboxField
                      key={field.id}
                      field={field}
                      value={value as string | boolean}
                      handleFieldChange={
                        readOnly
                          ? () => {}
                          : (id: string, val: string | boolean) => {
                              handleFieldChange(id, val);
                            }
                      }
                      handleFieldTouch={handleFieldTouch}
                      touchedFields={touchedFields}
                      error={error}
                    />
                  );
                case "HEADER":
                  return (
                    <div key={field.id} className="col-span-2">
                      <h2 className="text-xl font-bold my-2">{field.label}</h2>
                      <h2 className="text-xl font-bold my-2">
                        {field.content}
                      </h2>
                    </div>
                  );
                case "PARAGRAPH":
                  return (
                    <div key={field.id} className="col-span-2">
                      <p className="text-gray-700 text-sm">{field.label}</p>
                      <p className="text-gray-700 my-2">{field.content}</p>
                    </div>
                  );
                case "MULTISELECT":
                  return (
                    <RenderMultiselectField
                      key={field.id}
                      field={field}
                      value={value as string | string[]}
                      options={options}
                      handleFieldChange={
                        readOnly
                          ? () => {}
                          : (id: string, val: string | string[]) => {
                              handleFieldChange(id, val);
                            }
                      }
                      handleFieldTouch={handleFieldTouch}
                      touchedFields={touchedFields}
                      error={error}
                    />
                  );
                case "SEARCH_PERSON":
                  return (
                    <RenderSearchPersonField
                      key={field.id}
                      field={field}
                      value={value as string}
                      userOptions={userOptions} // Use the userOptions array
                      handleFieldChange={
                        readOnly
                          ? () => {}
                          : (
                              id: string,
                              val:
                                | string
                                | Date
                                | string[]
                                | object
                                | boolean
                                | number
                                | null
                            ) => {
                              handleFieldChange(id, val);
                            }
                      }
                      handleFieldTouch={handleFieldTouch}
                      touchedFields={touchedFields}
                      error={error}
                      formData={formData}
                    />
                  );
                case "SEARCH_ASSET":
                  return (
                    <RenderSearchAssetField
                      key={field.id}
                      field={field}
                      value={value as string}
                      handleFieldChange={
                        readOnly
                          ? () => {}
                          : (
                              id: string,
                              val:
                                | string
                                | Date
                                | string[]
                                | object
                                | boolean
                                | number
                                | null
                            ) => {
                              handleFieldChange(id, val);
                            }
                      }
                      handleFieldTouch={handleFieldTouch}
                      touchedFields={touchedFields}
                      formData={formData}
                      clientOptions={clientOptions || []}
                      equipmentOptions={equipmentOptions || []}
                      jobsiteOptions={jobsiteOptions || []}
                      costCodeOptions={costCodeOptions || []}
                      error={error}
                    />
                  );
                default:
                  return (
                    <RenderInputField
                      key={field.id}
                      field={field}
                      value={value as string}
                      handleFieldChange={
                        readOnly
                          ? () => {}
                          : (id: string, val: string) => {
                              handleFieldChange(id, val);
                            }
                      }
                      handleFieldTouch={handleFieldTouch}
                      touchedFields={touchedFields}
                      error={error}
                    />
                  );
              }
            }) || []}
          </div>
        </div>
      )) || []}
    </>
  );
}
