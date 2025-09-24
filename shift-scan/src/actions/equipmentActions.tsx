"use server";
import prisma from "@/lib/prisma";
import * as Sentry from "@sentry/nextjs";
import { revalidatePath } from "next/cache";
import {
  Priority,
  EquipmentTags,
  EquipmentState,
} from "../../prisma/generated/prisma/client";
import { auth } from "@/auth";
import { OwnershipType } from "../../prisma/generated/prisma";

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

// Create equipment
export async function createEquipment(formData: FormData) {
  try {
    const ownershipType = formData.get("ownershipType") as OwnershipType;
    const createdById = formData.get("createdById") as string;
    const equipmentTag = formData.get("equipmentTag") as EquipmentTags;
    const name = formData.get("temporaryEquipmentName") as string;
    const creationReason = formData.get("creationReasoning") as string;
    const destination = formData.get("destination") as string;
    const qrId = formData.get("eqCode") as string;
    const description = "";

    // Validate required fields before starting transaction
    if (!equipmentTag) {
      throw new Error("Please select an equipment tag.");
    }

    const result = await prisma.$transaction(async (prisma) => {
      const newEquipment = await prisma.equipment.create({
        data: {
          qrId,
          name,
          description,
          creationReason,
          equipmentTag,
          createdById,
          ownershipType,
        },
        include: {
          createdBy: {
            select: {
              firstName: true,
              lastName: true,
            },
          },
        },
      });

      if (destination) {
        await prisma.equipmentHauled.create({
          data: {
            equipmentId: newEquipment.id,
            destination,
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
        throw new Error(
          "No open timesheet found for this user. Cannot create equipment log.",
        );
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
        `Failed to create employee equipment log: ${error.message}`,
      );
    } else {
      throw error;
    }
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
