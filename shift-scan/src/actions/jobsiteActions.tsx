"use server";
import prisma from "@/lib/prisma";
import { Prisma } from "../../prisma/generated/prisma/client";
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

  const submitterName = formData.get("submitterName") as string;
  const name = formData.get("temporaryJobsiteName") as string;
  const code = formData.get("code") as string;
  const createdById = formData.get("createdById") as string;
  const qrId = formData.get("qrCode") as string;
  const creationComment = formData.get("creationComment") as string;
  const creationReasoning = formData.get("creationReasoning") as string;
  const address = formData.get("address") as string;
  const city = formData.get("city") as string;
  const state = formData.get("state") as string;
  const zipCode = formData.get("zipCode") as string;

  try {
    await prisma.$transaction(async (prisma) => {
      // If newAddress is checked, try to find existing client by name or address
      let addressRecord = null;

      // Try to find client by address if not found by name
      if (address && city && state && zipCode) {
        addressRecord = await prisma.address.findFirst({
          where: {
            street: address,
            city,
            state,
            zipCode,
          },
        });
      }

      // Check for duplicate jobsite name
      const existingJobsites = await prisma.jobsite.findMany({
        where: { name },
      });
      if (existingJobsites.length > 0) {
        throw new Error("A jobsite with the same name already exists.");
      }

      const data: Prisma.JobsiteCreateInput = {
        name,
        code,
        qrId,
        description: creationComment,
        creationReason: creationReasoning,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      if (createdById) {
        (data as Prisma.JobsiteCreateInput).createdBy = {
          connect: { id: createdById },
        };
      }

      if (address && city && state && zipCode) {
        // Try to find address first using findFirst for type safety
        let addr = await prisma.address.findFirst({
          where: {
            street: address,
            city,
            state,
            zipCode,
          },
        });
        if (!addr) {
          addr = await prisma.address.create({
            data: {
              street: address,
              city,
              state,
              zipCode,
            },
          });
        }
        if (addr) {
          data.Address = { connect: { id: addr.id } };
        }
      }

      // Create the jobsite and get the created record
      const createdJobsite = await prisma.jobsite.create({
        data,
      });

      await prisma.jobsite.update({
        where: { id: createdJobsite.id },
        data: {
          CCTags: {
            connect: { id: "All" }, // Ensure 'All' tag is connected
          },
        },
      });

      // If address is linked, update Address.Jobsite relation
      if (createdJobsite.addressId) {
        await prisma.address.update({
          where: { id: createdJobsite.addressId },
          data: {
            Jobsite: {
              connect: { id: createdJobsite.id },
            },
          },
        });
      }
      if (createdJobsite) {
        //todo notification trigger
      }

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
