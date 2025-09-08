"use server";

import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { FormStatus, WorkType } from "@/lib/enums";
import { revalidatePath } from "next/cache";
import { formatISO } from "date-fns";
import { sendNotificationToTopic } from "./notificationSender";
// Get all TimeSheets
type TimesheetUpdate = {
  id: number;
  startTime?: string;
  endTime?: string | null;
  jobsiteId?: string;
  costcode?: string;
};

type TimesheetHighlights = {
  submitDate: string;
  date: Date | string;
  id: number;
  userId: string;
  jobsiteId: string;
  costcode: string;
  startTime: Date | string;
  endTime: Date | string | null;
  status: FormStatus; // Enum: PENDING, APPROVED, etc.
  workType: WorkType; // Enum: Type of work
  Jobsite: {
    name: string;
  };
};

export async function getTimeSheetsbyId() {
  const timesheets = prisma.timeSheet.findMany();
  console.log(timesheets);
  return timesheets;
}

//-------------------------------------------------------------------------------------------------------------------------------
//-----------------------------------------------  GENERAL CRUD  ---------------------------------------------------------------
//-------------------------------------------------------------------------------------------------------------------------------
// Create TimeSheet
export async function CreateTimeSheet(formData: FormData) {
  try {
    console.log("[CreateTimeSheet] Entered CreateTimeSheet:");
    console.log("[CreateTimeSheet] formData:", formData);
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
        Jobsite: { connect: { id: formData.get("jobsiteId") as string } },
        comment: (formData.get("timeSheetComments") as string) || null,
        User: { connect: { id: formData.get("userId") as string } },
        CostCode: { connect: { name: costCode } },
        startTime: formatISO(formData.get("startTime") as string),
        workType: workType,
        status: "DRAFT",
      },
    });
    console.log(
      "[CreateTimeSheet] New timesheet after clock-in:",
      newTimeSheet,
    );

    revalidatePath("/admins/settings");
    revalidatePath("/admins/assets");
    revalidatePath("/admins/reports");
    revalidatePath("/admins/personnel");
    revalidatePath("/admins");
    revalidatePath("/dashboard");

    return newTimeSheet;
  } catch (error) {
    console.error("[CreateTimeSheet] Error creating timesheet:", error);
    throw error;
  }
}
//--------- Update Time Sheet
export async function updateTimeSheetBySwitch(formData: FormData) {
  let updatedTimeSheet: Awaited<
    ReturnType<typeof prisma.timeSheet.update>
  > | null = null;
  try {
    console.log("[updateTimeSheetBySwitch] formData:", formData);
    for (const [key, value] of formData.entries()) {
      console.log(`[updateTimeSheetBySwitch] formData entry: ${key} =`, value);
    }
    console.log(
      "[updateTimeSheetBySwitch] switch jobsite, updating Timesheet...",
    );

    const id = Number(formData.get("id"));
    const endTimeRaw = formData.get("endTime");
    // Support both timesheetComments and timeSheetComments for robustness
    const commentRaw =
      formData.get("timesheetComments") ?? formData.get("timeSheetComments");
    console.log("[updateTimeSheetBySwitch] id:", id);
    console.log("[updateTimeSheetBySwitch] endTimeRaw:", endTimeRaw);
    console.log("[updateTimeSheetBySwitch] commentRaw:", commentRaw);

    const endTime = endTimeRaw ? formatISO(endTimeRaw as string) : undefined;
    // Always set comment, even if empty string
    const comment = commentRaw !== undefined ? String(commentRaw) : "";

    await prisma.$transaction(async (prisma) => {
      updatedTimeSheet = await prisma.timeSheet.update({
        where: { id },
        data: {
          ...(endTime ? { endTime } : {}),
          comment, // always set comment
          status: "PENDING", // always set status
        },
      });
      console.log("[updateTimeSheetBySwitch] Prisma update data:", {
        ...(endTime ? { endTime } : {}),
        comment,
        status: "PENDING",
      });
    });

    // Fetch and log after update
    const afterUpdate = await prisma.timeSheet.findUnique({ where: { id } });
    console.log(
      "[updateTimeSheetBySwitch] Timesheet after update:",
      afterUpdate,
    );

    const forced = await forcePendingIfEnded(id);
    console.log(
      "[updateTimeSheetBySwitch] forcePendingIfEnded result:",
      forced,
    );

    if (updatedTimeSheet) {
      console.log(
        "[updateTimeSheetBySwitch] Timesheet after switching jobs or ending day, status set to PENDING:",
        updatedTimeSheet,
      );
    }
    revalidatePath(`/`);
    revalidatePath("/admins/settings");
    revalidatePath("/admins/assets");
    revalidatePath("/admins/reports");
    revalidatePath("/admins/personnel");
    revalidatePath("/admins");

    return { success: true };
  } catch (error) {
    console.error("[updateTimeSheetBySwitch] Error:", error);
    throw error;
  }
}
//--------- Update Time Sheet
export async function breakOutTimeSheet(formData: FormData) {
  let updatedTimeSheet: Awaited<
    ReturnType<typeof prisma.timeSheet.findUnique>
  > | null = null;
  try {
    console.log("[breakOutTimeSheet] formData:", formData);
    console.log("[breakOutTimeSheet] break out, updating Timesheet...");
    const id = Number(formData.get("id"));
    const endTime = formatISO(formData.get("endTime") as string);
    const comment = formData.get("timesheetComments") as string;

    // Only DB operations in transaction
    await prisma.$transaction(async (prisma) => {
      await prisma.timeSheet.update({
        where: { id },
        data: {
          endTime,
          comment,
          status: "PENDING",
        },
      });
    });
    // Fetch and log after transaction
    updatedTimeSheet = await prisma.timeSheet.findUnique({ where: { id } });
    if (updatedTimeSheet) {
      console.log(
        "[breakOutTimeSheet] Timesheet after starting break, status set to PENDING:",
        updatedTimeSheet,
      );
    }
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
    console.error("[breakOutTimeSheet] Error:", error);
    throw error;
  }
}
//
//-------------------------------------------------------------------------------------------------------------------------------
//-------------------------------------------------------------------------------------------------------------------------------
//-----------------------------------------------  TRUCKING CRUD  ---------------------------------------------------------------
//-------------------------------------------------------------------------------------------------------------------------------
//--------- Create Truck driver Time Sheet
export async function CreateTruckDriverTimeSheet(formData: FormData) {
  try {
    console.log(
      "[CreateTruckDriverTimeSheet] Entered CreateTruckDriverTimeSheet:",
    );
    console.log("[CreateTruckDriverTimeSheet] formData:", formData);

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
        Jobsite: { connect: { id: jobsiteId } },
        comment: timeSheetComments || null,
        User: { connect: { id: userId } },
        CostCode: { connect: { name: costCode } },
        startTime: formatISO(formData.get("startTime") as string),
        workType,
        status: "DRAFT",
      },
    });
    console.log(
      "[CreateTruckDriverTimeSheet] New timesheet after clock-in:",
      createdTimeSheet,
    );

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
    console.error(
      "[CreateTruckDriverTimeSheet] Error creating timesheet:",
      error,
    );
    throw error;
  }
}
//--------- Update Truck Driver sheet By switch Jobs
export async function updateTruckDriverTSBySwitch(formData: FormData) {
  try {
    const session = await auth();
    if (!session) {
      throw new Error("Unauthorized user");
    }
    console.log("[updateTruckDriverTSBySwitch] formData:", formData);

    const id = Number(formData.get("id"));
    const endingMileageStr = formData.get("endingMileage");
    const endingMileage = endingMileageStr
      ? parseInt(endingMileageStr as string, 10)
      : null;
    const endTimeRaw = formData.get("endTime");
    const endTime = endTimeRaw ? new Date(endTimeRaw as string) : new Date();

    // Fetch and log all EmployeeEquipmentLogs for this timesheet for debugging
    const equipmentLogs = await prisma.employeeEquipmentLog.findMany({
      where: { timeSheetId: id },
    });
    console.log(
      "[updateTruckDriverTSBySwitch] Equipment logs for timesheet:",
      equipmentLogs,
    );

    // Update the TruckingLog for this timesheet with endingMileage if provided
    if (endingMileage !== null) {
      const truckingLog = await prisma.truckingLog.findFirst({
        where: { timeSheetId: id },
      });
      if (truckingLog) {
        await prisma.truckingLog.update({
          where: { id: truckingLog.id },
          data: { endingMileage },
        });
        console.log(
          "[updateTruckDriverTSBySwitch] Updated TruckingLog endingMileage:",
          endingMileage,
        );
      } else {
        console.warn(
          "[updateTruckDriverTSBySwitch] No TruckingLog found for timesheet:",
          id,
        );
      }
    }

    // Build update data for timesheet
    const updateData: {
      status: "PENDING";
      updatedAt: Date;
      endTime: Date;
    } = {
      status: "PENDING",
      updatedAt: new Date(),
      endTime,
    };

    const updatedTimesheet = await prisma.timeSheet.update({
      where: { id },
      data: updateData,
    });
    console.log(
      "[updateTruckDriverTSBySwitch] Timesheet status set to PENDING:",
      updatedTimesheet,
    );
    return updatedTimesheet;
  } catch (error) {
    console.error("[updateTruckDriverTSBySwitch] Error:", error);
    throw error;
  }
}

/**
 * Ensures that any timesheet with an endTime is set to PENDING if it is still DRAFT.
 * This can be called after a user attempts to clock out or end day, regardless of current state.
 */
export async function forcePendingIfEnded(id: number) {
  const timesheet = await prisma.timeSheet.findUnique({ where: { id } });
  console.log("[forcePendingIfEnded] timesheet before check:", timesheet);
  if (timesheet && timesheet.endTime && timesheet.status === "DRAFT") {
    const updated = await prisma.timeSheet.update({
      where: { id },
      data: { status: "PENDING" },
    });
    console.log(
      "[forcePendingIfEnded] Forced status to PENDING for ended timesheet:",
      updated,
    );
    return updated;
  }
  if (timesheet && timesheet.endTime && timesheet.status !== "DRAFT") {
    console.log(
      "[forcePendingIfEnded] End of day called on already-ended timesheet:",
      timesheet,
    );
  }
  return timesheet;
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
    console.log("[handleGeneralTimeSheet] formData:", formData);
    let newTimeSheet: number | null = null;
    let previousTimeSheetId: number | null = null;
    let previoustimeSheetComments: string | null = null;
    let endTime: string | null = null;
    let type: string | null = null;
    // Extract all needed values before transaction
    const jobsiteId = formData.get("jobsiteId") as string;
    const userId = formData.get("userId") as string;
    previoustimeSheetComments = formData.get("timeSheetComments") as string;
    const costCode = formData.get("costcode") as string;
    type = formData.get("type") as string;
    if (type === "switchJobs") {
      previousTimeSheetId = Number(formData.get("id"));
      endTime = formData.get("endTime") as string;
    }
    // Only DB operations in transaction
    await prisma.$transaction(async (prisma) => {
      // Step 1: Create a new TimeSheet
      const createdTimeSheet = await prisma.timeSheet.create({
        data: {
          date: formatISO(formData.get("date") as string),
          Jobsite: { connect: { id: jobsiteId } },
          User: { connect: { id: userId } },
          CostCode: { connect: { name: costCode } },
          startTime: formatISO(formData.get("startTime") as string),
          workType: "LABOR",
          status: "DRAFT",
        },
      });
      newTimeSheet = createdTimeSheet.id;
      console.log(
        "[handleGeneralTimeSheet] Created new timesheet as DRAFT:",
        createdTimeSheet,
      );
      if (type === "switchJobs" && previousTimeSheetId && endTime) {
        const updatedPrev = await prisma.timeSheet.update({
          where: { id: previousTimeSheetId },
          data: {
            endTime: formatISO(endTime),
            comment: previoustimeSheetComments,
            status: "PENDING",
          },
        });

        console.log(
          "[handleGeneralTimeSheet] Previous timesheet set to PENDING:",
          updatedPrev,
        );
      }
    });
    // Fetch and log after transaction
    if (newTimeSheet) {
      const created = await prisma.timeSheet.findUnique({
        where: { id: newTimeSheet },
      });
      console.log("[handleGeneralTimeSheet] Confirmed new timesheet:", created);
    }

    // Trigger notification if a timesheet was set to PENDING (switchJobs case)
    if (type === "switchJobs" && previousTimeSheetId) {
      try {
        // Get user information for the notification
        const prevTimesheet = await prisma.timeSheet.findUnique({
          where: { id: previousTimeSheetId },
          include: { User: true },
        });
        sendNotificationToTopic({
          topic: "timecard-submission",
          title: "Timecard Submission Pending",
          message: `A timecard submission is pending for ${prevTimesheet?.User?.firstName} ${prevTimesheet?.User?.lastName}`,
          link: `/admins/timesheets`,
        });
      } catch (notifyError) {
        // Log but don't fail the whole operation if notification fails
        console.error(
          "[handleGeneralTimeSheet] Error triggering notification:",
          notifyError,
        );
      }
    }

    // Revalidate paths after transaction
    revalidatePath("/");
    revalidatePath("/admins/settings");
    revalidatePath("/admins/assets");
    revalidatePath("/admins/reports");
    revalidatePath("/admins/personnel");
    revalidatePath("/admins");
    revalidatePath("/dashboard");
    return newTimeSheet;
  } catch (error) {
    console.error("[handleGeneralTimeSheet] Error in transaction:", error);
    throw error;
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
    console.log("[handleMechanicTimeSheet] formData:", formData);
    let newTimeSheet: number | null = null;
    let previousTimeSheetId: number | null = null;
    let previoustimeSheetComments: string | null = null;
    let endTime: string | null = null;
    let type: string | null = null;
    // Extract all needed values before transaction
    const jobsiteId = formData.get("jobsiteId") as string;
    const userId = formData.get("userId") as string;
    previoustimeSheetComments = formData.get("timeSheetComments") as string;
    const costCode = formData.get("costcode") as string;
    type = formData.get("type") as string;
    if (type === "switchJobs") {
      previousTimeSheetId = Number(formData.get("id"));
      endTime = formData.get("endTime") as string;
    }
    // Only DB operations in transaction
    await prisma.$transaction(async (prisma) => {
      // Step 1: Create a new TimeSheet
      const createdTimeSheet = await prisma.timeSheet.create({
        data: {
          date: formatISO(formData.get("date") as string),
          Jobsite: { connect: { id: jobsiteId } },
          User: { connect: { id: userId } },
          CostCode: { connect: { name: costCode } },
          startTime: formatISO(formData.get("startTime") as string),
          workType: "MECHANIC",
          status: "DRAFT",
        },
      });
      newTimeSheet = createdTimeSheet.id;
      console.log(
        "[handleMechanicTimeSheet] Created new timesheet as DRAFT:",
        createdTimeSheet,
      );
      if (type === "switchJobs" && previousTimeSheetId && endTime) {
        const updatedPrev = await prisma.timeSheet.update({
          where: { id: previousTimeSheetId },
          data: {
            endTime: formatISO(endTime),
            comment: previoustimeSheetComments,
            status: "PENDING",
          },
        });

        console.log(
          "[handleMechanicTimeSheet] Previous timesheet set to PENDING:",
          updatedPrev,
        );
      }
    });
    // Fetch and log after transaction
    if (newTimeSheet) {
      const created = await prisma.timeSheet.findUnique({
        where: { id: newTimeSheet },
      });
      console.log(
        "[handleMechanicTimeSheet] Confirmed new timesheet:",
        created,
      );
    }

    // Trigger notification if a timesheet was set to PENDING (switchJobs case)
    if (type === "switchJobs" && previousTimeSheetId) {
      try {
        // Get user information for the notification
        const prevTimesheet = await prisma.timeSheet.findUnique({
          where: { id: previousTimeSheetId },
          include: { User: true },
        });

        sendNotificationToTopic({
          topic: "timecard-submission",
          title: "Timecard Submission Pending",
          message: `A timecard submission is pending for ${prevTimesheet?.User?.firstName} ${prevTimesheet?.User?.lastName}`,
          link: `/admins/timesheets`,
        });
      } catch (notifyError) {
        // Log but don't fail the whole operation if notification fails
        console.error(
          "[handleMechanicTimeSheet] Error triggering notification:",
          notifyError,
        );
      }
    }

    // Revalidate paths after transaction
    revalidatePath("/");
    revalidatePath("/admins/settings");
    revalidatePath("/admins/assets");
    revalidatePath("/admins/reports");
    revalidatePath("/admins/personnel");
    revalidatePath("/admins");
    revalidatePath("/dashboard");
    return newTimeSheet;
  } catch (error) {
    console.error("[handleMechanicTimeSheet] Error in transaction:", error);
    throw error;
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
    console.log("[handleTascoTimeSheet] formData:", formData);
    let newTimeSheet: number | null = null;
    let previousTimeSheetId: number | null = null;
    let previousTimeSheetComments: string | null = null;
    let endTime: string | null = null;
    let type: string | null = null;
    // Extract all needed values before transaction
    const jobsiteId = formData.get("jobsiteId") as string;
    const userId = formData.get("userId") as string;
    const equipmentId = formData.get("equipment") as string;
    previousTimeSheetComments = formData.get("timeSheetComments") as string;
    const costCode = formData.get("costcode") as string;
    const shiftType = formData.get("shiftType") as string;
    type = formData.get("type") as string;
    let materialType;
    const laborType = formData.get("laborType") as string;
    if (shiftType === "ABCD Shift") {
      materialType = formData.get("materialType") as string;
    } else {
      materialType = undefined;
    }
    if (type === "switchJobs") {
      previousTimeSheetId = Number(formData.get("id"));
      endTime = formData.get("endTime") as string;
    }
    // Only DB operations in transaction
    await prisma.$transaction(async (prisma) => {
      // Step 1: Create a new TimeSheet
      const createdTimeSheet = await prisma.timeSheet.create({
        data: {
          date: formatISO(formData.get("date") as string),
          Jobsite: { connect: { id: jobsiteId } },
          User: { connect: { id: userId } },
          CostCode: { connect: { name: costCode } },
          startTime: formatISO(formData.get("startTime") as string),
          workType: "TASCO",
          status: "DRAFT",
          TascoLogs: {
            create: {
              shiftType,
              laborType: laborType,
              ...(equipmentId && {
                Equipment: { connect: { id: equipmentId } },
              }),
              ...(materialType && {
                TascoMaterialTypes: { connect: { name: materialType } },
              }),
            },
          },
        },
      });
      newTimeSheet = createdTimeSheet.id;
      console.log(
        "[handleTascoTimeSheet] Created new timesheet as DRAFT:",
        createdTimeSheet,
      );
      if (type === "switchJobs" && previousTimeSheetId && endTime) {
        const updatedPrev = await prisma.timeSheet.update({
          where: { id: previousTimeSheetId },
          data: {
            endTime: formatISO(endTime),
            comment: previousTimeSheetComments,
            status: "PENDING",
          },
        });

        console.log(
          "[handleTascoTimeSheet] Previous timesheet set to PENDING:",
          updatedPrev,
        );
      }
    });
    // Fetch and log after transaction
    if (newTimeSheet) {
      const created = await prisma.timeSheet.findUnique({
        where: { id: newTimeSheet },
      });
      console.log("[handleTascoTimeSheet] Confirmed new timesheet:", created);
    }

    // Trigger notification if a timesheet was set to PENDING (switchJobs case)
    if (type === "switchJobs" && previousTimeSheetId) {
      try {
        // Get user information for the notification
        const prevTimesheet = await prisma.timeSheet.findUnique({
          where: { id: previousTimeSheetId },
          include: { User: true },
        });
        sendNotificationToTopic({
          topic: "timecard-submission",
          title: "Timecard Submission Pending",
          message: `A timecard submission is pending for ${prevTimesheet?.User?.firstName} ${prevTimesheet?.User?.lastName}`,
          link: `/admins/timesheets`,
        });
      } catch (notifyError) {
        // Log but don't fail the whole operation if notification fails
        console.error(
          "[handleTascoTimeSheet] Error triggering notification:",
          notifyError,
        );
      }
    }

    // Revalidate paths after transaction
    revalidatePath("/");
    revalidatePath("/admins/settings");
    revalidatePath("/admins/assets");
    revalidatePath("/admins/reports");
    revalidatePath("/admins/personnel");
    revalidatePath("/admins");
    revalidatePath("/dashboard");
    return newTimeSheet;
  } catch (error) {
    console.error("[handleTascoTimeSheet] Error in transaction:", error);
    throw error;
  }
}

//-------------------------------------------------------------------------------------------------------------------------------
//-----------------------------------------------  TRUCKING CRUD  ---------------------------------------------------------------
//-------------------------------------------------------------------------------------------------------------------------------
// --- Transaction to handle Truck Driver TimeSheet
export async function handleTruckTimeSheet(formData: FormData) {
  try {
    let newTimeSheet: number | null = null;
    let previousTimeSheetId: number | null = null;
    let previoustimeSheetComments: string | null = null;
    let type: string | null = null;
    // Extract all needed values before transaction
    const jobsiteId = formData.get("jobsiteId") as string;
    const userId = formData.get("userId") as string;
    previoustimeSheetComments = formData.get("timeSheetComments") as string;
    const costCode = formData.get("costcode") as string;
    type = formData.get("type") as string;
    const startingMileage = parseInt(formData.get("startingMileage") as string);
    const laborType = formData.get("laborType") as string;
    const truck = formData.get("truck") as string;
    const equipmentId = formData.get("equipment") as string;
    // Get trailer value, treat empty string or 'no trailer' as null
    const trailer = formData.get("trailer");
    let trailerNumber: string | null = null;
    if (
      typeof trailer === "string" &&
      trailer.trim() !== "" &&
      trailer.trim().toLowerCase() !== "no trailer" &&
      trailer.trim().toLowerCase() !== "none"
    ) {
      trailerNumber = trailer;
    } else {
      trailerNumber = null;
    }
    if (type === "switchJobs") {
      previousTimeSheetId = Number(formData.get("id"));
      // Only use transaction if updating two timesheets
      await prisma.$transaction(async (prisma) => {
        // Step 1: Create a new TimeSheet
        const createdTimeSheet = await prisma.timeSheet.create({
          data: {
            date: formatISO(formData.get("date") as string),
            Jobsite: { connect: { id: jobsiteId } },
            User: { connect: { id: userId } },
            CostCode: { connect: { name: costCode } },
            startTime: formatISO(formData.get("startTime") as string),
            workType: "TRUCK_DRIVER",
            status: "DRAFT",
            TruckingLogs: {
              create: {
                laborType,
                truckNumber: truck,
                equipmentId: equipmentId || null,
                startingMileage,
                trailerNumber: trailerNumber,
              },
            },
          },
        });
        newTimeSheet = createdTimeSheet.id;
        console.log(
          "[handleTruckTimeSheet] Created new timesheet as DRAFT:",
          createdTimeSheet,
        );
        if (previousTimeSheetId) {
          const updatedPrev = await prisma.timeSheet.update({
            where: { id: previousTimeSheetId },
            data: {
              endTime: formatISO(formData.get("endTime") as string),
              comment: previoustimeSheetComments,
              status: "PENDING",
            },
          });

          console.log(
            "[handleTruckTimeSheet] Previous timesheet set to PENDING:",
            updatedPrev,
          );
        }
      });
    } else {
      // Just create, no transaction needed
      const createdTimeSheet = await prisma.timeSheet.create({
        data: {
          date: formatISO(formData.get("date") as string),
          Jobsite: { connect: { id: jobsiteId } },
          User: { connect: { id: userId } },
          CostCode: { connect: { name: costCode } },
          startTime: formatISO(formData.get("startTime") as string),
          workType: "TRUCK_DRIVER",
          status: "DRAFT",
          TruckingLogs: {
            create: {
              laborType,
              truckNumber: truck,
              equipmentId: equipmentId || null,
              startingMileage,
              trailerNumber: trailerNumber || null,
            },
          },
        },
      });
      newTimeSheet = createdTimeSheet.id;
      console.log(
        "[handleTruckTimeSheet] Created new timesheet as DRAFT:",
        createdTimeSheet,
      );
    }
    // Fetch and log after DB ops
    if (newTimeSheet) {
      const created = await prisma.timeSheet.findUnique({
        where: { id: newTimeSheet },
      });
      console.log("[handleTruckTimeSheet] Confirmed new timesheet:", created);
    }

    // Trigger notification if a timesheet was set to PENDING (switchJobs case)
    if (type === "switchJobs" && previousTimeSheetId) {
      try {
        // Get user information for the notification
        const prevTimesheet = await prisma.timeSheet.findUnique({
          where: { id: previousTimeSheetId },
          include: { User: true },
        });
        sendNotificationToTopic({
          topic: "timecard-submission",
          title: "Timecard Submission Pending",
          message: `A timecard submission is pending for ${prevTimesheet?.User?.firstName} ${prevTimesheet?.User?.lastName}`,
          link: `/admins/timesheets`,
        });
      } catch (notifyError) {
        // Log but don't fail the whole operation if notification fails
        console.error(
          "[handleTruckTimeSheet] Error triggering notification:",
          notifyError,
        );
      }
    }

    // Revalidate paths after DB ops
    revalidatePath("/");
    revalidatePath("/admins/settings");
    revalidatePath("/admins/assets");
    revalidatePath("/admins/reports");
    revalidatePath("/admins/personnel");
    revalidatePath("/admins");
    revalidatePath("/dashboard");
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
  manager: string,
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
    console.log("formData1:", formData);

    // Get the ID from formData
    const idString = formData.get("id") as string;
    const id = parseInt(idString, 10);
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
        comment: (formData.get("timeSheetComments") as string) || null,
        status: "PENDING", // Set status to PENDING
        wasInjured: formData.get("wasInjured") === "true",
      },
    });

    console.log("Timesheet updated successfully.");
    console.log(updatedTimeSheet);

    // Trigger notification for submitted timesheet
    try {
      // Get the user information for the notification
      const timesheet = await prisma.timeSheet.findUnique({
        where: { id },
        include: { User: true },
      });

      sendNotificationToTopic({
        topic: "timecard-submission",
        title: "Timecard Submission Pending",
        message: `A timecard submission is pending for ${timesheet?.User?.firstName} ${timesheet?.User?.lastName}`,
        link: `/admins/timesheets`,
      });
    } catch (notifyError) {
      // Log but don't fail the whole operation if notification fails
      console.error(
        "[updateTimeSheet] Error triggering notification:",
        notifyError,
      );
    }

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

    const id = Number(formData.get("id"));
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

export async function updateTimesheetHighlights(
  updatedTimesheets: TimesheetUpdate[],
) {
  try {
    const session = await auth();
    if (!session) throw new Error("Unauthorized");

    const updatePromises = updatedTimesheets.map((timesheet) =>
      prisma.timeSheet.update({
        where: { id: timesheet.id },
        data: {
          startTime: timesheet.startTime
            ? new Date(timesheet.startTime)
            : undefined,
          endTime: timesheet.endTime ? new Date(timesheet.endTime) : null,
          jobsiteId: timesheet.jobsiteId,
          costcode: timesheet.costcode,
          editedByUserId: session.user.id,
          updatedAt: new Date(),
        },
      }),
    );

    await Promise.all(updatePromises);

    // Aggressive revalidation
    revalidatePath("/dashboard/myTeam");
    revalidatePath("/dashboard/myTeam/[id]/employee/[employeeId]", "page");

    return { success: true };
  } catch (error) {
    console.error("Error updating timesheets:", error);
    throw error;
  }
}

// Approve all pending timesheets for a user
export async function approvePendingTimesheets(
  userId: string,
  managerName?: string,
) {
  try {
    // Find all pending timesheets for the user
    const pendingTimesheets = await prisma.timeSheet.findMany({
      where: {
        userId,
        status: "PENDING",
      },
      select: { id: true },
    });
    if (!pendingTimesheets.length) return { success: true, updated: 0 };
    const timesheetIds = pendingTimesheets.map((ts) => ts.id);
    // Update all to APPROVED
    await prisma.timeSheet.updateMany({
      where: {
        id: { in: timesheetIds },
        userId,
        status: "PENDING",
      },
      data: {
        status: "APPROVED",
        statusComment: managerName
          ? `Approved by ${managerName}`
          : "Approved by manager",
      },
    });
    revalidatePath("/dashboard/myTeam/timecards");
    revalidatePath("/dashboard/myTeam");
    return { success: true, updated: timesheetIds.length };
  } catch (error) {
    console.error("Error approving pending timesheets:", error);
    return { success: false, error: "Failed to approve timesheets" };
  }
}
