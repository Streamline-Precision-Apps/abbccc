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
  console.log("Creating hauling logs...");
  console.log(formData);
  const id = formData.get("id") as string;
  const truckingLogId = formData.get("truckingLogId") as string;

  const haulingLog = await prisma.material.create({
    data: {
      id: id,
      truckingLogId,
    },
  });
  console.log(haulingLog);
  revalidatePath("/dashboard/truckingAssistant");
  revalidateTag("material");
  return haulingLog;
}
