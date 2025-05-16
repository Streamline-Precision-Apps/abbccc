"use server";

import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import {
  TimesheetUpdate,
  TruckingEquipmentHaulUpdate,
  TruckingMileageUpdate,
} from "@/lib/types";
import { WorkType } from "@prisma/client";
import { error } from "console";
import { revalidatePath } from "next/cache";
import { formatInTimeZone } from "date-fns-tz";
const { formatISO } = require("date-fns");

export async function updateTimesheetHighlights(
  updatedTimesheets: TimesheetUpdate[]
) {
  try {
    console.log("[SERVER] Updating timesheets:", updatedTimesheets);
    const session = await auth();
    if (!session) throw new Error("Unauthorized");

    const updatePromises = updatedTimesheets.map((timesheet) =>
      prisma.timeSheet.update({
        where: { id: timesheet.id },
        data: {
          startTime: timesheet.startTime
            ? new Date(timesheet.startTime)
            : undefined,
          endTime: timesheet.endTime ? new Date(timesheet.endTime) : null,
          jobsiteId: timesheet.jobsiteId,
          costcode: timesheet.costcode,
          editedByUserId: session.user.id,
          updatedAt: new Date(),
        },
      })
    );

    await Promise.all(updatePromises);
    console.log("Successfully updated timesheets:", updatedTimesheets);
    // Aggressive revalidation
    revalidatePath("/dashboard/myTeam");
    revalidatePath("/dashboard/myTeam/[id]/employee/[employeeId]", "page");

    return { success: true };
  } catch (error) {
    console.error("Error updating timesheets:", error);
    throw error;
  }
}

export async function updateTruckingMileage(
  data: FormData | TruckingMileageUpdate[]
): Promise<{ success: boolean; updatedCount?: number; error?: string }> {
  try {
    console.log("[SERVER] Updating trucking mileage:", data);
    const session = await auth();

    if (!session) {
      console.error("[SERVER] Unauthorized attempt to update mileage");
      throw new Error("Unauthorized");
    }

    // Handle both FormData and direct array input
    let mileageUpdates: TruckingMileageUpdate[];
    if (data instanceof FormData) {
      // Get all entries that start with 'changes'
      const changesEntries = Array.from(data.entries())
        .filter(([key]) => key.startsWith("changes"))
        .map(([, value]) => value as string);

      if (changesEntries.length === 0) {
        throw new Error("No changes data found in FormData");
      }

      // Parse each entry and combine into an array
      mileageUpdates = changesEntries.flatMap((entry) => JSON.parse(entry));
    } else {
      // Direct array input
      mileageUpdates = data;
    }

    // Rest of your code remains the same...
    // Validate the updates
    if (!Array.isArray(mileageUpdates)) {
      throw new Error("Invalid mileage updates format");
    }

    const updatePromises = mileageUpdates.map((mileage) => {
      if (!mileage.id) {
        console.error("[SERVER] Missing ID in mileage update:", mileage);
        throw new Error(
          `Missing ID in mileage update: ${JSON.stringify(mileage)}`
        );
      }

      // Validate numbers
      if (
        mileage.startingMileage !== undefined &&
        isNaN(Number(mileage.startingMileage))
      ) {
        throw new Error(`Invalid startingMileage: ${mileage.startingMileage}`);
      }
      if (
        mileage.endingMileage !== undefined &&
        isNaN(Number(mileage.endingMileage))
      ) {
        throw new Error(`Invalid endingMileage: ${mileage.endingMileage}`);
      }

      return prisma.truckingLog.update({
        where: { id: mileage.id },
        data: {
          startingMileage:
            mileage.startingMileage !== undefined
              ? Number(mileage.startingMileage)
              : undefined,
          endingMileage:
            mileage.endingMileage !== undefined
              ? Number(mileage.endingMileage)
              : undefined,
        },
      });
    });

    const results = await Promise.all(updatePromises);
    console.log("[SERVER] Successfully updated", results.length, "records");

    revalidatePath("/dashboard/myTeam");
    revalidatePath("/dashboard/myTeam/[id]/employee/[employeeId]", "page");

    return {
      success: true,
      updatedCount: results.length,
    };
  } catch (error) {
    console.error("[SERVER] Error updating trucking mileage:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

export async function updateTruckingHaulLogs(
  updates: TruckingEquipmentHaulUpdate[]
): Promise<{ success: boolean; updatedCount?: number; error?: string }> {
  try {
    console.log("[SERVER] Received haul log updates:", updates);
    const session = await auth();

    if (!session) {
      console.error("[SERVER] Unauthorized attempt to update haul logs");
      return { success: false, error: "Unauthorized" };
    }

    // Validate and deduplicate updates
    const validUpdates = updates
      .filter((update) => {
        if (!update.id) {
          console.warn("[SERVER] Skipping update with missing ID:", update);
          return false;
        }
        return true;
      })
      .filter(
        (update, index, self) =>
          self.findIndex((u) => u.id === update.id) === index
      );

    if (validUpdates.length === 0) {
      return { success: false, error: "No valid updates provided" };
    }

    console.log("[SERVER] Processing updates for:", validUpdates);

    // Start a transaction
    const result = await prisma.$transaction(async (tx) => {
      const updateResults = await Promise.all(
        validUpdates.map(async (update) => {
          try {
            return await tx.equipmentHauled.update({
              where: { id: update.id },
              data: {
                equipmentId: update.equipmentId || null,
                jobSiteId: update.jobSiteId || null,
              },
            });
          } catch (error) {
            console.error(
              `[SERVER] Failed to update haul log ${update.id}:`,
              error
            );
            throw error;
          }
        })
      );

      return updateResults;
    });

    console.log("[SERVER] Successfully updated", result.length, "haul logs");

    // Revalidate affected paths
    revalidatePath("/dashboard/myTeam");
    revalidatePath("/dashboard/myTeam/[id]/employee/[employeeId]", "page");

    return {
      success: true,
      updatedCount: result.length,
    };
  } catch (error) {
    console.error("[SERVER] Error updating trucking haul logs:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

export async function updateTruckingMaterialLogs(
  updates: {
    id: string;
    name?: string;
    LocationOfMaterial?: string;
    materialWeight?: number | null;
    lightWeight?: number | null;
    grossWeight?: number | null;
  }[]
): Promise<{ success: boolean; updatedCount?: number; error?: string }> {
  try {
    console.log("[SERVER] Updating trucking material logs:", updates);
    const session = await auth();
    if (!session) throw new Error("Unauthorized");

    const result = await prisma.$transaction(async (tx) => {
      const updatePromises = updates.map((update) =>
        tx.material.update({
          where: { id: update.id },
          data: {
            name: update.name,
            LocationOfMaterial: update.LocationOfMaterial,
            materialWeight: update.materialWeight,
            lightWeight: update.lightWeight,
            grossWeight: update.grossWeight,
          },
        })
      );

      return await Promise.all(updatePromises);
    });

    console.log(
      "[SERVER] Successfully updated",
      result.length,
      "material logs"
    );

    revalidatePath("/dashboard/myTeam");
    revalidatePath("/dashboard/myTeam/[id]/employee/[employeeId]", "page");

    return {
      success: true,
      updatedCount: result.length,
    };
  } catch (error) {
    console.error("Error updating trucking material logs:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

// For TimeCardTruckingRefuelLogs
export async function updateTruckingRefuelLogs(
  updates: {
    id: string;
    gallonsRefueled?: number | null;
    milesAtFueling?: number | null;
  }[]
): Promise<{ success: boolean; updatedCount?: number; error?: string }> {
  try {
    console.log("[SERVER] Updating trucking refuel logs:", updates);
    const session = await auth();
    if (!session) throw new Error("Unauthorized");

    const result = await prisma.$transaction(async (tx) => {
      const updatePromises = updates.map((update) =>
        tx.refuelLog.update({
          where: { id: update.id },
          data: {
            gallonsRefueled: update.gallonsRefueled,
            milesAtFueling: update.milesAtFueling,
          },
        })
      );

      return await Promise.all(updatePromises);
    });

    console.log("[SERVER] Successfully updated", result.length, "refuel logs");

    revalidatePath("/dashboard/myTeam");
    revalidatePath("/dashboard/myTeam/[id]/employee/[employeeId]", "page");

    return {
      success: true,
      updatedCount: result.length,
    };
  } catch (error) {
    console.error("Error updating trucking refuel logs:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

// For TimeCardTruckingStateMileageLogs
export async function updateTruckingStateLogs(
  updates: {
    id: string;
    state?: string;
    stateLineMileage?: number;
  }[]
): Promise<{ success: boolean; updatedCount?: number; error?: string }> {
  try {
    console.log("[SERVER] Updating trucking state logs:", updates);
    const session = await auth();
    if (!session) throw new Error("Unauthorized");

    const result = await prisma.$transaction(async (tx) => {
      const updatePromises = updates.map((update) =>
        tx.stateMileage.update({
          where: { id: update.id },
          data: {
            state: update.state,
            stateLineMileage: update.stateLineMileage,
          },
        })
      );

      return await Promise.all(updatePromises);
    });

    console.log(
      "[SERVER] Successfully updated",
      result.length,
      "trucking state logs"
    );

    revalidatePath("/dashboard/myTeam");
    revalidatePath("/dashboard/myTeam/[id]/employee/[employeeId]", "page");

    return {
      success: true,
      updatedCount: result.length,
    };
  } catch (error) {
    console.error("Error updating trucking state logs:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

// For TimeCardTascoHaulLogs
export async function updateTascoHaulLogs(
  updates: {
    id: string;
    shiftType?: string;
    equipmentId?: string | null;
    materialType?: string;
    LoadQuantity?: number | null;
  }[]
): Promise<{ success: boolean; updatedCount?: number; error?: string }> {
  try {
    console.log("[SERVER] Updating tasco haul logs:", updates);
    const session = await auth();
    if (!session) throw new Error("Unauthorized");

    const result = await prisma.$transaction(async (tx) => {
      const updatePromises = updates.map((update) =>
        tx.tascoLog.update({
          where: { id: update.id },
          data: {
            shiftType: update.shiftType,
            equipmentId: update.equipmentId,
            materialType: update.materialType,
            LoadQuantity: update.LoadQuantity || 0,
          },
        })
      );

      return await Promise.all(updatePromises);
    });

    console.log(
      "[SERVER] Successfully updated",
      result.length,
      "tasco haul logs"
    );

    revalidatePath("/dashboard/myTeam");
    revalidatePath("/dashboard/myTeam/[id]/employee/[employeeId]", "page");

    return {
      success: true,
      updatedCount: result.length,
    };
  } catch (error) {
    console.error("Error updating tasco haul logs:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

// For TimeCardTascoRefuelLogs
export async function updateTascoRefuelLogs(
  updates: {
    id: string;
    gallonsRefueled?: number | null;
  }[]
): Promise<{ success: boolean; updatedCount?: number; error?: string }> {
  try {
    console.log("[SERVER] Updating tasco refuel logs:", updates);
    const session = await auth();
    if (!session) throw new Error("Unauthorized");

    const result = await prisma.$transaction(async (tx) => {
      const updatePromises = updates.map((update) =>
        tx.refuelLog.update({
          where: { id: update.id },
          data: {
            gallonsRefueled: update.gallonsRefueled,
          },
        })
      );

      return await Promise.all(updatePromises);
    });

    console.log("[SERVER] Updated tasco refuel logs:", result);

    revalidatePath("/dashboard/myTeam");
    revalidatePath("/dashboard/myTeam/[id]/employee/[employeeId]", "page");

    return {
      success: true,
      updatedCount: result.length,
    };
  } catch (error) {
    console.error("Error updating tasco refuel logs:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

// For TimeCardEquipmentLogs
export async function updateEquipmentLogs(
  updates: {
    id: string;
    startTime?: Date;
    endTime?: Date;
  }[]
): Promise<{ success: boolean; updatedCount?: number; error?: string }> {
  try {
    console.log("[SERVER] Updating equipment logs:", updates);
    const session = await auth();
    if (!session) throw new Error("Unauthorized");

    const result = await prisma.$transaction(async (tx) => {
      const updatePromises = updates.map((update) =>
        tx.employeeEquipmentLog.update({
          where: { id: update.id },
          data: {
            startTime: update.startTime,
            endTime: update.endTime,
          },
        })
      );

      return await Promise.all(updatePromises);
    });

    console.log(
      "[SERVER] Successfully updated",
      result.length,
      "equipment logs"
    );

    revalidatePath("/dashboard/myTeam");
    revalidatePath("/dashboard/myTeam/[id]/employee/[employeeId]", "page");

    return {
      success: true,
      updatedCount: result.length,
    };
  } catch (error) {
    console.error("Error updating equipment logs:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

// For TimeCardEquipmentRefuelLogs
export async function updateEquipmentRefuelLogs(
  updates: {
    id: string;
    gallonsRefueled?: number | null;
  }[]
): Promise<{ success: boolean; updatedCount?: number; error?: string }> {
  try {
    console.log("[SERVER] Updating equipment refuel logs:", updates);
    const session = await auth();
    if (!session) throw new Error("Unauthorized");

    const result = await prisma.$transaction(async (tx) => {
      const updatePromises = updates.map((update) =>
        tx.refuelLog.update({
          where: { id: update.id },
          data: {
            gallonsRefueled: update.gallonsRefueled || 0,
          },
        })
      );

      return await Promise.all(updatePromises);
    });

    console.log("[SERVER] Updated equipment refuel logs:", result);

    revalidatePath("/dashboard/myTeam");
    revalidatePath("/dashboard/myTeam/[id]/employee/[employeeId]", "page");

    return {
      success: true,
      updatedCount: result.length,
    };
  } catch (error) {
    console.error("Error updating equipment logs:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}
