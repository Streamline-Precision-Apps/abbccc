"use server";
import prisma from "@/lib/prisma";
import * as Sentry from "@sentry/nextjs";
import { revalidatePath } from "next/cache";

export async function getJobsiteForms() {
  try {
    const jobsiteForms = await prisma.jobsite.findMany();
    console.log(jobsiteForms);
    return jobsiteForms;
  } catch (error) {
    Sentry.captureException(error);
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
  console.log("Creating jobsite...");
  console.log(formData);

  const name = formData.get("temporaryJobsiteName") as string;
  const createdById = formData.get("createdById") as string;
  const qrId = formData.get("qrCode") as string;

  const creationComment = formData.get("creationComment") as string;
  const creationReasoning = formData.get("creationReasoning") as string;
  const clientId = formData.get("clientId") as string;
  try {
    prisma.$transaction(async (prisma) => {
      const existingJobsites = await prisma.jobsite.findMany({
        where: {
          name,
        },
      });

      if (existingJobsites.length > 0) {
        throw new Error(
          "A jobsite with the same name, address, city, state, and zip code already exists."
        );
      }

      const newJobsite = await prisma.jobsite.create({
        data: {
          name,
          qrId,
          description: creationReasoning,
          comment: creationComment,
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date(),
          Client: { connect: { id: clientId } },
        },
      });

      revalidatePath("/dashboard/qr-generator");
    });
    console.log("Jobsite created successfully.");
    return { success: true };
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
