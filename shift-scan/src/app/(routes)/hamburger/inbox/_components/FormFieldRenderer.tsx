"use client";

import { FormIndividualTemplate } from "@/app/(routes)/admins/forms/[id]/_component/hooks/types";
import RenderFields from "./RenderFields";
import {
  useDBEquipment,
  useDBCostcode,
  useDBJobsite,
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
}

export const FormFieldRenderer: React.FC<FormFieldRendererProps> = ({
  formData,
  formValues,
  setFormValues,
  readOnly = false,
}) => {
  const [equipmentOptions, setEquipmentOptions] = useState<Option[]>([]);
  const [jobsiteOptions, setJobsiteOptions] = useState<Option[]>([]);
  const [costCodeOptions, setCostCodeOptions] = useState<Option[]>([]);
  const [userOptions, setUserOptions] = useState<Option[]>([]);
  const [clientOptions, setClientOptions] = useState<Option[]>([]);

  const { equipmentResults } = useDBEquipment();
  const { costcodeResults } = useDBCostcode();
  const { jobsiteResults } = useDBJobsite();

  // Convert equipment data to Option format
  useEffect(() => {
    const options = equipmentResults.map((equipment) => ({
      value: equipment.id,
      label: equipment.name,
    }));
    setEquipmentOptions(options);
  }, [equipmentResults]);

  // Convert jobsite data to Option format
  useEffect(() => {
    const options = jobsiteResults.map((jobsite) => ({
      value: jobsite.id,
      label: jobsite.name,
    }));
    setJobsiteOptions(options);
  }, [jobsiteResults]);

  // Convert cost code data to Option format
  useEffect(() => {
    const options = costcodeResults.map((costcode) => ({
      value: costcode.id,
      label: costcode.name,
    }));
    setCostCodeOptions(options);
  }, [costcodeResults]);

  // Fetch user options
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch("/api/getAllActiveEmployeeName");
        const employees = await res.json();
        const options = employees.map(
          (user: { id: string; firstName: string; lastName: string }) => ({
            value: user.id,
            label: `${user.firstName} ${user.lastName}`,
          })
        );
        setUserOptions(options);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };
    fetchUsers();
  }, []);

  // Fetch client options
  useEffect(() => {
    const fetchClients = async () => {
      try {
        const res = await fetch("/api/getClientsSummary");
        const clients = await res.json();
        const options = clients.map((client: { id: string; name: string }) => ({
          value: client.id,
          label: client.name,
        }));
        setClientOptions(options);
      } catch (error) {
        console.error("Error fetching clients:", error);
      }
    };
    fetchClients();
  }, []);

  // Convert FormTemplate to FormIndividualTemplate for RenderFields
  const convertToIndividualTemplate = (
    template: FormTemplate
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
    values: Record<string, string>
  ): Record<string, FormFieldValue> => {
    const result: Record<string, FormFieldValue> = {};
    console.log("convertToFormFieldValues input values:", values);
    Object.entries(values).forEach(([key, value]) => {
      // Find the field to understand its type
      // First try to find by field ID, then by field label/name
      const field = formData.groupings
        ?.flatMap((group: FormGrouping) => group.fields || [])
        .find(
          (f: FormField) => f.id === key || f.label === key || f.name === key
        );

      if (field) {
        console.log("Found field for key:", {
          key,
          field: field.id,
          type: field.type,
          value,
        });
        switch (field.type) {
          case "NUMBER":
            result[field.id] = value ? parseFloat(value) : 0;
            break;
          case "CHECKBOX":
            const checkboxValue = value === "true";
            console.log("CHECKBOX conversion:", {
              key,
              value,
              checkboxValue,
              fieldId: field.id,
            });
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
    console.log("convertToFormFieldValues final result:", result);
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
      const convertedValue = convertFromFormFieldValue(value);

      // Find the original key in formValues that corresponds to this field
      const originalKey = Object.keys(formValues).find((key) => {
        const field = formData.groupings
          ?.flatMap((group: FormGrouping) => group.fields || [])
          .find((f: FormField) => f.id === fieldId);
        return (
          field &&
          (field.id === key || field.label === key || field.name === key)
        );
      });

      const keyToUpdate = originalKey || fieldId;

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
      clientOptions={clientOptions}
      equipmentOptions={equipmentOptions}
      jobsiteOptions={jobsiteOptions}
      costCodeOptions={costCodeOptions}
      readOnly={readOnly}
      hideSubmittedBy={true}
    />
  );
};
