"use client";
interface FormField {
  id: string;
  label: string;
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
    setFormValues({ ...formValues, [field.id]: e.target.value });
  };

  return (
    <div>
      <label htmlFor={field.id}>
        {field.label} {field.required && "*"}
      </label>

      {field.type === "TEXT" && (
        <input
          type="text"
          id={field.id}
          placeholder={field.placeholder}
          required={field.required}
          value={formValues[field.id] || ""}
          onChange={handleChange}
        />
      )}

      {field.type === "TEXTAREA" && (
        <textarea
          id={field.id}
          placeholder={field.placeholder}
          required={field.required}
          value={formValues[field.id] || ""}
          onChange={handleChange}
        />
      )}

      {field.type === "DATE" && (
        <input
          type="date"
          id={field.id}
          required={field.required}
          value={formValues[field.id] || ""}
          onChange={handleChange}
        />
      )}

      {field.type === "DROPDOWN" && field.options && (
        <select
          id={field.id}
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
        </select>
      )}

      {field.type === "CHECKBOX" && (
        <input
          type="checkbox"
          id={field.id}
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
    </div>
  );
};
