"use server";
import prisma from "@/lib/prisma";
import * as Sentry from "@sentry/nextjs";
import { revalidatePath } from "next/cache";
import { Priority, EquipmentTags, EquipmentState } from "@/lib/enums";
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
    Sentry.captureException(error);
    console.error("Error checking if equipment exists:", error);
    throw error;
  }
}

export async function fetchEq(date: string, employeeId: string) {
  const startOfDay = new Date(date);
  startOfDay.setUTCHours(0, 0, 0, 0);

  const endOfDay = new Date(date);
  endOfDay.setUTCHours(23, 59, 59, 999);

  // Find the user's open timesheet for the given day
  const timeSheet = await prisma.timeSheet.findFirst({
    where: {
      userId: employeeId,
      startTime: { lte: endOfDay.toISOString() },
      OR: [
        { endTime: null },
        { endTime: { gte: startOfDay.toISOString() } },
      ],
    },
    select: { id: true },
  });

  if (!timeSheet) return [];

  const eqlogs = await prisma.employeeEquipmentLog.findMany({
    where: {
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
  const filteredEqLogs = eqlogs.filter(
    (log) => log.Equipment !== undefined && log.Equipment !== null
  );

  console.log("\n\n\nEquipment Logs:", filteredEqLogs);
  revalidatePath("/dashboard/myTeam/");
  return filteredEqLogs;
}

export async function updateEq(formData1: FormData) {
  {
    const id = formData1.get("id") as string;
    const e = formData1.get("qrId") as string;
    const alter = await prisma.equipment.findUnique({
      where: {
        qrId: e,
      },
    });

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
    return equipment;
  } catch (error) {
    console.error("Error fetching equipment:", error);
    throw error;
  }
}

// Create equipment
export async function createEquipment(formData: FormData) {
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
    const creationReason = formData.get("creationReasoning") as string;
    const jobsiteId = formData.get("jobsiteLocation") as string;
    const qrId = formData.get("eqCode") as string;
    const createdById = formData.get("createdById") as string;
    const description = "";

    // Validate required fields before starting transaction
    if (!equipmentTag) {
      throw new Error("Please select an equipment tag.");
    }

    const result = await prisma.$transaction(async (prisma) => {
      let newEquipment;
      if (equipmentTag === "EQUIPMENT") {
        newEquipment = await prisma.equipment.create({
          data: {
            qrId,
            name,
            description,
            creationReason,
            equipmentTag,
          },
        });
      } else {
        // Validate vehicle-specific fields
        if (!make || !model || !year || !licensePlate || !mileage) {
          throw new Error("All vehicle fields are required");
        }

        newEquipment = await prisma.equipment.create({
          data: {
            qrId,
            name,
            description,
            creationReason,
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
          },
        });
      }

      return newEquipment;
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

    const equipmentId = formData.get("equipmentId") as string;
    const jobsiteId = formData.get("jobsiteId") as string; // Execute all operations in a transaction
    const result = await prisma.$transaction(async (tx) => {
      const userId = formData.get("userId") as string | null;
      if (userId === null) {
        throw new Error("userId is required");
      }

      const timeSheet = await tx.timeSheet.findFirst({
        where: {
          userId: userId,
          endTime: null,
        },
        select: { id: true, workType: true },
      });

      // pulling current work type from current timesheet
      const workType =
        timeSheet?.workType === "MECHANIC"
          ? "MAINTENANCE"
          : timeSheet?.workType === "TRUCK_DRIVER"
          ? "TRUCKING"
          : timeSheet?.workType === "LABOR"
          ? "LABOR"
          : timeSheet?.workType === "TASCO"
          ? "TASCO"
          : "GENERAL";
      // 3. Create the EmployeeEquipmentLog entry
      if (!timeSheet?.id) {
        throw new Error("No open timesheet found for this user. Cannot create equipment log.");
      }
      const newLog = await tx.employeeEquipmentLog.create({
        data: {
          equipmentId,
          timeSheetId: timeSheet?.id ?? "", // fallback to empty string if undefined
          startTime: new Date().toISOString(),
          endTime: formData.get("endTime")
            ? new Date(formData.get("endTime") as string)
            : null,
          comment: formData.get("comment") as string,
        },
      });

      return newLog;
    });
    return result;
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error creating employee equipment log:", error);
      throw new Error(
        `Failed to create employee equipment log: ${error.message}`
      );
    } else {
      throw error;
    }
  }
}

export async function createMaintenanceRequest(formData: FormData) {
  try {
    const equipmentId = formData.get("equipmentId") as string;
    const equipmentIssue = formData.get("equipmentIssue") as string;
    const additionalInfo = formData.get("additionalInfo") as string;
    const priority = formData.get("priority") as string;
    const createdBy = formData.get("createdBy") as string;

    const maintenance = await prisma.maintenance.create({
      data: {
        equipmentId,
        equipmentIssue,
        additionalInfo,
        priority: priority as Priority,
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
    // Use a transaction to ensure both operations succeed or fail together
    await prisma.$transaction(async (prisma) => {
      // Delete the maintenance record if it exists
      await prisma.maintenance.delete({
        where: { id },
      });
    });
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

    await prisma.$transaction(async (prisma) => {
      const id = formData.get("id") as string;
      const equipmentId = formData.get("equipmentId") as string;
      const startTime = formData.get("startTime") as string;
      const endTime = formData.get("endTime") as string;
      const comment = formData.get("comment") as string;
      const status = formData.get("Equipment.status") as EquipmentState;

      // Maintenance fields
      const equipmentIssue = formData.get("equipmentIssue") as string;
      const additionalInfo = formData.get("additionalInfo") as string;
      let maintenanceId = formData.get("maintenanceId") as string | null;

      // Refuel log fields - handle null values with special "__NULL__" marker
      const disconnectRefuelLog =
        formData.get("disconnectRefuelLog") === "true";
      const refuelLogId = formData.get("refuelLogId") as string | null;
      const gallonsRefueledStr = formData.get("gallonsRefueled") as
        | string
        | null;

      const actualRefuelLogId = refuelLogId === "__NULL__" ? null : refuelLogId;
      const actualGallonsStr =
        gallonsRefueledStr === "__NULL__" ? null : gallonsRefueledStr;
      const gallonsRefueled = actualGallonsStr
        ? Number(actualGallonsStr)
        : null;

      // Prepare RefuelLog data based on form values
      let refuelLogUpdate = {};

      if (disconnectRefuelLog) {
        // Explicitly disconnect refuel log when requested
        refuelLogUpdate = {
          disconnect: true,
        };
      } else if (gallonsRefueled && actualRefuelLogId) {
        // Update existing refuel log
        refuelLogUpdate = {
          update: {
            where: { id: actualRefuelLogId },
            data: { gallonsRefueled },
          },
        };
      } else if (gallonsRefueled) {
        // Create new refuel log
        refuelLogUpdate = {
          create: {
            gallonsRefueled,
          },
        };
      }
      // If no refuel log data provided, don't include any RefuelLog updates

      // --- MAINTENANCE LOGIC ---
      let createdMaintenanceId: string | null = null;
      if (status === "NEEDS_REPAIR" || status === "MAINTENANCE") {
        if (
          (equipmentIssue && equipmentIssue.length > 0) ||
          (additionalInfo && additionalInfo.length > 0)
        ) {
          const maintenanceData = {
            equipmentIssue: equipmentIssue || null,
            additionalInfo: additionalInfo || null,
            priority: Priority.PENDING,
            employeeEquipmentLogId: id,
          };

          if (maintenanceId) {
            // Update existing maintenance request
            await prisma.maintenance.update({
              where: { id: maintenanceId },
              data: maintenanceData,
            });
          } else {
            // Create a new maintenance request and capture its ID
            const newMaintenance = await prisma.maintenance.create({
              data: {
                ...maintenanceData,
                equipmentId,
                createdBy:
                  `${session.user?.name} <${session.user?.lastName}>` ||
                  "Unknown",
              },
            });
            createdMaintenanceId = newMaintenance.id;
            maintenanceId = newMaintenance.id;
          }
        }
      }

      // --- UPDATE EMPLOYEE EQUIPMENT LOG (including maintenanceId if present) ---
      const log = await prisma.employeeEquipmentLog.update({
        where: { id },
        data: {
          startTime,
          endTime: endTime ? endTime : new Date().toISOString(),
          comment,
          ...(Object.keys(refuelLogUpdate).length > 0
            ? { RefuelLog: refuelLogUpdate }
            : {}),
          ...(maintenanceId ? { maintenanceId } : {}),
        },
      });

      // Update equipment status
      if (status) {
        await prisma.equipment.update({
          where: { id: equipmentId },
          data: {
            state: status,
          },
        });
      }

      // Ensure bidirectional link: update Maintenance with employeeEquipmentLogId (if new maintenance was created)
      if (createdMaintenanceId) {
        await prisma.maintenance.update({
          where: { id: createdMaintenanceId },
          data: {
            employeeEquipmentLogId: id,
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
    const equipmentId = formData.get("equipmentId") as string;
    const equipmentStatus = formData.get("equipmentStatus") as string;
    const comment = formData.get("comment") as string;

    if (!equipmentId) {
      throw new Error("Equipment ID is required");
    }

    // Validate that equipmentStatus is a valid EquipmentState value
    const validEquipmentStates = Object.values(EquipmentState);
    const status = validEquipmentStates.includes(
      equipmentStatus as EquipmentState
    )
      ? (equipmentStatus as EquipmentState)
      : EquipmentState.AVAILABLE;

    // Update the equipment with the new status
    await prisma.equipment.update({
      where: { id: equipmentId },
      data: {
        state: status,
      },
    });

    // Also update any associated maintenance records if needed
    const maintenanceIssue = formData.get("maintenanceIssue") as string;
    const maintenanceInfo = formData.get("maintenanceInfo") as string;

    if (
      status === EquipmentState.MAINTENANCE &&
      (maintenanceIssue || maintenanceInfo)
    ) {
      // Check if maintenance exists
      const existingMaintenance = await prisma.maintenance.findFirst({
        where: { equipmentId },
      });

      if (existingMaintenance) {
        // Update existing maintenance
        await prisma.maintenance.update({
          where: { id: existingMaintenance.id },
          data: {
            equipmentIssue: maintenanceIssue || null,
            additionalInfo: maintenanceInfo || null,
          },
        });
      } else {
        // Create new maintenance record
        await prisma.maintenance.create({
          data: {
            equipmentId,
            equipmentIssue: maintenanceIssue || null,
            additionalInfo: maintenanceInfo || null,
            priority: "MEDIUM",
            repaired: false,
          },
        });
      }
    }

    revalidatePath("/dashboard/equipment");
    return { success: true };
  } catch (error) {
    console.error("Error updating equipment:", error);
    throw error;
  }
}
export async function updateEquipmentID(formData: FormData) {
  try {
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
    const userId = formData.get("id") as string;

    // Find all open timesheets for this user
    const openTimeSheets = await prisma.timeSheet.findMany({
      where: { userId, endTime: null },
      select: { id: true },
    });
    const openTimeSheetIds = openTimeSheets.map((ts) => ts.id);

    if (openTimeSheetIds.length === 0) return;

    const logs = await prisma.employeeEquipmentLog.updateMany({
      // Removed isFinished from where and data as it does not exist in schema
      data: {
        // No isFinished field
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
    const id = formData.get("id") as string;

    const deletedLog = await prisma.employeeEquipmentLog.delete({
      where: { id },
    });
    // Revalidate the path to reflect changes
    revalidatePath("/dashboard/equipment");
  } catch (error) {
    console.error("Error updating employee equipment log:", error);
    throw new Error(`Failed to update employee equipment log: ${error}`);
  }
}
export async function updateAllEquipment(formData: FormData) {
  try {
    const id = formData.get("id") as string;
    const equipmentId = formData.get("equipmentId") as string;
    const startTime = formData.get("startTime") as string;
    const endTime = formData.get("endTime") as string;
    const comment = formData.get("comment") as string;
    const equipmentState = formData.get("Equipment.status") as EquipmentState;
    const equipmentIssue = formData.get("equipmentIssue") as string;
    const additionalInfo = formData.get("additionalInfo") as string;

    // Validate equipmentState against EquipmentState enum
    if (
      ![
        "AVAILABLE",
        "IN_USE",
        "MAINTENANCE",
        "NEEDS_REPAIR",
        "RETIRED",
      ].includes(equipmentState)
    ) {
      throw new Error(`Invalid EquipmentState: ${equipmentState}`);
    }

    // Parse maintenanceId if it's passed as a stringified object
    let maintenanceId = null;
    try {
      maintenanceId = JSON.parse(formData.get("maintenanceId") as string);
    } catch (error) {
      console.warn("Failed to parse maintenanceId, using raw value.", error);
      maintenanceId = formData.get("maintenanceId");
    }

    await prisma.$transaction(async (prisma) => {
      // Update the main equipment log
      await prisma.employeeEquipmentLog.update({
        where: { id },
        data: {
          startTime,
          endTime: endTime || new Date().toISOString(),
          comment,
          Equipment: {
            update: {
              state: equipmentState,
            },
          },
        },
      });

      // Optionally create or update a maintenance request
      if (equipmentIssue && additionalInfo) {
        await prisma.maintenance.upsert({
          where: { id: maintenanceId?.id || "" },
          update: {
            equipmentId,
            equipmentIssue,
            additionalInfo,
          },
          create: {
            equipmentId,
            equipmentIssue,
            additionalInfo,
            priority: "LOW", // Default priority
            createdBy: "system", // Replace with actual user ID if available
          },
        });
      }
    });

    revalidatePath(`/dashboard/equipment/${id}`);
    revalidatePath("/dashboard/equipment");
  } catch (error) {
    console.error("Error updating all equipment items:", error);
    throw new Error(`Failed to update all equipment items: ${error}`);
  }
}
