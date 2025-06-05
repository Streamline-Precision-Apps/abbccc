"use server";
import prisma from "@/lib/prisma";
import { revalidatePath, revalidateTag } from "next/cache";
import { EquipmentTags, EquipmentStatus } from "@/lib/types";

type VehicleInfo = {
  make: string | null;
  model: string | null;
  year: string | null;
  licensePlate: string | null;
  registrationExpiration: Date | null;
  mileage: number;
};

interface EquipmentUpdateData {
  name: string | undefined;
  description: string;
  equipmentTag: EquipmentTags;
  currentWeight: number;
  overWeight: boolean;
  updatedAt: Date;
  equipmentVehicleInfo?: {
    create?: VehicleInfo;
    update?: VehicleInfo;
    delete?: boolean;
  };
}

/**
 * Utility function to validate jobsite input data
 */
function validateJobsiteData(data: {
  name?: string;
  description?: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  country?: string;
}) {
  const errors: string[] = [];

  if (!data.name?.trim()) {
    errors.push("Jobsite name is required");
  }

  if (!data.description?.trim()) {
    errors.push("Jobsite description is required");
  }

  // Optional: Add more specific validation rules
  if (data.name && data.name.trim().length < 2) {
    errors.push("Jobsite name must be at least 2 characters long");
  }

  if (data.description && data.description.trim().length < 5) {
    errors.push("Jobsite description must be at least 5 characters long");
  }

  if (
    data.zipCode &&
    data.zipCode.trim() &&
    !/^\d{5}(-\d{4})?$/.test(data.zipCode.trim())
  ) {
    errors.push("Zip code must be in format 12345 or 12345-6789");
  }

  return errors;
}

/**
 * Server action to update equipment asset data
 * Handles both basic equipment data and vehicle information
 */
export async function updateEquipmentAsset(formData: FormData) {
  console.log("Updating equipment asset...");

  try {
    // Extract basic equipment data
    const id = formData.get("id") as string;
    const name = formData.get("name") as string;
    const description = formData.get("description") as string;
    const equipmentTag = formData.get("equipmentTag") as EquipmentTags;
    // const status = formData.get("status") as EquipmentStatus;
    const currentWeight =
      parseFloat(formData.get("currentWeight") as string) || 0;
    const overWeight = formData.get("overWeight") === "true";

    if (!id) {
      throw new Error("Equipment ID is required");
    }

    // Check if equipment exists
    const existingEquipment = await prisma.equipment.findUnique({
      where: { id },
      include: { equipmentVehicleInfo: true },
    });

    if (!existingEquipment) {
      throw new Error("Equipment not found");
    }

    // Prepare update data
    const updateData: EquipmentUpdateData = {
      name: name?.trim(),
      description: description?.trim() || "",
      equipmentTag: equipmentTag,
      currentWeight: currentWeight,
      overWeight: overWeight,
      updatedAt: new Date(),
    };

    // Handle vehicle information for VEHICLE and TRUCK types
    if (equipmentTag === "VEHICLE" || equipmentTag === "TRUCK") {
      const make = formData.get("make") as string;
      const model = formData.get("model") as string;
      const year = formData.get("year") as string;
      const licensePlate = formData.get("licensePlate") as string;
      const registrationExpirationStr = formData.get(
        "registrationExpiration"
      ) as string;
      const mileage = parseInt(formData.get("mileage") as string) || 0;

      // Convert registration expiration to ISO string if provided
      let registrationExpiration: Date | null = null;
      if (registrationExpirationStr) {
        registrationExpiration = new Date(registrationExpirationStr);
      }

      const vehicleData = {
        make: make?.trim() || null,
        model: model?.trim() || null,
        year: year?.trim() || null,
        licensePlate: licensePlate?.trim() || null,
        registrationExpiration: registrationExpiration,
        mileage: mileage,
      };

      // Check if vehicle info exists, update or create accordingly
      if (existingEquipment.equipmentVehicleInfo) {
        updateData.equipmentVehicleInfo = {
          update: vehicleData,
        };
      } else {
        updateData.equipmentVehicleInfo = {
          create: vehicleData,
        };
      }
    } else {
      // For non-vehicle equipment, remove vehicle info if it exists
      if (existingEquipment.equipmentVehicleInfo) {
        updateData.equipmentVehicleInfo = {
          delete: true,
        };
      }
    }

    // Perform the update
    const updatedEquipment = await prisma.equipment.update({
      where: { id },
      data: updateData,
      include: {
        equipmentVehicleInfo: true,
      },
    });

    // Revalidate relevant paths and tags
    revalidateTag("equipment");
    revalidateTag("assets");
    revalidatePath("/admins/assets");
    revalidatePath(`/admins/assets/${id}`);

    console.log("Equipment updated successfully:", updatedEquipment.id);
    return {
      success: true,
      data: updatedEquipment,
      message: "Equipment updated successfully",
    };
  } catch (error) {
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
    currentWeight: number;
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
            { address: address?.trim() || "" },
            { city: city?.trim() || "" },
            { state: state?.trim() || "" },
          ],
        },
      });

      if (duplicateJobsite) {
        throw new Error(
          "A jobsite with the same name and location already exists"
        );
      }

      // Update jobsite
      return await prisma.jobsite.update({
        where: { id },
        data: {
          name: name.trim(),
          description: description.trim(),
          address: address?.trim() || "",
          city: city?.trim() || "",
          state: state?.trim() || "",
          zipCode: zipCode?.trim() || "",
          country: country?.trim() || "US",
          comment: comment?.trim() || null,
          isActive: isActive,
          Client: { connect: { id: client } },
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
 * Alternative function for creating jobsite that accepts a structured object
 * Useful for direct TypeScript integration with forms
 */
export async function createJobsiteFromObject(jobsiteData: {
  name: string;
  description: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  country?: string;
  comment?: string;
  isActive?: boolean;
  client?: string;
}) {
  console.log("Creating jobsite from object...");

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
          address: jobsiteData.address?.trim() || "",
          city: jobsiteData.city?.trim() || "",
          state: jobsiteData.state?.trim() || "",
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
          address: jobsiteData.address?.trim() || "",
          city: jobsiteData.city?.trim() || "",
          state: jobsiteData.state?.trim() || "",
          zipCode: jobsiteData.zipCode?.trim() || "",
          country: jobsiteData.country?.trim() || "US",
          comment: jobsiteData.comment?.trim() || null,
          isActive: jobsiteData.isActive ?? true,
          Client: { connect: { id: jobsiteData.client } },
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
export async function createCostCode(costCodeData: {
  cCNumber: string;
  cCName: string;
  isActive: boolean;
}) {
  console.log("Creating new cost code...");

  try {
    // Validate required fields
    if (!costCodeData.cCName?.trim()) {
      throw new Error("Cost code name is required");
    }

    // Check if cost code with the same name already exists
    const existingCostCode = await prisma.costCode.findUnique({
      where: {
        name: `${costCodeData.cCNumber.trim()} ${costCodeData.cCName.trim()}`,
      },
    });

    if (existingCostCode) {
      throw new Error("A cost code with this name already exists");
    }

    // Create the new cost code
    const newCostCode = await prisma.costCode.create({
      data: {
        name: `${costCodeData.cCNumber.trim()} ${costCodeData.cCName.trim()}`,
        isActive: costCodeData.isActive,
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
 * Server action to delete a cost code
 */
export async function deleteTag(id: string) {
  console.log("Deleting Tag with ID:", id);

  try {
    // Delete the cost code
    await prisma.cCTag.delete({
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

/** Layout for server actions 
export async function (formData: FormData) {
  try {
  } catch (error) {
    console.error("Error creating jobsite:", error);
    throw error;
  }
}
*/
