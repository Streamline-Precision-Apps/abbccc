"use server";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
//-------- Not in use --------
// Utility function to convert string to enum value
// function toEnumValue<T extends Record<string, string>>(
//   enumObject: T,
//   value: string
// ): T[keyof T] | null {
//   return Object.values(enumObject).includes(value as T[keyof T])
//     ? (value as T[keyof T])
//     : null;
// }

// Enum for jobsite status
// enum JobsiteStatus {
//   ACTIVE = "ACTIVE",
//   COMPLETE = "COMPLETE",
// }
// ----------------

// Get all jobsite forms
export async function getJobsiteForms() {
  try {
    const jobsiteForms = await prisma.jobsite.findMany();
    console.log(jobsiteForms);
    return jobsiteForms;
  } catch (error) {
    console.error("Error fetching jobsite forms:", error);
    throw error;
  }
}

// Check if jobsite exists
export async function jobExists(id: string) {
  try {
    const jobsite = await prisma.jobsite.findUnique({
      where: { id: id },
    });
    return jobsite;
  } catch (error) {
    console.error("Error checking if jobsite exists:", error);
    throw error;
  }
}

// Create jobsite
export async function createJobsite(formData: FormData) {
  try {
    console.log("Creating jobsite...");
    console.log(formData);
    const tags = formData.getAll("tags") as string[];
    const qrId = formData.get("qrId") as string;
    const name = formData.get("name") as string;
    const address = formData.get("address") as string;
    const zipCode = formData.get("zipCode") as string;
    const city = formData.get("city") as string;
    const state = formData.get("state") as string;
    const description = formData.get("description") as string;
    const comment = formData.get("jobsite_comment") as string;

    const verify = await prisma.jobsite.findMany({
      where: { name: name, address: address, city: city, zipCode: zipCode },
    });
    // Check if jobsite already exists based on id

    if (verify.length > 0) {
      console.log("Jobsite already exists.");
      throw new Error("Jobsite already exists.");
    }

    await prisma.jobsite.create({
      data: {
        qrId,
        name,
        description,
        isActive: true,
        address,
        city,
        state,
        zipCode,
        comment: comment || null,
        CCTags: {
          connect: [...tags.map((tag) => ({ id: tag }))],
        },
      },
    });
    console.log("Jobsite created successfully.");
    // Revalidate the path
    revalidatePath(`/dashboard/qr-generator`);
  } catch (error) {
    console.error("Error creating jobsite:", error);
    throw error;
  }
}

// Delete jobsite by id
export async function deleteJobsite(id: string) {
  try {
    await prisma.jobsite.delete({
      where: { id: id },
    });
    console.log("Jobsite deleted successfully.");
  } catch (error) {
    console.error("Error deleting jobsite:", error);
    throw error;
  }
}
