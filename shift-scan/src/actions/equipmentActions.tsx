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

// Enum for tags
enum Tags {
  TRUCK = "TRUCK",
  TRAILER = "TRAILER",
  EQUIPMENT = "EQUIPMENT",
}

// Enum for equipment status
enum EquipmentStatus {
  OPERATIONAL = "OPERATIONAL",
  NEEDS_REPAIR = "NEEDS_REPAIR",
}

// Get all equipment forms
export async function getEquipmentForms() {
  try {
    const equipmentForms = await prisma.equipment.findMany();
    console.log(equipmentForms);
    return equipmentForms;
  } catch (error) {
    console.error("Error fetching equipment forms:", error);
    throw error;
  }
}

// Get equipment by id
export async function fetchEquipment(id: string) {
  try {
    const equipment = await prisma.equipment.findUnique({
      where: { id },
    });
    return equipment;
  } catch (error) {
    console.error("Error fetching equipment:", error);
    throw error;
  }
}

// Create equipment
export async function createEquipment(formData: FormData) {
  try {
    console.log("Creating equipment...");
    console.log(formData);

    const statusValue = formData.get("status") as string;
    const equipmentTagValue = formData.get("equipment_tag") as string;
    const equipmentStatusValue = formData.get("equipment_status") as string;

    console.log("Status Value:", statusValue);
    console.log("Equipment Tag Value:", equipmentTagValue);
    console.log("Equipment Status Value:", equipmentStatusValue);

    const equipmentTag = toEnumValue(Tags, equipmentTagValue);
    const equipmentStatus = toEnumValue(EquipmentStatus, equipmentStatusValue);

    console.log("Parsed Equipment Tag:", equipmentTag);
    console.log("Parsed Equipment Status:", equipmentStatus);

    if (!equipmentTag || !equipmentStatus) {
      throw new Error("Invalid enum value provided.");
    }

    await prisma.equipment.create({
      data: {
        qr_id: "test-qr-id",
        name: formData.get("name") as string,
        description: formData.get("description") as string,
        equipment_tag: equipmentTag || undefined,
        equipment_status: equipmentStatus || undefined,
        make: (formData.get("make") as string) || null,
        model: (formData.get("model") as string) || null,
        year: (formData.get("year") as string) || null,
        license_plate: (formData.get("license_plate") as string) || null,
        registration_expiration:
          new Date(formData.get("registration_expiration") as string) || null,
        mileage: Number(formData.get("mileage")) || null,
      },
    });
    console.log("Equipment created successfully.");

    // Revalidate the path
    revalidatePath(`/dashboard/qr-generator`);

    // Redirect to the qr-generator page
    redirect(`/dashboard/qr-generator`);
  } catch (error) {
    console.error("Error creating equipment:", error);
    throw error;
  }
}

// Delete equipment by id
export async function deleteEquipment(id: string) {
  try {
    await prisma.equipment.delete({
      where: { id },
    });
    console.log("Equipment deleted successfully.");
  } catch (error) {
    console.error("Error deleting equipment:", error);
    throw error;
  }
}
