"use server";
import { LoadType, WorkType } from "@/lib/enums";
import prisma from "@/lib/prisma";
import { revalidatePath, revalidateTag } from "next/cache";
import type { Prisma } from "@prisma/client";

export type TimesheetSubmission = {
  form: {
    date: Date;
    user: { id: string; firstName: string; lastName: string };
    jobsite: { id: string; name: string };
    costcode: { id: string; name: string };
    startTime: { date: string; time: string };
    endTime: { date: string; time: string };
    workType: string;
  };
  maintenanceLogs: Array<{
    startTime: string;
    endTime: string;
    maintenanceId: string;
  }>;
  truckingLogs: Array<{
    equipmentId: string;
    startingMileage: string;
    endingMileage: string;
    equipmentHauled: Array<{
      equipment: { id: string; name: string };
      jobsite: { id: string; name: string };
    }>;
    materials: Array<{
      location: string;
      name: string;
      materialWeight: string;
      lightWeight: string;
      grossWeight: string;
      loadType: "screened" | "unscreened" | "";
    }>;
    refuelLogs: Array<{
      gallonsRefueled: string;
      milesAtFueling: string;
    }>;
    stateMileages: Array<{
      state: string;
      stateLineMileage: string;
    }>;
  }>;
  tascoLogs: Array<{
    shiftType: "ABCD Shift" | "E Shift" | "F Shift" | "";
    laborType: "Equipment Operator" | "Labor" | "";
    materialType: string;
    loadQuantity: string;
    refuelLogs: Array<{ gallonsRefueled: string }>;
    equipment: Array<{ id: string; name: string }>;
  }>;
  laborLogs: Array<{
    equipment: { id: string; name: string };
    startTime: string;
    endTime: string;
  }>;
};

export async function adminCreateTimesheet(data: TimesheetSubmission) {
  // Create the main timesheet and all related logs in a transaction
  console.log("Creating timesheet with data:", data);
  await prisma.$transaction(async (tx) => {
    // Create the main timesheet

    // Helper to convert MM/dd/yyyy to yyyy-MM-dd
    function toISODateString(dateStr: string) {
      if (!dateStr) return "";
      // If already yyyy-MM-dd, return as is
      if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) return dateStr;
      // If MM/dd/yyyy, convert
      const parts = dateStr.split("/");
      if (parts.length === 3) {
        return `${parts[2]}-${parts[0].padStart(2, "0")}-${parts[1].padStart(
          2,
          "0"
        )}`;
      }
      return dateStr;
    }

    const startDateString = toISODateString(data.form.startTime?.date);
    const startTimeString = data.form.startTime?.time;
    const endDateString = toISODateString(data.form.endTime?.date);
    const endTimeString = data.form.endTime?.time;
    const startDateTimeISO =
      startDateString && startTimeString
        ? new Date(`${startDateString}T${startTimeString}:00`)
        : undefined;
    const endDateTimeISO =
      endDateString && endTimeString
        ? new Date(`${endDateString}T${endTimeString}:00`)
        : undefined;
    const timesheetData: Prisma.TimeSheetCreateInput = {
      date: data.form.date.toISOString(),
      User: { connect: { id: data.form.user.id } },
      Jobsite: { connect: { id: data.form.jobsite.id } },
      CostCode: { connect: { name: data.form.costcode.name } },
      workType: data.form.workType as WorkType,
      createdByAdmin: true,
      startTime: startDateTimeISO ?? new Date(),
      endTime: endDateTimeISO,
      // Add other fields as needed
    };
    const timesheet = await tx.timeSheet.create({
      data: timesheetData,
    });

    // Maintenance Logs
    for (const log of data.maintenanceLogs) {
      if (!log.maintenanceId) continue;
      const logStartDate =
        data.form.startTime?.date || data.form.date.toISOString().slice(0, 10);
      const logEndDate =
        data.form.endTime?.date || data.form.date.toISOString().slice(0, 10);
      const logStartTime = log.startTime;
      const logEndTime = log.endTime;
      const logStart =
        logStartDate && logStartTime
          ? new Date(`${logStartDate}T${logStartTime}:00`)
          : new Date();
      const logEnd =
        logEndDate && logEndTime
          ? new Date(`${logEndDate}T${logEndTime}:00`)
          : undefined;
      const maintenanceLogData: Prisma.MaintenanceLogCreateInput = {
        TimeSheet: { connect: { id: timesheet.id } },
        User: { connect: { id: data.form.user.id } },
        Maintenance: { connect: { id: log.maintenanceId } },
        startTime: logStart,
        endTime: logEnd,
      };
      await tx.maintenanceLog.create({
        data: maintenanceLogData,
      });
    }

    // Trucking Logs
    for (const tlog of data.truckingLogs) {
      if (!tlog.equipmentId) continue;
      const truckingLog = await tx.truckingLog.create({
        data: {
          timeSheetId: timesheet.id,
          laborType: "truckDriver",
          equipmentId: tlog.equipmentId,
          startingMileage: tlog.startingMileage
            ? parseInt(tlog.startingMileage)
            : null,
          endingMileage: tlog.endingMileage
            ? parseInt(tlog.endingMileage)
            : null,
        },
      });
      // Equipment Hauled
      for (const eq of tlog.equipmentHauled) {
        if (!eq.equipment.id) continue;
        await tx.equipmentHauled.create({
          data: {
            truckingLogId: truckingLog.id,
            equipmentId: eq.equipment.id,
            jobSiteId: eq.jobsite.id,
          },
        });
      }
      // Materials
      for (const mat of tlog.materials) {
        await tx.material.create({
          data: {
            truckingLogId: truckingLog.id,
            LocationOfMaterial: mat.location,
            name: mat.name,
            materialWeight: mat.materialWeight
              ? parseFloat(mat.materialWeight)
              : null,
            lightWeight: mat.lightWeight ? parseFloat(mat.lightWeight) : null,
            grossWeight: mat.grossWeight ? parseFloat(mat.grossWeight) : null,
            loadType: mat.loadType
              ? (mat.loadType.toUpperCase() as LoadType)
              : null,
          },
        });
      }
      // Refuel Logs
      for (const ref of tlog.refuelLogs) {
        await tx.refuelLog.create({
          data: {
            truckingLogId: truckingLog.id,
            gallonsRefueled: ref.gallonsRefueled
              ? parseFloat(ref.gallonsRefueled)
              : null,
            milesAtFueling: ref.milesAtFueling
              ? parseInt(ref.milesAtFueling)
              : null,
          },
        });
      }
      // State Mileages
      for (const sm of tlog.stateMileages) {
        await tx.stateMileage.create({
          data: {
            truckingLogId: truckingLog.id,
            state: sm.state,
            stateLineMileage: sm.stateLineMileage
              ? parseInt(sm.stateLineMileage)
              : null,
          },
        });
      }
    }

    // Tasco Logs
    for (const tlog of data.tascoLogs) {
      if (!tlog.shiftType) continue;
      const tascoLog = await tx.tascoLog.create({
        data: {
          timeSheetId: timesheet.id,
          shiftType: tlog.shiftType,
          laborType: tlog.laborType,
          materialType: tlog.materialType,
          LoadQuantity: tlog.loadQuantity ? parseInt(tlog.loadQuantity) : 0,
          equipmentId: tlog.equipment[0]?.id || null,
        },
      });
      // Refuel Logs for Tasco
      for (const ref of tlog.refuelLogs) {
        await tx.refuelLog.create({
          data: {
            tascoLogId: tascoLog.id,
            gallonsRefueled: ref.gallonsRefueled
              ? parseFloat(ref.gallonsRefueled)
              : null,
          },
        });
      }
    }

    // Labor Logs (EmployeeEquipmentLog)
    for (const log of data.laborLogs) {
      if (!log.equipment.id) continue;
      const logStartDate =
        data.form.startTime?.date || data.form.date.toISOString().slice(0, 10);
      const logEndDate =
        data.form.endTime?.date || data.form.date.toISOString().slice(0, 10);
      await tx.employeeEquipmentLog.create({
        data: {
          equipmentId: log.equipment.id,
          startTime:
            log.startTime && logStartDate
              ? new Date(`${logStartDate}T${log.startTime}:00`)
              : undefined,
          endTime:
            log.endTime && logEndDate
              ? new Date(`${logEndDate}T${log.endTime}:00`)
              : undefined,
          timeSheetId: timesheet.id,
        },
      });
    }
  });
  revalidatePath("/admins/records/timesheets");
  revalidateTag("timesheets");
}

export async function adminDeleteTimesheet(id: string) {
  try {
    await prisma.timeSheet.delete({
      where: { id },
    });
    revalidateTag("timesheets");
    return true;
  } catch (error) {
    console.error(`Error deleting timesheet with ID ${id}:`, error);
    throw error;
  }
}

export async function adminUpdateTimesheet(
  id: string,
  data: TimesheetSubmission
) {
  // Implementation for updating a timesheet
  console.log("Updating timesheet with ID:", id, "and data:", data);
}
