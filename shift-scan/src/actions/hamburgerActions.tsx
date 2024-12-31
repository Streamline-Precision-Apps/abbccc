"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { UserSettings } from "@/lib/types";
export async function updateSettings(data: UserSettings) {
  const { userId, ...settings } = data;
  await prisma.userSettings.update({
    where: { userId: userId },
    data: settings,
  });
  // Revalidate the path to show updated data
  revalidatePath("/hamburger/settings");
}
