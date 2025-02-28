"use server";
import prisma from "@/lib/prisma";
import { revalidatePath, revalidateTag } from "next/cache";

/* EQUIPMENT Hauled */
//------------------------------------------------------------------
//------------------------------------------------------------------

export async function createEquipmentHauled(formData: FormData) {
  console.log("Creating hauling logs...");
  console.log(formData);
  const truckingLogId = formData.get("truckingLogId") as string;

  const equipmentHauled = await prisma.equipmentHauled.create({
    data: {
      truckingLog: {
        connect: { id: truckingLogId },
      },
    },
  });

  console.log(equipmentHauled);
  revalidatePath("/dashboard/truckingAssistant");
  revalidateTag("equipmentHauled");
  return equipmentHauled;
}

export async function updateEquipmentLogsLocation(formData: FormData) {
  console.log("Updating hauling logs...");
  console.log(formData);
  const id = formData.get("id") as string;
  const equipmentId = formData.get("equipmentId") as string;
  const truckingLogId = formData.get("truckingLogId") as string;

  // Use a nested update to update the related Equipment's jobsiteId in one call.
  const updatedLog = await prisma.equipmentHauled.update({
    where: { id },
    data: {
      truckingLogId,
      jobSiteId: equipmentId,
    },
  });
  // Create EquipmentLocationLog for the updated jobSiteId

  console.log(updatedLog);
  revalidateTag("equipmentHauled");
  revalidatePath("/dashboard/truckingAssistant");
  return updatedLog;
}

export async function updateEquipmentLogsEquipment(formData: FormData) {
  console.log("Updating hauling logs...");
  console.log(formData);
  const id = formData.get("id") as string;
  const equipmentId = formData.get("equipmentId") as string;
  const truckingLogId = formData.get("truckingLogId") as string;

  // Use a nested update to update the related Equipment's jobsiteId in one call.
  const updatedLog = await prisma.equipmentHauled.update({
    where: { id },
    data: {
      truckingLogId,
      equipmentId,
    },
  });
  console.log(updatedLog);
  revalidateTag("equipmentHauled");
  revalidatePath("/dashboard/truckingAssistant");
  return updatedLog;
}

export async function deleteEquipmentHauled(id: string) {
  console.log("Deleting Equipment hauling logs...");
  console.log(id);
  await prisma.equipmentHauled.delete({
    where: { id },
  });

  revalidateTag("equipmentHauled");
  return true;
}

/* MATERIALS Hauled */
//------------------------------------------------------------------
//------------------------------------------------------------------

export async function createHaulingLogs(formData: FormData) {
  console.log("Creating hauling logs...");
  console.log(formData);
  const truckingLogId = formData.get("truckingLogId") as string;

  const haulingLog = await prisma.material.create({
    data: {
      truckingLogId,
    },
  });

  console.log(haulingLog);
  revalidatePath("/dashboard/truckingAssistant");
  revalidateTag("material");
  return haulingLog;
}

export async function updateHaulingLogs(formData: FormData) {
  const id = formData.get("id") as string;
  const name = formData.get("name") as string;
  const LocationOfMaterial = formData.get("LocationOfMaterial") as string;
  const quantity = parseInt(formData.get("quantity") as string);
  const truckingLogId = formData.get("truckingLogId") as string;

  // If ID is provided, update the existing log
  if (id) {
    const updatedLog = await prisma.material.update({
      where: { id },
      data: {
        name,
        LocationOfMaterial,
        quantity,
      },
    });

    console.log("Updated Hauling Log:", updatedLog);
    return updatedLog;
  }

  // If no ID, create a new log
  const haulingLog = await prisma.material.create({
    data: {
      name,
      LocationOfMaterial,
      quantity,
      truckingLogId,
    },
  });
  revalidateTag("material");
  console.log("New Hauling Log:", haulingLog);
  return haulingLog;
}

export async function deleteHaulingLogs(id: string) {
  console.log("Deleting hauling logs...");
  console.log(id);
  await prisma.material.delete({
    where: { id },
  });

  revalidateTag("material");
  return true;
}
/* Update */
//------------------------------------------------------------------
//------------------------------------------------------------------

export const updateTruckingMileage = async (formData: FormData) => {
  const id = formData.get("id") as string;
  const endingMileage = parseInt(formData.get("endingMileage") as string);

  const updatedLog = await prisma.truckingLog.update({
    where: { id },
    data: {
      endingMileage,
    },
  });
  return updatedLog;
};

export const updateTruckDrivingNotes = async (formData: FormData) => {
  const id = formData.get("id") as string;
  const comment = formData.get("comment") as string;

  const updatedLog = await prisma.truckingLog.update({
    where: { id },
    data: {
      comment,
    },
  });

  revalidatePath("/dashboard/truckingAssistant");
  return updatedLog;
};

export async function createStateMileage(formData: FormData) {
  console.log("Creating hauling logs...");
  console.log(formData);
  const truckingLogId = formData.get("truckingLogId") as string;

  const equipmentHauled = await prisma.stateMileage.create({
    data: {
      truckingLogId,
    },
  });

  console.log(equipmentHauled);
  revalidatePath("/dashboard/truckingAssistant");
  revalidateTag("equipmentHauled");
  return equipmentHauled;
}

export async function updateStateMileage(formData: FormData) {
  const id = formData.get("id") as string;
  const state = formData.get("state") as string;
  const stateLineMileage = Number(formData.get("stateLineMileage")) || 0;

  // Update the state mileage in the database
  const updatedStateMileage = await prisma.stateMileage.update({
    where: { id },
    data: {
      state,
      stateLineMileage,
    },
  });

  console.log("Updated State Mileage:", updatedStateMileage);

  return updatedStateMileage;
}

export async function deleteStateMileage(id: string) {
  console.log("Deleting State Mileage:", id);
  await prisma.stateMileage.delete({
    where: { id },
  });

  return true;
}
