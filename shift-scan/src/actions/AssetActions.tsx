"use server";
import prisma from "@/lib/prisma";
import { revalidatePath, revalidateTag } from "next/cache";
import { EquipmentTags, EquipmentStatus } from "@/lib/types";

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

/**
 * Alternative function that accepts a structured object instead of FormData
 * Useful for direct TypeScript integration
 */
export async function updateEquipmentAssetFromObject(equipmentData: {
  id: string;
  name: string;
  description?: string;
  equipmentTag: string;
  status?: string;
  currentWeight: number;
  overWeight: boolean;
  equipmentVehicleInfo?: {
    make: string | null;
    model: string | null;
    year: string | null;
    licensePlate: string | null;
    registrationExpiration: Date | null;
    mileage: number | null;
  };
}) {
  try {
    const { id, equipmentVehicleInfo, ...basicData } = equipmentData;

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
      ...basicData,
      updatedAt: new Date(),
    };

    // Handle vehicle information
    if (
      equipmentData.equipmentTag === "VEHICLE" ||
      equipmentData.equipmentTag === "TRUCK"
    ) {
      if (equipmentVehicleInfo) {
        if (existingEquipment.equipmentVehicleInfo) {
          updateData.equipmentVehicleInfo = {
            update: equipmentVehicleInfo,
          };
        } else {
          updateData.equipmentVehicleInfo = {
            create: equipmentVehicleInfo,
          };
        }
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
