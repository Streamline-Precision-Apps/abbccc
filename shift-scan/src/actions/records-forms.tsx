"use server";
import prisma from "@/lib/prisma";
import { FieldType } from "@prisma/client";
import { revalidatePath } from "next/cache";

// Types for form builder
export interface FormFieldData {
  id: string;
  name: string;
  label: string;
  type: string;
  required: boolean;
  placeholder?: string;
  helperText?: string;
  options?: string[];
  maxLength?: number;
  order: number;
}

export interface FormSettingsData {
  name: string;
  description: string;
  category: string;
  status: string;
  requireSignature: boolean;
}

export interface SaveFormData {
  settings: FormSettingsData;
  fields: FormFieldData[];
  companyId: string;
  formId?: string; // for updates
}

// Helper function to map field type string to FieldType enum
function mapFieldType(type: string): FieldType {
  const typeMap: Record<string, FieldType> = {
    text: FieldType.TEXT,
    textarea: FieldType.TEXTAREA,
    text_area: FieldType.TEXTAREA,
    number: FieldType.NUMBER,
    date: FieldType.DATE,
    time: FieldType.DATE, // Using DATE for time as well
    dropdown: FieldType.DROPDOWN,
    checkbox: FieldType.CHECKBOX,
    file: FieldType.FILE,
    rating: FieldType.TEXT, // Fallback to TEXT for rating
  };

  return typeMap[type.toLowerCase()] || FieldType.TEXT;
}

// Create or update a form template
export async function saveFormTemplate(data: SaveFormData) {
  try {
    const { settings, fields, companyId, formId } = data;

    // Start a transaction
    const result = await prisma.$transaction(async (tx) => {
      let formTemplate;

      if (formId) {
        // Update existing form
        formTemplate = await tx.formTemplate.update({
          where: { id: formId },
          data: {
            name: settings.name,
            formType: settings.category,
            isActive: settings.status === "active",
            isSignatureRequired: settings.requireSignature,
            updatedAt: new Date(),
          },
        });

        // Delete existing form groupings and fields
        await tx.formGrouping.deleteMany({
          where: {
            FormTemplate: {
              some: { id: formId },
            },
          },
        });
      } else {
        // Create new form
        formTemplate = await tx.formTemplate.create({
          data: {
            companyId,
            name: settings.name,
            formType: settings.category,
            isActive: settings.status === "active",
            isSignatureRequired: settings.requireSignature,
          },
        });
      }

      // Create form grouping (one grouping per form for simplicity)
      const formGrouping = await tx.formGrouping.create({
        data: {
          title: settings.name,
          order: 0,
        },
      });

      // Connect form template to grouping
      await tx.formTemplate.update({
        where: { id: formTemplate.id },
        data: {
          FormGrouping: {
            connect: { id: formGrouping.id },
          },
        },
      });

      // Create form fields
      for (const field of fields) {
        const formField = await tx.formField.create({
          data: {
            formGroupingId: formGrouping.id,
            label: field.label,
            name: field.name,
            type: mapFieldType(field.type),
            required: field.required,
            order: field.order,
            placeholder: field.placeholder,
            maxLength: field.maxLength,
            helperText: field.helperText,
          },
        });

        // Create field options if it's a dropdown
        if (field.options && field.options.length > 0) {
          for (const option of field.options) {
            await tx.formFieldOption.create({
              data: {
                fieldId: formField.id,
                value: option,
              },
            });
          }
        }
      }

      return formTemplate;
    });

    revalidatePath("/admins/records/forms");
    return {
      success: true,
      formId: result.id,
      message: "Form saved successfully",
    };
  } catch (error) {
    console.error("Error saving form template:", error);
    return { success: false, error: "Failed to save form template" };
  }
}

// Get form template with fields for editing
export async function getFormTemplateForEdit(formId: string) {
  try {
    const formTemplate = await prisma.formTemplate.findUnique({
      where: { id: formId },
      include: {
        FormGrouping: {
          include: {
            Fields: {
              include: {
                Options: true,
              },
              orderBy: { order: "asc" },
            },
          },
        },
      },
    });

    if (!formTemplate) {
      return { success: false, error: "Form template not found" };
    }

    // Transform the data to match our FormBuilder interface
    const settings: FormSettingsData = {
      name: formTemplate.name,
      description: formTemplate.formType || "",
      category: formTemplate.formType || "",
      status: formTemplate.isActive ? "active" : "inactive",
      requireSignature: formTemplate.isSignatureRequired,
    };

    const fields: FormFieldData[] = [];

    // Flatten fields from all groupings
    formTemplate.FormGrouping.forEach((grouping) => {
      grouping.Fields.forEach((field) => {
        fields.push({
          id: field.id,
          name: field.name,
          label: field.label,
          type: field.type.toLowerCase(),
          required: field.required,
          placeholder: field.placeholder || "",
          helperText: field.helperText || "",
          options: field.Options.map((opt) => opt.value),
          maxLength: field.maxLength || undefined,
          order: field.order,
        });
      });
    });

    // Sort fields by order
    fields.sort((a, b) => a.order - b.order);

    return {
      success: true,
      data: {
        settings,
        fields,
        formId: formTemplate.id,
      },
    };
  } catch (error) {
    console.error("Error fetching form template:", error);
    return { success: false, error: "Failed to fetch form template" };
  }
}

// Delete form template
export async function deleteFormTemplate(formId: string) {
  try {
    await prisma.formTemplate.delete({
      where: { id: formId },
    });

    revalidatePath("/admins/records/forms");
    return { success: true, message: "Form deleted successfully" };
  } catch (error) {
    console.error("Error deleting form template:", error);
    return { success: false, error: "Failed to delete form template" };
  }
}

// Get all form templates for a company
export async function getFormTemplates(
  companyId: string,
  page = 1,
  pageSize = 10,
  searchTerm = "",
  formType = ""
) {
  try {
    const skip = (page - 1) * pageSize;

    const where = {
      companyId,
      ...(searchTerm && {
        OR: [
          { name: { contains: searchTerm, mode: "insensitive" as const } },
          { formType: { contains: searchTerm, mode: "insensitive" as const } },
        ],
      }),
      ...(formType && { formType }),
    };

    const [formTemplates, total] = await Promise.all([
      prisma.formTemplate.findMany({
        where,
        include: {
          _count: {
            select: { Submissions: true },
          },
        },
        orderBy: { createdAt: "desc" },
        skip,
        take: pageSize,
      }),
      prisma.formTemplate.count({ where }),
    ]);

    return {
      success: true,
      data: {
        forms: formTemplates,
        total,
        totalPages: Math.ceil(total / pageSize),
        currentPage: page,
      },
    };
  } catch (error) {
    console.error("Error fetching form templates:", error);
    return { success: false, error: "Failed to fetch form templates" };
  }
}

// Duplicate form template
export async function duplicateFormTemplate(formId: string, companyId: string) {
  try {
    const originalForm = await getFormTemplateForEdit(formId);

    if (!originalForm.success || !originalForm.data) {
      return { success: false, error: "Failed to fetch original form" };
    }

    const { settings, fields } = originalForm.data;

    // Modify settings for the duplicate
    const duplicateSettings = {
      ...settings,
      name: `${settings.name} (Copy)`,
      status: "inactive", // Always create duplicates as inactive
    };

    // Generate new IDs for fields
    const duplicateFields = fields.map((field) => ({
      ...field,
      id: `field_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    }));

    const result = await saveFormTemplate({
      settings: duplicateSettings,
      fields: duplicateFields,
      companyId,
    });

    return result;
  } catch (error) {
    console.error("Error duplicating form template:", error);
    return { success: false, error: "Failed to duplicate form template" };
  }
}
