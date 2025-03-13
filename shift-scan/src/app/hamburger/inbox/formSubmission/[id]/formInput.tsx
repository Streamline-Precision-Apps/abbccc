"use client";

import { Holds } from "@/components/(reusable)/holds";
import { Inputs } from "@/components/(reusable)/inputs";
import { Labels } from "@/components/(reusable)/labels";
import { Selects } from "@/components/(reusable)/selects";
import { TextAreas } from "@/components/(reusable)/textareas";

interface FormField {
  id: string;
  label: string;
  name: string;
  type: string;
  required: boolean;
  order: number;
  defaultValue?: string;
  placeholder?: string;
  helperText?: string;
  options?: string[];
}
interface FormInputProps {
  field: FormField;
  formValues: Record<string, string>;
  setFormValues: (values: Record<string, string>) => void;
}

export const FormInput: React.FC<FormInputProps> = ({
  field,
  formValues,
  setFormValues,
}) => {
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const key = field.name;
    setFormValues({ ...formValues, [key]: e.target.value });
  };

  return (
    <Holds>
      <Labels htmlFor={field.id}>
        {field.label}{" "}
        {field.required && <span className="text-red-500">*</span>}
      </Labels>

      {field.type === "TEXT" && (
        <Inputs
          type="text"
          id={field.id}
          name={field.name}
          placeholder={field.placeholder}
          required={field.required}
          value={formValues[field.id] || ""}
          onChange={handleChange}
        />
      )}

      {field.type === "TEXTAREA" && (
        <TextAreas
          id={field.id}
          name={field.name}
          placeholder={field.placeholder}
          required={field.required}
          value={formValues[field.id] || ""}
          onChange={handleChange}
        />
      )}

      {field.type === "DATE" && (
        <Inputs
          type="date"
          id={field.id}
          name={field.name}
          required={field.required}
          value={formValues[field.id] || ""}
          onChange={handleChange}
        />
      )}

      {field.type === "DROPDOWN" && field.options && (
        <Selects
          id={field.id}
          name={field.name}
          required={field.required}
          value={formValues[field.id] || ""}
          onChange={handleChange}
        >
          <option value="">Select an option</option>
          {field.options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </Selects>
      )}

      {field.type === "CHECKBOX" && (
        <Inputs
          type="checkbox"
          id={field.id}
          name={field.name}
          checked={formValues[field.id] === "true"}
          onChange={(e) =>
            setFormValues({
              ...formValues,
              [field.id]: e.target.checked.toString(),
            })
          }
        />
      )}

      {field.helperText && <p>{field.helperText}</p>}
    </Holds>
  );
};
