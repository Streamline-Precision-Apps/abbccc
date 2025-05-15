"use server";

import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { TimeSheet, TimesheetHighlights, TimesheetUpdate, TruckingMileageUpdate } from "@/lib/types";
import { WorkType } from "@prisma/client";
import { error } from "console";
import { revalidatePath } from "next/cache";
import { formatInTimeZone } from "date-fns-tz";
import { select } from "@nextui-org/theme";
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
        TascoLogs: true,
        TruckingLogs: true,
        MaintenanceLogs: true,
        EmployeeEquipmentLogs: true,
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
        date: formatISO(formData.get("date") as string),
        Jobsite: { connect: { qrId: formData.get("jobsiteId") as string } },
        comment: (formData.get("timeSheetComments") as string) || null,
        User: { connect: { id: formData.get("userId") as string } },
        CostCode: { connect: { name: costCode } },
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
        date: formatISO(formData.get("date") as string),
        Jobsite: { connect: { qrId: jobsiteId } },
        comment: timeSheetComments || null,
        User: { connect: { id: userId } },
        CostCode: { connect: { name: costCode } },
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
//-----------------------------------------------   General   CRUD  ---------------------------------------------------------------
//-------------------------------------------------------------------------------------------------------------------------------
//---------- Transaction to create a new time sheet for General
export async function handleGeneralTimeSheet(formData: FormData) {
  try {
    const session = await auth();
    if (!session) {
      throw new Error("Unauthorized user");
    }
    console.log("Handle General TimeSheet:", formData);
    let newTimeSheet: string | null = null;
    // Start a transaction
    await prisma.$transaction(async (prisma) => {
      // Step 1: Create a new TimeSheet
      const jobsiteId = formData.get("jobsiteId") as string;
      const userId = formData.get("userId") as string;
      const previoustimeSheetComments = formData.get(
        "timeSheetComments"
      ) as string;
      const costCode = formData.get("costcode") as string;
      const type = formData.get("type") as string; // Add type to formData

      // Create a new TimeSheet
      const createdTimeSheet = await prisma.timeSheet.create({
        data: {
          date: formatISO(formData.get("date") as string),
          Jobsite: { connect: { qrId: jobsiteId } },
          User: { connect: { id: userId } },
          CostCode: { connect: { name: costCode } },
          startTime: formatISO(formData.get("startTime") as string),
          workType: "LABOR",
        },
      });

      console.log("New TimeSheet created:", createdTimeSheet);

      newTimeSheet = createdTimeSheet.id;

      // Step 2: If type is "switchJobs", end the previous TimeSheet
      if (type === "switchJobs") {
        const previousTimeSheetId = formData.get("id") as string;
        if (!previousTimeSheetId) {
          throw new Error("No valid previous TimeSheet ID found.");
        }

        // Update the previous TimeSheet to set the end time
        await prisma.timeSheet.update({
          where: { id: previousTimeSheetId },
          data: {
            endTime: formatISO(formData.get("endTime") as string),
            comment: previoustimeSheetComments,
          },
        });

        console.log("Previous TimeSheet ended:", previousTimeSheetId);
      }

      // Revalidate paths
      revalidatePath("/");
      revalidatePath("/admins/settings");
      revalidatePath("/admins/assets");
      revalidatePath("/admins/reports");
      revalidatePath("/admins/personnel");
      revalidatePath("/admins");
      revalidatePath("/dashboard");
    });

    return newTimeSheet;
  } catch (error) {
    console.error("Error in transaction:", error);
    throw error; // Re-throw the error to handle it in the calling function
  }
}

//-------------------------------------------------------------------------------------------------------------------------------
//-----------------------------------------------   Mechanic   CRUD  ---------------------------------------------------------------
//-------------------------------------------------------------------------------------------------------------------------------
//---------- Transactions for clock in to roll back if error occurs
export async function handleMechanicTimeSheet(formData: FormData) {
  try {
    const session = await auth();
    if (!session) {
      throw new Error("Unauthorized user");
    }
    console.log("Handle Mechanic TimeSheet:", formData);
    let newTimeSheet: string | null = null;
    // Start a transaction
    await prisma.$transaction(async (prisma) => {
      // Step 1: Create a new TimeSheet
      const jobsiteId = formData.get("jobsiteId") as string;
      const userId = formData.get("userId") as string;
      const previoustimeSheetComments = formData.get(
        "timeSheetComments"
      ) as string;
      const costCode = formData.get("costcode") as string;
      const type = formData.get("type") as string; // Add type to formData

      // Create a new TimeSheet
      const createdTimeSheet = await prisma.timeSheet.create({
        data: {
          date: formatISO(formData.get("date") as string),
          Jobsite: { connect: { qrId: jobsiteId } },
          User: { connect: { id: userId } },
          CostCode: { connect: { name: costCode } },
          startTime: formatISO(formData.get("startTime") as string),
          workType: "MECHANIC",
        },
      });

      console.log("New TimeSheet created:", createdTimeSheet);

      newTimeSheet = createdTimeSheet.id;

      // Step 2: If type is "switchJobs", end the previous TimeSheet
      if (type === "switchJobs") {
        const previousTimeSheetId = formData.get("id") as string;
        if (!previousTimeSheetId) {
          throw new Error("No valid previous TimeSheet ID found.");
        }

        // Update the previous TimeSheet to set the end time
        await prisma.timeSheet.update({
          where: { id: previousTimeSheetId },
          data: {
            endTime: formatISO(formData.get("endTime") as string),
            comment: previoustimeSheetComments,
          },
        });

        console.log("Previous TimeSheet ended:", previousTimeSheetId);
      }

      // Revalidate paths
      revalidatePath("/");
      revalidatePath("/admins/settings");
      revalidatePath("/admins/assets");
      revalidatePath("/admins/reports");
      revalidatePath("/admins/personnel");
      revalidatePath("/admins");
      revalidatePath("/dashboard");
    });

    return newTimeSheet;
  } catch (error) {
    console.error("Error in transaction:", error);
    throw error; // Re-throw the error to handle it in the calling function
  }
}
//-------------------------------------------------------------------------------------------------------------------------------
//-----------------------------------------------   TASCO   CRUD  ---------------------------------------------------------------
//-------------------------------------------------------------------------------------------------------------------------------
//---------- Transaction to create a new time sheet
export async function handleTascoTimeSheet(formData: FormData) {
  try {
    const session = await auth();
    if (!session) {
      throw new Error("Unauthorized user");
    }
    console.log("Handle Tasco TimeSheet:", formData);
    let newTimeSheet: string | null = null;
    // Start a transaction
    await prisma.$transaction(async (prisma) => {
      // Step 1: Create a new TimeSheet
      const jobsiteId = formData.get("jobsiteId") as string;
      const userId = formData.get("userId") as string;
      const equipmentId = formData.get("equipment") as string;
      const equipment = await prisma.equipment.findUnique({
        where: { id: equipmentId },
        select: { qrId: true },
      });
      if (!equipment) {
        throw new Error("Equipment not found");
      }
      const previoustimeSheetComments = formData.get(
        "timeSheetComments"
      ) as string;
      const costCode = formData.get("costcode") as string;
      const shiftType = formData.get("shiftType") as string;
      const type = formData.get("type") as string; // Add type to formData

      let materialType;
      const laborType = formData.get("laborType") as string;
      if (shiftType === "ABCD Shift") {
        materialType = formData.get("materialType") as string;
      } else {
        materialType = null;
      }

      // Create a new TimeSheet
      const createdTimeSheet = await prisma.timeSheet.create({
        data: {
          date: formatISO(formData.get("date") as string),
          Jobsite: { connect: { qrId: jobsiteId } },
          User: { connect: { id: userId } },
          CostCode: { connect: { name: costCode } },
          startTime: formatISO(formData.get("startTime") as string),
          workType: "TASCO",
          TascoLogs: {
            create: {
              shiftType,
              equipmentId: equipment.qrId,
              laborType: laborType,
              materialType: materialType,
            },
          },
        },
      });

      console.log("New TimeSheet created:", createdTimeSheet);

      newTimeSheet = createdTimeSheet.id;

      // Step 2: If type is "switchJobs", end the previous TimeSheet
      if (type === "switchJobs") {
        const previousTimeSheetId = formData.get("id") as string;
        if (!previousTimeSheetId) {
          throw new Error("No valid previous TimeSheet ID found.");
        }

        // Update the previous TimeSheet to set the end time
        await prisma.timeSheet.update({
          where: { id: previousTimeSheetId },
          data: {
            endTime: formatISO(formData.get("endTime") as string),
            comment: previoustimeSheetComments,
          },
        });

        console.log("Previous TimeSheet ended:", previousTimeSheetId);
      }

      // Revalidate paths
      revalidatePath("/");
      revalidatePath("/admins/settings");
      revalidatePath("/admins/assets");
      revalidatePath("/admins/reports");
      revalidatePath("/admins/personnel");
      revalidatePath("/admins");
      revalidatePath("/dashboard");
    });

    return newTimeSheet;
  } catch (error) {
    console.error("Error in transaction:", error);
    throw error; // Re-throw the error to handle it in the calling function
  }
}

//-------------------------------------------------------------------------------------------------------------------------------
//-----------------------------------------------  TRUCKING CRUD  ---------------------------------------------------------------
//-------------------------------------------------------------------------------------------------------------------------------
// --- Transaction to handle Truck Driver TimeSheet
export async function handleTruckTimeSheet(formData: FormData) {
  try {
    const session = await auth();
    if (!session) {
      throw new Error("Unauthorized user");
    }
    console.log("Handle Truck TimeSheet:", formData);
    let newTimeSheet: string | null = null;
    // Start a transaction
    await prisma.$transaction(async (prisma) => {
      // Step 1: Create a new TimeSheet
      const jobsiteId = formData.get("jobsiteId") as string;
      const userId = formData.get("userId") as string;
      const previoustimeSheetComments = formData.get(
        "timeSheetComments"
      ) as string;
      const costCode = formData.get("costcode") as string;
      const type = formData.get("type") as string; // Add type to formData
      const startingMileage = parseInt(
        formData.get("startingMileage") as string
      );
      const laborType = formData.get("laborType") as string;
      const truck = formData.get("truck") as string;
      const equipmentId = formData.get("equipment") as string;

      // Create a new TimeSheet
      const createdTimeSheet = await prisma.timeSheet.create({
        data: {
          date: formatISO(formData.get("date") as string),
          Jobsite: { connect: { qrId: jobsiteId } },
          User: { connect: { id: userId } },
          CostCode: { connect: { name: costCode } },
          startTime: formatISO(formData.get("startTime") as string),
          workType: "TRUCK_DRIVER",
          TruckingLogs: {
            create: {
              laborType,

              equipmentId:
                laborType === "truckDriver"
                  ? truck
                  : laborType === "truckEquipmentOperator"
                  ? equipmentId
                  : null,
              startingMileage,
            },
          },
        },
      });

      console.log("New TimeSheet created:", createdTimeSheet);

      newTimeSheet = createdTimeSheet.id;

      // Step 2: If type is "switchJobs", end the previous TimeSheet
      if (type === "switchJobs") {
        const previousTimeSheetId = formData.get("id") as string;
        if (!previousTimeSheetId) {
          throw new Error("No valid previous TimeSheet ID found.");
        }

        // Update the previous TimeSheet to set the end time
        await prisma.timeSheet.update({
          where: { id: previousTimeSheetId },
          data: {
            endTime: formatISO(formData.get("endTime") as string),
            comment: previoustimeSheetComments,
          },
        });

        console.log("Previous TimeSheet ended:", previousTimeSheetId);
      }

      // Revalidate paths
      revalidatePath("/");
      revalidatePath("/admins/settings");
      revalidatePath("/admins/assets");
      revalidatePath("/admins/reports");
      revalidatePath("/admins/personnel");
      revalidatePath("/admins");
      revalidatePath("/dashboard");
    });

    return newTimeSheet;
  } catch (error) {
    console.error("Error in transaction:", error);
    throw error; // Re-throw the error to handle it in the calling function
  }
}
//-------------------------------------------------------------------------------------------------------------------------------
//-------------------------------------------------------------------------------------------------------------------------------
//-------------------------------------------------------------------------------------------------------------------------------
//--------------------------
//-- update TimeSheets - located in manager section
export async function updateTimeSheets(
  updatedSheets: TimesheetHighlights[],
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

//---------------------------------------------------------------------------------
//---------------------------------------------------------------------------------
//---------------------------------------------------------------------------------
//ADMINS SERVER ACTIONS
//---------------------------------------------------------------------------------
//---------------------------------------------------------------------------------
//---------
//--------- Update Time Sheet
//---------
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
//---------
//--------- return to prev work
//---------
export async function returnToPrevWork(formData: FormData) {
  try {
    console.log("formData:", formData);

    const id = formData.get("id") as string;
    const PrevTimeSheet = await prisma.timeSheet.findUnique({
      where: { id },
      select: {
        id: true,
        Jobsite: {
          select: {
            id: true,
            qrId: true,
            name: true,
          },
        },
        CostCode: {
          select: {
            id: true,
            name: true,
          },
        },
        workType: true,
        TascoLogs: {
          select: {
            shiftType: true,

            Equipment: {
              select: {
                qrId: true,
                name: true,
              },
            },
            laborType: true,
            materialType: true,
          },
        },
        TruckingLogs: {
          select: {
            laborType: true,
            Equipment: {
              select: {
                qrId: true,
                name: true,
              },
            },
            startingMileage: true,
          },
        },
      },
    });
    console.log(PrevTimeSheet);

    return PrevTimeSheet;
  } catch (error) {
    console.error("Error updating timesheet:", error);
  }
}
//---------
//---------  Delete TimeSheet by id - will be used by Admin only
//---------
export async function deleteTimeSheet(id: string) {
  await prisma.timeSheet.delete({
    where: { id },
  });
}

