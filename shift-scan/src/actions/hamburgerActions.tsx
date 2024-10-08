"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function updateSettings(data: any) {
  const { userId, ...settings } = data;

  const result = await prisma.userSettings.update({
    where: { userId: userId },
    data: settings,
  });

  // Revalidate the path to show updated data
  revalidatePath("/hamburger/settings");
}
