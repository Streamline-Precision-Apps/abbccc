"use server";
import prisma from "@/lib/prisma";
import { FormStatus, Permission } from "@/lib/types";

import { revalidatePath, revalidateTag } from "next/cache";

export async function deleteTimesheet(id: number) {
  try {
    await prisma.timeSheets.delete({
      where: { id },
    });
    revalidateTag("timesheets");
    return true;
  } catch (error) {
    console.error(`Error deleting log with ID ${id}:`, error);
    throw error;
  }
}

export async function deleteLog(id: number) {
  try {
    await prisma.employeeEquipmentLogs.delete({
      where: { id },
    });
    revalidateTag("timesheets");
    return true;
  } catch (error) {
    console.error(`Error deleting log with ID ${id}:`, error);
    throw error;
  }
}

export async function saveTimesheet(formData: FormData) {
  try {
    console.log("Saving timesheet...");
    const id = formData.get("id")
      ? parseInt(formData.get("id") as string)
      : undefined;
    const userId = formData.get("userId") as string;

    const date = formData.get("date") as string;
    const dateIsoString = new Date(date).toISOString();

    const timesheet = await prisma.timeSheets.upsert({
      where: { id: id || -1 }, // Use an invalid ID for new entries
      create: {
        userId,
        startTime: formData.get("startTime") as string,
        endTime: formData.get("endTime") as string,
        duration: parseFloat(formData.get("duration") as string),
        date: dateIsoString,
        costcode: formData.get("costcode") as string,
        jobsiteId: formData.get("jobsiteId") as string,
        timeSheetComments: formData.get("timeSheetComments") as string,
        vehicleId: parseInt(formData.get("vehicleId") as string),
        startingMileage: parseInt(formData.get("startingMileage") as string),
        endingMileage: parseInt(formData.get("endingMileage") as string),
        leftIdaho: formData.get("leftIdaho") === "true",
        refuelingGallons: parseInt(formData.get("refuelingGallons") as string),
        hauledLoadsQuantity: parseInt(
          formData.get("hauledLoadsQuantity") as string
        ),
        equipmentHauled: formData.get("equipmentHauled") as string,
        materialsHauled: formData.get("materialsHauled") as string,
      },
      update: {
        startTime: formData.get("startTime") as string,
        endTime: formData.get("endTime") as string,
        duration: parseFloat(formData.get("duration") as string),
        submitDate: dateIsoString,
        date: dateIsoString,
        costcode: formData.get("costcode") as string,
        jobsiteId: formData.get("jobsiteId") as string,
        timeSheetComments: formData.get("timeSheetComments") as string,
        vehicleId: parseInt(formData.get("vehicleId") as string),
        startingMileage: parseInt(formData.get("startingMileage") as string),
        endingMileage: parseInt(formData.get("endingMileage") as string),
        leftIdaho: formData.get("leftIdaho") === "true",
        refuelingGallons: parseInt(formData.get("refuelingGallons") as string),
        hauledLoadsQuantity: parseInt(
          formData.get("hauledLoadsQuantity") as string
        ),
        status: formData.get("status") as FormStatus,
        equipmentHauled: formData.get("equipmentHauled") as string,
        materialsHauled: formData.get("materialsHauled") as string,
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

export async function CreateTimesheet(userId: string, date: string) {
  try {
    const timesheet = await prisma.timeSheets.create({
      data: {
        submitDate: new Date().toISOString(),
        userId: userId,
        startTime: new Date(date).toISOString(),
        endTime: new Date(date).toISOString(),
        duration: 0,
        date: new Date(date).toISOString(),
        costcode: "new",
        jobsiteId: "new",
        timeSheetComments: null,
        vehicleId: null,
        startingMileage: null,
        endingMileage: null,
        leftIdaho: null,
        refuelingGallons: null,
        hauledLoadsQuantity: null,
        equipmentHauled: null,
        materialsHauled: null,
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

export async function CreateEquipmentLogs(userId: string, date: string) {
  try {
    console.log("Saving equipment logs...");

    const equipmentLog = await prisma.employeeEquipmentLogs.create({
      data: {
        date: new Date(date).toISOString(),
        equipmentId: "new", // this is a placeholder equipment
        jobsiteId: "new", // this is a placeholder jobsite
        employeeId: userId,
        startTime: new Date(date).toISOString(),
        endTime: new Date(date).toISOString(),
        duration: null,
        isRefueled: false,
        fuelUsed: null,
        comment: null,
        isCompleted: true,
        isSubmitted: true,
        status: "APPROVED",
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

export async function saveEquipmentLogs(formData: FormData) {
  try {
    console.log("Saving equipment logs...");
    console.log("Form data form saveEquipmentLogs", formData);
    const id = formData.get("id")
      ? parseInt(formData.get("id") as string)
      : undefined;

    const equipmentLog = await prisma.employeeEquipmentLogs.update({
      where: { id: id }, // Use an invalid ID for new entries
      data: {
        id: id,
        startTime: formData.get("startTime") as string,
        endTime: formData.get("endTime") as string,
        equipmentId: formData.get("equipmentId") as string,
        duration: parseFloat(formData.get("duration") as string),
        isRefueled: formData.get("isRefueled") === "true",
        fuelUsed: parseInt(formData.get("fuelUsed") as string),
        comment: formData.get("comment") as string,
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

export async function reactivatePersonnel(formData: FormData) {
  try {
    console.log("Archiving personnel...");
    console.log(formData);
    const id = formData.get("userId") as string;
    const activeEmployee = formData.get("active") === "true";

    const result = await prisma.users.update({
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

export async function removeProfilePic(formData: FormData) {
  try {
    console.log("Removing profile pic...");
    console.log(formData);
    const id = formData.get("userId") as string;

    const result = await prisma.users.update({
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

export async function archivePersonnel(formData: FormData) {
  try {
    console.log("Archiving personnel...");
    console.log(formData);
    const id = formData.get("userId") as string;
    const activeEmployee = formData.get("active") === "true";

    const result = await prisma.users.update({
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
// Edit personnel info
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

    await prisma.users.update({
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
      where: { employeeId: id },
      data: {
        email: email,
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

export async function timecardData(formData: FormData) {
  const startDate = formData.get("start") as string;
  const endDate = formData.get("end") as string;

  const startOfDay = new Date(startDate);
  startOfDay.setUTCHours(0, 0, 0, 0);

  const endOfDay = new Date(endDate);
  endOfDay.setUTCHours(23, 59, 59, 999);

  const timeSheets = await prisma.timeSheets.findMany({
    where: {
      date: {
        gte: startOfDay.toISOString(),
        lte: endOfDay.toISOString(),
      },
    },
  });

  console.log("\n\n\nTimeSheets:", timeSheets);
  return timeSheets;
}

// Create jobsite admin
export async function createJobsite(formData: FormData) {
  try {
    console.log("Creating jobsite...");
    console.log(formData);

    await prisma.jobsites.create({
      data: {
        name: formData.get("name") as string,
        streetNumber: (formData.get("streetNumber") as string) || null,
        streetName: formData.get("streetName") as string,
        city: formData.get("city") as string,
        state: (formData.get("state") as string) || null,
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
    const streetNumber = formData.get("streetNumber") as string;
    const streetName = formData.get("streetName") as string;
    const city = formData.get("city") as string;
    const state = formData.get("state") as string;
    const country = formData.get("country") as string;
    const description = formData.get("description") as string;
    const comment = formData.get("jobsite_comment") as string;
    const isActive = Boolean(formData.get("isActive") as string);

    const id = formData.get("id") as string;
    await prisma.jobsites.update({
      where: {
        id: id,
      },
      data: {
        name: name,
        streetNumber: streetNumber,
        streetName: streetName,
        city: city,
        state: state,
        country: country,
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
  const jobsite = await prisma.jobsites.findFirst({
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
    await prisma.jobsites.delete({
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

    await prisma.jobsites.update({
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
    await prisma.costCodes.create({
      data: {
        name: formData.get("name") as string,
        description: formData.get("description") as string,
        type: formData.get("type") as string,
      },
    });
    revalidatePath(`/admin/assets`);
  } catch (error) {
    console.error("Error creating cost code:", error);
    throw error;
  }
}
export async function fetchByNameCostCode(description: string) {
  const costCode = await prisma.costCodes.findFirst({
    where: {
      description: description,
    },
  });
  revalidatePath(`/admin/assets`);
  return costCode;
}

export async function findAllCostCodesByTags(formData: FormData) {
  console.log("findAllCostCodesByTags");
  console.log(formData);

  const type = formData.get("type") as string;
  const costCodes = await prisma.costCodes.findMany({
    where: {
      type: type,
    },
  });
  revalidatePath(`/admin/assets`);
  return costCodes;
}

export async function EditCostCode(formData: FormData) {
  try {
    console.log("Creating cost code...");
    console.log(formData);
    const id = Number(formData.get("id") as string);
    const name = formData.get("name") as string;
    const costCodeDescription = formData.get("description") as string;
    const costCodeType = formData.get("type") as string;
    await prisma.costCodes.update({
      where: {
        id: id,
      },
      data: {
        name: name,
        description: costCodeDescription,
        type: costCodeType,
      },
    });

    revalidatePath(`/admin/assets`);
  } catch (error) {
    console.error("Error creating cost code:", error);
    throw error;
  }
}
export async function deleteCostCode(formData: FormData) {
  const id = Number(formData.get("id") as string);
  try {
    await prisma.costCodes.delete({
      where: { id: id },
    });
    revalidatePath(`/admin/assets`);
    return true;
  } catch (error) {
    console.error("Error deleting jobsite:", error);
    throw error;
  }
}

export async function TagCostCodeChange(formData: FormData) {
  try {
    console.log("Creating cost code...");
    console.log(formData);
    const id = Number(formData.get("id") as string);
    const costCodeType = formData.get("type") as string;
    await prisma.costCodes.update({
      where: {
        id: id,
      },
      data: {
        type: costCodeType,
      },
    });

    revalidatePath(`/admin/assets`);
  } catch (error) {
    console.error("Error creating cost code:", error);
    throw error;
  }
}

export async function AddListToJobsite(formData: FormData) {
  try {
    console.log("Adding cost codes to job site...");
    const qrId = formData.get("qrId") as string;
    const costCodeTypes = (formData.get("types") as string)
      .split(",")
      .map((code) => code.trim());

    // Find all cost codes that match the list of types
    const costCodes = await prisma.costCodes.findMany({
      where: {
        type: {
          in: costCodeTypes,
        },
      },
    });

    if (costCodes.length === 0) {
      console.log("No matching cost codes found.");
      return;
    }

    console.log("Cost codes found:", costCodes);

    // Connect the found cost codes to the job site
    const jobsite = await prisma.jobsites.update({
      where: {
        qrId: qrId,
      },
      data: {
        costCode: {
          connect: costCodes.map((code) => ({ id: code.id })),
        },
      },
    });

    console.log("Job site updated with cost codes:", jobsite);

    // Revalidate the path to reflect changes
    revalidatePath(`/admin/assets`);
  } catch (error) {
    console.error("Error adding cost codes to job site:", error);
    throw error;
  }
}

export async function RemoveListToJobsite(formData: FormData) {
  try {
    console.log("Adding cost codes to job site...");
    const qrId = formData.get("qrId") as string;
    const costCodeTypes = (formData.get("types") as string)
      .split(",")
      .map((code) => code.trim());

    // Find all cost codes that match the list of types
    const costCodes = await prisma.costCodes.findMany({
      where: {
        type: {
          in: costCodeTypes,
        },
      },
    });

    if (costCodes.length === 0) {
      console.log("No matching cost codes found.");
      return;
    }

    console.log("Cost codes found:", costCodes);

    // Connect the found cost codes to the job site
    const jobsite = await prisma.jobsites.update({
      where: {
        qrId: qrId,
      },
      data: {
        costCode: {
          disconnect: costCodes.map((code) => ({ id: code.id })),
        },
      },
    });

    console.log("Job site updated with cost codes:", jobsite);

    // Revalidate the path to reflect changes
    revalidatePath(`/admin/assets`);
  } catch (error) {
    console.error("Error adding cost codes to job site:", error);
    throw error;
  }
}
