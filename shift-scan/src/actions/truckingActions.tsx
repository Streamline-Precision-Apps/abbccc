"use server";
import prisma from "@/lib/prisma";
import { revalidatePath, revalidateTag } from "next/cache";

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
