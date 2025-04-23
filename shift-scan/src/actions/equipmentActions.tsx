"use server";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { EquipmentTags, EquipmentStatus } from "@/lib/types";
import { Priority } from "@prisma/client";
import { auth } from "@/auth";

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
  console.log("Creating equipment...");
  console.log(formData);

  try {
    const equipmentTag = formData.get("equipmentTag") as EquipmentTags;
    const make = formData.get("make") as string;
    const model = formData.get("model") as string;
    const year = formData.get("year") as string;
    const licensePlate = formData.get("licensePlate") as string;
    const registrationExpiration = new Date(
      formData.get("registration") as string
    );
    const mileage = Number(formData.get("mileage") as string);
    const name = formData.get("temporaryEquipmentName") as string;
    const comment = formData.get("creationReasoning") as string;
    const jobsiteId = formData.get("jobsiteLocation") as string;
    const qrId = formData.get("eqCode") as string;
    const createdById = formData.get("createdById") as string;
    const description = "";

    // Validate required fields before starting transaction
    if (!equipmentTag) {
      throw new Error("Please select an equipment tag.");
    }

    const result = await prisma.$transaction(async (prisma) => {
      if (equipmentTag === "EQUIPMENT") {
        return await prisma.equipment.create({
          data: {
            qrId,
            name,
            description,
            equipmentTag,
            CreationLogs: {
              create: {
                createdById,
                comment,
                jobsiteId,
              },
            },
          },
        });
      } else {
        // Validate vehicle-specific fields
        if (!make || !model || !year || !licensePlate || !mileage) {
          throw new Error("All vehicle fields are required");
        }

        return await prisma.equipment.create({
          data: {
            qrId,
            name,
            description,
            equipmentVehicleInfo: {
              create: {
                make,
                model,
                year,
                licensePlate,
                registrationExpiration,
                mileage,
              },
            },
            equipmentTag,
            CreationLogs: {
              create: {
                createdById,
                comment,
                jobsiteId,
              },
            },
          },
        });
      }
    });

    revalidatePath("/dashboard/qr-generator");
    return { success: true, data: result };
  } catch (error) {
    console.error("Error creating equipment:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "An unknown error occurred",
    };
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

    // Execute all operations in a transaction
    const result = await prisma.$transaction(async (tx) => {
      // 1. Check if related records exist
      const [employee, equipment, jobsite] = await Promise.all([
        tx.user.findUnique({ where: { id: employeeId } }),
        tx.equipment.findUnique({ where: { qrId: equipmentQRId } }),
        tx.jobsite.findUnique({ where: { qrId: jobsiteId } }),
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

      // 2. Find the timesheet
      const timeSheetId = await tx.timeSheet.findFirst({
        where: { userId: employeeId, endTime: null },
        select: { id: true },
      });

      // 3. Create the EmployeeEquipmentLog entry
      const newLog = await tx.employeeEquipmentLog.create({
        data: {
          employeeId,
          equipmentId: equipment.id,
          timeSheetId: timeSheetId?.id,
          jobsiteId,
          startTime: formData.get("startTime")
            ? new Date(formData.get("startTime") as string)
            : null,
          endTime: formData.get("endTime")
            ? new Date(formData.get("endTime") as string)
            : null,
          comment: formData.get("comment") as string,
          isFinished: false,
          status: "PENDING",
        },
      });

      return newLog;
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

export async function createMaintenanceRequest(formData: FormData) {
  try {
    const equipmentId = formData.get("equipmentId") as string;
    const equipmentIssue = formData.get("equipmentIssue") as string;
    const additionalInfo = formData.get("additionalInfo") as string;
    const priority = formData.get("priority") as Priority;
    const createdBy = formData.get("createdBy") as string;

    const maintenance = await prisma.maintenance.create({
      data: {
        equipmentId,
        equipmentIssue,
        additionalInfo,
        priority,
        createdBy,
      },
    });

    revalidatePath(`/dashboard/equipment/${equipmentId}`);
    return maintenance;
  } catch (error) {
    console.error("Error creating maintenance request:", error);
    throw new Error(`Failed to create maintenance request: ${error}`);
  }
}

export async function deleteEmployeeEquipmentLog(id: string) {
  try {
    console.log("Deleting employee equipment log:", id);
    await prisma.employeeEquipmentLog.delete({
      where: { id },
    });
    return true;
  } catch (error) {
    console.error("Error deleting employee equipment log:", error);
    throw error;
  }
}

export async function deleteMaintenanceInEquipment(id: string) {
  try {
    // First find the log to get the maintenanceId
    const log = await prisma.employeeEquipmentLog.findUnique({
      where: { id },
      include: { MaintenanceId: true },
    });

    if (!log) {
      throw new Error("Equipment log not found");
    }

    // Use a transaction to ensure both operations succeed or fail together
    await prisma.$transaction([
      // Delete the maintenance record if it exists
      ...(log.MaintenanceId
        ? [
            prisma.maintenance.delete({
              where: { id: log.MaintenanceId.id },
            }),
          ]
        : []),

      // Update the equipment log to remove the maintenance reference
      prisma.employeeEquipmentLog.update({
        where: { id },
        data: {
          isFinished: true,
          MaintenanceId: { disconnect: true }, // Proper way to remove relation
        },
      }),

      // Also update the equipment status to OPERATIONAL
      prisma.equipment.update({
        where: { id: log.equipmentId },
        data: { status: "OPERATIONAL" },
      }),
    ]);

    return true;
  } catch (error) {
    console.error("Error deleting maintenance:", error);
    throw error; // Re-throw to handle in calling function
  }
}

export async function updateEmployeeEquipmentLog(formData: FormData) {
  try {
    const session = await auth();
    if (!session) {
      throw new Error("Unauthorized user");
    }
    console.log("Update EmployeeEquipmentLog:", formData);

    await prisma.$transaction(async (prisma) => {
      const id = formData.get("id") as string;
      const equipmentId = formData.get("equipmentId") as string;
      const startTime = formData.get("startTime") as string;
      const endTime = formData.get("endTime") as string;
      const comment = formData.get("comment") as string;
      const status = formData.get("Equipment.status") as EquipmentStatus;
      const equipmentIssue = formData.get("equipmentIssue") as string;
      const additionalInfo = formData.get("additionalInfo") as string;

      // Update the employee equipment log
      const log = await prisma.employeeEquipmentLog.update({
        where: { id },
        data: {
          startTime,
          endTime: endTime ? endTime : new Date().toISOString(),
          comment,
          isFinished: true,
        },
      });

      // Update the status of the equipment using the correct equipmentId
      await prisma.equipment.update({
        where: { id: equipmentId },
        data: {
          status,
        },
      });

      // Create a new maintenance request if the equipment is not operational
      if (status !== "OPERATIONAL") {
        await prisma.maintenance.create({
          data: {
            equipmentId: equipmentId, // Use equipmentId here, not the log ID
            employeeEquipmentLogId: log.id,
            equipmentIssue,
            additionalInfo,
            priority: "PENDING",
            createdBy: `${session.user.firstName} ${session.user.lastName}`,
          },
        });
      }

      revalidatePath(`/dashboard/equipment/${id}`);
      revalidatePath("/dashboard/equipment");
    });
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
        status: equipmentStatus || undefined,
        equipmentVehicleInfo: {
          update: {
            make: formData.get("make") as string,
            model: formData.get("model") as string,
            year: formData.get("year") as string,
            licensePlate: formData.get("licensePlate") as string,
            registrationExpiration: converted || null,
            mileage: Number(formData.get("mileage") as string),
          },
        },
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
