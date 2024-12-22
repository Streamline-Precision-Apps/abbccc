"use server";
import prisma from "@/lib/prisma";
import { WorkType } from "@prisma/client";
import { revalidatePath } from "next/cache";

// Parse UTC function to handle timezone conversion
const parseUTC = (timestamp: string): Date => {
  const date = new Date(timestamp);
  if (isNaN(date.getTime())) {
    throw new RangeError(`Invalid time value: ${timestamp}`);
  }
  date.setMinutes(date.getMinutes() - date.getTimezoneOffset());
  console.log("Parse UTC date:", date);
  return date;
};
const parseUTCNoTz = (timestamp: string): Date => {
  const date = new Date(timestamp);
  if (isNaN(date.getTime())) {
    throw new RangeError(`Invalid time value: ${timestamp}`);
  }
  date.setMinutes(date.getMinutes());
  console.log("Parse UTC date:", date);
  return date;
};
// Get all TimeSheets
export async function getTimeSheetsbyId() {
  const timesheets = prisma.timeSheet.findMany();
  console.log(timesheets);
  return timesheets;
}

// Get TimeSheet by id
export async function fetchTimesheets(employeeId: string, date: string) {
  const startOfDay = new Date(date);
  startOfDay.setUTCHours(0, 0, 0, 0);

  const endOfDay = new Date(date);
  endOfDay.setUTCHours(23, 59, 59, 999);

  const timeSheet = await prisma.timeSheet.findMany({
    where: {
      userId: employeeId,
      date: {
        gte: startOfDay.toISOString(),
        lte: endOfDay.toISOString(),
      },
    },
  });

  console.log("\n\n\nTimeSheets:", timeSheet);
  return timeSheet;
}

// Create TimeSheet
// used at each login and will retain that timesheetId until the user logs out with switch jobsite
export async function CreateTimeSheet(formData: FormData) {
  try {
    console.log("entered CreateTimeSheet:");
    console.log("formData:", formData);
    // convert workType to correct enum
    const workType = formData.get("workType") as string;
    if (workType === "general") {
      formData.set("workType", "LABOR");
    }
    if (workType === "mechanic") {
      formData.set("workType", "MECHANIC");
    }
    if (workType === "tasco") {
      formData.set("workType", "TASCO");
    }
    if (workType === "truck") {
      formData.set("workType", "TRUCK_DRIVER");
    }

    const newTimeSheet = await prisma.timeSheet.create({
      data: {
        submitDate: parseUTC(
          formData.get("submitDate") as string
        ).toISOString(),
        date: parseUTC(formData.get("date") as string).toISOString(),
        jobsite: { connect: { qrId: formData.get("jobsiteId") as string } },
        costcode: formData.get("costcode") as string,
        comment: (formData.get("timeSheetComments") as string) || null,
        user: { connect: { id: formData.get("userId") as string } },
        startTime: formData.get("startTime") as string,
        workType: formData.get("workType") as WorkType,
      },
    });

    console.log("newTimeSheet:", newTimeSheet);
    revalidatePath("/admins/settings");
    revalidatePath("/admins/assets");
    revalidatePath("/admins/reports");
    revalidatePath("/admins/personnel");
    revalidatePath("/admins");
    return newTimeSheet;
  } catch (error) {
    console.error("Error creating timesheet:", error);
    throw error;
  }
}

// Create TimeSheet
// used at each login and will retain that timesheetId until the user logs out with switch jobsite
export async function AddWholeTimeSheet(formData: FormData) {
  try {
    console.log("Creating Timesheet...");
    console.log(formData);

    const newTimeSheet = await prisma.timeSheet.create({
      data: {
        submitDate: parseUTC(
          formData.get("submitDate") as string
        ).toISOString(),
        date: parseUTC(formData.get("date") as string).toISOString(),
        jobsite: { connect: { qrId: formData.get("jobsiteId") as string } },
        costcode: formData.get("costcode") as string,
        startTime: parseUTC(formData.get("startTime") as string).toISOString(),
        endTime: formData.get("endTime")
          ? parseUTC(formData.get("endTime") as string).toISOString()
          : null,
        comment: formData.get("timeSheetComments")
          ? (formData.get("timeSheetComments") as string)
          : null,
        user: { connect: { id: formData.get("userId") as string } },
        workType: formData.get("workType") as WorkType, // Add this line
      },
    });
    console.log("Timesheet created successfully.");
    return newTimeSheet;
  } catch (error) {
    console.error("Error creating timesheet:", error);
    throw error;
  }
}

export async function editTimeSheet(formData: FormData) {
  console.log("Editing Timesheet...");
  console.log(formData);
  try {
    const id = formData.get("id") as string;
    const costcode = formData.get("costcode");
    const endTime = parseUTC(formData.get("endTime") as string);
    const startTime = parseUTC(formData.get("startTime") as string);

    if (!id) {
      throw new Error("ID is required");
    }

    const timeSheet = await prisma.timeSheet.update({
      where: { id: id },
      data: {
        costcode: costcode as string,
        startTime: startTime.toISOString(),
        endTime: endTime.toISOString(),
      },
    });

    console.log(timeSheet);
  } catch (error) {
    console.error("Error editing timesheet:", error);
  }
}

// provides a way to update a timesheet and will give supervisor access to all timesheets
// and provide a way to alter them as needed by employee accuracy.
export async function updateTimeSheet(formData: FormData) {
  try {
    console.log("formData:", formData);

    // Get the ID from formData
    const id = formData.get("id") as string;
    if (!id) {
      throw new Error("Invalid timesheet ID");
    }

    // Fetch the startTime from the database to ensure correct calculations
    const start = await prisma.timeSheet.findUnique({
      where: { id },
      select: { startTime: true },
    });

    if (!start || !start.startTime) {
      throw new Error("Start time not found for the given timesheet ID.");
    }

    const startTime = parseUTCNoTz(start.startTime.toISOString()); // it was stored correctly in the db so we dont need to fix it.
    console.log("startTime:", startTime);

    // Parse endTime from the formData
    const endTimeString = formData.get("endTime") as string;
    if (!endTimeString) {
      throw new Error("End time is required");
    }

    const endTime = parseUTC(endTimeString);
    console.log("endTime:", endTime);

    // Update the timesheet with new data
    const updatedTimeSheet = await prisma.timeSheet.update({
      where: { id },
      data: {
        endTime: endTime.toISOString(),
      },
    });

    console.log("Timesheet updated successfully.");
    console.log(updatedTimeSheet);

    // Optionally, you can handle revalidation of paths here or elsewhere
    revalidatePath(`/`);
  } catch (error) {
    console.error("Error updating timesheet:", error);
  }
}

export async function updateTimeSheetBySwitch(formData: FormData) {
  try {
    console.log("formData:", formData);
    console.log("switch jobsite, updating Timesheet...");

    const id = formData.get("id") as string;

    // Fetch the startTime from the database to prevent irregular dates
    const start = await prisma.timeSheet.findUnique({
      where: { id },
      select: { startTime: true },
    });

    const startTime = start?.startTime;
    if (!startTime) {
      throw new Error("Start time not found for the given timesheet ID.");
    }

    console.log("formData:", formData);
    console.log("Updating Timesheet...");

    const updatedTimeSheet = await prisma.timeSheet.update({
      where: { id },
      data: {
        endTime: parseUTC(formData.get("endTime") as string).toISOString(),
        comment: formData.get("timeSheetComments") as string,
      },
    });
    console.log("Timesheet updated successfully.");
    console.log(updatedTimeSheet);

    // Revalidate the path
    revalidatePath(`/`);
    revalidatePath("/admins/settings");
    revalidatePath("/admins/assets");
    revalidatePath("/admins/reports");
    revalidatePath("/admins/personnel");
    revalidatePath("/admins");
    return { success: true };
  } catch (error) {
    console.log(error);
  }
}

export async function GetAllTimeSheets(date: string) {
  date = new Date(date).toISOString();
  const timeSheet = await prisma.timeSheet.findMany({
    where: { date: { equals: date } },
  });
  return timeSheet;
}

// Delete TimeSheet by id
// will be used by Admin only
export async function deleteTimeSheet(id: string) {
  await prisma.timeSheet.delete({
    where: { id },
  });
}

export async function findTimesheetsforDay(formData: FormData) {
  console.log("formData:", formData);

  const id = formData.get("id") as string;
  const dateString = formData.get("date") as string;

  // Create a full local ISO string (including time)
  const localDateISO = new Date(dateString).toISOString();

  // Query for timesheets where the full ISO string matches
  const timeSheet = await prisma.timeSheet.findMany({
    where: {
      userId: id,
      date: {
        equals: localDateISO, // Match the full ISO string
      },
    },
  });

  if (timeSheet.length === 0) {
    return null;
  } else {
    return timeSheet;
  }
}
