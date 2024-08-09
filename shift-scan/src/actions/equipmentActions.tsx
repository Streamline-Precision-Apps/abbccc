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

export async function fetchEq(employeeId: string, date: string) {
  const startOfDay = new Date(date);
  startOfDay.setUTCHours(0, 0, 0, 0);

  const endOfDay = new Date(date);
  endOfDay.setUTCHours(23, 59, 59, 999);

  const eqlogs = await prisma.employeeEquipmentLog.findMany({
    where: {
      employee_id: employeeId,
      start_time: {
        gte: startOfDay.toISOString(),
        lte: endOfDay.toISOString(),
      },
    },
    include: {
      Equipment: true,
    },
  });

  // Ensure no null values are present
  const filteredEqLogs = eqlogs.filter((log) => log.Equipment !== null);

  console.log("\n\n\nEquipment Logs:", filteredEqLogs);
  revalidatePath("/dashboard/myTeam/" + employeeId);
  return filteredEqLogs;
}

export async function updateEq(formData1: FormData) {
  {
    console.log(formData1);
    const id = formData1.get("id") as string;
    const e = formData1.get("qr_id") as string;
    const alter = await prisma.equipment.findUnique({
      where: {
        qr_id: e,
      },
    });

    console.log(alter);

    const log = await prisma.employeeEquipmentLog.update({
      where: {
        id: Number(id),
      },
      data: {
        equipment_id: alter?.id,
        duration: Number(formData1.get("duration") as string),
      },
    });
  }
  revalidatePath("/dashboard/myTeam/" + formData1.get("employeeId"));
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
    console.log("Form Data:", Object.fromEntries(formData.entries())); // Log all form data

    const statusValue = formData.get("status") as string;
    const equipmentTagValue = formData.get("equipment_tag") as string;
    const equipmentStatusValue = formData.get("equipment_status") as string;
    const image = formData.get("image") as string;

    console.log("Image Base64 String:", image); // Log the image base64 string

    const equipmentTag = toEnumValue(Tags, equipmentTagValue);
    const equipmentStatus = toEnumValue(EquipmentStatus, equipmentStatusValue);

    if (!equipmentTag || !equipmentStatus) {
      throw new Error("Invalid enum value provided.");
    }

    await prisma.equipment.create({
      data: {
        name: formData.get("name") as string,
        description: formData.get("description") as string,
        equipment_tag: equipmentTag,
        equipment_status: equipmentStatus,
        make: (formData.get("make") as string) || null,
        model: (formData.get("model") as string) || null,
        year: (formData.get("year") as string) || null,
        license_plate: (formData.get("license_plate") as string) || null,
        registration_expiration: formData.get("registration_expiration")
          ? new Date(formData.get("registration_expiration") as string)
          : null,
        mileage: formData.get("mileage")
          ? Number(formData.get("mileage"))
          : null,
        image: image || null,
      },
    });

    revalidatePath("/dashboard/qr-generator");
    redirect("/dashboard/qr-generator");
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

export async function CreateEmployeeEquipmentLog(formData: FormData) {
  try {
    console.log("Creating EmployeeEquipmentLog...");
    console.log(formData);
    const employeeId = formData.get("employee_id") as string;
    const equipmentQrId = formData.get("equipment_id") as string;
    const jobsiteId = formData.get("jobsite_id") as string;

    // Check if the related records exist form of errror handling
    const [employee, equipment, jobsite] = await Promise.all([
      prisma.user.findUnique({ where: { id: employeeId } }),
      prisma.equipment.findUnique({ where: { qr_id: equipmentQrId } }),
      prisma.jobsite.findUnique({ where: { jobsite_id: jobsiteId } }),
    ]);

    if (!employee)
      throw new Error(`Employee with id ${employeeId} does not exist`);
    if (!equipment)
      throw new Error(`Equipment with qr_id ${equipmentQrId} does not exist`);
    if (!jobsite)
      throw new Error(`Jobsite with id ${jobsiteId} does not exist`);

    const log = await prisma.employeeEquipmentLog.create({
      data: {
        start_time: formData.get("start_time") as string,
        end_time: formData.get("end_time") as string,
        duration: Number(formData.get("duration") as string) || null,
        equipment_notes: formData.get("equipment_notes") as string,
        employee: { connect: { id: employeeId } },
        Equipment: { connect: { qr_id: equipmentQrId } },
        Job: { connect: { jobsite_id: jobsiteId } },
      },
    });

    revalidatePath("/");
    return log;
  } catch (error: any) {
    console.error("Error creating employee equipment log:", error);
    throw new Error(
      `Failed to create employee equipment log: ${error.message}`
    );
  }
}

export async function updateEmployeeEquipmentLog(formData: FormData) {
  try {
    console.log(formData);
    const id = formData.get("id") as string;

    const log = await prisma.employeeEquipmentLog.update({
      where: { id: Number(id) },
      data: {
        end_time: new Date(formData.get("end_time") as string).toISOString(),
        duration: Number(formData.get("duration") as string),
        equipment_notes: formData.get("equipment_notes") as string,
        completed: true,
      },
    });

    revalidatePath("/");
    return log;
  } catch (error: any) {
    console.error("Error updating employee equipment log:", error);
    throw new Error(
      `Failed to update employee equipment log: ${error.message}`
    );
  }
}
export async function updateEmployeeEquipment(formData: FormData) {
  try {
    console.log(formData);
    const id = formData.get("id") as string;

    const log = await prisma.employeeEquipmentLog.update({
      where: { id: Number(id) },
      data: {
        completed: true,
      },
    });
  } catch (error: any) {
    console.error("Error updating employee equipment log:", error);
  }
}

export async function Submit(formData: FormData) {
  try {
    const id = formData.get("id") as string;

    const logs = await prisma.employeeEquipmentLog.updateMany({
      where: {
        employee_id: id,
        submitted: false,
      },
      data: {
        completed: true,
        submitted: true,
      },
    });

    // Revalidate the path to reflect changes
    revalidatePath("/dashboard/equipment/current");
    return logs;
  } catch (error: any) {
    console.error("Error updating employee equipment log:", error);
    throw new Error(
      `Failed to update employee equipment log: ${error.message}`
    );
  }
}

export async function DeleteLogs(formData: FormData) {
  try {
    console.log(formData);
    const id = formData.get("id") as string;

    const deletedLog = await prisma.employeeEquipmentLog.delete({
      where: { id: Number(id) },
    });
    console.log(deletedLog);
    // Revalidate the path to reflect changes
    revalidatePath("/dashboard/equipment/current");
  } catch (error: any) {
    console.error("Error updating employee equipment log:", error);
    throw new Error(
      `Failed to update employee equipment log: ${error.message}`
    );
  }
}
