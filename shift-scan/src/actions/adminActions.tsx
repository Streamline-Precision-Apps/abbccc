"use server";
import prisma from "@/lib/prisma";
import {
  FormStatus,
  TimeOffRequestType,
  Permission,
  WorkType,
} from "@/lib/types";
import { revalidatePath, revalidateTag } from "next/cache";
import { z } from "zod";

interface NewEmployeeFormData {
  username: string;
  password: string;
  firstName: string;
  lastName: string;
  email: string;
  dateOfBirth: Date | string;
  permissionLevel: string; // or more specific type like 'admin' | 'manager' | 'employee'
  employmentStatus: string;
  crews: string[];
  phoneNumber: string;
  emergencyContact: string;
  emergencyContactNumber: string;
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
  phoneNumber: z.string(),
  email: z.string().email(),
  emergencyContact: z.string(),
  emergencyContactNumber: z.string(),
  dateOfBirth: z.string(),
  permissionLevel: z.string(),
  employmentStatus: z.string(),
  crews: z.array(z.string()),
  truckingView: z.boolean().optional(),
  tascoView: z.boolean().optional(),
  engineerView: z.boolean().optional(),
  generalView: z.boolean().optional(),
});

export async function submitNewEmployee(formData: NewEmployeeFormData) {
  const parsed = newUserSchema.safeParse(formData);
  if (!parsed.success) {
    throw new Error("Invalid form data");
  }

  const {
    username,
    password,
    firstName,
    lastName,
    email,
    dateOfBirth,
    permissionLevel,
    employmentStatus,
    crews,
    phoneNumber,
    emergencyContact,
    emergencyContactNumber,
    truckingView = false,
    tascoView = false,
    engineerView = false,
    generalView = false,
  } = parsed.data;

  // Use a transaction to ensure both operations succeed or fail together
  const result = await prisma.$transaction(async (prisma) => {
    // Create the user
    const user = await prisma.user.create({
      data: {
        username,
        password,
        firstName,
        lastName,
        email,
        DOB: dateOfBirth,
        permission: permissionLevel as Permission,
        activeEmployee: employmentStatus.toLowerCase() === "active",
        truckView: truckingView,
        tascoView: tascoView,
        mechanicView: engineerView,
        laborView: generalView,
        clockedIn: false,
        accountSetup: false,
        startDate: new Date(),
        Crews: {
          connect: crews.map((crewId: string) => ({ id: crewId })),
        },
        Contact: {
          create: {
            phoneNumber,
            emergencyContact,
            emergencyContactNumber,
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
      "emergencyContactNumber"
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
    console.error("Error updating employee and contact info:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

export async function CreateLeaveRequest(formData: FormData) {
  try {
    console.log("Updating leave request...");
    console.log(formData);
    const requestType = formData.get("requestType") as string;
    const status = formData.get("status") as string;

    let enumStatus = FormStatus.PENDING;
    switch (status) {
      case "APPROVED":
        enumStatus = FormStatus.APPROVED;
        break;
      case "DENIED":
        enumStatus = FormStatus.DENIED;
        break;
      case "PENDING":
        enumStatus = FormStatus.PENDING;
        break;
    }
    let enumRequestType = TimeOffRequestType.FAMILY_MEDICAL;
    switch (requestType) {
      case "FAMILY_MEDICAL":
        enumRequestType = TimeOffRequestType.FAMILY_MEDICAL;
        break;
      case "MILITARY":
        enumRequestType = TimeOffRequestType.MILITARY;
        break;
      case "PAID_VACATION":
        enumRequestType = TimeOffRequestType.PAID_VACATION;
        break;
      case "UNPAID_VACATION":
        enumRequestType = TimeOffRequestType.NON_PAID_PERSONAL;
        break;
      case "SICK":
        enumRequestType = TimeOffRequestType.SICK;
        break;
    }

    console.log("Updating leave request...");
    console.log(formData);
    revalidatePath("/admins/leave-requests");
  } catch (error) {
    console.error("Error updating leave request:", error);
    throw error;
  }
}

// export async function UpdateLeaveRequest(formData: FormData) {
//   try {
//     console.log("Updating leave request...");
//     console.log(formData);
//     const id = formData.get("id") as string;
//     const status = formData.get("status") as string;
//     const decidedBy = formData.get("decidedBy") as string;
//     let enumStatus = FormStatus.PENDING;
//     switch (status) {
//       case "APPROVED":
//         enumStatus = FormStatus.APPROVED;
//         break;
//       case "DENIED":
//         enumStatus = FormStatus.DENIED;
//         break;
//       case "PENDING":
//         enumStatus = FormStatus.PENDING;
//         break;
//     }
//     const managerComment = formData.get("managerComment") as string;
//     const leaveRequest = await prisma.timeOffRequestForm.update({
//       where: { id },
//       data: {
//         status: enumStatus,
//         managerComment: managerComment,
//         decidedBy: decidedBy,
//         signature: formData.get("signature") as string,
//       },
//     });
//     console.log(leaveRequest);
//     revalidatePath("/admins/leave-requests");
//     return leaveRequest;
//   } catch (error) {
//     console.error("Error updating leave request:", error);
//     throw error;
//   }
// }

export async function deleteAdminJobsite(id: string) {
  try {
    await prisma.jobsite.delete({
      where: { id },
    });
    console.log("Jobsite deleted successfully.");
    return { success: true };
  } catch (error) {
    console.error("Failed to delete jobsite:", error);
    return { success: false, message: "Failed to delete jobsite." };
  }
}
//#TODO: Test Server Action
export async function createAdminJobsite(formData: FormData) {
  try {
    console.log("Saving jobsite changes...");
    console.log(formData);
    const jobsite = await prisma.jobsite.create({
      data: {
        name: formData.get("name") as string,
        address: formData.get("address") as string,
        city: formData.get("city") as string,
        state: formData.get("state") as string,
        country: formData.get("country") as string,
        zipCode: formData.get("zipCode") as string,
        description: formData.get("description") as string,
        comment: formData.get("comment") as string,
        CCTags: {
          connect: {
            id: "1", //automatically connect to the first tag
          },
        },
      },
    });
    console.log(jobsite);
    revalidatePath("/admins/assets/jobsite");
    return jobsite;
  } catch (error) {
    console.error(error);
    throw new Error("Failed to save jobsite changes");
  }
}
//#TODO: Test Server Action
export async function savejobsiteChanges(formData: FormData) {
  try {
    console.log("Saving jobsite changes...");
    console.log(formData);
    const jobsiteId = formData.get("id") as string;
    const jobsite = await prisma.jobsite.update({
      where: { id: jobsiteId },
      data: {
        name: formData.get("name") as string,
        address: formData.get("address") as string,
        city: formData.get("city") as string,
        state: formData.get("state") as string,
        country: formData.get("country") as string,
        zipCode: formData.get("zipCode") as string,
        description: formData.get("description") as string,
        comment: formData.get("comment") as string,
      },
    });
    console.log(jobsite);
    revalidatePath("/admins/assets/jobsites");
    return jobsite;
  } catch (error) {
    console.error(error);
    throw new Error("Failed to save jobsite changes");
  }
}

export async function deleteTagById(tagId: string) {
  try {
    console.log("Deleting tag...");
    console.log(tagId);
    const deletedTag = await prisma.cCTag.delete({
      where: {
        id: tagId,
      },
    });
    console.log(deletedTag);
    revalidatePath("/admins/assets/tags");
    return deletedTag;
  } catch (error) {
    console.error(error);
    throw new Error("Failed to delete tag");
  }
}
//#TODO: Test Server Action
export async function createTag(data: {
  name: string;
  description: string;
  jobs: string[];
  costCodes: string[];
}) {
  try {
    console.log("Creating tag...");
    console.log(data);

    const newTag = await prisma.cCTag.create({
      data: {
        name: data.name,
        Jobsites: {
          connect: data.jobs.map((job) => ({ id: job })), // Connect jobs
        },
        CostCodes: {
          connect: data.costCodes.map((id) => ({ id })), // Connect cost codes
        },
      },
    });
    console.log(newTag);
    return newTag;
  } catch (error) {
    console.error(error);
    throw new Error("Failed to create tag");
  }
}
//#TODO: Test Server Action
export async function changeTags(data: {
  id: string;
  name: string;
  description: string;
  jobs: string[];
  removeJobs: string[];
  costCodes: string[];
  removeCostCodes: string[];
}) {
  try {
    const updateTags = await prisma.cCTag.update({
      where: {
        id: data.id,
      },
      data: {
        name: data.name,
        Jobsites: {
          connect: data.jobs.map((id) => ({ id })), // Add new connections
          disconnect: data.removeJobs.map((id) => ({ id })), // Remove connections
        },
        CostCodes: {
          connect: data.costCodes.map((id) => ({ id })), // Add new connections
          disconnect: data.removeCostCodes.map((id) => ({ id })), // Remove connections
        },
      },
    });
    console.log(updateTags);
    return updateTags;
  } catch (error) {
    console.error(error);
    throw new Error("Failed to update tags");
  }
}

export async function deleteCostCodeById(costcodeId: string) {
  try {
    console.log("Deleting cost code...");
    console.log(costcodeId);
    const deletedCostCode = await prisma.costCode.delete({
      where: { id: costcodeId },
    });
    console.log(deletedCostCode);
    revalidateTag("costcodes");
    return deletedCostCode;
  } catch (error) {
    return error;
  }
}
//#TODO: Test Server Action
export async function changeCostCodeTags(formData: FormData) {
  try {
    console.log("Changing cost code tags...");
    console.log(formData);

    const costcodeId = formData.get("costcodeId") as string;
    const newTags = formData
      .getAll("tags")
      .map((tag) => ({ id: tag as string })); // Map tags to connect format
    const disconnectTags = formData
      .getAll("removeTags")
      .map((tag) => ({ id: tag as string })); // Map tags to disconnect format
    const updateCostcodeTags = await prisma.costCode.update({
      where: {
        id: costcodeId,
      },
      data: {
        name: formData.get("name") as string,
        CCTags: {
          connect: newTags, // Add new connections
          disconnect: disconnectTags, // Remove connections
        },
      },
    });
    console.log(updateCostcodeTags);
    revalidateTag("costCodes");
    return formData;
  } catch (error) {
    return error;
  }
}
//#TODO: Test Server Action
export async function createNewCostCode(formData: FormData) {
  try {
    console.log("Creating new cost code...");
    console.log(formData);
    const newTags = formData
      .getAll("tags")
      .map((tag) => ({ id: tag as string })); // Ensure IDs are numbers

    const newCostCode = await prisma.costCode.create({
      data: {
        name: formData.get("name") as string,
        CCTags: {
          connect: newTags, // Add new connections
        },
      },
    });

    if (!newCostCode) {
      throw new Error("Failed to create cost code");
    }
    revalidateTag("costCodes");

    return true;
  } catch (error) {
    return error;
  }
}

//#TODO: Test Server Action
export async function createCrew(formData: FormData) {
  try {
    console.log("Creating new crew...");

    // Extract data from formData
    const crewName = formData.get("crewName") as string;
    const crewDescription = formData.get("crewDescription") as string;
    const crewRaw = formData.get("crew") as string;
    const teamLead = formData.get("teamLead") as string;
    const crewType = formData.get("crewType") as WorkType;

    if (!crewName || !crewName.trim()) {
      throw new Error("Crew name is required.");
    }
    if (!crewRaw) {
      throw new Error("Crew members data is missing.");
    }
    if (!teamLead) {
      throw new Error("A team lead is required.");
    }

    const crew = JSON.parse(crewRaw as string) as Array<{
      id: string;
    }>;

    // Create the crew
    const newCrew = await prisma.crew.create({
      data: {
        name: crewName.trim(),
        leadId: teamLead,
        crewType: crewType,
        Users: {
          connect: crew.map((user) => ({
            id: user.id,
          })),
        },
      },
    });

    revalidateTag("crews");
    revalidatePath(`/admins/personnel/crew/new-crew`);
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
      }`
    );
  }
}

export async function deleteCrewAction(id: string) {
  try {
    console.log("Deleting crew...");

    // Delete associated crew members first
    await prisma.crew.deleteMany({
      where: { id },
    });

    revalidateTag("crews");
    console.log("Crew deleted successfully");
  } catch (error) {
    console.error("Error deleting crew:", error);
    throw new Error("Failed to delete crew. Please try again.");
  }
}

// Todo: Test Server Action
export async function updateCrew(id: string, formData: FormData) {
  try {
    console.log("Updating crew...");

    // Extract data from formData
    const crewName = formData.get("crewName") as string;
    const crewDescription = formData.get("crewDescription") as string;
    const crew = JSON.parse(formData.get("crew") as string) as Array<{
      id: string;
    }>;
    const initialUsersInCrew = JSON.parse(
      formData.get("initialUsersInCrew") as string
    ) as Array<{ id: string }>;

    const disconnectUsers = initialUsersInCrew.filter(
      (user) => !crew.some((crewUser) => crewUser.id === user.id)
    );

    const connectUsers = crew.filter(
      (crewUser) => !initialUsersInCrew.some((user) => user.id === crewUser.id)
    );

    const teamLead = formData.get("teamLead") as string;

    // Update the crew details
    const updatedCrew = await prisma.crew.update({
      where: { id },
      data: {
        name: crewName,
        leadId: teamLead,

        Users: {
          connect: connectUsers,
          disconnect: disconnectUsers,
        },
      },
    });

    if (!updatedCrew) {
      throw new Error("Crew not found");
    }

    revalidatePath(`/admins/personnel/crew/${id}`);
    revalidateTag("crews");
    console.log("Crew updated successfully");
    return { success: true, message: "Crew updated successfully" };
  } catch (error) {
    console.error("Error updating crew:", error);
    return { success: false, message: "Failed to update crew", error };
  }
}

// Todo: Test Server Action
export async function deleteTimesheet(id: string) {
  try {
    await prisma.timeSheet.delete({
      where: { id },
    });
    revalidateTag("timesheets");
    return true;
  } catch (error) {
    console.error(`Error deleting log with ID ${id}:`, error);
    throw error;
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

// Todo: Test Server Action
export async function saveTimesheet(formData: FormData) {
  try {
    console.log("Saving timesheet...");
    const id = formData.get("id" as string)
      ? (formData.get("id") as string)
      : undefined;
    const userId = formData.get("userId") as string;
    const date = formData.get("date") as string;
    const dateIsoString = new Date(date).toISOString();
    const workType = formData.get("workType") as WorkType;
    const status = formData.get("status") as string;

    let enumStatus = FormStatus.PENDING;
    switch (status) {
      case "Approved":
        enumStatus = FormStatus.APPROVED;
        break;
      case "Denied":
        enumStatus = FormStatus.DENIED;
        break;
      case "Pending":
        enumStatus = FormStatus.PENDING;
        break;
      case "Draft":
        enumStatus = FormStatus.DRAFT;
        break;
      default:
        enumStatus = FormStatus.PENDING;
        break;
    }

    const timesheet = await prisma.timeSheet.upsert({
      where: { id }, // Use an invalid ID for new entries
      create: {
        date: dateIsoString,
        userId: userId,
        jobsiteId: formData.get("jobsiteId") as string,
        costcode: formData.get("costcode") as string,
        startTime: formData.get("startTime") as string,
        endTime: formData.get("endTime") as string,
        comment: formData.get("comment") as string,
        status: FormStatus.PENDING,
        statusComment: formData.get("statusComment") as string,
        workType: workType,
      },
      update: {
        date: dateIsoString,
        userId,
        jobsiteId: formData.get("jobsiteId") as string,
        costcode: formData.get("costcode") as string,
        startTime: formData.get("startTime") as string,
        endTime: formData.get("endTime") as string,
        comment: formData.get("comment") as string,
        status: FormStatus.PENDING,
        statusComment: formData.get("statusComment") as string,
        workType: workType,
      },
    });

    console.log(timesheet);
    revalidatePath(`/admins/personnel/${id}`);
    revalidateTag("timesheets");
    return true;
  } catch (error) {
    console.error("Error saving timesheet:", error);
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
        jobsiteId: "new", // this is a placeholder jobsite
        employeeId: userId,
        startTime: new Date(date).toISOString(),
        endTime: new Date(date).toISOString(),
        comment: null,
        isFinished: true,
        status: FormStatus.APPROVED,
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
        timeSheetId: (formData.get("timeSheetId") as string) || null,
        tascoLogId: (formData.get("tascoLogId") as string) || null,
        laborLogId: (formData.get("laborLogId") as string) || null,
        MaintenanceId: {
          connect: {
            id: formData.get("maintenanceId") as string,
          },
        },
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
    const activeEmployee = formData.get("active") === "true";

    const result = await prisma.user.update({
      where: { id },
      data: {
        activeEmployee: activeEmployee,
        terminationDate: null,
      },
    });
    console.log(result.activeEmployee);

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
    const activeEmployee = formData.get("active") === "true";

    const result = await prisma.user.update({
      where: { id },
      data: {
        activeEmployee: activeEmployee,
        terminationDate: new Date().toISOString(),
      },
    });
    console.log(result.activeEmployee);

    revalidatePath(`/admins/personnel/${id}`);
    return true;
  } catch (error) {
    console.error("Error archiving personnel:", error);
    throw error;
  }
}

// Completed: Test
export async function editPersonnelInfo(formData: FormData) {
  try {
    console.log("Editing personnel info...");
    console.log(formData);

    const id = formData.get("id") as string;

    const firstName = formData.get("firstName") as string;

    const lastName = formData.get("lastName") as string;

    const email = formData.get("email") as string;

    const DOB = formData.get("DOB") as string;

    const permission = formData.get("permission") as string;

    const truckBool = formData.get("truckView") as string;
    const truckView = Boolean(truckBool === "true");

    const tascoBool = formData.get("tascoView") as string;
    const tascoView = Boolean(tascoBool === "true");

    const laborBool = formData.get("laborView") as string;
    const laborView = Boolean(laborBool === "true");

    const mechanicBool = formData.get("mechanicView") as string;
    const mechanicView = Boolean(mechanicBool === "true");

    console.log(truckView, tascoView, laborView, mechanicView);

    await prisma.user.update({
      where: { id: id },
      data: {
        firstName: firstName,
        lastName: lastName,
        email: email,
        DOB: DOB,
        permission: permission as Permission,
        truckView: truckView,
        tascoView: tascoView,
        laborView: laborView,
        mechanicView: mechanicView,
      },
    });

    const phoneNumber = formData.get("phoneNumber") as string;
    const emergencyContact = formData.get("emergencyContact") as string;
    const emergencyContactNumber = formData.get(
      "emergencyContactNumber"
    ) as string;

    await prisma.contacts.update({
      where: { userId: id },
      data: {
        phoneNumber: phoneNumber,
        emergencyContact: emergencyContact,
        emergencyContactNumber: emergencyContactNumber,
      },
    });

    return true;
  } catch (error) {
    console.error("Error editing personnel info:", error);
    return new Response("Error", { status: 500 });
  }
}

// Create jobsite admin
export async function createJobsite(formData: FormData) {
  try {
    console.log("Creating jobsite...");
    console.log(formData);

    await prisma.jobsite.create({
      data: {
        name: formData.get("name") as string,
        address: formData.get("address") as string,
        city: formData.get("city") as string,
        state: formData.get("state") as string,
        zipCode: formData.get("zip") as string,
        country: formData.get("country") as string,
        description: formData.get("description") as string,
        comment: (formData.get("jobsite_comment") as string) || null,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });
    console.log("Jobsite created successfully.");

    // Revalidate the path
    revalidatePath(`/admin/assets`);
  } catch (error) {
    console.error("Error creating jobsite:", error);
    throw error;
  }
}

export async function updateJobsite(formData: FormData) {
  try {
    console.log("Updating jobsite...");
    console.log(formData);
    const name = formData.get("name") as string;
    const address = formData.get("address") as string;
    const zipCode = formData.get("zipCode") as string;
    const city = formData.get("city") as string;
    const state = formData.get("state") as string;
    const country = formData.get("country") as string;
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
        address: address,
        city: city,
        state: state,
        country: country,
        zipCode: zipCode,
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
