"use server";
import prisma from "@/lib/prisma";
import { revalidatePath, revalidateTag } from "next/cache";

/* LOADS Hauled */
//------------------------------------------------------------------
//------------------------------------------------------------------

export async function addLoad(formData: FormData) {
  console.log("Creating Load...");
  console.log(formData);
  const tascoLogId = formData.get("tascoLogId") as string;
  const currentCount = await prisma.tascoLog.findFirst({
    where: {
      id: tascoLogId,
    },
    select: {
      LoadQuantity: true,
    },
  });

  if (!currentCount) {
    // Handle the case where no record is found
    console.error("No record found for Tasco Log ID:", tascoLogId);
    // You can either return an error or throw an exception here
    return { error: "No record found" };
  }

  const tascoLog = await prisma.tascoLog.update({
    where: {
      id: tascoLogId,
    },
    data: {
      LoadQuantity: currentCount?.LoadQuantity + 1,
    },
  });
  console.log("Load Added");
  console.log("Updated Tasco Log:", tascoLog);
  revalidatePath("/dashboard/tasco");
  revalidateTag("load");
  return true;
}


export async function deleteLoad(formData: FormData) {
  console.log("Creating Load...");
  console.log(formData);
  const tascoLogId = formData.get("tascoLogId") as string;
  const currentCount = await prisma.tascoLog.findFirst({
    where: {
      id: tascoLogId,
    },
    select: {
      LoadQuantity: true,
    },
  });

  if (!currentCount) {
    // Handle the case where no record is found
    console.error("No record found for Tasco Log ID:", tascoLogId);
    // You can either return an error or throw an exception here
    return { error: "No record found" };
  }

  if (currentCount?.LoadQuantity > 0) {
  const tascoLog = await prisma.tascoLog.update({
    where: {
      id: tascoLogId,
    },
    data: {
      LoadQuantity: currentCount?.LoadQuantity + 1,
    },
  });
  }
  else {
    console.log("No loads to delete.");
    return false;
  }
  console.log("Load Deleted");
  revalidatePath("/dashboard/tasco");
  revalidateTag("load");
  return true;
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
export async function createRefuelLog(formData: FormData) {
  console.log("Creating refuel logs...");
  console.log(formData);
  const tascoLogId = formData.get("tascoLogId") as string;

  const refueledLogs = await prisma.refueled.create({
    data: {
      tascoLogId,
    },
  });

  console.log(refueledLogs);
  revalidatePath("/dashboard/tasco");
  return refueledLogs;
}

export async function createRefuelEquipmentLog(formData: FormData) {
  console.log("Creating refuel logs...");
  console.log(formData);
  const employeeEquipmentLogId = formData.get(
    "employeeEquipmentLogId"
  ) as string;

  const refueledLogs = await prisma.refueled.create({
    data: {
      employeeEquipmentLogId,
    },
  });

  console.log(refueledLogs);
  revalidatePath("/dashboard/tasco");
  return refueledLogs;
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

export async function updateRefuelLog(formData: FormData) {
  const id = formData.get("id") as string;
  const gallonsRefueled =
    Number(formData.get("gallonsRefueled") as string) || 0;
  const milesAtfueling = Number(formData.get("milesAtfueling")) || 0;

  // Update the state mileage in the database
  const updatedStateMileage = await prisma.refueled.update({
    where: { id },
    data: {
      gallonsRefueled,
      milesAtfueling,
    },
  });
  revalidatePath("/dashboard/tasco");
  console.log("Updated State Mileage:", updatedStateMileage);

  return updatedStateMileage;
}

export async function deleteRefuelLog(id: string) {
  console.log("Deleting refuel logs:", id);
  console.log("id", id);
  await prisma.refueled.delete({
    where: { id },
  });

  return true;
}


