"use server";
import prisma from "@/lib/prisma";
import { revalidatePath, revalidateTag } from "next/cache";
import { Priority } from "@/lib/types";

// This Updates the selected staus of the project in the database
export async function setProjectSelected(id: string, selected: boolean) {
  try {
    console.log("Updating project...");
    console.log(id, "set to", selected);
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

export async function CreateMechanicProject(formData: FormData) {
  try {
    console.log("Creating new project...");
    console.log(formData);
    const equipmentId = formData.get("equipmentId") as string;
    const equipmentIssue = formData.get("equipmentIssue") as string;
    const additionalInfo = formData.get("additionalInfo") as string;
    const location = formData.get("location") as string;
    const stringPriority = formData.get("priority") as string;

    let priority;

    switch (stringPriority) {
      case "LOW":
        priority = Priority.LOW;
        break;
      case "MEDIUM":
        priority = Priority.MEDIUM;
        break;
      case "HIGH":
        priority = Priority.HIGH;
        break;
      case "PENDING":
        priority = Priority.PENDING;
        break;
      case "TODAY":
        priority = Priority.TODAY;
        break;
      default:
        priority = Priority.PENDING;
    }

    await prisma.maintenance.create({
      data: {
        equipmentId,
        equipmentIssue,
        additionalInfo,
        location,
        priority,
      },
    });
    console.log("Project created successfully.");
    revalidatePath("/dashboard/mechanic");
    revalidateTag("projects");
    return true;
  } catch (error) {
    console.error("Error updating project:", error);
    throw error;
  }
}

export async function setEditForProjectInfo(formData: FormData) {
  try {
    console.log(formData);
    const location = formData.get("location") as string;
    const stringPriority = formData.get("priority") as string;

    let priority;

    switch (stringPriority) {
      case "LOW":
        priority = Priority.LOW;
        break;
      case "MEDIUM":
        priority = Priority.MEDIUM;
        break;
      case "HIGH":
        priority = Priority.HIGH;
        break;
      case "PENDING":
        priority = Priority.PENDING;
        break;
      case "TODAY":
        priority = Priority.TODAY;
        break;
      default:
        priority = Priority.PENDING;
    }

    await prisma.maintenance.update({
      where: {
        id: formData.get("id") as string,
      },
      data: {
        location,
        priority,
      },
    });
  } catch (error) {
    console.error("Error updating project:", error);
  }
}

export async function deleteMaintenanceProject(id: string) {
  try {
    await prisma.maintenance.delete({
      where: {
        id,
      },
    });
    return true;
  } catch (error) {
    console.error("Error updating project:", error);
  }
}
