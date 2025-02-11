"use server";
import prisma from "@/lib/prisma";
import { revalidatePath, revalidateTag } from "next/cache";

// This Updates the selected staus of the project in the database
export async function setProjectSelected(id: string, selected: boolean) {
  try {
    await prisma.maintenance.update({
      where: {
        id,
      },
      data: {
        selected,
      },
    });
    revalidatePath("/dashboard/mechanic");
    revalidateTag("projects");
  } catch (error) {
    console.error("Error updating project:", error);
    throw error;
  }
}
