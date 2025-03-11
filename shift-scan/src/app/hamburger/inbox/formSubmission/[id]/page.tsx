"use client";
import { useEffect, useState } from "react";
import { FormInput } from "./formInput";

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

interface FormGrouping {
  id: string;
  title: string;
  order: number;
  fields: FormField[];
}

interface FormTemplate {
  id: string;
  name: string;
  formType: string;
  isActive: boolean;
  isSignatureRequired: boolean;
  groupings: FormGrouping[];
}

export default function DynamicForm({ params }: { params: { id: string } }) {
  const [formData, setFormData] = useState<FormTemplate | null>(null);
  const [formValues, setFormValues] = useState<Record<string, string>>({});

  useEffect(() => {
    async function fetchForm() {
      const res = await fetch(`/api/form/` + params.id);
      const data = await res.json();
      setFormData(data);
      console.log(data);
    }

    fetchForm();
  }, [params.id]);

  if (!formData) return <p>Loading form...</p>;

  return (
    <div>
      <h2>{formData.name}</h2>
      <form>
        {formData?.groupings?.map((group) => (
          <div key={group.id}>
            <h3>{group.title || ""}</h3>
            {group.fields.map((field) => (
              <FormInput
                key={field.id}
                field={field}
                formValues={formValues}
                setFormValues={setFormValues}
              />
            ))}
          </div>
        ))}

        <button type="submit">Submit</button>
      </form>
    </div>
  );
}
