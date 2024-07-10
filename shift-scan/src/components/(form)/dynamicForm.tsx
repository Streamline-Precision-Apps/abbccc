"use client";
import { useState, useEffect, ChangeEvent, FormEvent } from "react";

// Define types for the form structure and fields
type FormField = {
    id: string;
    name: string;
    label: string;
    type: string;
    required: boolean;
};

type FormStructure = {
    title: string;
    fields: FormField[];
};

type DynamicFormProps = {
    formId: string | string[] | undefined;
};

export default function DynamicForm({ formId }: DynamicFormProps) {
    const [formStructure, setFormStructure] = useState<FormStructure | null>(null);
    const [formData, setFormData] = useState<{ [key: string]: string }>({});

    useEffect(() => {
    // Fetch form structure based on form ID
    const fetchFormStructure = async () => {
        const response = await fetch(`/api/forms/${formId}`);
        const data: FormStructure = await response.json();
        setFormStructure(data);
    };
    fetchFormStructure();
    }, [formId]);

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    await fetch(`/api/forms/submit`, {
        method: "POST",
        headers: {
        "Content-Type": "application/json",
        },
        body: JSON.stringify({ formId, data: formData }),
    });
};

    if (!formStructure) return null;

    return (
    <form onSubmit={handleSubmit}>
        <h1>{formStructure.title}</h1>
        {formStructure.fields.map((field) => (
        <div key={field.id}>
            <label htmlFor={field.name}>{field.label}</label>
            <input
            type={field.type}
            name={field.name}
            required={field.required}
            value={formData[field.name] || ""}
            onChange={handleChange}
            />
        </div>
        ))}
        <button type="submit">Submit</button>
    </form>
    );
}