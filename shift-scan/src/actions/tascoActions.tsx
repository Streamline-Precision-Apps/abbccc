"use server";
import prisma from "@/lib/prisma";
import { revalidatePath, revalidateTag } from "next/cache";
import {
  RefuelLogType,
  CreateRefuelLogParams,
  UpdateRefuelLogParams,
  DeleteRefuelLogParams
} from "@/lib/types";

/* LOADS Hauled */
//------------------------------------------------------------------
//------------------------------------------------------------------


export async function SetLoad(formData: FormData) {
  console.log("Setting Load...");
  console.log(formData);
  const tascoLogId = formData.get("tascoLogId") as string;
  const loadCount = Number(formData.get("loadCount"));

  
    const tascoLog = await prisma.tascoLog.update({
      where: {
        id: tascoLogId,
      },
      data: {
        LoadQuantity: loadCount,
      },
    });
  console.log("Load Quantity updated");
  revalidatePath("/dashboard/tasco");
  revalidateTag("load");
  return tascoLog;
}

// /* Tasco Comments */
// ------------------------------------------------------------------
// ------------------------------------------------------------------

export const updateTascoComments = async (formData: FormData) => {
  const id = formData.get("id") as string;
  const comment = formData.get("comment") as string;

  const updatedLog = await prisma.tascoLog.update({
    where: { id },
    data: {
      comment,
    },
  });

  revalidatePath("/dashboard/tascoAssistant");
  return updatedLog;
};

// /* Tasco Refuel Logs */
// ------------------------------------------------------------------
// ------------------------------------------------------------------
/**
 * Creates a new refuel log
 */
export async function createRefuelLog(params: CreateRefuelLogParams) {
  try {
    return await prisma.$transaction(async (tx) => {
      const data = {
        ...(params.type === 'tasco' 
          ? { tascoLogId: params.parentId }
          : { employeeEquipmentLogId: params.parentId })
      };

      const result = await tx.refueled.create({ data });
      revalidatePaths();
      return result;
    });
  } catch (error) {
    console.error(`Failed to create ${params.type} refuel log:`, error);
    throw new Error(`Failed to create ${params.type} refuel log`);
  }
}

/**
 * Updates an existing refuel log
 */
export async function updateRefuelLog(params: UpdateRefuelLogParams) {
  try {
    return await prisma.$transaction(async (tx) => {
      console.log("Updating refuel log...");
      const data = {
        gallonsRefueled: params.gallonsRefueled,
      };

      const result = await tx.refueled.update({
        where: { id: params.id },
        data
      });

      revalidatePaths();
      console.log("Refuel Gallons updated: ", params.gallonsRefueled);
      return result;
    });
  } catch (error) {
    console.error(`Failed to update ${params.type} refuel log:`, error);
    throw new Error(`Failed to update ${params.type} refuel log`);
  }
}

/**
 * Deletes a refuel log
 */
export async function deleteRefuelLog(params: DeleteRefuelLogParams) {
  try {
    return await prisma.$transaction(async (tx) => {
      console.log("Deleting refuel log...");
      const result = await tx.refueled.delete({
        where: { id: params.id }
      });

      revalidatePaths();
      console.log("Refuel log deleted: ", params.id);
      return result;
    });
  } catch (error) {
    console.error(`Failed to delete ${params.type} refuel log:`, error);
    throw new Error(`Failed to delete ${params.type} refuel log`);
  }
}

/**
 * Helper function to revalidate paths and tags
 */
function revalidatePaths() {
  try {
    revalidatePath("/dashboard/tasco");
    revalidatePath("/dashboard/tascoAssistant");
    revalidateTag("load");
  } catch (error) {
    console.error("Failed to revalidate paths:", error);
  }
}