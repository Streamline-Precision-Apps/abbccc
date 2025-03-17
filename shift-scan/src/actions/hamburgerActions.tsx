"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { UserSettings } from "@/lib/types";
import { error } from "console";
import { title } from "process";

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
  formTitle?: string,
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
          submittedAt: new Date().toISOString(),
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
          submittedAt: new Date().toISOString(),
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
  submissionId?: string,
  title?: string
) {
  try {
    if (submissionId) {
      // Fetch the existing submission to compare with the new data
      const existingSubmission = await prisma.formSubmission.findUnique({
        where: { id: submissionId },
      });

      if (!existingSubmission) {
        throw new Error("Submission not found");
      }

      if (existingSubmission.data === null) {
        throw new Error("Submission data is null");
      }

      // Type-cast data to a Record<string, any>
      const existingData = existingSubmission.data as Record<string, any>;

      // Compare the new data with the existing data to find changed fields
      const changedFields: Record<string, any> = {};
      for (const key in formData) {
        if (formData[key] !== existingData[key]) {
          changedFields[key] = formData[key]; // Only include changed fields
        }
      }

      // If the form is in "PENDING" status, preserve certain fields
      if (existingSubmission.status === "PENDING") {
        if (title) {
          const updatedSubmission = await prisma.formSubmission.update({
            where: { id: submissionId },
            data: {
              title: title, // Preserve existing title if not provided
              data: {
                ...existingData, // Preserve existing data
                ...changedFields, // Overwrite with changed fields
              },
            },
          });
          return updatedSubmission;
        } else {
          const updatedSubmission = await prisma.formSubmission.update({
            where: { id: submissionId },
            data: {
              data: {
                ...existingData, // Preserve existing data
                ...changedFields, // Overwrite with changed fields
              },
            },
          });
          return updatedSubmission;
        }
      } else {
        // For drafts or other statuses, update as usual
        if (title) {
          const updatedSubmission = await prisma.formSubmission.update({
            where: { id: submissionId },
            data: {
              data: {
                title: title,
                ...existingData, // Preserve existing data
                ...changedFields, // Overwrite with changed fields
              },
              status: "DRAFT", // Ensure the status remains DRAFT
            },
          });
          return updatedSubmission;
        } else {
          const updatedSubmission = await prisma.formSubmission.update({
            where: { id: submissionId },
            data: {
              data: {
                ...existingData, // Preserve existing data
                ...changedFields, // Overwrite with changed fields
              },
            },
          });
          return updatedSubmission;
        }
      }
    } else {
      // Create new draft
      const newSubmission = await prisma.formSubmission.create({
        data: {
          title: title || "",
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

export async function updateFormApproval(formData: FormData) {
  try {
    console.log("Updating form approval...");

    // Extract data from FormData
    const id = formData.get("id") as string;
    const formSubmissionId = formData.get("formSubmissionId") as string;
    const signedBy = formData.get("signedBy") as string;
    const signature = formData.get("signature") as string;
    const comment = formData.get("comment") as string;
    const isApproved = formData.get("isApproved") === "true"; // Convert to boolean
    const isFinalApproval = formData.get("isFinalApproval") === "true"; // Flag for final approval

    // Validate required fields
    if (!formSubmissionId || !signedBy) {
      throw new Error("formSubmissionId and signedBy are required fields.");
    }

    // Signature is only required for final approval
    if (isFinalApproval && !signature) {
      throw new Error("Signature is required for final approval.");
    }

    // Prepare data for update/create
    const data: any = {
      formSubmissionId,
      signedBy,
    };

    // Only include fields that are provided
    if (signature) data.signature = signature;
    if (comment !== null) data.comment = comment;
    if (isApproved !== null) data.isApproved = isApproved;

    // Check if the approval record already exists
    const existingApproval = await prisma.formApproval.findUnique({
      where: { id },
    });

    let approval;
    if (existingApproval) {
      // Update existing approval
      approval = await prisma.formApproval.update({
        where: { id },
        data,
      });
    } else {
      // Create new approval
      approval = await prisma.formApproval.create({
        data,
      });
    }

    // Update the FormSubmission status if this is a final approval
    if (isFinalApproval) {
      const newStatus = isApproved ? "APPROVED" : "DENIED";
      await prisma.formSubmission.update({
        where: { id: formSubmissionId },
        data: {
          status: newStatus,
        },
      });
      console.log(`FormSubmission status updated to: ${newStatus}`);
    }

    console.log("Form approval updated/created:", approval);
    return approval; // Return the updated/created approval for client-side use
  } catch (error) {
    console.error("Error updating form approval:", error);
    throw new Error("Failed to update form approval");
  }
}
