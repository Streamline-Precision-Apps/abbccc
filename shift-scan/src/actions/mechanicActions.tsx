"use server";
import prisma from "@/lib/prisma";
import { Priority } from "@/lib/enums";
import { revalidatePath, revalidateTag } from "next/cache";

// This Updates the selected staus of the project in the database
export async function setProjectSelected(id: string, selected: boolean) {
  try {
    await prisma.maintenance.update({
      where: { id },
      data: { selected },
    });

    // Revalidate both the page and the data
    revalidatePath("/dashboard/mechanic");
    revalidateTag("maintenance-projects");

    return { success: true };
  } catch (error) {
    console.error("Error updating project:", error);
    return { success: false, error: "Failed to update project" };
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
    const stringPriority = formData.get("priority") as Priority;
    const createdBy = formData.get("createdBy") as string;

    let priority: Priority;

    switch (stringPriority) {
      case Priority.LOW:
        priority = Priority.LOW;
        break;
      case Priority.MEDIUM:
        priority = Priority.MEDIUM;
        break;
      case Priority.HIGH:
        priority = Priority.HIGH;
        break;
      case Priority.PENDING:
        priority = Priority.PENDING;
        break;
      case Priority.TODAY:
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
        createdBy,
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

export async function RemoveDelayRepair(formData: FormData) {
  try {
    console.log("id", formData);
    const id = formData.get("id") as string;

    const updatedRepair = await prisma.maintenance.update({
      where: { id },
      data: {
        delayReasoning: null,
        delay: null,
        hasBeenDelayed: true,
      },
    });
    console.log("update", updatedRepair);
    return updatedRepair;
  } catch (error) {
    console.error("Error removing delay:", error);
    throw error;
  }
}

export async function setEditForProjectInfo(formData: FormData) {
  try {
    console.log(formData);
    const location = formData.get("location") as string;
    const stringPriority = formData.get("priority") as string;
    const delay = formData.get("delay") as string;
    const delayReasoning = formData.get("delayReasoning") as string;
    const equipmentIssue = formData.get("equipmentIssue") as string;
    const additionalInfo = formData.get("additionalInfo") as string;

    let priority: Priority;

    switch (stringPriority) {
      case Priority.LOW:
        priority = Priority.LOW;
        break;
      case Priority.MEDIUM:
        priority = Priority.MEDIUM;
        break;
      case Priority.HIGH:
        priority = Priority.HIGH;
        break;
      case Priority.PENDING:
        priority = Priority.PENDING;
        break;
      case Priority.TODAY:
        priority = Priority.TODAY;
        break;
      default:
        priority = Priority.PENDING;
    }

    if (delay === "") {
      await prisma.maintenance.update({
        where: {
          id: formData.get("id") as string,
        },
        data: {
          location,
          priority,
          delay: null,
          delayReasoning: null,
          equipmentIssue,
          additionalInfo,
        },
      });
    } else {
      await prisma.maintenance.update({
        where: {
          id: formData.get("id") as string,
        },
        data: {
          location,
          priority,
          delay,
          delayReasoning,
          equipmentIssue,
          additionalInfo,
        },
      });
    }
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
    revalidateTag("maintenance-projects");
    return true;
  } catch (error) {
    console.error("Error updating project:", error);
  }
}

export async function startEngineerProject(formData: FormData) {
  try {
    console.log("Starting project...");
    console.log(formData);

    const maintenanceId = formData.get("maintenanceId") as string;
    const timeSheetId = formData.get("timeSheetId") as string;
    const userId = formData.get("userId") as string;
    const startTime = new Date().toISOString();

    // ✅ Debug logs
    console.log("Maintenance ID:", maintenanceId);
    console.log("Time Sheet ID:", timeSheetId);
    console.log("User ID:", userId);

    // ✅ Check if timeSheetId exists in TimeSheet model
    const existingTimeSheet = await prisma.timeSheet.findUnique({
      where: { id: timeSheetId },
    });

    if (!existingTimeSheet) {
      throw new Error(`TimeSheet with ID ${timeSheetId} does not exist.`);
    }

    // ✅ Insert Maintenance Log
    const log = await prisma.maintenanceLog.create({
      data: {
        timeSheetId,
        maintenanceId,
        userId,
        startTime,
      },
    });

    revalidatePath("/dashboard/mechanic");
    revalidateTag("projects");

    return log;
  } catch (error) {
    console.error("Error updating project:", error);
    return false;
  }
}

export async function LeaveEngineerProject(formData: FormData) {
  try {
    console.log("Leaving project...");
    console.log(formData);

    const comment = formData.get("comment") as string;
    const id = formData.get("maintenanceId") as string;
    const userId = formData.get("userId") as string;
    const endTime = new Date().toISOString();

    await prisma.maintenanceLog.update({
      where: {
        id,
      },
      data: {
        comment,
        userId,
        endTime,
      },
    });

    revalidatePath("/dashboard/mechanic");
    revalidateTag("projects");
    return true;
  } catch (error) {}
}

export async function updateDelay(formData: FormData) {
  try {
    console.log("Updating delay...");
    console.log(formData);
    const id = formData.get("maintenanceId") as string;
    const delay = formData.get("delay") as string;
    const delayReasoning = formData.get("delayReasoning") as string;
    await prisma.maintenance.update({
      where: {
        id,
      },
      data: {
        delay,
        delayReasoning,
        hasBeenDelayed: true,
      },
    });
    revalidatePath("/dashboard/mechanic");
  } catch (error) {}
}

export async function findUniqueUser(formData: FormData) {
  try {
    const user = await prisma.maintenanceLog.findFirst({
      where: {
        maintenanceId: formData.get("maintenanceId") as string,
        userId: formData.get("userId") as string,
        endTime: null,
      },
      select: {
        id: true,
        userId: true,
      },
    });
    return user;
  } catch (error) {
    console.error("Error finding user:", error);
  }
}

export async function SubmitEngineerProject(formData: FormData) {
  try {
    console.log("Leaving project...");
    console.log(formData);

    const id = formData.get("id") as string;
    const problemDiagnosis = formData.get("diagnosedProblem") as string;
    const solution = formData.get("solution") as string;
    const totalHoursLaboured = parseFloat(
      formData.get("totalHoursLaboured") as string
    );

    await prisma.maintenance.update({
      where: {
        id,
      },
      data: {
        problemDiagnosis,
        solution,
        repaired: true,
        totalHoursLaboured,
      },
    });

    revalidatePath("/dashboard/mechanic");
    revalidateTag("projects");
    revalidateTag("maintenance-projects");

    return true;
  } catch (error) {}
}
export async function setEngineerComment(comment: string, id: string) {
  try {
    await prisma.maintenanceLog.update({
      where: {
        id,
      },
      data: {
        comment,
      },
    });
    return true;
  } catch (error) {
    console.error("Error updating project:", error);
    return false;
  }
}
