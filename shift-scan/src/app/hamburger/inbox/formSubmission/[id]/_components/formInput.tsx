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
  setFormValues?: (values: Record<string, string>) => void;
  readOnly?: boolean; // Add a readOnly prop
}

export const FormInput: React.FC<FormInputProps> = ({
  field,
  formValues,
  setFormValues,
  readOnly = false, // Default to false
}) => {
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    if (!readOnly && setFormValues) {
      const key = field.name; // Use field.name as the key
      setFormValues({ ...formValues, [key]: e.target.value });
    }
  };

  return (
    <Holds>
      <Labels size={"p5"} htmlFor={field.name}>
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
          readOnly={readOnly} // Set readOnly attribute
          disabled={readOnly} // Set disabled attribute
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
          readOnly={readOnly} // Set readOnly attribute
          disabled={readOnly} // Set disabled attribute
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
          readOnly={readOnly} // Set readOnly attribute
          disabled={readOnly} // Set disabled attribute
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
          disabled={readOnly} // Set disabled attribute
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
            !readOnly &&
            setFormValues &&
            setFormValues({
              ...formValues,
              [field.name]: e.target.checked.toString(), // Use field.name as the key
            })
          }
          disabled={readOnly} // Set disabled attribute
        />
      )}

      {field.helperText && <p>{field.helperText}</p>}
    </Holds>
  );
};
