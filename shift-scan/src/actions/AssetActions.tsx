"use server";
import prisma from "@/lib/prisma";
import { revalidatePath, revalidateTag } from "next/cache";
import { EquipmentTags, EquipmentStatus } from "@/lib/types";

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
    const status = formData.get("status") as EquipmentStatus;
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
    const updateData: any = {
      name: name?.trim(),
      description: description?.trim() || "",
      equipmentTag: equipmentTag,
      status: status,
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
    status?: string;
    isActive: boolean;
    inUse: boolean;
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
            status: (equipmentData.status as EquipmentStatus) || "OPERATIONAL",
            isActive: equipmentData.isActive,
            inUse: equipmentData.inUse,
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
            status: (equipmentData.status as EquipmentStatus) || "OPERATIONAL",
            isActive: equipmentData.isActive,
            inUse: equipmentData.inUse,
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
          Client: client?.trim() || null,
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
          Client: jobsiteData.client?.trim() || null,
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

/** Layout for server actions 
export async function (formData: FormData) {
  try {
  } catch (error) {
    console.error("Error creating jobsite:", error);
    throw error;
  }
}
*/
