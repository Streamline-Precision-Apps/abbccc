"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Holds } from "@/components/(reusable)/holds";
import { Buttons } from "@/components/(reusable)/buttons";
import { Titles } from "@/components/(reusable)/titles";
import { Inputs } from "@/components/(reusable)/inputs";
import { Selects } from "@/components/(reusable)/selects";
import { Grids } from "@/components/(reusable)/grids";

type FormTemplate = {
  id: string;
  name: string;
  description?: string;
  fields: FormField[];
};

type FormField = {
  id: string;
  label: string;
  type: "TEXT" | "NUMBER" | "DATE" | "FILE" | "DROPDOWN" | "CHECKBOX";
  required: boolean;
  options?: string;
};

export default function FormPage({ params }: { params: { slug: string } }) {
  const [form, setForm] = useState<FormTemplate | null>(null);
  const [formData, setFormData] = useState<{ [key: string]: any }>({});
  const router = useRouter();

  // Fetch form data from API
  useEffect(() => {
    const fetchForm = async () => {
      const response = await fetch(`/api/forms/${params.slug}`);
      const data = await response.json();
      if (data.error) return router.push("/404"); // Redirect if form not found
      setForm(data);
    };
    fetchForm();
  }, [params.slug, router]);

  // Handle input changes
  const handleChange = (fieldId: string, value: any) => {
    setFormData((prev) => ({ ...prev, [fieldId]: value }));
  };

  // Handle form submission
  const handleSubmit = async () => {
    //Todo: Send Data to API
  };

  if (!form) return <p>Loading...</p>;

  return (
    <Holds className="p-5">
      <Titles size="h3">{form.name}</Titles>
      {form.description && <p>{form.description}</p>}

      <Grids gap="4" className="auto-rows-auto">
        {form.fields.map((field) => (
          <Holds key={field.id} className="mb-3">
            <label className="block">
              {field.label} {field.required && "*"}
            </label>
            {field.type === "TEXT" && (
              <Inputs
                type="text"
                required={field.required}
                onChange={(e) => handleChange(field.id, e.target.value)}
              />
            )}
            {field.type === "NUMBER" && (
              <Inputs
                type="number"
                required={field.required}
                onChange={(e) => handleChange(field.id, e.target.value)}
              />
            )}
            {field.type === "DATE" && (
              <Inputs
                type="date"
                required={field.required}
                onChange={(e) => handleChange(field.id, e.target.value)}
              />
            )}
            {field.type === "FILE" && (
              <Inputs
                type="file"
                required={field.required}
                onChange={(e) => handleChange(field.id, e.target.files?.[0])}
              />
            )}
            {field.type === "DROPDOWN" && field.options && (
              <Selects onChange={(e) => handleChange(field.id, e.target.value)}>
                {JSON.parse(field.options).map((option: string) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </Selects>
            )}
            {field.type === "CHECKBOX" && (
              <input
                type="checkbox"
                onChange={(e) => handleChange(field.id, e.target.checked)}
              />
            )}
          </Holds>
        ))}
      </Grids>

      <Buttons onClick={handleSubmit} background={"lightBlue"}>
        Submit
      </Buttons>
    </Holds>
  );
}
