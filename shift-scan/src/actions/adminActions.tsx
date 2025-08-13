"use server";
import prisma from "@/lib/prisma";
import { FormStatus, Permission, WorkType } from "@/lib/enums";
import { revalidatePath, revalidateTag } from "next/cache";
import { z } from "zod";
import * as Sentry from "@sentry/nextjs";
import { hash } from "bcrypt-ts";
interface NewEmployeeFormData {
  username: string;
  password: string;
  firstName: string;
  lastName: string;
  // email: string;
  // dateOfBirth: Date | string;
  // phoneNumber: string;
  // emergencyContact: string;
  // emergencyContactNumber: string;
  permissionLevel: string; // or more specific type like 'admin' | 'manager' | 'employee'
  employmentStatus: string;
  crews: string[];
  truckingView?: boolean;
  tascoView?: boolean;
  engineerView?: boolean;
  generalView?: boolean;
}

const newUserSchema = z.object({
  username: z.string(),
  password: z.string(),
  firstName: z.string(),
  lastName: z.string(),
  // phoneNumber: z.string(),
  // email: z.string().email(),
  // emergencyContact: z.string(),
  // emergencyContactNumber: z.string(),
  // dateOfBirth: z.string(),
  permissionLevel: z.string(),
  employmentStatus: z.string(),
  crews: z.array(z.string()),
  truckingView: z.boolean().optional(),
  tascoView: z.boolean().optional(),
  engineerView: z.boolean().optional(),
  generalView: z.boolean().optional(),
});

export async function createUserAdmin(payload: {
  terminationDate: Date | null;
  createdById: string;
  username: string;
  firstName: string;
  middleName: string;
  lastName: string;
  secondLastName: string;
  password: string;
  permission: string;
  truckView: boolean;
  tascoView: boolean;
  mechanicView: boolean;
  laborView: boolean;
  crews: {
    id: string;
  }[];
}) {
  console.log("Creating user admin...");
  console.log(payload);
  const hashedPassword = await hash(payload.password, 10);

  // Use a transaction to ensure both operations succeed or fail together
  const result = await prisma.$transaction(async (prisma) => {
    // Create the user
    const user = await prisma.user.create({
      data: {
        username: payload.username,
        password: hashedPassword,
        firstName: payload.firstName,
        lastName: payload.lastName,
        permission: payload.permission as Permission,
        truckView: payload.truckView,
        tascoView: payload.tascoView,
        mechanicView: payload.mechanicView,
        laborView: payload.laborView,
        clockedIn: false,
        accountSetup: false,
        startDate: new Date(),
        Crews: {
          connect: payload.crews.map((crew) => ({ id: crew.id })),
        },
        Contact: {
          create: {
            // phoneNumber,
            // emergencyContact,
            // emergencyContactNumber,
          },
        },
        Company: { connect: { id: "1" } },
      },
    });

    // Create user settings
    await prisma.userSettings.create({
      data: {
        userId: user.id,
        language: "en",
        generalReminders: false,
        personalReminders: false,
        cameraAccess: false,
        locationAccess: false,
      },
    });

    revalidatePath("/admins/personnel");
    return { success: true, userId: user.id };
  });

  return result;
}

export async function editUserAdmin(payload: {
  id: string;
  terminationDate: string | null;
  username: string;
  firstName: string;
  middleName: string | null;
  lastName: string;
  secondLastName: string | null;
  permission: string;
  truckView: boolean;
  tascoView: boolean;
  mechanicView: boolean;
  laborView: boolean;
  crews: {
    id: string;
  }[];
}) {
  console.log("Creating user admin...");
  console.log(payload);

  // Use a transaction to ensure both operations succeed or fail together
  const result = await prisma.$transaction(async (prisma) => {
    // Create the user

    // Disconnect all crews, then connect only the selected ones
    const user = await prisma.user.update({
      where: { id: payload.id },
      data: {
        username: payload.username,
        firstName: payload.firstName,
        middleName: payload.middleName,
        lastName: payload.lastName,
        secondLastName: payload.secondLastName,
        permission: payload.permission as Permission,
        truckView: payload.truckView,
        tascoView: payload.tascoView,
        mechanicView: payload.mechanicView,
        laborView: payload.laborView,
        Crews: {
          set: [], // disconnect all crews first
          connect: payload.crews.map((crew) => ({ id: crew.id })),
        },
        Company: { connect: { id: "1" } },
      },
    });

    revalidatePath("/admins/personnel");
    return { success: true, userId: user.id };
  });

  return result;
}

export async function deleteUser(id: string) {
  try {
    await prisma.user.delete({
      where: { id },
    });
    return { success: true };
  } catch (error) {
    console.error("Error deleting user:", error);
    return { success: false, error: error };
  }
}

// Update an existing employee's info and contact details (for UserSelected save)
export async function updateEmployeeAndContact(formData: FormData) {
  try {
    const id = formData.get("id") as string;
    if (!id) throw new Error("Missing user id");

    // User fields
    const firstName = formData.get("firstName") as string;
    const lastName = formData.get("lastName") as string;
    const email = formData.get("email") as string;
    const DOB = formData.get("DOB") as string;
    const permission = formData.get("permission") as string;
    const truckView = formData.get("truckView") === "true";
    const tascoView = formData.get("tascoView") === "true";
    const laborView = formData.get("laborView") === "true";
    const mechanicView = formData.get("mechanicView") === "true";

    // Contact fields
    const phoneNumber = formData.get("phoneNumber") as string;
    const emergencyContact = formData.get("emergencyContact") as string;
    const emergencyContactNumber = formData.get(
      "emergencyContactNumber",
    ) as string;

    // Update user
    await prisma.user.update({
      where: { id },
      data: {
        firstName,
        lastName,
        email,
        DOB,
        permission: permission as Permission,
        truckView,
        tascoView,
        laborView,
        mechanicView,
      },
    });

    // Update contact info (if present)
    if (phoneNumber || emergencyContact || emergencyContactNumber) {
      await prisma.contacts.update({
        where: { userId: id },
        data: {
          phoneNumber,
          emergencyContact,
          emergencyContactNumber,
        },
      });
    }

    // Optionally: handle crews or other relations here if needed

    revalidatePath(`/admins/personnel/${id}`);
    return { success: true };
  } catch (error) {
    Sentry.captureException(error);
    console.error("Error updating employee and contact info:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

//#TODO: Test Server Action
export async function createCrew(formData: FormData) {
  try {
    console.log("Creating new crew...");
    // Extract data from formData
    const crewName = formData.get("name") as string;
    const Users = formData.get("Users") as string;
    const teamLead = formData.get("leadId") as string;
    const crewType = formData.get("crewType") as WorkType;

    if (!crewName || !crewName.trim()) {
      throw new Error("Crew name is required.");
    }
    if (!Users) {
      throw new Error("Crew members data is missing.");
    }
    if (!teamLead) {
      throw new Error("A team lead is required.");
    }

    // Create the crew
    const newCrew = await prisma.crew.create({
      data: {
        name: crewName.trim(),
        leadId: teamLead,
        crewType: crewType,
        Users: {
          connect: JSON.parse(Users as string) as Array<{
            id: string;
          }>,
        },
      },
    });

    revalidateTag("crews");
    revalidatePath(`/admins/crew`);
    return {
      success: true,
      crewId: newCrew.id,
      message: "Crew created successfully",
    };
  } catch (error) {
    console.error("Error creating crew:", error);
    throw new Error(
      `Failed to create crew: ${
        error instanceof Error ? error.message : "Unknown error"
      }`,
    );
  }
}

export async function editCrew(formData: FormData) {
  try {
    console.log("Editing crew...");
    // Extract data from formData
    const crewName = formData.get("name") as string;
    const Users = formData.get("Users") as string;
    const teamLead = formData.get("leadId") as string;
    const crewType = formData.get("crewType") as WorkType;
    const crewId = formData.get("id") as string;

    if (!crewName || !crewName.trim()) {
      throw new Error("Crew name is required.");
    }
    if (!Users) {
      throw new Error("Crew members data is missing.");
    }
    if (!teamLead) {
      throw new Error("A team lead is required.");
    }

    // First, fetch existing crew to get current users
    const existingCrew = await prisma.crew.findUnique({
      where: { id: crewId },
      include: { Users: true },
    });

    if (!existingCrew) {
      throw new Error("Crew not found.");
    }

    // Parse new users from form data
    const newUsers = JSON.parse(Users as string) as Array<{
      id: string;
    }>;

    // Update the crew - first disconnect all users, then connect the new selection
    const updatedCrew = await prisma.crew.update({
      where: { id: crewId },
      data: {
        name: crewName.trim(),
        leadId: teamLead,
        crewType: crewType,
        Users: {
          disconnect: existingCrew.Users.map((user) => ({ id: user.id })),
          connect: newUsers.map((user) => ({ id: user.id })),
        },
      },
    });

    revalidateTag("crews");
    revalidatePath(`/admins/crew`);
    return {
      success: true,
      crewId: updatedCrew.id,
      message: "Crew updated successfully",
    };
  } catch (error) {
    console.error("Error updating crew:", error);
    throw new Error(
      `Failed to update crew: ${
        error instanceof Error ? error.message : "Unknown error"
      }`,
    );
  }
}

export async function deleteCrew(id: string) {
  try {
    await prisma.crew.delete({
      where: { id },
    });
    return { success: true };
  } catch (error) {
    console.error("Error deleting crew:", error);
    return { success: false, error: error };
  }
}
// Todo: Test Server Action
export async function deleteLog(id: string) {
  try {
    await prisma.employeeEquipmentLog.delete({
      where: { id },
    });
    revalidateTag("timesheets");
    return true;
  } catch (error) {
    console.error(`Error deleting log with ID ${id}:`, error);
    throw error;
  }
}

// Todo: update this to make a new timesheet
export async function CreateTimesheet(userId: string, date: string) {
  try {
    const timesheet = await prisma.timeSheet.create({
      data: {
        userId: userId,
        startTime: new Date(date).toISOString(),
        endTime: new Date(date).toISOString(),
        date: new Date(date).toISOString(),
        costcode: "new",
        jobsiteId: "new",
        comment: null,
        workType: "LABOR" as WorkType,
      },
    });

    console.log(timesheet);
    revalidatePath(`/admins/personnel/${timesheet.userId}?date=${date}`);
    revalidateTag("timesheets");
    return timesheet;
  } catch (error) {
    console.error("Error saving timesheet:", error);
    throw error;
  }
}

// Todo: Test Server Action - rewrite timesheet creation with logs included
export async function CreateEquipmentLogs(userId: string, date: string) {
  try {
    console.log("Saving equipment logs...");

    const equipmentLog = await prisma.employeeEquipmentLog.create({
      data: {
        equipmentId: "new", // this is a placeholder equipment
        timeSheetId: "new", // this is a placeholder timesheet
        startTime: new Date(date).toISOString(),
        endTime: new Date(date).toISOString(),
        comment: null,
      },
    });

    console.log(equipmentLog);
    revalidateTag("timesheets");

    return equipmentLog;
  } catch (error) {
    console.error("Error saving equipment logs:", error);
    throw error;
  }
}

// Todo: Check after testing
export async function saveEquipmentLogs(formData: FormData) {
  try {
    console.log("Saving equipment logs...");
    console.log("Form data form saveEquipmentLogs", formData);
    const id = formData.get("id") ? (formData.get("id") as string) : undefined;

    const equipmentLog = await prisma.employeeEquipmentLog.update({
      where: { id: id }, // Use an invalid ID for new entries
      data: {
        id: id,
        startTime: formData.get("startTime") as string,
        endTime: formData.get("endTime") as string,
        equipmentId: formData.get("equipmentId") as string,
        comment: formData.get("comment") as string,
        timeSheetId: (formData.get("timeSheetId") as string) || undefined,

        maintenanceId: (formData.get("maintenanceId") as string) || undefined,
      },
    });

    console.log(equipmentLog);
    revalidateTag("timesheets");
    return true;
  } catch (error) {
    console.error("Error saving equipment logs:", error);
    throw error;
  }
}

// Completed: Test
export async function reactivatePersonnel(formData: FormData) {
  try {
    console.log("Archiving personnel...");
    console.log(formData);
    const id = formData.get("userId") as string;

    const result = await prisma.user.update({
      where: { id },
      data: {
        terminationDate: null,
      },
    });

    revalidatePath(`/admins/personnel/${id}`);
    return true;
  } catch (error) {
    console.error("Error archiving personnel:", error);
    throw error;
  }
}

//todo: test after sean's changes
export async function removeProfilePic(formData: FormData) {
  try {
    console.log("Removing profile pic...");
    console.log(formData);
    const id = formData.get("userId") as string;

    const result = await prisma.user.update({
      where: { id },
      data: {
        image: null,
      },
    });
    revalidatePath("/admins/personnel");
    revalidatePath("/admins/personnel/" + result.id);
    return result.image;
  } catch (error) {
    console.error("Error removing profile pic:", error);
    throw error;
  }
}
// Completed: Test
export async function archivePersonnel(formData: FormData) {
  try {
    console.log("Archiving personnel...");
    console.log(formData);
    const id = formData.get("userId") as string;

    const result = await prisma.user.update({
      where: { id },
      data: {
        terminationDate: new Date().toISOString(),
      },
    });

    revalidatePath(`/admins/personnel/${id}`);
    return true;
  } catch (error) {
    console.error("Error archiving personnel:", error);
    throw error;
  }
}

// Completed: Test

export async function updateJobsite(formData: FormData) {
  try {
    console.log("Updating jobsite...");
    console.log(formData);
    const name = formData.get("name") as string;
    const address = formData.get("address") as string;
    const description = formData.get("description") as string;
    const comment = formData.get("jobsite_comment") as string;
    const isActive = Boolean(formData.get("isActive") as string);

    const id = formData.get("id") as string;
    await prisma.jobsite.update({
      where: {
        id: id,
      },
      data: {
        name: name,
        Address: { connect: { id: address } },
        description: description,
        comment: comment,
        isActive: isActive,
      },
    });
    revalidatePath(`/admin/assets`);
  } catch (error) {
    console.error("Error updating jobsite:", error);
    throw error;
  }
}

// Fetch first jobsite
export async function fetchByNameJobsite(name: string) {
  const jobsite = await prisma.jobsite.findFirst({
    where: {
      name: name,
    },
  });
  revalidatePath(`/admin/assets`);
  return jobsite;
}

// Delete jobsite by id
export async function deleteJobsite(formData: FormData) {
  const qrId = formData.get("qrId") as string;
  try {
    await prisma.jobsite.delete({
      where: { qrId: qrId },
    });
    revalidatePath(`/admin/assets`);
    return true;
  } catch (error) {
    console.error("Error deleting jobsite:", error);
    throw error;
  }
}

export async function editGeneratedJobsite(formData: FormData) {
  try {
    const name = formData.get("name") as string;
    const qrId = formData.get("qrId") as string;

    await prisma.jobsite.update({
      where: {
        qrId: qrId,
      },
      data: {
        name: name,
        qrId: qrId,
      },
    });

    revalidatePath(`/admin/assets`);

    return;
  } catch (error) {
    console.error("Error editing generated jobsite:", error);
    throw error;
  }
}

// SCHEMA NOTE: The User.activeEmployee field has been removed from the database schema.
// To check if a user is active, use: user.terminationDate === null
// Example for filtering active employees:
//   const activeEmployees = await prisma.user.findMany({ where: { terminationDate: null } });
// If you add or update CreationLogs, createdAt and updatedAt are now required (handled by Prisma defaults).

// NOTE: The User.activeEmployee field has been removed from the schema.
// Use user.terminationDate === null to check if a user is active.
// If you add or update CreationLogs, ensure createdAt and updatedAt are set (handled by Prisma defaults).

export async function createCostCode(formData: FormData) {
  try {
    console.log("Creating cost code...");
    console.log(formData);
    // Check if cost code already exists
    await prisma.costCode.create({
      data: {
        name: formData.get("name") as string,
      },
    });
    revalidatePath(`/admin/assets`);
  } catch (error) {
    console.error("Error creating cost code:", error);
    throw error;
  }
}

export async function EditCostCode(formData: FormData) {
  try {
    console.log("Creating cost code...");
    console.log(formData);
    const id = formData.get("id") as string;
    const name = formData.get("name") as string;
    await prisma.costCode.update({
      where: {
        id: id,
      },
      data: {
        name: name,
      },
    });

    revalidatePath(`/admin/assets`);
  } catch (error) {
    console.error("Error creating cost code:", error);
    throw error;
  }
}

export async function deleteCostCode(formData: FormData) {
  const id = formData.get("id") as string;
  try {
    await prisma.costCode.delete({
      where: { id: id },
    });
    revalidatePath(`/admin/assets`);
    return true;
  } catch (error) {
    console.error("Error deleting jobsite:", error);
    throw error;
  }
}
