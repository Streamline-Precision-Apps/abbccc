"use client";

import { FormIndividualTemplate } from "@/app/(routes)/admins/forms/[id]/_component/hooks/types";
import RenderFields from "./RenderFields";
import {
  useEquipment,
  useCostCode,
  useJobSite,
} from "@/app/context/dbCodeContext";
import { useEffect, useState } from "react";

// Define FormFieldValue type to match RenderFields expectations
type FormFieldValue =
  | string
  | Date
  | string[]
  | object
  | boolean
  | number
  | null;

// Define local types for backward compatibility
interface FormField {
  id: string;
  label: string;
  name: string;
  type: string;
  required: boolean;
  order: number;
  defaultValue?: string;
  placeholder?: string;
  maxLength?: number;
  helperText?: string;
  filter?: string;
  multiple?: boolean;
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

interface Option {
  value: string;
  label: string;
}

interface FormFieldRendererProps {
  formData: FormTemplate;
  formValues: Record<string, string>;
  setFormValues?: (values: Record<string, string>) => void;
  readOnly?: boolean;
  disabled?: boolean;
}

export const FormFieldRenderer: React.FC<FormFieldRendererProps> = ({
  formData,
  formValues,
  setFormValues,
  readOnly = false,
  disabled = false,
}) => {
  const [equipmentOptions, setEquipmentOptions] = useState<Option[]>([]);
  const [jobsiteOptions, setJobsiteOptions] = useState<Option[]>([]);
  const [costCodeOptions, setCostCodeOptions] = useState<Option[]>([]);
  const [userOptions, setUserOptions] = useState<Option[]>([]);

  // TODO: These hooks no longer provide data arrays - they only provide selected values
  // Need to implement proper data fetching for options
  const { selectedEquipment } = useEquipment();
  const { selectedCostCode } = useCostCode();
  const { selectedJobSite } = useJobSite();

  // Convert equipment data to Option format
  useEffect(() => {
    // TODO: Implement proper equipment data fetching
    // For now, using empty array to prevent build errors
    setEquipmentOptions([]);
  }, []);

  // Convert jobsite data to Option format
  useEffect(() => {
    // TODO: Implement proper jobsite data fetching  
    // For now, using empty array to prevent build errors
    setJobsiteOptions([]);
  }, []);

  // Convert cost code data to Option format
  useEffect(() => {
    // TODO: Implement proper cost code data fetching
    // For now, using empty array to prevent build errors
    setCostCodeOptions([]);
  }, []);

  // Fetch user options
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch("/api/getAllActiveEmployeeName", {
          cache: "no-store",
          headers: { "Cache-Control": "no-cache" },
        });
        const employees = await res.json();
        const options = employees.map(
          (user: { id: string; firstName: string; lastName: string }) => ({
            value: user.id,
            label: `${user.firstName} ${user.lastName}`,
          }),
        );
        setUserOptions(options);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };
    fetchUsers();
  }, []);

  // Convert FormTemplate to FormIndividualTemplate for RenderFields
  const convertToIndividualTemplate = (
    template: FormTemplate,
  ): FormIndividualTemplate => {
    return {
      id: template.id,
      name: template.name,
      formType: template.formType,
      isActive: template.isActive ? "ACTIVE" : "INACTIVE",
      isSignatureRequired: template.isSignatureRequired,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      description: null,
      Submissions: [],
      total: 0,
      page: 1,
      pageSize: 10,
      totalPages: 1,
      FormGrouping:
        template.groupings?.map((group: FormGrouping) => ({
          id: group.id,
          title: group.title,
          order: group.order,
          Fields:
            group.fields?.map((field: FormField) => ({
              id: field.id,
              formGroupingId: group.id,
              label: field.label,
              type: field.label === "Time" ? "TIME" : field.type, // Map Time label to TIME type
              required: field.required,
              order: field.order,
              placeholder: field.placeholder || null,
              maxLength: field.maxLength || null,
              minLength: null,
              multiple: field.multiple || null,
              content: null,
              filter: field.filter || null,
              Options:
                field.options?.map((opt: string) => ({
                  id: `${field.id}-${opt}`,
                  value: opt,
                  fieldId: field.id,
                })) || [],
            })) || [],
        })) || [],
    };
  };

  // Convert string values to proper types for RenderFields
  const convertToFormFieldValues = (
    values: Record<string, string>,
  ): Record<string, FormFieldValue> => {
    const result: Record<string, FormFieldValue> = {};

    Object.entries(values).forEach(([key, value]) => {
      // Find the field to understand its type
      // First try to find by field ID, then by field label/name, then by order
      let field = formData.groupings
        ?.flatMap((group: FormGrouping) => group.fields || [])
        .find(
          (f: FormField) => f.id === key || f.label === key || f.name === key,
        );

      // If no field found and key is numeric, try to find by order
      if (!field && /^\d+$/.test(key)) {
        const order = parseInt(key);
        field = formData.groupings
          ?.flatMap((group: FormGrouping) => group.fields || [])
          .find((f: FormField) => f.order === order);
      }

      if (field) {
        switch (field.type) {
          case "NUMBER":
            result[field.id] = value ? parseFloat(value) : 0;
            break;
          case "CHECKBOX":
            const checkboxValue = value === "true";
            result[field.id] = checkboxValue;
            break;
          case "DATE":
          case "DATE_TIME":
            result[field.id] = value || "";
            break;
          case "MULTISELECT":
            try {
              result[field.id] = value ? JSON.parse(value) : [];
            } catch (error) {
              // If JSON parsing fails, treat as empty array
              result[field.id] = [];
            }
            break;
          case "SEARCH_PERSON":
            try {
              result[field.id] = value ? JSON.parse(value) : null;
            } catch (error) {
              // If JSON parsing fails, treat as string (backward compatibility)
              result[field.id] = value || "";
            }
            break;
          case "SEARCH_ASSET":
            try {
              result[field.id] = value ? JSON.parse(value) : null;
            } catch (error) {
              // If JSON parsing fails, treat as string (backward compatibility)
              result[field.id] = value || "";
            }
            break;
          default:
            result[field.id] = value || "";
        }
      } else {
        result[key] = value || "";
      }
    });

    return result;
  };

  // Convert FormFieldValue back to string for legacy components
  const convertFromFormFieldValue = (value: FormFieldValue): string => {
    if (typeof value === "string") {
      return value;
    } else if (typeof value === "number" || typeof value === "boolean") {
      return value.toString();
    } else if (value instanceof Date) {
      return value.toISOString();
    } else if (Array.isArray(value)) {
      return JSON.stringify(value);
    } else if (value && typeof value === "object") {
      return JSON.stringify(value);
    } else {
      return "";
    }
  };

  const handleFieldChange = (fieldId: string, value: FormFieldValue) => {
    if (!readOnly && setFormValues) {
      // Find the field to understand its type
      const field = formData.groupings
        ?.flatMap((group: FormGrouping) => group.fields || [])
        .find((f: FormField) => f.id === fieldId);

      let convertedValue = "";

      if (field) {
        switch (field.type) {
          case "SEARCH_PERSON":
          case "SEARCH_ASSET":
            // For search fields, store as JSON string
            if (Array.isArray(value)) {
              convertedValue = JSON.stringify(value);
            } else if (value && typeof value === "object") {
              convertedValue = JSON.stringify(value);
            } else {
              convertedValue = value ? String(value) : "";
            }
            break;
          case "MULTISELECT":
            // For multiselect, store as JSON array
            if (Array.isArray(value)) {
              convertedValue = JSON.stringify(value);
            } else {
              convertedValue = value ? String(value) : "";
            }
            break;
          case "CHECKBOX":
            convertedValue = value ? "true" : "false";
            break;
          case "NUMBER":
            convertedValue = value ? String(value) : "0";
            break;
          case "DATE":
          case "DATE_TIME":
            if (value instanceof Date) {
              convertedValue = value.toISOString();
            } else {
              convertedValue = value ? String(value) : "";
            }
            break;
          default:
            convertedValue = value ? String(value) : "";
        }
      } else {
        // Fallback conversion
        convertedValue = convertFromFormFieldValue(value);
      }

      // Always use field.id as the key since we're standardizing on that
      // RenderFields will handle both field.id and field.label lookups
      const keyToUpdate = fieldId;

      const newFormValues = {
        ...formValues,
        [keyToUpdate]: convertedValue,
      };
      setFormValues(newFormValues);
    }
  };

  const convertedTemplate = convertToIndividualTemplate(formData);
  const convertedValues = convertToFormFieldValues(formValues);

  return (
    <RenderFields
      formTemplate={convertedTemplate}
      userOptions={userOptions}
      submittedBy={null}
      setSubmittedBy={() => {}}
      submittedByTouched={false}
      formData={convertedValues}
      handleFieldChange={handleFieldChange}
      equipmentOptions={equipmentOptions}
      jobsiteOptions={jobsiteOptions}
      costCodeOptions={costCodeOptions}
      readOnly={readOnly}
      hideSubmittedBy={true}
      disabled={disabled}
    />
  );
};
