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
  const clientId = formData.get("clientId") as string | null;
  const newAddress = formData.get("newAddress") === "true";
  const address = formData.get("address") as string;
  const city = formData.get("city") as string;
  const state = formData.get("state") as string;
  const zipCode = formData.get("zipCode") as string;
  const clientName = formData.get("clientName") as string;

  try {
    await prisma.$transaction(async (prisma) => {
      // If newAddress is checked, try to find existing client by name or address
      let foundClient = null;
      let addressRecord = null;
      if (newAddress) {
        // Try to find client by name
        if (clientName) {
          foundClient = await prisma.client.findFirst({
            where: { name: clientName },
          });
        }
        // Try to find client by address if not found by name
        if (!foundClient && address && city && state && zipCode) {
          addressRecord = await prisma.address.findFirst({
            where: {
              street: address,
              city,
              state,
              zipCode,
            },
            include: { Client: true },
          });
          if (addressRecord && addressRecord.Client.length > 0) {
            foundClient = addressRecord.Client[0];
          }
        }
      }

      // Check for duplicate jobsite name
      const existingJobsites = await prisma.jobsite.findMany({
        where: { name },
      });
      if (existingJobsites.length > 0) {
        throw new Error("A jobsite with the same name already exists.");
      }

      // Build the data object for jobsite creation
      // If CCTags are provided in the formData, connect them
      let ccTagIds: string[] = [];
      if (formData.has("ccTagIds")) {
        const ccTagsRaw = formData.getAll("ccTagIds");
        ccTagIds = Array.isArray(ccTagsRaw)
          ? (ccTagsRaw as string[])
          : [ccTagsRaw as string];
      }

      const data: any = {
        name,
        qrId,
        description: creationReasoning,
        comment: creationComment,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
        ...(ccTagIds.length > 0 && {
          CCTags: {
            connect: ccTagIds.map((id) => ({ id })),
          },
        }),
      };

      if (createdById) {
        data.createdBy = { connect: { id: createdById } };
      }

      if (newAddress) {
        // If found client, link to client
        if (foundClient) {
          data.Client = { connect: { id: foundClient.id } };
        }
        // Always create or connect address
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
        // If no client, do not set Client or clientId at all (leave null)
      }
      // If not new address, do not set Client or Address at all (leave null)

      // Create the jobsite and get the created record
      const createdJobsite = await prisma.jobsite.create({
        data,
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

      // If client is linked, update Client.Jobsites relation
      if (createdJobsite.clientId) {
        await prisma.client.update({
          where: { id: createdJobsite.clientId },
          data: {
            Jobsites: {
              connect: { id: createdJobsite.id },
            },
          },
        });
      }

      // If both client and address are linked, ensure bidirectional relations
      if (createdJobsite.clientId && createdJobsite.addressId) {
        // Add client to address if not already there
        const address = await prisma.address.findUnique({
          where: { id: createdJobsite.addressId },
          include: { Client: true },
        });
        if (
          address &&
          !address.Client.some((c) => c.id === createdJobsite.clientId)
        ) {
          await prisma.address.update({
            where: { id: createdJobsite.addressId },
            data: {
              Client: {
                connect: { id: createdJobsite.clientId },
              },
            },
          });
        }

        // Add address to client if not already there
        const client = await prisma.client.findUnique({
          where: { id: createdJobsite.clientId },
          include: { Address: true },
        });
        if (
          client &&
          (!client.addressId || client.addressId !== createdJobsite.addressId)
        ) {
          await prisma.client.update({
            where: { id: createdJobsite.clientId },
            data: {
              Address: {
                connect: { id: createdJobsite.addressId },
              },
            },
          });
        }
      }

      // If CCTags were connected, ensure bidirectional connection (optional, for completeness)
      if (ccTagIds.length > 0) {
        for (const ccTagId of ccTagIds) {
          await prisma.cCTag.update({
            where: { id: ccTagId },
            data: {
              Jobsites: {
                connect: { id: createdJobsite.id },
              },
            },
          });
        }
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
