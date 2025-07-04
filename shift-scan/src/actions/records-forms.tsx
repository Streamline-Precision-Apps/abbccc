"use server";
import prisma from "@/lib/prisma";
import {
  FieldType,
  FormTemplateCategory,
  FormTemplateStatus,
} from "@/lib/enums";
import { revalidatePath } from "next/cache";

// Types for form builder
export interface FormFieldData {
  id: string;
  label: string;
  type: string;
  required: boolean;
  order: number;
  placeholder?: string;
  maxLength?: number;
  groupId?: string; // For associating with sections
  Options?: { id: string; value: string }[];
}

export interface FormSettingsData {
  name: string;
  description: string;
  formType: string;
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
    const { settings, fields, companyId } = data;
    console.log("Saving form template with data:", data);

    // Start a transaction
    const result = await prisma.$transaction(async (tx) => {
      // Create new form
      const formTemplate = await tx.formTemplate.create({
        data: {
          companyId,
          name: settings.name,
          formType: settings.formType as FormTemplateCategory, // Ensure formType is cast to enum
          isActive: (settings.status as FormTemplateStatus) || "DRAFT",
          isSignatureRequired: settings.requireSignature,
        },
      });

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
            type: mapFieldType(field.type),
            required: field.required,
            order: field.order,
            placeholder: field.placeholder,
            maxLength: field.maxLength,
          },
        });

        // Handle field options for dropdowns
        if (
          field.type === "DROPDOWN" &&
          field.Options &&
          field.Options.length > 0
        ) {
          for (const option of field.Options) {
            const optionData =
              typeof option === "string" ? { value: option } : option;
            await tx.formFieldOption.create({
              data: {
                fieldId: formField.id,
                value: optionData.value,
              },
            });
          }
        }

        // Handle additional types
        if (field.type === "TEXTAREA" || field.type === "TEXT") {
          await tx.formField.update({
            where: { id: formField.id },
            data: {
              maxLength: field.maxLength,
            },
          });
        }

        if (field.type === "NUMBER") {
          await tx.formField.update({
            where: { id: formField.id },
            data: {
              maxLength: field.maxLength,
            },
          });
        }

        if (field.type === "DATE" || field.type === "TIME") {
          await tx.formField.update({
            where: { id: formField.id },
            data: {
              placeholder: field.placeholder,
            },
          });
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

export async function updateFormTemplate(data: SaveFormData) {
  try {
    const { settings, fields, companyId, formId } = data;
    if (!formId) {
      return { success: false, error: "No formId provided for update" };
    }

    // Update the form template main settings
    const updatedForm = await prisma.formTemplate.update({
      where: { id: formId },
      data: {
        name: settings.name,
        formType: settings.formType as FormTemplateCategory,
        isActive: (settings.status as FormTemplateStatus) || "DRAFT",
        isSignatureRequired: settings.requireSignature,
        description: settings.description,
      },
    });

    // Get the grouping(s) for this form
    const groupings = await prisma.formGrouping.findMany({
      where: { FormTemplate: { some: { id: formId } } },
    });
    let formGroupingId = groupings[0]?.id;
    // If no grouping exists, create one
    if (!formGroupingId) {
      const newGrouping = await prisma.formGrouping.create({
        data: { title: settings.name, order: 0 },
      });
      await prisma.formTemplate.update({
        where: { id: formId },
        data: { FormGrouping: { connect: { id: newGrouping.id } } },
      });
      formGroupingId = newGrouping.id;
    }

    // Fetch all existing fields for this grouping
    const existingFields = await prisma.formField.findMany({
      where: { formGroupingId },
      include: { Options: true },
    });

    // Build a map for quick lookup
    const existingFieldMap = new Map(existingFields.map((f) => [f.id, f]));
    const submittedFieldIds = new Set(fields.map((f) => f.id));

    // Delete fields that are not in the submitted fields
    for (const oldField of existingFields) {
      if (!submittedFieldIds.has(oldField.id)) {
        await prisma.formFieldOption.deleteMany({
          where: { fieldId: oldField.id },
        });
        await prisma.formField.delete({ where: { id: oldField.id } });
      }
    }

    // Upsert submitted fields
    for (const field of fields) {
      let formFieldId = field.id;
      const isExisting = existingFieldMap.has(field.id);
      if (isExisting) {
        // Update the field
        await prisma.formField.update({
          where: { id: field.id },
          data: {
            label: field.label,
            type: mapFieldType(field.type),
            required: field.required,
            order: field.order,
            placeholder: field.placeholder,
            maxLength: field.maxLength,
            formGroupingId,
          },
        });
        // Remove all options for this field (will re-add below)
        await prisma.formFieldOption.deleteMany({
          where: { fieldId: field.id },
        });
      } else {
        // Create the field
        const created = await prisma.formField.create({
          data: {
            id: field.id,
            formGroupingId,
            label: field.label,
            type: mapFieldType(field.type),
            required: field.required,
            order: field.order,
            placeholder: field.placeholder,
            maxLength: field.maxLength,
          },
        });
        formFieldId = created.id;
      }

      // Handle field options for dropdowns, radios, multiselects
      if (
        ["DROPDOWN", "RADIO", "MULTISELECT"].includes(field.type) &&
        field.Options &&
        field.Options.length > 0
      ) {
        for (const option of field.Options) {
          await prisma.formFieldOption.create({
            data: {
              fieldId: formFieldId,
              value: option.value,
            },
          });
        }
      }

      // Handle additional types
      if (field.type === "TEXTAREA" || field.type === "TEXT") {
        await prisma.formField.update({
          where: { id: formFieldId },
          data: {
            maxLength: field.maxLength,
          },
        });
      }

      if (field.type === "NUMBER") {
        await prisma.formField.update({
          where: { id: formFieldId },
          data: {
            maxLength: field.maxLength,
          },
        });
      }

      if (field.type === "DATE" || field.type === "TIME") {
        await prisma.formField.update({
          where: { id: formFieldId },
          data: {
            placeholder: field.placeholder,
          },
        });
      }
    }

    revalidatePath("/admins/forms");
    return { success: true, formId, message: "Form updated successfully" };
  } catch (error) {
    console.error("Error updating form template:", error);
    return { success: false, error: "Failed to update form template" };
  }
}
// Delete form template
export async function deleteFormTemplate(formId: string) {
  try {
    await prisma.formTemplate.delete({
      where: { id: formId },
    });

    revalidatePath("/admins/forms");
    revalidatePath(`/admins/forms/${formId}`);

    return { success: true, message: "Form deleted successfully" };
  } catch (error) {
    console.error("Error deleting form template:", error);
    return { success: false, error: "Failed to delete form template" };
  }
}
// used in the form/id page.tsx
export async function archiveFormTemplate(formId: string) {
  try {
    await prisma.formTemplate.update({
      where: { id: formId },
      data: { isActive: "ARCHIVED" },
    });

    revalidatePath("/admins/records/forms");
    return { success: true, message: "Form archived successfully" };
  } catch (error) {
    console.error("Error archiving form template:", error);
    return { success: false, error: "Failed to archive form template" };
  }
}
export async function publishFormTemplate(formId: string) {
  try {
    await prisma.formTemplate.update({
      where: { id: formId },
      data: { isActive: "ACTIVE" },
    });

    revalidatePath("/admins/records/forms");
    return { success: true, message: "Form published successfully" };
  } catch (error) {
    console.error("Error publishing form template:", error);
    return { success: false, error: "Failed to publish form template" };
  }
}
export async function draftFormTemplate(formId: string) {
  try {
    await prisma.formTemplate.update({
      where: { id: formId },
      data: { isActive: "DRAFT" },
    });

    revalidatePath("/admins/records/forms");
    return { success: true, message: "Form drafted successfully" };
  } catch (error) {
    console.error("Error drafting form template:", error);
    return { success: false, error: "Failed to draft form template" };
  }
}
