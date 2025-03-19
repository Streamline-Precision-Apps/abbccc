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
  maxLength?: number;
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
    const key = field.name; // Use field.name as the key
    setFormValues({ ...formValues, [key]: e.target.value });
  };

  return (
    <Holds>
      <Labels size={"p4"} htmlFor={field.name}>
        {field.label}{" "}
        {field.required && <span className="text-red-500">*</span>}
      </Labels>

      {field.type === "TEXT" && (
        <Inputs
          type="text"
          id={field.name}
          name={field.name} // Use field.name
          placeholder={field.placeholder}
          required={field.required}
          value={formValues[field.name] || ""}
          onChange={handleChange}
          className="text-center text-sm"
        />
      )}

      {field.type === "TEXTAREA" && (
        <TextAreas
          id={field.name}
          name={field.name} // Use field.name
          placeholder={field.placeholder}
          required={field.required}
          value={formValues[field.name] || ""}
          onChange={handleChange}
          className=" text-sm"
          maxLength={field.maxLength || undefined}
        />
      )}

      {field.type === "DATE" && (
        <Inputs
          type="date"
          id={field.name}
          name={field.name} // Use field.name
          required={field.required}
          value={formValues[field.name] || ""}
          onChange={handleChange}
          className="text-center text-sm"
        />
      )}

      {field.type === "DROPDOWN" && field.options && (
        <Selects
          id={field.name}
          name={field.name} // Use field.name
          required={field.required}
          value={formValues[field.name] || ""}
          onChange={handleChange}
          className="text-center text-sm"
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
          id={field.name}
          name={field.name} // Use field.name
          checked={formValues[field.name] === "true"} // Use field.name as the key
          onChange={(e) =>
            setFormValues({
              ...formValues,
              [field.name]: e.target.checked.toString(), // Use field.name as the key
            })
          }
        />
      )}

      {field.helperText && <p>{field.helperText}</p>}
    </Holds>
  );
};
