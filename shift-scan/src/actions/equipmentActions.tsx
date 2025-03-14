"use server";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { EquipmentTags, EquipmentStatus } from "@/lib/types";
import { form } from "@nextui-org/theme";
import { start } from "repl";

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

  const eqlogs = await prisma.employeeEquipmentLog.findMany({
    where: {
      employeeId: employeeId,
      startTime: {
        gte: startOfDay.toISOString(),
        lte: endOfDay.toISOString(),
      },
    },
    include: {
      equipment: true,
    },
  });

  // Ensure no null values are present
  const filteredEqLogs = eqlogs.filter((log) => log.equipment !== null);

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

    await prisma.employeeEquipmentLog.update({
      where: {
        id,
      },
      data: {
        equipmentId: alter?.id,
        startTime: formData1.get("startTime") as string,
        endTime: formData1.get("endTime") as string,
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
    // Log form data values for debugging
    console.log({
      equipmentTag: formData.get("equipmentTag"),
      status: formData.get("equipmentStatus"),
    });

    // Retrieve form data
    const name = formData.get("name") as string;
    const description = formData.get("description") as string;
    const equipmentTagSubmission = formData.get("equipmentTag") as string;
    const statusSubmission = formData.get("equipmentStatus") as string;
    let equipmentTag: EquipmentTags;
    let EQstatus: EquipmentStatus;

    // Update validation to include EQUIPMENT
    if (equipmentTagSubmission.toUpperCase() === "TRUCK")
      equipmentTag = "TRUCK";
    else if (equipmentTagSubmission.toUpperCase() === "TRAILER")
      equipmentTag = "TRAILER";
    else if (equipmentTagSubmission.toUpperCase() === "EQUIPMENT")
      // Changed from VEHICLE to EQUIPMENT
      equipmentTag = "EQUIPMENT";
    else throw new Error("Invalid enum value provided for equipmentTag.");

    // Status validation remains the same
    if (statusSubmission.toUpperCase() === "OPERATIONAL")
      EQstatus = "OPERATIONAL";
    else if (statusSubmission.toUpperCase() === "NEEDS_REPAIR")
      EQstatus = "NEEDS_REPAIR";
    else if (statusSubmission.toUpperCase() === "NEEDS_MAINTENANCE")
      EQstatus = "NEEDS_MAINTENANCE";
    else throw new Error("Invalid enum value provided for status.");

    const qrId = formData.get("qrId") as string;
    const jobsiteLocation = formData.get("jobsiteLocation") as string;
    // form data for trucks, trailers, and vehicles
    const make = formData.get("make") as string;
    const model = formData.get("model") as string;
    const year = formData.get("year") as string;
    const licensePlate = formData.get("licensePlate") as string;
    const registrationExpiration = formData.get("registrationExpiration")
      ? new Date(formData.get("registrationExpiration") as string)
      : null;
    const mileage = formData.get("mileage")
      ? Number(formData.get("mileage"))
      : null;

    if (!equipmentTag || !EQstatus) {
      throw new Error("Invalid enum value provided.");
    }

    await prisma.equipment.create({
      data: {
        name,
        description,
        qrId,
        equipmentTag: equipmentTag,
        status: EQstatus,
        make: make || null,
        model: model || null,
        year: year || null,
        licensePlate: licensePlate || null,
        registrationExpiration: registrationExpiration || null,
        mileage: mileage || null,
      },
    });
    revalidatePath("/dashboard/qr-generator");
    console.log("Equipment created successfully.");
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
    const equipmentQRId = formData.get("equipmentId") as string;
    const jobsiteId = formData.get("jobsiteId") as string;

    // Check if the related records exist
    const [employee, equipment, jobsite] = await Promise.all([
      prisma.user.findUnique({ where: { id: employeeId } }),
      prisma.equipment.findUnique({ where: { qrId: equipmentQRId } }),
      prisma.jobsite.findUnique({ where: { qrId: jobsiteId } }),
    ]);

    if (!employee) {
      throw new Error(`Employee with id ${employeeId} does not exist`);
    }
    if (!equipment) {
      throw new Error(`Equipment with id ${equipmentQRId} does not exist`);
    }
    if (!jobsite) {
      throw new Error(`Jobsite with id ${jobsiteId} does not exist`);
    }

    // Create the EmployeeEquipmentLog entry
    await prisma.employeeEquipmentLog.create({
      data: {
        employeeId,
        equipmentId: equipment.id,

        jobsiteId,
        startTime: formData.get("startTime")
          ? new Date(formData.get("startTime") as string)
          : null,
        endTime: formData.get("endTime")
          ? new Date(formData.get("endTime") as string)
          : null,
        comment: formData.get("comment") as string,
        isFinished: false, // default to false as per schema
        status: "PENDING", // default status
      },
    });

    // Revalidate the path to update any dependent front-end views
    revalidatePath("/");

    return true;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Error creating employee equipment log:", error);
      throw new Error(
        `Failed to create employee equipment log: ${error.message}`
      );
    } else {
      console.error("An unknown error occurred:", error);
      throw error;
    }
  }
}

export async function updateEmployeeEquipmentLog(formData: FormData) {
  try {
    console.log(formData);
    const id = formData.get("id") as string;
    const startTime = formData.get("startTime") as string;
    const endTime = formData.get("endTime") as string;
    const comment = formData.get("comment") as string;

    // Update the employee equipment log
    const log = await prisma.employeeEquipmentLog.update({
      where: { id },
      data: {
        startTime,
        endTime: endTime ? endTime : new Date().toISOString(),
        comment,
        isFinished: true,
        equipment: {
          update: {
            status: formData.get("Equipment.status") as EquipmentStatus,
          },
        },
      },
    });

    console.log(log);
    revalidatePath("dashboard/equipment/" + id);
    revalidatePath("/dashboard/equipment");
  } catch (error) {
    console.error("Error updating employee equipment log:", error);
    throw new Error(`Failed to update employee equipment log: ${error}`);
  }
}

export async function updateEquipment(formData: FormData) {
  try {
    console.log("server action recieved formData:", formData);
    const id = formData.get("id") as string;
    const converted = new Date(
      formData.get("registrationExpiration") as string
    ).toISOString();

    const equipmentTag = formData.get("equipmentTag") as EquipmentTags;
    const equipmentStatus = formData.get("status") as EquipmentStatus;

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
        mileage: Number(formData.get("mileage") as string),
      },
    });
    revalidatePath("/admin/assets");
    console.log(log);
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

export async function UpdateSubmit(formData: FormData) {
  try {
    console.log("Sever action formData: ", formData);
    const id = formData.get("id") as string;

    const logs = await prisma.employeeEquipmentLog.updateMany({
      where: {
        employeeId: id,
        isFinished: false,
      },
      data: {
        isFinished: true,
      },
    });

    // Revalidate the path to reflect changes
    revalidatePath("/dashboard/equipment");
  } catch (error) {
    console.error("Error updating employee equipment log:", error);
    throw new Error(`Failed to update employee equipment log: ${error}`);
  }
}

export async function DeleteLogs(formData: FormData) {
  try {
    console.log(formData);
    const id = formData.get("id") as string;

    const deletedLog = await prisma.employeeEquipmentLog.delete({
      where: { id },
    });
    console.log(deletedLog);
    // Revalidate the path to reflect changes
    revalidatePath("/dashboard/equipment");
  } catch (error) {
    console.error("Error updating employee equipment log:", error);
    throw new Error(`Failed to update employee equipment log: ${error}`);
  }
}
