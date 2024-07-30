"use server";
import { prisma } from "@/lib/prisma";
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
    const jobsiteForms = await prisma.jobsite.findMany();
    console.log(jobsiteForms);
    return jobsiteForms;
  } catch (error) {
    console.error("Error fetching jobsite forms:", error);
    throw error;
  }
}

// Create jobsite
export async function createJobsite(formData: FormData) {
  try {
    console.log("Creating jobsite...");
    console.log(formData);

    await prisma.jobsite.create({
      data: {
        jobsite_name: formData.get("jobsite_name") as string,
        street_number: (formData.get("street_number") as string) || null,
        street_name: formData.get("street_name") as string,
        city: formData.get("city") as string,
        state: (formData.get("state") as string) || null,
        country: formData.get("country") as string,
        jobsite_description: formData.get("jobsite_description") as string,
        comments: (formData.get("jobsite_comments") as string) || null,
        jobsite_active: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });
    console.log("Jobsite created successfully.");

    // Revalidate the path
    revalidatePath(`/dashboard/qr-generator`);

    // Redirect to the qr-generator page
    redirect(`/dashboard/qr-generator`);
  } catch (error) {
    console.error("Error creating jobsite:", error);
    throw error;
  }
}

// Delete jobsite by id
export async function deleteJobsite(jobsite_id: string) {
  try {
    await prisma.jobsite.delete({
      where: { jobsite_id: jobsite_id },
    });
    console.log("Jobsite deleted successfully.");
  } catch (error) {
    console.error("Error deleting jobsite:", error);
    throw error;
  }
}
