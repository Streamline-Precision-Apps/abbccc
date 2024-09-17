"use server";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

// Utility function to convert string to enum value
function toEnumValue<T extends Record<string, string>>(
  enumObject: T,
  value: string
): T[keyof T] | null {
  return Object.values(enumObject).includes(value as T[keyof T])
    ? (value as T[keyof T])
    : null;
}

// Enum for jobsite status
enum JobsiteStatus {
  ACTIVE = "ACTIVE",
  COMPLETE = "COMPLETE",
}

// Get all jobsite forms
export async function getJobsiteForms() {
  try {
    const jobsiteForms = await prisma.jobsites.findMany();
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
    const jobsite = await prisma.jobsites.findUnique({
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
    const id = formData.get("id");
    const idString = id?.toString() ?? "";
    const verify = prisma.jobsites.findMany({
      where: { id: idString },
    });
    // Check if jobsite already exists
    if ((await verify).length > 0) {
      console.log("Jobsite already exists.");
      throw new Error("Jobsite already exists.");
    }

    await prisma.jobsites.create({
      data: {
        name: formData.get("name") as string,
        streetNumber: (formData.get("streetNumber") as string) || null,
        streetName: formData.get("streetName") as string,
        city: formData.get("city") as string,
        state: (formData.get("state") as string) || null,
        country: formData.get("country") as string,
        description: formData.get("description") as string,
        comment: (formData.get("jobsite_comment") as string) || null,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
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
    await prisma.jobsites.delete({
      where: { id: id },
    });
    console.log("Jobsite deleted successfully.");
  } catch (error) {
    console.error("Error deleting jobsite:", error);
    throw error;
  }
}
