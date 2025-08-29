"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { UserSettings } from "@/lib/types";

enum FormStatus {
  PENDING = "PENDING",
  APPROVED = "APPROVED",
  DENIED = "DENIED",
  DRAFT = "DRAFT",
}

// Accepts contact info and settings, updates User, Contacts, and UserSettings as needed
export async function updateSettings(data: {
  userId: string;
  phoneNumber?: string;
  email?: string;
  emergencyContact?: string;
  emergencyContactNumber?: string;
  language?: string;
  generalReminders?: boolean;
  personalReminders?: boolean;
  cameraAccess?: boolean;
  locationAccess?: boolean;
  cookiesAccess?: boolean;
}) {
  const {
    userId,
    phoneNumber,
    email,
    emergencyContact,
    emergencyContactNumber,
    ...settings
  } = data;

  // Update User email if provided
  if (email !== undefined) {
    await prisma.user.update({
      where: { id: userId },
      data: { email },
    });
  }

  // Update Contacts info if provided
  if (
    phoneNumber !== undefined ||
    emergencyContact !== undefined ||
    emergencyContactNumber !== undefined
  ) {
    await prisma.contacts.upsert({
      where: { userId },
      update: {
        phoneNumber,
        emergencyContact,
        emergencyContactNumber,
      },
      create: {
        userId,
        phoneNumber: phoneNumber || "",
        emergencyContact: emergencyContact || "",
        emergencyContactNumber: emergencyContactNumber || "",
      },
    });
  }

  // Update UserSettings if any settings provided
  const userSettingsFields: (keyof typeof settings)[] = [
    "language",
    "generalReminders",
    "personalReminders",
    "cameraAccess",
    "locationAccess",
    "cookiesAccess",
  ];
  const hasSettings = userSettingsFields.some(
    (key) => settings[key] !== undefined,
  );
  if (hasSettings) {
    await prisma.userSettings.update({
      where: { userId },
      data: settings,
    });
  }

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
            Fields: true,
          },
        },
      },
    });

    if (!formTemplate) {
      throw new Error("Form template not found");
    }

    // Initialize the data object with field.id as keys and field.content as default value
    const initialData: Record<string, string> = {};
    for (const group of formTemplate.FormGrouping) {
      for (const field of group.Fields) {
        initialData[field.id] = field.content || ""; // Use field.id instead of field.label
      }
    }

    // Create the form submission with the initialized data
    const submission = await prisma.formSubmission.create({
      data: {
        formTemplateId,
        userId,
        title: "",
        data: initialData, // Use the initialized data
      },
    });

    return submission.id;
  } catch (error) {
    console.error("Error creating form submission:", error);
    throw new Error("Failed to create form submission");
  }
}

export async function deleteFormSubmission(id: number) {
  try {
    await prisma.formSubmission.delete({
      where: {
        id: id,
      },
    });
    revalidatePath("/hamburger/inbox");
    return true;
  } catch {
    console.error("error deleting Form Submission");
  }
}

// export async function fetchDraft(submissionId: string) {
//   try {
//     const submission = await prisma.formSubmission.findUnique({
//       where: { id: submissionId },
//     });
//     return submission;
//   } catch (error) {
//     console.error("Error fetching draft:", error);
//     throw new Error("Failed to fetch draft");
//   }
// }

export async function saveDraft(
  formData: Record<string, string>,
  formTemplateId: string,
  userId: string,
  formType?: string,
  submissionId?: number,
  title?: string,
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

      // Type-cast data to a Record<string, string>
      const existingData = existingSubmission.data as Record<string, string>;
      const existingTitle = existingSubmission.title;

      // Compare the new data with the existing data to find changed fields
      const changedFields: Record<string, string> = {};
      for (const key in formData) {
        if (formData[key] !== existingData[key]) {
          changedFields[key] = formData[key]; // Only include changed fields
        }
      }

      // Update the submission with the changed fields
      const updatedSubmission = await prisma.formSubmission.update({
        where: { id: submissionId },
        data: {
          title: title || existingTitle, // Preserve existing title if not provided
          data: {
            ...existingData, // Preserve existing data
            ...changedFields, // Overwrite with changed fields
          },
        },
      });

      return updatedSubmission;
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
          submittedAt: new Date().toISOString(),
        },
      });
      return newSubmission;
    }
  } catch (error) {
    console.error("Error saving draft:", error);
    throw new Error("Failed to save draft");
  }
}

export async function saveDraftToPending(
  formData: Record<string, string>,
  formTemplateId: string,
  userId: string,
  formType?: string,
  submissionId?: number,
  title?: string,
) {
  try {
    console.log("saveDraftToPending called with:", {
      formData,
      formTemplateId,
      userId,
      formType,
      submissionId,
      title,
    });

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

      // Type-cast data to a Record<string, string>
      const existingData = existingSubmission.data as Record<string, string>;
      const existingTitle = existingSubmission.title;

      // Compare the new data with the existing data to find changed fields
      const changedFields: Record<string, string> = {};
      for (const key in formData) {
        if (formData[key] !== existingData[key]) {
          changedFields[key] = formData[key]; // Only include changed fields
        }
      }

      console.log("Updating submission with changed fields:", changedFields);

      // Update the submission with the changed fields
      const updatedSubmission = await prisma.formSubmission.update({
        where: { id: submissionId },
        data: {
          title: title || existingTitle, // Preserve existing title if not provided
          data: {
            ...existingData, // Preserve existing data
            ...changedFields, // Overwrite with changed fields
          },
          submittedAt: new Date().toISOString(),
          status: "PENDING", // Change status to PENDING
        },
      });

      console.log("Submission updated successfully:", updatedSubmission.id);
      return updatedSubmission;
    } else {
      // Create new draft
      const newSubmission = await prisma.formSubmission.create({
        data: {
          title: title || "",
          formTemplateId,
          userId,
          formType,
          data: formData,
          status: "PENDING",
          submittedAt: new Date().toISOString(),
        },
      });
      return newSubmission;
    }
  } catch (error) {
    console.error("Error saving draft:", error);
    throw new Error("Failed to save draft");
  }
}

export async function savePending(
  formData: Record<string, string>,
  formTemplateId: string,
  userId: string,
  formType?: string,
  submissionId?: number,
  title?: string,
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

      // Type-cast data to a Record<string, string>
      const existingData = existingSubmission.data as Record<string, string>;
      const existingTitle = existingSubmission.title;

      // Compare the new data with the existing data to find changed fields
      const changedFields: Record<string, string> = {};
      for (const key in formData) {
        if (formData[key] !== existingData[key]) {
          changedFields[key] = formData[key]; // Only include changed fields
        }
      }

      // Update the submission with the changed fields
      const updatedSubmission = await prisma.formSubmission.update({
        where: { id: submissionId },
        data: {
          title: title || existingTitle, // Preserve existing title if not provided
          data: {
            ...existingData, // Preserve existing data
            ...changedFields, // Overwrite with changed fields
          },
          status: "PENDING", // Ensure the status remains PENDING
        },
      });

      return updatedSubmission;
    } else {
      // Create new submission with PENDING status
      const newSubmission = await prisma.formSubmission.create({
        data: {
          title: title || "",
          formTemplateId,
          userId,
          formType,
          data: formData,
          status: "PENDING", // Ensure the status is PENDING
        },
      });
      return newSubmission;
    }
  } catch (error) {
    console.error("Error saving pending submission:", error);
    throw new Error("Failed to save pending submission");
  }
}

export async function createFormApproval(
  formData: FormData,
  approval: FormStatus.APPROVED | FormStatus.DENIED,
) {
  try {
    console.log("Creating form approval...");
    const formSubmissionId = Number(formData.get("formSubmissionId"));
    const signedBy = formData.get("signedBy") as string;
    const signature = formData.get("signature") as string;
    const comment = formData.get("comment") as string;

    const create = await prisma.formApproval.create({
      data: {
        formSubmissionId,
        signedBy,
        signature,
        comment,
      },
    });

    if (create) {
      await prisma.formSubmission.update({
        where: { id: formSubmissionId },
        data: {
          status: approval,
        },
      });
    }

    return true;
  } catch (error) {
    return error;
  }
}

export async function updateFormApproval(formData: FormData) {
  try {
    console.log("Updating form approval...");

    // Extract data from FormData
    const id = formData.get("id") as string;
    const formSubmissionId = Number(formData.get("formSubmissionId"));
    const comment = formData.get("comment") as string;
    const isApp = formData.get("isApproved") === "true"; // Convert string to boolean

    // Log input data for debugging
    console.log("Input Data:", {
      id,
      formSubmissionId,
      comment,
      isApp,
    });

    // Use a transaction to ensure atomicity
    const [approval, updatedSubmission] = await prisma.$transaction([
      // Update the formApproval record
      prisma.formApproval.update({
        where: { id },
        data: {
          comment, // Update the comment
        },
      }),
      // Update the formSubmission status
      prisma.formSubmission.update({
        where: { id: formSubmissionId },
        data: {
          status: isApp ? "APPROVED" : "DENIED", // Set the new status
        },
      }),
    ]);

    // Log updated records for debugging
    console.log("Updated Approval:", approval);
    console.log("Updated Submission:", updatedSubmission);

    console.log("Form approval updated successfully.");
    return { approval, updatedSubmission }; // Return both updated records
  } catch (error) {
    console.error("Error updating form approval:", error);
  }
}
