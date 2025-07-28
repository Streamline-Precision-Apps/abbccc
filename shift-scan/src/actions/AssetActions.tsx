"use server";
import prisma from "@/lib/prisma";
import { revalidatePath, revalidateTag } from "next/cache";
import { EquipmentTags, ApprovalStatus, CreatedVia } from "@/lib/enums";
import * as Sentry from "@sentry/nextjs";
import { Prisma } from "@prisma/client";

/**
 * Server action to update equipment asset data
 * Handles both basic equipment data and vehicle information
 */
export async function updateEquipmentAsset(formData: FormData) {
  console.log("Updating equipment asset...");
  console.log(formData);
  try {
    const id = formData.get("id") as string;

    if (!id) {
      throw new Error("Equipment ID is required");
    }

    // Fetch existing equipment early
    const existingEquipment = await prisma.equipment.findUnique({
      where: { id },
      include: { equipmentVehicleInfo: true },
    });

    if (!existingEquipment) {
      throw new Error("Equipment not found");
    }

    const updateData: Prisma.EquipmentUpdateInput = {};
    if (formData.has("name"))
      updateData.name = (formData.get("name") as string)?.trim();
    if (formData.has("description"))
      updateData.description =
        (formData.get("description") as string)?.trim() || "";
    if (formData.has("equipmentTag"))
      updateData.equipmentTag = formData.get("equipmentTag") as EquipmentTags;
    if (formData.has("currentWeight"))
      updateData.currentWeight =
        parseFloat(formData.get("currentWeight") as string) || 0;
    if (formData.has("overWeight"))
      updateData.overWeight = formData.get("overWeight") === "true";
    if (formData.has("approvalStatus"))
      updateData.approvalStatus = formData.get(
        "approvalStatus"
      ) as ApprovalStatus;
    if (formData.has("isDisabledByAdmin"))
      updateData.isDisabledByAdmin = Boolean(formData.get("isDisabledByAdmin"));
    if (formData.has("creationReason"))
      updateData.creationReason = formData.get("creationReason") as string;
    updateData.updatedAt = new Date();

    const tag = formData.get("equipmentTag") as EquipmentTags;

    if (tag === "VEHICLE" || tag === "TRUCK") {
      const vehicleCreateData: Prisma.EquipmentVehicleInfoCreateWithoutEquipmentInput =
        {};
      const vehicleUpdateData: Prisma.EquipmentVehicleInfoUpdateWithoutEquipmentInput =
        {};

      if (formData.has("make")) {
        const val = (formData.get("make") as string)?.trim();
        vehicleCreateData.make = val;
        vehicleUpdateData.make = val;
      }
      if (formData.has("model")) {
        const val = (formData.get("model") as string)?.trim();
        vehicleCreateData.model = val;
        vehicleUpdateData.model = val;
      }
      if (formData.has("year")) {
        const val = (formData.get("year") as string)?.trim();
        vehicleCreateData.year = val;
        vehicleUpdateData.year = val;
      }
      if (formData.has("licensePlate")) {
        const val = (formData.get("licensePlate") as string)?.trim();
        vehicleCreateData.licensePlate = val;
        vehicleUpdateData.licensePlate = val;
      }
      if (formData.has("registrationExpiration")) {
        const regExp = new Date(
          formData.get("registrationExpiration") as string
        );
        vehicleCreateData.registrationExpiration = regExp;
        vehicleUpdateData.registrationExpiration = regExp;
      }
      if (formData.has("mileage")) {
        const mileage = parseInt(formData.get("mileage") as string) || 0;
        vehicleCreateData.mileage = mileage;
        vehicleUpdateData.mileage = mileage;
      }

      updateData.equipmentVehicleInfo = existingEquipment.equipmentVehicleInfo
        ? { update: vehicleUpdateData }
        : { create: vehicleCreateData };
    } else if (existingEquipment.equipmentVehicleInfo) {
      updateData.equipmentVehicleInfo = { delete: true };
    }

    const updatedEquipment = await prisma.equipment.update({
      where: { id },
      data: updateData,
      include: { equipmentVehicleInfo: true },
    });

    revalidateTag("equipment");
    revalidateTag("assets");
    revalidatePath("/admins/assets");
    revalidatePath(`/admins/assets/${id}`);
    revalidatePath("/admins/equipment");

    console.log("Equipment updated successfully:", updatedEquipment.id);
    return {
      success: true,
      data: updatedEquipment,
      message: "Equipment updated successfully",
    };
  } catch (error) {
    Sentry.captureException(error);
    console.error("Error updating equipment:", error);
    throw new Error(
      `Failed to update equipment: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
  }
}

export async function registerEquipment(
  equipmentData: {
    name: string;
    description?: string;
    equipmentTag: string;
    overWeight: boolean | null;
    currentWeight: number | null;
    equipmentVehicleInfo?: {
      make: string | null;
      model: string | null;
      year: string | null;
      licensePlate: string | null;
      registrationExpiration: Date | null;
      mileage: number | null;
    };
  },
  createdById: string
) {
  console.log("Registering equipment...");
  console.log(equipmentData);

  try {
    // Validate required fields
    if (!equipmentData.name.trim()) {
      throw new Error("Equipment name is required.");
    }

    if (!equipmentData.equipmentTag) {
      throw new Error("Please select an equipment tag.");
    }

    // Generate QR ID for new equipment
    const qrId = `EQ-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    const result = await prisma.$transaction(async (prisma) => {
      // Check if equipment tag requires vehicle info
      const needsVehicleInfo =
        equipmentData.equipmentTag === "VEHICLE" ||
        equipmentData.equipmentTag === "TRUCK";

      if (needsVehicleInfo) {
        // Validate vehicle-specific fields
        if (
          !equipmentData.equipmentVehicleInfo?.make ||
          !equipmentData.equipmentVehicleInfo?.model ||
          !equipmentData.equipmentVehicleInfo?.year ||
          !equipmentData.equipmentVehicleInfo?.licensePlate
        ) {
          throw new Error(
            "All vehicle fields are required for trucks and vehicles"
          );
        }

        return await prisma.equipment.create({
          data: {
            qrId,
            name: equipmentData.name,
            description: equipmentData.description || "",
            equipmentTag: equipmentData.equipmentTag as EquipmentTags,
            overWeight: equipmentData.overWeight || false,
            currentWeight: equipmentData.currentWeight || 0,
            equipmentVehicleInfo: {
              create: {
                make: equipmentData.equipmentVehicleInfo.make,
                model: equipmentData.equipmentVehicleInfo.model,
                year: equipmentData.equipmentVehicleInfo.year,
                licensePlate: equipmentData.equipmentVehicleInfo.licensePlate,
                registrationExpiration:
                  equipmentData.equipmentVehicleInfo.registrationExpiration,
                mileage: equipmentData.equipmentVehicleInfo.mileage || 0,
              },
            },
          },
          include: {
            equipmentVehicleInfo: true,
          },
        });
      } else {
        // Create equipment without vehicle info
        return await prisma.equipment.create({
          data: {
            qrId,
            name: equipmentData.name,
            description: equipmentData.description || "",
            equipmentTag: equipmentData.equipmentTag as EquipmentTags,
            overWeight: equipmentData.overWeight || false,
            currentWeight: equipmentData.currentWeight || 0,
          },
        });
      }
    });

    revalidatePath("/admins/assets");
    return { success: true, data: result };
  } catch (error) {
    console.error("Error registering equipment:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "An unknown error occurred",
    };
  }
}
/**
 *
 * Server Actions for registering and updating equipment assets.
 *
 */

export async function updateJobsite(formData: FormData) {
  console.log("Updating jobsite...");
  console.log(formData);

  try {
    // Extract form data
    const id = formData.get("id") as string;
    const name = formData.get("name") as string;
    const description = formData.get("description") as string;
    const address = formData.get("address") as string;
    const city = formData.get("city") as string;
    const state = formData.get("state") as string;
    const zipCode = formData.get("zipCode") as string;
    const country = formData.get("country") as string;
    const comment = formData.get("comment") as string;
    const isActive = formData.get("isActive") === "true";
    const client = formData.get("client") as string;
    // CCTags are passed as a JSON string, not as multiple form fields
    const cCTagsString = formData.get("cCTags") as string;

    // Validate required fields
    if (!id) {
      throw new Error("Jobsite ID is required");
    }

    if (!name?.trim()) {
      throw new Error("Jobsite name is required");
    }

    if (!description?.trim()) {
      throw new Error("Jobsite description is required");
    }

    const result = await prisma.$transaction(async (prisma) => {
      // Check if jobsite exists
      const existingJobsite = await prisma.jobsite.findUnique({
        where: { id },
      });

      if (!existingJobsite) {
        throw new Error("Jobsite not found");
      }

      // Check for duplicate jobsite name/location (excluding current jobsite)
      const duplicateJobsite = await prisma.jobsite.findFirst({
        where: {
          AND: [
            { id: { not: id } },
            { name: name.trim() },
            // Removed address, city, and state as they are not valid fields in the Prisma Jobsite model
          ],
        },
      });

      if (duplicateJobsite) {
        throw new Error(
          "A jobsite with the same name and location already exists"
        );
      }

      // Get current CCTags for this jobsite
      const jobsiteWithTags = await prisma.jobsite.findUnique({
        where: { id },
        include: { CCTags: true },
      });

      if (!jobsiteWithTags) {
        throw new Error("Jobsite not found");
      }

      // Get current tag IDs
      const currentTagIds = jobsiteWithTags.CCTags.map((tag) => tag.id);

      // Parse cCTags from JSON string
      const parsedCCTags = JSON.parse(cCTagsString || "[]");
      const newTagIds = parsedCCTags.map((tag: { id: string }) => tag.id);

      // Determine which tags to connect (add) and disconnect (remove)
      const tagsToConnect = newTagIds
        .filter((tagId: string) => !currentTagIds.includes(tagId))
        .map((tagId: string) => ({ id: tagId }));

      const tagsToDisconnect = currentTagIds
        .filter((tagId: string) => !newTagIds.includes(tagId))
        .map((tagId: string) => ({ id: tagId }));

      // Update jobsite
      return await prisma.jobsite.update({
        where: { id },
        data: {
          name: name.trim(),
          description: description.trim(),
          // Removed country as it is not a valid field in the Prisma Jobsite model
          comment: comment?.trim() || null,
          isActive: isActive,
          Client: { connect: { id: client } },
          updatedAt: new Date(),
          CCTags: {
            connect: tagsToConnect.length > 0 ? tagsToConnect : undefined,
            disconnect:
              tagsToDisconnect.length > 0 ? tagsToDisconnect : undefined,
          },
        },
        include: {
          CCTags: true,
        },
      });
    });

    // Revalidate relevant paths and tags
    revalidateTag("jobsites");
    revalidateTag("assets");
    revalidatePath("/admins/assets");

    return {
      success: true,
      data: result,
      message: "Jobsite updated successfully",
    };
  } catch (error) {
    console.error("Error updating jobsite:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
}

/**
 * Server action to update equipment asset data
 * Handles both basic jobsite data and vehicle information
 */
export async function updateJobsiteAdmin(formData: FormData) {
  console.log("Updating jobsite...");
  console.log(formData);
  try {
    const id = formData.get("id") as string;

    if (!id) {
      throw new Error("Jobsite ID is required");
    }

    // Fetch existing jobsite early
    const existingJobsite = await prisma.jobsite.findUnique({
      where: { id },
      include: { CCTags: true },
    });

    if (!existingJobsite) {
      throw new Error("Jobsite not found");
    }

    const updateData: Prisma.JobsiteUpdateInput = {};
    if (formData.has("client")) {
      const clientId = formData.get("client") as string;
      if (clientId) {
        updateData.Client = {
          connect: { id: clientId },
        };
      } else {
        updateData.Client = {
          disconnect: true,
        };
      }
    }
    if (formData.has("code")) {
      updateData.code = (formData.get("code") as string)?.trim();
    }
    if (formData.has("name")) {
      updateData.name = (formData.get("name") as string)?.trim();
    }
    if (formData.has("description")) {
      updateData.description =
        (formData.get("description") as string)?.trim() || "";
    }
    if (formData.has("approvalStatus")) {
      updateData.approvalStatus = formData.get(
        "approvalStatus"
      ) as ApprovalStatus;
    }
    if (formData.has("isActive")) {
      updateData.isActive = formData.get("isActive") === "true";
    }
    if (formData.has("creationReason")) {
      updateData.creationReason = formData.get("creationReason") as string;
    }
    if (formData.has("updatedAt")) {
      const updatedAt = formData.get("updatedAt");
      updateData.updatedAt =
        updatedAt && updatedAt !== "null" && updatedAt !== "undefined"
          ? new Date(updatedAt as string)
          : new Date();
    } else {
      updateData.updatedAt = new Date();
    }
    if (formData.has("CCTags")) {
      const cCTagsString = formData.get("CCTags") as string;
      const cCTagsArray = JSON.parse(cCTagsString || "[]");
      updateData.CCTags = {
        set: cCTagsArray.map((tag: { id: string }) => ({ id: tag.id })),
      };
    }

    const updatedJobsite = await prisma.jobsite.update({
      where: { id },
      data: updateData,
      include: { CCTags: true },
    });

    revalidatePath("/admins/jobsites");

    console.log("Jobsite updated successfully:", updatedJobsite.id);
    return {
      success: true,
      data: updatedJobsite,
      message: "Jobsite updated successfully",
    };
  } catch (error) {
    Sentry.captureException(error);
    console.error("Error updating jobsite:", error);
    throw new Error(
      `Failed to update jobsite: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
  }
}
/**
 * Alternative function for creating jobsite that accepts a structured object
 * Useful for direct TypeScript integration with forms
 */

export async function createJobsiteAdmin({
  payload,
}: {
  payload: {
    code: string;
    name: string;
    description: string;
    ApprovalStatus: string;
    isActive: boolean;
    Address: {
      street: string;
      city: string;
      state: string;
      zipCode: string;
    };
    Client?: {
      id: string;
    } | null;
    CreatedVia: string;
    createdById: string;
  };
}) {
  try {
    console.log("Creating jobsite...");
    console.log(payload);
    await prisma.$transaction(async (prisma) => {
      const existingAddress = await prisma.address.findFirst({
        where: {
          street: payload.Address.street.trim(),
          city: payload.Address.city.trim(),
          state: payload.Address.state.trim(),
          zipCode: payload.Address.zipCode.trim(),
        },
      });

      if (existingAddress) {
        await prisma.jobsite.create({
          data: {
            code: payload.code.trim(),
            name: payload.name.trim(),
            description: payload.description.trim(),
            approvalStatus: payload.ApprovalStatus as ApprovalStatus,
            isActive: payload.isActive,
            createdVia: payload.CreatedVia as CreatedVia,
            Address: {
              connect: { id: existingAddress.id },
            },
            ...(payload.Client?.id && {
              Client: {
                connect: { id: payload.Client.id },
              },
            }),
            createdBy: {
              connect: { id: payload.createdById.trim() },
            },
          },
        });
      } else {
        await prisma.jobsite.create({
          data: {
            code: payload.code.trim(),
            name: payload.name.trim(),
            description: payload.description.trim(),
            approvalStatus: payload.ApprovalStatus as ApprovalStatus,
            isActive: payload.isActive,
            createdVia: payload.CreatedVia as CreatedVia,
            Address: {
              create: {
                street: payload.Address.street.trim(),
                city: payload.Address.city.trim(),
                state: payload.Address.state.trim(),
                zipCode: payload.Address.zipCode.trim(),
              },
            },
            ...(payload.Client?.id && {
              Client: {
                connect: { id: payload.Client.id },
              },
            }),
            createdBy: {
              connect: { id: payload.createdById.trim() },
            },
          },
        });
      }
    });

    return {
      success: true,
      message: "Jobsite created successfully",
    };
  } catch (error) {
    console.error("Error creating jobsite:", error);
    throw error;
  }
}

export async function createJobsiteFromObject(jobsiteData: {
  name: string;
  clientId: string;
  description: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  country?: string;
  comment?: string;
  isActive?: boolean;
  CCTags?: Array<{ id: string; name: string }>;
}) {
  console.log("Creating jobsite from object...");
  console.log(jobsiteData);

  try {
    // Validate required fields
    if (!jobsiteData.name?.trim()) {
      throw new Error("Jobsite name is required");
    }

    if (!jobsiteData.description?.trim()) {
      throw new Error("Jobsite description is required");
    }

    // Generate unique QR ID for new jobsite
    const qrId = `JS-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    const result = await prisma.$transaction(async (prisma) => {
      // Check for duplicate jobsite (name + address + city + state combination)
      const existingJobsite = await prisma.jobsite.findFirst({
        where: {
          name: jobsiteData.name.trim(),
          // Removed address, city, and state as they are not valid fields in the Prisma Jobsite model
        },
      });

      if (existingJobsite) {
        throw new Error(
          "A jobsite with the same name and location already exists"
        );
      }

      // Create new jobsite
      return await prisma.jobsite.create({
        data: {
          qrId,
          name: jobsiteData.name.trim(),
          description: jobsiteData.description.trim(),
          // Removed address, city, state, zipCode, and country as they are not valid fields in the Prisma Jobsite model
          comment: jobsiteData.comment?.trim() || null,
          isActive: true,
          Client: { connect: { id: jobsiteData.clientId } },
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        include: {
          CCTags: true,
        },
      });
    });

    // Revalidate relevant paths and tags
    revalidateTag("jobsites");
    revalidateTag("assets");
    revalidatePath("/admins/assets");

    return {
      success: true,
      data: result,
      message: "Jobsite created successfully",
    };
  } catch (error) {
    console.error("Error creating jobsite:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
}

export async function deleteJobsite(id: string) {
  console.log("Deleting jobsite with ID:", id);
  try {
    await prisma.jobsite.delete({
      where: { id },
    });

    // Revalidate relevant paths and tags
    revalidateTag("jobsites");
    revalidateTag("assets");
    revalidatePath("/admins/assets");
    revalidatePath("/admins/jobsites");

    return { success: true, message: "Jobsite deleted successfully" };
  } catch (error) {
    console.error("Error deleting jobsite:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
}

/**
 * Server action to delete an equipment asset
 * @param id The ID of the equipment to delete
 * @returns Success status and message
 */
export async function deleteEquipment(id: string) {
  console.log("Deleting equipment with ID:", id);
  try {
    // Check if equipment exists
    const existingEquipment = await prisma.equipment.findUnique({
      where: { id },
      include: { equipmentVehicleInfo: true },
    });

    if (!existingEquipment) {
      throw new Error("Equipment not found");
    }

    // Delete the equipment (this will cascade to related records like equipmentVehicleInfo)
    await prisma.equipment.delete({
      where: { id },
    });

    // Revalidate relevant paths and tags
    revalidateTag("equipment");
    revalidateTag("assets");
    revalidatePath("/admins/assets");

    return { success: true, message: "Equipment deleted successfully" };
  } catch (error) {
    console.error("Error deleting equipment:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
}

/**
 * Server action to create a new cost code
 */
export async function updateCostCodeAdmin(formData: FormData) {
  console.log("Updating cost code...");
  console.log(formData);
  try {
    const id = formData.get("id") as string;

    if (!id) {
      throw new Error("Jobsite ID is required");
    }

    // Fetch existing jobsite early
    const existingJobsite = await prisma.costCode.findUnique({
      where: { id },
      include: {
        CCTags: {
          select: { id: true, name: true },
        },
      },
    });

    if (!existingJobsite) {
      throw new Error("Jobsite not found");
    }

    const updateData: Prisma.CostCodeUpdateInput = {};
    if (formData.has("code")) {
      updateData.code = (formData.get("code") as string)?.trim();
    }
    if (formData.has("name")) {
      updateData.name = (formData.get("name") as string)?.trim();
    }
    if (formData.has("isActive")) {
      updateData.isActive = formData.get("isActive") === "true";
    }

    if (formData.has("cCTags")) {
      const cCTagsString = formData.get("cCTags") as string;
      let cCTagsArray = JSON.parse(cCTagsString || "[]");
      // If no tags provided, add the 'All' tag automatically
      if (!Array.isArray(cCTagsArray) || cCTagsArray.length === 0) {
        // Find the 'All' tag in the database
        const allTag = await prisma.cCTag.findFirst({
          where: { name: { equals: "All", mode: "insensitive" } },
          select: { id: true },
        });
        if (allTag) {
          cCTagsArray = [{ id: allTag.id }];
        }
      }
      updateData.CCTags = {
        set: cCTagsArray.map((tag: { id: string }) => ({ id: tag.id })),
      };
    }

    updateData.updatedAt = new Date();

    const updatedCostCode = await prisma.costCode.update({
      where: { id },
      data: updateData,
      include: { CCTags: true },
    });

    revalidatePath("/admins/cost-codes");

    console.log("Cost code updated successfully:", updatedCostCode.id);
    return {
      success: true,
      data: updatedCostCode,
      message: "Cost code updated successfully",
    };
  } catch (error) {
    Sentry.captureException(error);
    console.error("Error updating jobsite:", error);
    throw new Error(
      `Failed to update jobsite: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
  }
}

export async function createCostCode(payload: {
  code: string;
  name: string;
  isActive: boolean;
  CCTags: {
    id: string;
    name: string;
  }[];
}) {
  console.log("Creating new cost code...");
  console.log(payload);

  try {
    // Validate required fields
    if (!payload.name?.trim()) {
      throw new Error("Cost code name is required");
    }

    // Check if cost code with the same name already exists
    const existingCostCode = await prisma.costCode.findUnique({
      where: {
        code: payload.code.trim(),
        name: `${payload.code.trim()} ${payload.name.trim()}`,
      },
    });

    if (existingCostCode) {
      throw new Error("A cost code with this name already exists");
    }

    // Create the new cost code
    const newCostCode = await prisma.costCode.create({
      data: {
        code: payload.code.split("#")[1] || "",
        name: `${payload.code.trim()} ${payload.name.trim()}`,
        isActive: payload.isActive,
        CCTags: {
          connect: payload.CCTags?.map((tag) => ({ id: tag.id })) || [],
        },
      },
    });

    // Revalidate relevant paths and tags
    revalidateTag("costcodes");
    revalidateTag("assets");
    revalidatePath("/admins/assets");

    return {
      success: true,
      data: newCostCode,
      message: "Cost code created successfully",
    };
  } catch (error) {
    console.error("Error creating cost code:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
}

/**
 * Server action to update an existing cost code
 */
export async function updateCostCode(
  id: string,
  costCodeData: Partial<{
    name: string;
    isActive: boolean;
    CCTags?: { id: string; name: string }[];
  }>
) {
  console.log("Updating cost code...", id, costCodeData);

  try {
    // Validate cost code exists
    const existingCostCode = await prisma.costCode.findUnique({
      where: { id },
      include: {
        CCTags: true,
      },
    });

    if (!existingCostCode) {
      throw new Error("Cost code not found");
    }

    // If name is being updated, check for duplicates
    if (costCodeData.name && costCodeData.name !== existingCostCode.name) {
      const duplicateName = await prisma.costCode.findUnique({
        where: {
          name: costCodeData.name.trim(),
          NOT: { id },
        },
      });

      if (duplicateName) {
        throw new Error("A cost code with this name already exists");
      }
    }

    // Prepare update data with proper typing
    type UpdateData = {
      name?: string;
      isActive?: boolean;
      updatedAt: Date;
      CCTags?: {
        connect?: Array<{ id: string }>;
        disconnect?: Array<{ id: string }>;
      };
    };

    const updateData: UpdateData = {
      ...(costCodeData.name && { name: costCodeData.name.trim() }),
      ...(costCodeData.isActive !== undefined && {
        isActive: costCodeData.isActive,
      }),
      updatedAt: new Date(),
    };

    // Handle tags update if provided
    if (costCodeData.CCTags !== undefined) {
      // Get the current tag IDs from the database
      const currentTagIds = new Set(
        existingCostCode.CCTags.map((tag) => tag.id)
      );

      // Get the new tag IDs from the form data
      const newTagIds = new Set(costCodeData.CCTags.map((tag) => tag.id));

      // Determine which tags to connect (add) and disconnect (remove)
      const tagsToConnect = costCodeData.CCTags.filter(
        (tag) => !currentTagIds.has(tag.id)
      ).map((tag) => ({ id: tag.id }));

      const tagsToDisconnect = existingCostCode.CCTags.filter(
        (tag) => !newTagIds.has(tag.id)
      ).map((tag) => ({ id: tag.id }));

      // Add tag connection/disconnection operations to update data
      updateData.CCTags = {};
      if (tagsToConnect.length > 0) {
        updateData.CCTags.connect = tagsToConnect;
      }
      if (tagsToDisconnect.length > 0) {
        updateData.CCTags.disconnect = tagsToDisconnect;
      }
    }

    // Update the cost code
    const updatedCostCode = await prisma.costCode.update({
      where: { id },
      data: updateData,
      include: {
        CCTags: true, // Include tags in the returned data
      },
    });

    // Revalidate relevant paths and tags
    revalidateTag("costcodes");
    revalidateTag("assets");
    revalidatePath("/admins/assets");

    return {
      success: true,
      data: updatedCostCode,
      message: "Cost code updated successfully",
    };
  } catch (error) {
    console.error("Error updating cost code:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
}

/**
 * Server action to delete a cost code
 */
export async function deleteCostCode(id: string) {
  console.log("Deleting cost code with ID:", id);

  try {
    // Check for related records before deletion
    const costCodeWithRelations = await prisma.costCode.findUnique({
      where: { id },
      include: {
        Timesheets: true,
        CCTags: true,
      },
    });

    if (!costCodeWithRelations) {
      throw new Error("Cost code not found");
    }

    // Check if cost code is in use
    if (costCodeWithRelations.Timesheets.length > 0) {
      throw new Error("Cannot delete cost code that is used in timesheets");
    }

    // Disconnect any related CCTags before deletion
    if (costCodeWithRelations.CCTags.length > 0) {
      await prisma.costCode.update({
        where: { id },
        data: {
          CCTags: {
            disconnect: costCodeWithRelations.CCTags.map((tag) => ({
              id: tag.id,
            })),
          },
        },
      });
    }

    // Delete the cost code
    await prisma.costCode.delete({
      where: { id },
    });

    // Revalidate relevant paths and tags
    revalidateTag("costcodes");
    revalidateTag("assets");
    revalidatePath("/admins/assets");

    return {
      success: true,
      message: "Cost code deleted successfully",
    };
  } catch (error) {
    console.error("Error deleting cost code:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
}

export async function updateTagAdmin(formData: FormData) {
  console.log("Updating tag ...");
  console.log(formData);
  try {
    const id = formData.get("id") as string;
    if (!id) {
      throw new Error("Tag ID is required");
    }

    // Fetch existing tag early
    const existingTag = await prisma.cCTag.findUnique({
      where: { id },
      include: {
        Jobsites: { select: { id: true, name: true } },
        CostCodes: { select: { id: true, name: true } },
      },
    });
    if (!existingTag) {
      throw new Error("Tag not found");
    }

    const updateData: Prisma.CCTagUpdateInput = {};
    if (formData.has("name")) {
      updateData.name = (formData.get("name") as string)?.trim();
    }
    if (formData.has("description")) {
      updateData.description =
        (formData.get("description") as string)?.trim() || "";
    }

    // Handle Jobsites relation
    if (formData.has("Jobsites")) {
      const jobsitesString = formData.get("Jobsites") as string;
      const jobsitesArray = JSON.parse(jobsitesString || "[]");
      updateData.Jobsites = {
        set: jobsitesArray.map((id: string) => ({ id })),
      };
    }

    // Handle CostCodes relation
    if (formData.has("CostCodeTags")) {
      const costCodesString = formData.get("CostCodeTags") as string;
      const costCodesArray = JSON.parse(costCodesString || "[]");
      updateData.CostCodes = {
        set: costCodesArray.map((id: string) => ({ id })),
      };
    }

    const updatedTag = await prisma.cCTag.update({
      where: { id },
      data: updateData,
      include: {
        Jobsites: { select: { id: true, name: true } },
        CostCodes: { select: { id: true, name: true } },
      },
    });

    revalidatePath("/admins/cost-codes");

    console.log("Tag updated successfully:", updatedTag.id);
    return {
      success: true,
      data: updatedTag,
      message: "Tag updated successfully",
    };
  } catch (error) {
    Sentry.captureException(error);
    console.error("Error updating tag:", error);
    throw new Error(
      `Failed to update tag: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
  }
}

export async function updateTags(
  id: string,
  tagData: Partial<{
    name: string;
    description: string;
    CostCodes?: { id: string; name: string }[];
  }>
) {
  console.log("Updating tag...", id, tagData);

  try {
    // Validate tag exists
    const existingTag = await prisma.cCTag.findUnique({
      where: { id },
      include: {
        CostCodes: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    if (!existingTag) {
      throw new Error("Tag not found");
    }

    // Prepare update data
    const updateData: Partial<{
      name: string;
      description: string;
      CostCodes: {
        connect?: { id: string }[];
        disconnect?: { id: string }[];
      };
    }> = {
      ...(tagData.name && { name: tagData.name.trim() }),
      ...(tagData.description !== undefined && {
        description: tagData.description,
      }),
    };

    // Handle CostCodes updates if provided
    if (tagData.CostCodes !== undefined) {
      // Get current cost code IDs
      const currentCostCodeIds = new Set(
        existingTag.CostCodes.map((costCode) => costCode.id)
      );

      // Get new cost code IDs
      const newCostCodeIds = new Set(
        tagData.CostCodes.map((costCode) => costCode.id)
      );

      // Determine which cost codes to connect (add) and disconnect (remove)
      const costCodesToConnect = tagData.CostCodes.filter(
        (costCode) => !currentCostCodeIds.has(costCode.id)
      ).map((costCode) => ({ id: costCode.id }));

      const costCodesToDisconnect = existingTag.CostCodes.filter(
        (costCode) => !newCostCodeIds.has(costCode.id)
      ).map((costCode) => ({ id: costCode.id }));

      // Add cost code connection/disconnection operations to update data
      updateData.CostCodes = {};
      if (costCodesToConnect.length > 0) {
        updateData.CostCodes.connect = costCodesToConnect;
      }
      if (costCodesToDisconnect.length > 0) {
        updateData.CostCodes.disconnect = costCodesToDisconnect;
      }
    }

    // Update the tag
    const updatedTag = await prisma.cCTag.update({
      where: { id },
      data: updateData,
      include: {
        CostCodes: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    // Revalidate relevant paths and tags
    revalidateTag("costcodes");
    revalidateTag("assets");
    revalidatePath("/admins/assets");

    return {
      success: true,
      data: updatedTag,
      message: "Tag updated successfully",
    };
  } catch (error) {
    console.error("Error updating tag:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
}

/**
 * Server action to delete a tag
 *
 * @param id - The ID of the tag to delete
 * @returns Results object with success status and optional error message
 */
export async function deleteTag(id: string) {
  console.log("Deleting Tag with ID:", id);

  try {
    // Check if the tag exists before attempting to delete
    const existingTag = await prisma.cCTag.findUnique({
      where: { id },
      include: {
        CostCodes: {
          select: { id: true },
        },
      },
    });

    if (!existingTag) {
      return {
        success: false,
        error: "Tag not found",
      };
    }

    // Delete the tag
    await prisma.cCTag.delete({
      where: { id },
    });

    // Revalidate relevant paths and tags
    revalidateTag("costcodes");
    revalidateTag("assets");
    revalidatePath("/admins/assets");

    return {
      success: true,
      message: "Tag deleted successfully",
    };
  } catch (error) {
    console.error("Error deleting tag:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
}

export async function createTag(payload: {
  name: string;
  description: string;
  CostCode: {
    id: string;
    name: string;
  }[];
  Jobsites: {
    id: string;
    name: string;
  }[];
}) {
  console.log("Creating new tag...", {
    name: payload.name,
    description: payload.description,
    costCodesCount: payload.CostCode.length,
    jobsitesCount: payload.Jobsites.length,
  });

  try {
    // Validate required fields
    if (!payload.name?.trim()) {
      throw new Error("Tag name is required");
    }

    if (!payload.description?.trim()) {
      throw new Error("Tag description is required");
    }

    if (!payload.CostCode || payload.CostCode.length === 0) {
      throw new Error("At least one cost code must be selected");
    }

    // Check if tag with the same name already exists
    const existingTag = await prisma.cCTag.findUnique({
      where: {
        name: payload.name.trim(),
      },
    });

    if (existingTag) {
      throw new Error("A tag with this name already exists");
    }

    // Validate that all provided cost codes exist
    const existingCostCodes = await prisma.costCode.findMany({
      where: {
        id: {
          in: payload.CostCode.map((cc) => cc.id),
        },
      },
      select: {
        id: true,
        name: true,
      },
    });

    if (existingCostCodes.length !== payload.CostCode.length) {
      throw new Error("One or more selected cost codes do not exist");
    }

    // Validate that all provided jobsites exist (optional, but recommended)
    if (payload.Jobsites && payload.Jobsites.length > 0) {
      const existingJobsites = await prisma.jobsite.findMany({
        where: {
          id: {
            in: payload.Jobsites.map((js) => js.id),
          },
        },
        select: {
          id: true,
          name: true,
        },
      });

      if (existingJobsites.length !== payload.Jobsites.length) {
        throw new Error("One or more selected jobsites do not exist");
      }
    }

    // Create the new tag with associated cost codes and jobsites
    const newTag = await prisma.cCTag.create({
      data: {
        name: payload.name.trim(),
        description: payload.description.trim(),
        CostCodes: {
          connect: payload.CostCode.map((cc) => ({ id: cc.id })),
        },
        Jobsites:
          payload.Jobsites && payload.Jobsites.length > 0
            ? {
                connect: payload.Jobsites.map((js) => ({ id: js.id })),
              }
            : undefined,
      },
      include: {
        CostCodes: {
          select: {
            id: true,
            name: true,
          },
        },
        Jobsites: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    console.log("Tag created successfully:", newTag.id);

    // Revalidate relevant paths and tags
    revalidateTag("costcodes");
    revalidateTag("assets");
    revalidatePath("/admins/assets");

    return {
      success: true,
      data: newTag,
      message: "Tag created successfully",
    };
  } catch (error) {
    console.error("Error creating tag:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
}

export async function createClientAdmin({
  payload,
}: {
  payload: {
    name: string;
    description: string;
    approvalStatus: string;
    contactPerson: string;
    contactEmail: string;
    contactPhone: string;
    Address: {
      street: string;
      city: string;
      state: string;
      zipCode: string;
    };
    createdById?: string;
  };
}) {
  try {
    console.log("Creating jobsite...");
    console.log(payload);
    await prisma.$transaction(async (prisma) => {
      const existingAddress = await prisma.address.findFirst({
        where: {
          street: payload.Address.street.trim(),
          city: payload.Address.city.trim(),
          state: payload.Address.state.trim(),
          zipCode: payload.Address.zipCode.trim(),
        },
      });

      if (existingAddress) {
        await prisma.client.create({
          data: {
            name: payload.name.trim(),
            description: payload.description.trim(),
            approvalStatus: payload.approvalStatus as ApprovalStatus,
            contactPerson: payload.contactPerson.trim(),
            contactEmail: payload.contactEmail.trim(),
            contactPhone: payload.contactPhone.trim(),
            createdVia: "ADMIN",
            Address: {
              connect: { id: existingAddress.id },
            },
            Company: {
              connect: { id: "1", name: "Streamline Precision LLC" },
            },
            createdBy: {
              connect: { id: payload.createdById?.trim() },
            },
          },
        });
      } else {
        await prisma.client.create({
          data: {
            name: payload.name.trim(),
            description: payload.description.trim(),
            approvalStatus: payload.approvalStatus as ApprovalStatus,
            contactPerson: payload.contactPerson.trim(),
            contactEmail: payload.contactEmail.trim(),
            contactPhone: payload.contactPhone.trim(),
            createdVia: "ADMIN",
            Address: {
              create: {
                street: payload.Address.street.trim(),
                city: payload.Address.city.trim(),
                state: payload.Address.state.trim(),
                zipCode: payload.Address.zipCode.trim(),
              },
            },
            Company: {
              connect: { id: "1", name: "Streamline Precision LLC" },
            },
            createdBy: {
              connect: { id: payload.createdById?.trim() },
            },
          },
        });
      }
    });

    return {
      success: true,
      message: "Jobsite created successfully",
    };
  } catch (error) {
    console.error("Error creating jobsite:", error);
    throw error;
  }
}

export async function deleteClient(id: string) {
  console.log("Deleting client with ID:", id);

  try {
    // Check for related records before deletion
    const clientWithRelations = await prisma.client.findUnique({
      where: { id },
    });

    if (!clientWithRelations) {
      throw new Error("Client not found");
    }
    // Delete the client
    await prisma.client.delete({
      where: { id },
    });

    revalidatePath("/admins/clients");

    return {
      success: true,
      message: "Client deleted successfully",
    };
  } catch (error) {
    console.error("Error deleting client:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
}

export async function updateClientAdmin(formData: FormData) {
  console.log("Updating client...");
  console.log(formData);
  try {
    const id = formData.get("id") as string;

    if (!id) {
      throw new Error("Jobsite ID is required");
    }

    // Fetch existing client early
    const existingClient = await prisma.client.findUnique({
      where: { id },
      include: { Address: true },
    });

    if (!existingClient) {
      throw new Error("Client not found");
    }

    const updateData: Prisma.ClientUpdateInput = {};
    if (formData.has("name")) {
      updateData.name = (formData.get("name") as string)?.trim();
    }
    if (formData.has("description")) {
      updateData.description =
        (formData.get("description") as string)?.trim() || "";
    }
    if (formData.has("approvalStatus")) {
      updateData.approvalStatus = formData.get(
        "approvalStatus"
      ) as ApprovalStatus;
    }
    if (formData.has("contactPerson")) {
      updateData.contactPerson = (
        formData.get("contactPerson") as string
      )?.trim();
    }
    if (formData.has("contactEmail")) {
      updateData.contactEmail = (
        formData.get("contactEmail") as string
      )?.trim();
    }
    if (formData.has("contactPhone")) {
      updateData.contactPhone = (
        formData.get("contactPhone") as string
      )?.trim();
    }
    if (formData.has("creationReason")) {
      updateData.creationReason = formData.get("creationReason") as string;
    }
    updateData.updatedAt = new Date();
    if (formData.has("Address")) {
      const addressString = formData.get("Address") as string;
      const addressData = JSON.parse(addressString || "{}");
      updateData.Address = {
        update: {
          street: addressData.street?.trim(),
          city: addressData.city?.trim(),
          state: addressData.state?.trim(),
          zipCode: addressData.zipCode?.trim(),
        },
      };
    }

    const updatedClient = await prisma.client.update({
      where: { id },
      data: updateData,
      include: { Address: true },
    });

    revalidatePath("/admins/clients");

    console.log("Client updated successfully:", updatedClient.id);
    return {
      success: true,
      data: updatedClient,
      message: "Client updated successfully",
    };
  } catch (error) {
    Sentry.captureException(error);
    console.error("Error updating client:", error);
    throw new Error(
      `Failed to update client: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
  }
}
