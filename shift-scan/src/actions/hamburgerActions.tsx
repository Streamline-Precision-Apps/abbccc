"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { UserSettings } from "@/lib/types";
import { error } from "console";

enum FormStatus {
  PENDING = "PENDING",
  APPROVED = "APPROVED",
  DENIED = "DENIED",
  DRAFT = "DRAFT",
}

export async function updateSettings(data: UserSettings) {
  const { userId, ...settings } = data;
  await prisma.userSettings.update({
    where: { userId: userId },
    data: settings,
  });
  // Revalidate the path to show updated data
  revalidatePath("/hamburger/settings");
}

export async function createFormSubmission(formData: FormData) {
  try {
    const formTemplateId = formData.get("formTemplateId") as string;
    const userId = formData.get("userId") as string;

    // Fetch the form template to get the field names
    const formTemplate = await prisma.formTemplate.findUnique({
      where: { id: formTemplateId },
      include: {
        FormGrouping: {
          include: {
            fields: true,
          },
        },
      },
    });

    if (!formTemplate) {
      throw new Error("Form template not found");
    }

    // Initialize the data object with field.name as keys
    const initialData: Record<string, any> = {};
    for (const group of formTemplate.FormGrouping) {
      for (const field of group.fields) {
        initialData[field.name] = field.defaultValue || ""; // Set default values if available
      }
    }

    // Create the form submission with the initialized data
    const submission = await prisma.formSubmission.create({
      data: {
        formTemplateId,
        userId,
        data: initialData, // Use the initialized data
      },
    });

    return submission.id;
  } catch (error) {
    console.error("Error creating form submission:", error);
    throw new Error("Failed to create form submission");
  }
}

export async function deleteFormSubmission(id: string) {
  try {
    await prisma.formSubmission.delete({
      where: {
        id,
      },
    });

    return true;
  } catch {
    console.error("error deleting Form Submission");
  }
}

export async function submitForm(
  formData: Record<string, string>,
  formTemplateId: string,
  userId: string,
  formType?: string,
  submissionId?: string
) {
  try {
    if (submissionId) {
      // Update existing draft
      const updatedSubmission = await prisma.formSubmission.update({
        where: { id: submissionId },
        data: {
          title: formData.title || "",
          data: formData,
          status: FormStatus.PENDING, // or keep as DRAFT if not submitted
        },
      });
      return updatedSubmission;
    } else {
      // Create new submission
      const newSubmission = await prisma.formSubmission.create({
        data: {
          title: formData.title || "",
          formTemplateId,
          userId,
          formType,
          data: formData,
          status: FormStatus.DRAFT, // or PENDING if submitted immediately
        },
      });
      return newSubmission;
    }
  } catch (error) {
    console.error("Error submitting form:", error);
    throw new Error("Failed to submit form");
  }
}

export async function fetchDraft(submissionId: string) {
  try {
    const submission = await prisma.formSubmission.findUnique({
      where: { id: submissionId },
    });
    return submission;
  } catch (error) {
    console.error("Error fetching draft:", error);
    throw new Error("Failed to fetch draft");
  }
}

export async function saveDraft(
  formData: Record<string, any>,
  formTemplateId: string,
  userId: string,
  formType?: string,
  submissionId?: string
) {
  try {
    console.log("formData", formData);
    console.log("formTemplate", formTemplateId);
    console.log("formSubmission", submissionId);
    if (submissionId) {
      // Update existing draft
      const updatedSubmission = await prisma.formSubmission.update({
        where: { id: submissionId },
        data: {
          title: formData.title || "",
          data: formData,
          status: "DRAFT", // Ensure the status remains DRAFT
        },
      });
      return updatedSubmission;
    } else {
      // Create new draft
      const newSubmission = await prisma.formSubmission.create({
        data: {
          title: formData.title || "",
          formTemplateId,
          userId,
          formType,
          data: formData,
          status: "DRAFT",
        },
      });
      return newSubmission;
    }
  } catch (error) {
    console.error("Error saving draft:", error);
    throw new Error("Failed to save draft");
  }
}
