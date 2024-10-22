"use server";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

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

// Enum for equipment statusOPERATIONAL
enum EquipmentStatus {
  OPERATIONAL = "OPERATIONAL",
  NEEDS_REPAIR = "NEEDS_REPAIR",
}

export async function equipmentTagExists(id: string) {
  try {
    const equipment = await prisma.equipment.findUnique({
      where: {
        id: id,
      },
    });
    return equipment;
  } catch (error) {
    console.error("Error checking if equipment exists:", error);
    throw error;
  }
}

export async function fetchEq(employeeId: string, date: string) {
  const startOfDay = new Date(date);
  startOfDay.setUTCHours(0, 0, 0, 0);

  const endOfDay = new Date(date);
  endOfDay.setUTCHours(23, 59, 59, 999);

  const eqlogs = await prisma.employeeEquipmentLogs.findMany({
    where: {
      employeeId: employeeId,
      startTime: {
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
    const e = formData1.get("qrId") as string;
    const alter = await prisma.equipment.findUnique({
      where: {
        qrId: e,
      },
    });

    console.log(alter);

    await prisma.employeeEquipmentLogs.update({
      where: {
        id: Number(id),
      },
      data: {
        equipmentId: alter?.id,
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

export async function fetchByNameEquipment(name: string) {
  try {
    const equipment = await prisma.equipment.findFirst({
      where: name ? { name } : undefined,
    });
    console.log(equipment);
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

    const equipmentTagValue = formData.get("equipmentTag") as string;
    const equipmentStatusValue = formData.get("equipmentStatus") as string;
    const qrId = formData.get("qrId") as string;
    const image = formData.get("image") as string;
    const equipmentTag = toEnumValue(Tags, equipmentTagValue);
    const equipmentStatus = toEnumValue(EquipmentStatus, equipmentStatusValue);

    if (!equipmentTag || !equipmentStatus) {
      throw new Error("Invalid enum value provided.");
    }

    await prisma.equipment.create({
      data: {
        name: formData.get("name") as string,
        description: formData.get("description") as string,
        qrId: qrId,
        equipmentTag: equipmentTag,
        status: equipmentStatus,
        make: (formData.get("make") as string) || null,
        model: (formData.get("model") as string) || null,
        year: (formData.get("year") as string) || null,
        licensePlate: (formData.get("licensePlate") as string) || null,
        registrationExpiration: formData.get("registrationExpiration")
          ? new Date(formData.get("registrationExpiration") as string)
          : null,
        mileage: formData.get("mileage")
          ? Number(formData.get("mileage"))
          : null,
        image: image || null,
      },
    });
    revalidatePath("/dashboard/qr-generator");
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

export async function deleteEquipmentbyId(formData: FormData) {
  try {
    await prisma.equipment.delete({
      where: { id: formData.get("id") as string },
    });

    revalidatePath("/admin/assets");
    return true;
  } catch (error) {
    console.error("Error deleting equipment:", error);
    throw error;
  }
}

export async function CreateEmployeeEquipmentLog(formData: FormData) {
  try {
    console.log("Creating EmployeeEquipmentLog...");
    console.log(formData);
    const employeeId = formData.get("employeeId") as string;
    const equipmentQrId = formData.get("equipmentId") as string;
    const jobsiteId = formData.get("jobsiteId") as string;

    // Check if the related records exist form of errror handling
    const [employee, equipment, jobsite] = await Promise.all([
      prisma.users.findUnique({ where: { id: employeeId } }),
      prisma.equipment.findUnique({ where: { qrId: equipmentQrId } }),
      prisma.jobsites.findUnique({ where: { qrId: jobsiteId } }),
    ]);

    if (!employee)
      throw new Error(`Employee with id ${employeeId} does not exist`);
    if (!equipment)
      throw new Error(`Equipment with qrId ${equipmentQrId} does not exist`);
    if (!jobsite)
      throw new Error(`Jobsite with id ${jobsiteId} does not exist`);

    const log = await prisma.employeeEquipmentLogs.create({
      data: {
        startTime: formData.get("startTime") as string,
        endTime: formData.get("endTime") as string,
        duration: Number(formData.get("duration") as string) || null,
        comment: formData.get("comment") as string,
        employee: { connect: { id: employeeId } },
        Equipment: { connect: { qrId: equipmentQrId } },
        Job: { connect: { qrId: jobsiteId } },
      },
    });

    revalidatePath("/");
    return log;
  } catch (error) {
    console.error("Error creating employee equipment log:", error);
    throw new Error(`Failed to create employee equipment log: ${error}`);
  }
}

export async function findEquipmentLog(id: number) {
  try {
    const log = await prisma.employeeEquipmentLogs.findUnique({
      where: { id: Number(id) },
    });
    return log;
  } catch (error) {
    console.error("Error finding employee equipment log:", error);
    throw new Error(`Failed to find employee equipment log: ${error}`);
  }
}

export async function updateEmployeeEquipmentLog(formData: FormData) {
  try {
    console.log(formData);
    const id = formData.get("id") as string;
    const duration = formData.get("duration") as string;
    const hours = Number(duration.split(":")[0]);
    const minutes = Number(duration.split(":")[1]);
    const seconds = Number(duration.split(":")[2]);
    const totalHours = hours + minutes / 60 + seconds / 3600;
    const refueled =
      (formData.get("isRefueled") as string) === "true" ? true : false;

    const log = await prisma.employeeEquipmentLogs.update({
      where: { id: Number(id) },
      data: {
        endTime: new Date(formData.get("endTime") as string).toISOString(),
        duration: totalHours,
        comment: formData.get("comment") as string,
        isRefueled: Boolean(refueled),
        fuelUsed: Number(formData.get("fuelUsed") as string),
        isCompleted: true,
      },
    });
    console.log(log);
    revalidatePath("dashboard/equipment/" + id);
    revalidatePath("/dashboard/equipment");
    return log;
  } catch (error) {
    console.error("Error updating employee equipment log:", error);
    throw new Error(`Failed to update employee equipment log: ${error}`);
  }
}
export async function updateEmployeeEquipment(formData: FormData) {
  try {
    console.log(formData);
    const id = formData.get("id") as string;

    await prisma.employeeEquipmentLogs.update({
      where: { id: Number(id) },
      data: {
        isCompleted: true,
      },
    });
  } catch (error) {
    console.error("Error updating employee equipment log:", error);
  }
}

export async function updateEquipment(formData: FormData) {
  try {
    console.log(formData);
    const id = formData.get("id") as string;
    const converted = new Date(
      formData.get("registrationExpiration") as string
    ).toISOString();

    const equipmentTagValue = formData.get("equipmentTag") as string;
    const equipmentStatusValue = formData.get("status") as string;
    const equipmentTag = toEnumValue(Tags, equipmentTagValue);
    const equipmentStatus = toEnumValue(EquipmentStatus, equipmentStatusValue);

    const log = await prisma.equipment.update({
      where: { id: id },
      data: {
        qrId: formData.get("qrId") as string,
        name: formData.get("name") as string,
        description: formData.get("description") as string,
        equipmentTag: equipmentTag || undefined,
        lastInspection: formData.get("lastInspection") as string,
        lastRepair: formData.get("lastRepair") as string,
        status: equipmentStatus || undefined,
        make: formData.get("make") as string,
        model: formData.get("model") as string,
        year: formData.get("year") as string,
        licensePlate: formData.get("licensePlate") as string,
        registrationExpiration: converted || null,
      },
    });
    revalidatePath("/admin/assets");
    console.log(log);
    return log;
  } catch (error) {
    console.error("Error updating employee equipment log:", error);
  }
}
export async function updateEquipmentID(formData: FormData) {
  try {
    console.log(formData);
    const id = formData.get("id") as string;

    await prisma.equipment.update({
      where: { id: id },
      data: {
        qrId: formData.get("qrId") as string,
        name: formData.get("name") as string,
      },
    });
    revalidatePath("/admin/assets");
  } catch (error) {
    console.error("Error updating employee equipment log:", error);
  }
}

export async function Submit(formData: FormData) {
  try {
    const id = formData.get("id") as string;

    const logs = await prisma.employeeEquipmentLogs.updateMany({
      where: {
        employeeId: id,
        isSubmitted: false,
      },
      data: {
        isCompleted: true,
        isSubmitted: true,
      },
    });

    // Revalidate the path to reflect changes
    revalidatePath("/dashboard/equipment");
    return logs;
  } catch (error) {
    console.error("Error updating employee equipment log:", error);
    throw new Error(`Failed to update employee equipment log: ${error}`);
  }
}

export async function DeleteLogs(formData: FormData) {
  try {
    console.log(formData);
    const id = formData.get("id") as string;

    const deletedLog = await prisma.employeeEquipmentLogs.delete({
      where: { id: Number(id) },
    });
    console.log(deletedLog);
    // Revalidate the path to reflect changes
    revalidatePath("/dashboard/equipment");
  } catch (error) {
    console.error("Error updating employee equipment log:", error);
    throw new Error(`Failed to update employee equipment log: ${error}`);
  }
}
