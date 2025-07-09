import { Combobox } from "@/components/ui/combobox";
import { Label } from "@/components/ui/label";
import RenderTextArea from "./RenderTextAreaField";
import RenderNumberField from "./RenderNumberField";
import RenderDateField from "./RenderDateField";
import RenderTimeField from "./RenderTimeField";
import RenderDropdownField from "./RenderDropdownField";
import RenderRadioField from "./RenderRadioField";
import RenderCheckboxField from "./RenderCheckboxField";
import RenderSearchPersonField from "./RenderSearchPersonField";
import RenderMultiselectField from "./RenderMultiselectField";
import RenderSearchAssetField from "./RenderSearchAssetField";
import RenderInputField from "./RenderInputField";
import { FormIndividualTemplate } from "../[id]/_component/hooks/types";
import { Fields } from "../[id]/_component/CreateFormSubmissionModal";
import { useState } from "react";

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
}: {
  formTemplate: FormIndividualTemplate | null;
  userOptions: { value: string; label: string }[];
  submittedBy: { id: string; firstName: string; lastName: string } | null;
  setSubmittedBy: (
    user: { id: string; firstName: string; lastName: string } | null
  ) => void;
  submittedByTouched: boolean;
  formData: Record<string, any>;
  handleFieldChange: (
    fieldId: string,
    value: string | Date | string[] | object | boolean | number | null
  ) => void;
  clientOptions: { value: string; label: string }[];
  equipmentOptions?: { value: string; label: string }[];
  jobsiteOptions?: { value: string; label: string }[];
  costCodeOptions?: { value: string; label: string }[];
}) {
  const [touchedFields, setTouchedFields] = useState<Record<string, boolean>>(
    {}
  );

  const handleFieldTouch = (fieldId: string) => {
    setTouchedFields((prev) => ({ ...prev, [fieldId]: true }));
  };

  const handleFieldValidation = (field: Fields, value: any) => {
    if (field.required && !value) {
      return `Required`;
    }
    return null;
  };

  if (!formTemplate?.FormGrouping) return null;
  return (
    <>
      <div className="mb-4">
        <Label className="text-sm font-medium mb-1 ">
          Submitted By <span className="text-red-500">*</span>
        </Label>
        <Combobox
          options={userOptions}
          value={submittedBy?.id || ""}
          onChange={(val, option) => {
            if (option) {
              setSubmittedBy({
                id: option.value,
                firstName: option.label.split(" ")[0],
                lastName: option.label.split(" ")[1],
              });
            } else {
              setSubmittedBy(null);
            }
          }}
          placeholder="Select user"
          filterKeys={["value", "label"]}
        />
        {submittedByTouched && !submittedBy?.id.trim() && (
          <span className="text-xs text-red-500">This field is required.</span>
        )}
      </div>
      {formTemplate.FormGrouping.map((group) => (
        <div key={group.id} className="mb-4">
          <div className="flex flex-col gap-5">
            {group.Fields.map((field: Fields) => {
              const value = formData[field.id] ?? "";
              const options = field.Options || [];
              const error = handleFieldValidation(field, value);

              switch (field.type) {
                case "TEXTAREA":
                  return (
                    <RenderTextArea
                      field={field}
                      value={value}
                      handleFieldChange={handleFieldChange}
                      handleFieldTouch={handleFieldTouch}
                      touchedFields={touchedFields}
                      error={error}
                    />
                  );
                case "NUMBER":
                  return (
                    <RenderNumberField
                      field={field}
                      value={value}
                      handleFieldChange={handleFieldChange}
                      handleFieldTouch={handleFieldTouch}
                      touchedFields={touchedFields}
                      error={error}
                    />
                  );
                case "DATE":
                  return (
                    <RenderDateField
                      field={field}
                      value={value}
                      handleFieldChange={handleFieldChange}
                      handleFieldTouch={handleFieldTouch}
                      touchedFields={touchedFields}
                      error={error}
                    />
                  );
                case "TIME":
                  return (
                    <RenderTimeField
                      field={field}
                      value={value}
                      handleFieldChange={handleFieldChange}
                      handleFieldTouch={handleFieldTouch}
                      touchedFields={touchedFields}
                      error={error}
                    />
                  );
                case "DROPDOWN":
                  return (
                    <RenderDropdownField
                      field={field}
                      value={value}
                      options={options}
                      handleFieldChange={handleFieldChange}
                      handleFieldTouch={handleFieldTouch}
                      touchedFields={touchedFields}
                      error={error}
                    />
                  );
                case "RADIO":
                  return (
                    <RenderRadioField
                      field={field}
                      value={value}
                      options={options}
                      handleFieldChange={handleFieldChange}
                      handleFieldTouch={handleFieldTouch}
                      touchedFields={touchedFields}
                      error={error}
                    />
                  );
                case "CHECKBOX":
                  return (
                    <RenderCheckboxField
                      field={field}
                      value={value}
                      handleFieldChange={handleFieldChange}
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
                      field={field}
                      value={value}
                      options={options}
                      handleFieldChange={handleFieldChange}
                      handleFieldTouch={handleFieldTouch}
                      touchedFields={touchedFields}
                      error={error}
                    />
                  );
                case "SEARCH_PERSON":
                  return (
                    <RenderSearchPersonField
                      field={field}
                      value={value}
                      userOptions={userOptions} // Use the userOptions array
                      handleFieldChange={handleFieldChange}
                      handleFieldTouch={handleFieldTouch}
                      touchedFields={touchedFields}
                      error={error}
                      formData={formData}
                    />
                  );
                case "SEARCH_ASSET":
                  return (
                    <RenderSearchAssetField
                      field={field}
                      value={value}
                      handleFieldChange={handleFieldChange}
                      handleFieldTouch={handleFieldTouch}
                      touchedFields={touchedFields}
                      formData={formData}
                      clientOptions={clientOptions}
                      equipmentOptions={equipmentOptions}
                      jobsiteOptions={jobsiteOptions}
                      costCodeOptions={costCodeOptions}
                    />
                  );
                case "INPUT":
                default:
                  return (
                    <RenderInputField
                      field={field}
                      value={value}
                      handleFieldChange={handleFieldChange}
                      handleFieldTouch={handleFieldTouch}
                      touchedFields={touchedFields}
                      error={error}
                    />
                  );
              }
            })}
          </div>
        </div>
      ))}
    </>
  );
}
