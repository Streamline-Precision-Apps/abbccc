"use server";

import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { TimeSheet } from "@/lib/types";
import { WorkType } from "@prisma/client";
import { error } from "console";
import { revalidatePath } from "next/cache";
import { formatInTimeZone, toZonedTime } from "date-fns-tz";
const { formatISO } = require("date-fns");
// Get all TimeSheets
export async function getTimeSheetsbyId() {
  const timesheets = prisma.timeSheet.findMany();
  console.log(timesheets);
  return timesheets;
}

export async function processTimecards() {
  try {
    const timecards = await prisma.timeSheet.findMany({
      where: { endTime: null }, // Find all timecards with empty endTime
    });

    const midnight = new Date(); // Create a reference for 11:59:59 PM
    midnight.setHours(23, 59, 59, 999);

    const nextDayStart = new Date(midnight); // Start the next segment at midnight
    nextDayStart.setMilliseconds(1);

    const updatedTimecards = timecards.map((card) => ({
      ...card,
      endTime: midnight, // Update endTime to current time
    }));
    const newTimecards = timecards.map((card) => ({
      ...card,
      id: "",
      endTime: nextDayStart, // Update endTime to current time
    }));

    // Batch update the timecards
    await prisma.timeSheet.updateMany({ data: updatedTimecards });
    await prisma.timeSheet.createMany({ data: newTimecards });

    console.log(`${updatedTimecards.length} timecards processed.`);
  } catch (error) {
    console.error("Error processing timecards:", error);
  }
}

// Get TimeSheet by id
export async function fetchTimesheets(employeeId: string, date: string) {
  console.log("Fetching timesheets for:", { employeeId, date });

  // Convert the date to UTC start and end times
  const startOfDay = new Date(date);
  startOfDay.setUTCHours(0, 0, 0, 0);

  const endOfDay = new Date(date);
  endOfDay.setUTCHours(23, 59, 59, 999);

  try {
    // Fetch timesheets from Prisma
    const timeSheets = await prisma.timeSheet.findMany({
      where: {
        userId: employeeId,
        date: {
          gte: startOfDay.toISOString(), // Start of the day in UTC
          lte: endOfDay.toISOString(), // End of the day in UTC
        },
      },
      orderBy: {
        startTime: "asc",
      },
      include: {
        tascoLogs: true,
        truckingLogs: true,
        maintenanceLogs: true,
        employeeEquipmentLogs: true,
      },
    });

    console.log("Fetched Timesheets:", timeSheets);

    // Convert fetched ISO times to local timezone
    const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const adjustedTimeSheets = timeSheets.map((sheet) => ({
      ...sheet,
      startTime: sheet.startTime
        ? formatInTimeZone(sheet.startTime, timeZone, "yyyy-MM-dd HH:mm:ss")
        : "",
      endTime: sheet.endTime
        ? formatInTimeZone(sheet.endTime, timeZone, "yyyy-MM-dd HH:mm:ss")
        : "",
    }));

    console.log("Adjusted Timesheets:", adjustedTimeSheets);
    return adjustedTimeSheets;
  } catch (error) {
    console.error("Error fetching timesheets:", error);
    throw new Error("Failed to fetch timesheets");
  }
}
//-------------------------------------------------------------------------------------------------------------------------------
//-----------------------------------------------  GENERAL CRUD  ---------------------------------------------------------------
//-------------------------------------------------------------------------------------------------------------------------------
// Create TimeSheet
export async function CreateTimeSheet(formData: FormData) {
  try {
    console.log("entered CreateTimeSheet:");
    console.log("formData:", formData);
    // convert workType to correct enum
    const workTypeMapping: Record<string, WorkType> = {
      general: "LABOR",
      mechanic: "MECHANIC",
      tasco: "TASCO",
      truck: "TRUCK_DRIVER",
    };
    // create a key from the type
    const originalWorkType = formData.get("workType");
    if (
      typeof originalWorkType !== "string" ||
      !(originalWorkType in workTypeMapping)
    ) {
      throw new Error(`Invalid workType: ${originalWorkType}`);
    }
    // using the record find the type base on the user input
    const workType = workTypeMapping[originalWorkType];

    // this will set costcode to undefined if empty
    const costCode = formData.get("costcode") as string;
    console.log("costcode:", costCode);

    const newTimeSheet = await prisma.timeSheet.create({
      data: {
        submitDate: formatISO(formData.get("submitDate") as string),
        date: formatISO(formData.get("date") as string),
        jobsite: { connect: { qrId: formData.get("jobsiteId") as string } },
        comment: (formData.get("timeSheetComments") as string) || null,
        user: { connect: { id: formData.get("userId") as string } },
        costCode: { connect: { name: costCode } },
        startTime: formatISO(formData.get("startTime") as string),
        workType: workType,
      },
    });

    console.log("newTimeSheet:", newTimeSheet);
    revalidatePath("/admins/settings");
    revalidatePath("/admins/assets");
    revalidatePath("/admins/reports");
    revalidatePath("/admins/personnel");
    revalidatePath("/admins");
    revalidatePath("/dashboard");

    return newTimeSheet;
  } catch (error) {
    console.error("Error creating timesheet:", error);
    throw error;
  }
}
//--------- Update Time Sheet
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
        endTime: formatISO(formData.get("endTime") as string),
        comment: formData.get("timesheetComments") as string,
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
//--------- Update Time Sheet
export async function breakOutTimeSheet(formData: FormData) {
  try {
    console.log("formData:", formData);
    console.log("switch jobsite, updating Timesheet...");
    const id = formData.get("id") as string;
    const endTime = formatISO(formData.get("endTime") as string);
    const comment = formData.get("timesheetComments") as string;

    const updatedTimeSheet = await prisma.timeSheet.update({
      where: { id },
      data: {
        endTime,
        comment,
      },
    });
    console.log("Timesheet updated successfully.");
    console.log(updatedTimeSheet);

    // Revalidate the path
    revalidatePath(`/`);
    revalidatePath("/dashboard");
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
//-------------------------------------------------------------------------------------------------------------------------------
//
//
//-------------------------------------------------------------------------------------------------------------------------------
//-------------------------------------------------------------------------------------------------------------------------------
//-----------------------------------------------  TRUCKING CRUD  ---------------------------------------------------------------
//-------------------------------------------------------------------------------------------------------------------------------
//--------- Create Truck driver Time Sheet
export async function CreateTruckDriverTimeSheet(formData: FormData) {
  try {
    console.log("entered CreateTimeSheet:");
    console.log("formData:", formData);

    // create a record to loop through
    const workTypeMapping: Record<string, WorkType> = {
      general: "LABOR",
      mechanic: "MECHANIC",
      tasco: "TASCO",
      truck: "TRUCK_DRIVER",
    };
    // create a key from the type
    const originalWorkType = formData.get("workType");
    if (
      typeof originalWorkType !== "string" ||
      !(originalWorkType in workTypeMapping)
    ) {
      throw new Error(`Invalid workType: ${originalWorkType}`);
    }
    // using the record find the type base on the user input
    const workType = workTypeMapping[originalWorkType];

    // create a catch to be starting mileage is a string
    const startingMileageStr = formData.get("startingMileage");
    if (typeof startingMileageStr !== "string") {
      throw new Error("startingMileage is required and must be a string");
    }
    // parse into an Int to the db
    const startingMileage = parseInt(startingMileageStr, 10);
    if (isNaN(startingMileage)) {
      throw new Error("startingMileage must be a valid number");
    }

    // Jobsite and User IDs
    const jobsiteId = formData.get("jobsiteId") as string;
    const userId = formData.get("userId") as string;
    const equipmentId = formData.get("equipment") as string;
    const timeSheetComments = formData.get("timeSheetComments") as string;
    const costCode = formData.get("costcode") as string;
    const laborType = formData.get("laborType") as string;
    const truck = formData.get("truck") as string;

    // Create TimeSheet and TruckingLog within a transaction

    const createdTimeSheet = await prisma.timeSheet.create({
      data: {
        submitDate: formatISO(formData.get("submitDate") as string),
        date: formatISO(formData.get("date") as string),
        jobsite: { connect: { qrId: jobsiteId } },
        comment: timeSheetComments || null,
        user: { connect: { id: userId } },
        costCode: { connect: { name: costCode } },
        startTime: formatISO(formData.get("startTime") as string),
        workType,
      },
    });

    const truckingLog = await prisma.truckingLog.create({
      data: {
        laborType: laborType,
        timeSheetId: createdTimeSheet.id,
        taskName: laborType,
        equipmentId:
          laborType === "truckDriver"
            ? truck
            : laborType === "operator"
            ? equipmentId
            : null,
        startingMileage: startingMileage || null,
      },
    });

    console.log("TimeSheet");
    console.table(createdTimeSheet);
    console.log("Trucking log");
    console.table(truckingLog);

    revalidatePath("/admins/settings");
    revalidatePath("/admins/assets");
    revalidatePath("/admins/reports");
    revalidatePath("/admins/personnel");
    revalidatePath("/admins");
    revalidatePath("/dashboard");

    return createdTimeSheet;
  } catch (error) {
    console.error("Error creating timesheet:", error);
    throw error;
  }
}
//--------- Update Truck Driver sheet By switch Jobs
export async function updateTruckDriverTSBySwitch(formData: FormData) {
  try {
    const session = await auth();
    if (!session) {
      throw error("Unauthorized user");
    }
    // verify data is passed through
    console.log("formData:", formData);

    const id = formData.get("id") as string;

    // just updating because we do not need data
    await prisma.timeSheet.update({
      where: { id },
      data: {
        endTime: formatISO(formData.get("endTime") as string),
        comment: formData.get("timeSheetComments") as string,
      },
    });

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
//-------------------------------------------------------------------------------------------------------------------------------
//
//
//-------------------------------------------------------------------------------------------------------------------------------
//-------------------------------------------------------------------------------------------------------------------------------
//-----------------------------------------------  TRUCKING CRUD  ---------------------------------------------------------------
//-------------------------------------------------------------------------------------------------------------------------------
//--------- Create Truck driver Time Sheet
export async function CreateTascoTimeSheet(formData: FormData) {
  try {
    console.log("entered CreateTimeSheet:");
    console.log("formData:", formData);

    // Jobsite and User IDs
    const jobsiteId = formData.get("jobsiteId") as string;
    const userId = formData.get("userId") as string;
    const equipmentId = formData.get("equipment") as string;
    const timeSheetComments = formData.get("timeSheetComments") as string;
    const costCode = formData.get("costcode") as string;
    const shiftType = formData.get("shiftType") as string;

    // Create TimeSheet and TruckingLog within a transaction
    const createdTimeSheet = await prisma.timeSheet.create({
      data: {
        submitDate: formatISO(formData.get("submitDate") as string),
        date: formatISO(formData.get("date") as string),
        jobsite: { connect: { qrId: jobsiteId } },
        comment: timeSheetComments || null,
        user: { connect: { id: userId } },
        costCode: { connect: { name: costCode } },
        startTime: formatISO(formData.get("startTime") as string),
        workType: "TASCO",
      },
    });

    let materialType;
    let laborType = formData.get("laborType") as string;
    if (shiftType === "abcdShift") {
      materialType = formData.get("materialType") as string;
    } else {
      materialType = "";
      laborType = "equipmentOperator";
    }

    // Create a tasco log to be edited in tasco manager
    const tascoLog = await prisma.tascoLog.create({
      data: {
        timeSheetId: createdTimeSheet.id,
        shiftType,
        equipmentId: equipmentId || null,
        laborType,
        materialType,
      },
    });

    console.log("TimeSheet");
    console.log(createdTimeSheet);
    console.log("Tasco log");
    console.log(tascoLog);

    revalidatePath("/admins/settings");
    revalidatePath("/admins/assets");
    revalidatePath("/admins/reports");
    revalidatePath("/admins/personnel");
    revalidatePath("/admins");
    revalidatePath("/dashboard");

    return createdTimeSheet;
  } catch (error) {
    console.error("Error creating timesheet:", error);
    throw error;
  }
}
//-------------------------------------------------------------------------------------------------------------------------------
//--------- Update Truck Driver sheet By switch Jobs
export async function updateTascoTSBySwitch(formData: FormData) {
  try {
    const session = await auth();
    if (!session) {
      throw error("Unauthorized user");
    }
    // verify data is passed through
    console.log("formData:", formData);

    const id = formData.get("id") as string;

    // just updating because we do not need data
    await prisma.timeSheet.update({
      where: { id },
      data: {
        endTime: formatISO(formData.get("endTime") as string),
        comment: formData.get("timeSheetComments") as string,
      },
    });

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
//-------------------------------------------------------------------------------------------------------------------------------
//
//
//-------------------------------------------------------------------------------------------------------------------------------
//-------------------------------------------------------------------------------------------------------------------------------
//-----------------------------------------------  TRUCKING CRUD  ---------------------------------------------------------------
//-------------------------------------------------------------------------------------------------------------------------------
//--------- Create Truck driver Time Sheet
export async function CreateMechanicTimeSheet(formData: FormData) {
  try {
    console.log("entered CreateTimeSheet:");
    console.log("formData:", formData);

    // Jobsite and User IDs
    const jobsiteId = formData.get("jobsiteId") as string;
    const userId = formData.get("userId") as string;
    const timeSheetComments = formData.get("timeSheetComments") as string;

    // Create TimeSheet and TruckingLog within a transaction
    const createdTimeSheet = await prisma.timeSheet.create({
      data: {
        submitDate: formatISO(formData.get("submitDate") as string),
        date: formatISO(formData.get("date") as string),
        jobsite: { connect: { qrId: jobsiteId } },
        comment: timeSheetComments || null,
        user: { connect: { id: userId } },
        costCode: { connect: { name: "#00.50" } }, //connects to default cost code
        startTime: formatISO(formData.get("startTime") as string),
        workType: "TASCO",
      },
    });

    console.log("TimeSheet");
    console.log(createdTimeSheet);

    revalidatePath("/admins/settings");
    revalidatePath("/admins/assets");
    revalidatePath("/admins/reports");
    revalidatePath("/admins/personnel");
    revalidatePath("/admins");
    revalidatePath("/dashboard");

    return createdTimeSheet;
  } catch (error) {
    console.error("Error creating timesheet:", error);
    throw error;
  }
}
//--------- Update Truck Driver sheet By switch Jobs
export async function updateMechanicTSBySwitch(formData: FormData) {
  try {
    const session = await auth();
    if (!session) {
      throw error("Unauthorized user");
    }
    // verify data is passed through
    console.log("formData:", formData);

    const id = formData.get("id") as string;

    // just updating because we do not need data
    await prisma.timeSheet.update({
      where: { id },
      data: {
        endTime: formatISO(formData.get("endTime") as string),
        comment: formData.get("timeSheetComments") as string,
      },
    });

    // Revalidate the path
    revalidatePath(`/`);
    revalidatePath("/admins/settings");
    revalidatePath("/admins/assets");
    revalidatePath("/admins/reports");
    revalidatePath("/admins/personnel");
    revalidatePath("/admins");
    revalidatePath("/dashboard");
    return { success: true };
  } catch (error) {
    console.log(error);
  }
}
//
//
//-------------------------------------------------------------------------------------------------------------------------------
//
//-------------------------------------------------------------------------------------------------------------------------------
//-------------------------------------------------------------------------------------------------------------------------------
//-------------------------------------------------------------------------------------------------------------------------------
// Create TimeSheet - used at each login and will retain that timesheetId until the user logs out with switch jobsite
export async function AddWholeTimeSheet(formData: FormData) {
  try {
    console.log("Creating Timesheet...");
    console.log(formData);
    // this will set costcode to undefined if empty
    const costCode = formData.get("costcode");
    console.log("costcode:", costCode);

    const newTimeSheet = await prisma.timeSheet.create({
      data: {
        submitDate: formatISO(formData.get("submitDate") as string),
        date: formatISO(formData.get("date") as string),
        jobsite: { connect: { qrId: formData.get("jobsiteId") as string } },
        costCode: { connect: { name: costCode as string } },
        startTime: formatISO(formData.get("startTime") as string),
        endTime: formData.get("endTime")
          ? formatISO(formData.get("endTime") as string)
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
//-- update TimeSheets
export async function updateTimeSheets(
  updatedSheets: TimeSheet[],
  manager: string
) {
  try {
    console.log("Updating Timesheets...");
    console.log(updatedSheets);
    // Perform individual updates for each timesheet
    const updatePromises = updatedSheets.map((timesheet) => {
      return prisma.timeSheet.update({
        where: { id: timesheet.id }, // Identify the specific timesheet by its ID
        data: {
          workType: timesheet.workType as WorkType,
          startTime: timesheet.startTime,
          endTime: timesheet?.endTime,
          comment: timesheet.comment,
          editedByUserId: manager,
        },
      });
    });

    // Wait for all updates to complete
    await Promise.all(updatePromises);

    console.log("Timesheets updated successfully.");
  } catch (error) {
    console.error("Error updating timesheets:", error);
    throw new Error("Failed to update timesheets. Please try again.");
  }
}
//--Edit TimeSheets
export async function editTimeSheet(formData: FormData) {
  console.log("Editing Timesheet...");
  console.log(formData);
  try {
    const id = formData.get("id") as string;
    const costcode = formData.get("costcode");
    const endTime = formatISO(formData.get("endTime") as string);
    const startTime = formatISO(formData.get("startTime") as string);

    if (!id) {
      throw new Error("ID is required");
    }

    const timeSheet = await prisma.timeSheet.update({
      where: { id: id },
      data: {
        costcode: costcode as string,
        startTime: startTime,
        endTime: endTime,
      },
    });

    console.log(timeSheet);
  } catch (error) {
    console.error("Error editing timesheet:", error);
  }
}
//--------- Update Time Sheet
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

    const startTime = formatISO(start.startTime); // it was stored correctly in the db so we dont need to fix it.
    console.log("startTime:", startTime);

    // Parse endTime from the formData
    const endTimeString = formData.get("endTime") as string;
    if (!endTimeString) {
      throw new Error("End time is required");
    }

    const endTime = formatISO(endTimeString);
    console.log("endTime:", endTime);

    // Update the timesheet with new data
    const updatedTimeSheet = await prisma.timeSheet.update({
      where: { id },
      data: {
        endTime: endTime,
        comment: (formData.get("timesheetComments") as string) || null,
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
//--------- return to prev work
export async function returnToPrevWork(formData: FormData) {
  const id = formData.get("id") as string;
  const PrevTimeSheet = await prisma.timeSheet.findUnique({
    where: { id },
    select: {
      id: true,
      jobsiteId: true,
      costcode: true,
      workType: true,
    },
  });
  console.log(PrevTimeSheet);

  return PrevTimeSheet;
}
// get all timesheets
export async function GetAllTimeSheets(date: string) {
  const d = new Date(date).toISOString();
  const timeSheet = await prisma.timeSheet.findMany({
    where: { date: { equals: d } },
  });
  return timeSheet;
}
// Delete TimeSheet by id - will be used by Admin only
export async function deleteTimeSheet(id: string) {
  await prisma.timeSheet.delete({
    where: { id },
  });
}
// find TimeSheets for day
export async function findTimesheetsforDay(formData: FormData) {
  console.log("formData:", formData);

  const id = formData.get("id") as string;
  const dateString = formData.get("date") as string;

  // Create a full local ISO string (including time)
  const localDateISO = new Date(dateString);

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
