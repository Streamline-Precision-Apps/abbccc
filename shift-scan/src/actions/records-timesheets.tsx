"use server";
import { LoadType, WorkType } from "@/lib/enums";
import prisma from "@/lib/prisma";
import { revalidatePath, revalidateTag } from "next/cache";

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
    const timesheetData: any = {
      date: data.form.date.toISOString(),
      userId: data.form.user.id,
      jobsiteId: data.form.jobsite.id,
      costcode: data.form.costcode.name, // costcode is referenced by name in schema
      workType: data.form.workType as WorkType,
      createdByAdmin: true,
      // Add other fields as needed
    };
    if (startDateTimeISO) timesheetData.startTime = startDateTimeISO;
    if (endDateTimeISO) timesheetData.endTime = endDateTimeISO;
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
      const maintenanceLogData: any = {
        timeSheetId: timesheet.id,
        userId: data.form.user.id,
        maintenanceId: log.maintenanceId,
      };
      const logStart =
        logStartDate && logStartTime
          ? new Date(`${logStartDate}T${logStartTime}:00`)
          : undefined;
      const logEnd =
        logEndDate && logEndTime
          ? new Date(`${logEndDate}T${logEndTime}:00`)
          : undefined;
      if (logStart) maintenanceLogData.startTime = logStart;
      if (logEnd) maintenanceLogData.endTime = logEnd;
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

export async function adminUpdateTimesheet(id: string, data: any) {
  // Implementation for updating a timesheet
  console.log("Updating timesheet with ID:", id, "and data:", data);

  if (!id || !data) {
    throw new Error("Invalid timesheet ID or data");
  }
  try {
    await prisma.$transaction(async (tx) => {
      // Update the main timesheet
      await prisma.timeSheet.update({
        where: { id },
        data: {
          jobsiteId: data.form.jobsite.id,
          costcode: data.form.costcode.name,
          startTime: data.form.startTime,
          endTime: data.form.endTime,
          workType: data.form.workType as WorkType,
          EmployeeEquipmentLogs: {
            update: [],
          },
          MaintenanceLogs: {
            update: [],
          },
          TruckingLogs: {
            update: [],
          },
          TascoLogs: {
            update: [],
          },
        },
      });

      // Conditional log updates and deletions
      if (data.form.workType === "MECHANIC") {
        // Update or create MaintenanceLogs
        await Promise.all(
          data.maintenanceLogs.map((log: any) => {
            if (log.id) {
              return tx.maintenanceLog.update({
                where: { id: log.id },
                data: {
                  startTime: log.startTime,
                  endTime: log.endTime,
                  maintenanceId: log.maintenanceId,
                },
              });
            } else {
              // Create new log if no id
              return tx.maintenanceLog.create({
                data: {
                  timeSheetId: id,
                  userId: data.form.user.id,
                  startTime: log.startTime,
                  endTime: log.endTime,
                  maintenanceId: log.maintenanceId,
                },
              });
            }
          })
        );
        // Delete other logs
        await tx.truckingLog.deleteMany({ where: { timeSheetId: id } });
        await tx.tascoLog.deleteMany({ where: { timeSheetId: id } });
        await tx.employeeEquipmentLog.deleteMany({
          where: { timeSheetId: id },
        });
      } else if (data.form.workType === "TRUCK_DRIVER") {
        // Delete all existing trucking logs for this timesheet
        await tx.truckingLog.deleteMany({ where: { timeSheetId: id } });
        // Create new trucking logs from payload
        await Promise.all(
          data.truckingLogs.map((log: any) =>
            tx.truckingLog.create({
              data: {
                timeSheetId: id,
                laborType: "truckDriver",
                equipmentId: log.equipmentId,
                startingMileage: log.startingMileage
                  ? parseInt(log.startingMileage)
                  : null,
                endingMileage: log.endingMileage
                  ? parseInt(log.endingMileage)
                  : null,
              },
            })
          )
        );
        // Delete other logs
        await tx.maintenanceLog.deleteMany({ where: { timeSheetId: id } });
        await tx.tascoLog.deleteMany({ where: { timeSheetId: id } });
        await tx.employeeEquipmentLog.deleteMany({
          where: { timeSheetId: id },
        });
      } else if (data.form.workType === "TASCO") {
        // Update TascoLogs
        await Promise.all(
          data.tascoLogs.map((log: any) =>
            tx.tascoLog.update({
              where: { id: log.id },
              data: {
                shiftType: log.shiftType,
                laborType: log.laborType,
                materialType: log.materialType,
                LoadQuantity: log.loadQuantity ? parseInt(log.loadQuantity) : 0,
                equipmentId: log.equipment[0]?.id || null,
              },
            })
          )
        );
        // Delete other logs
        await tx.maintenanceLog.deleteMany({ where: { timeSheetId: id } });
        await tx.truckingLog.deleteMany({ where: { timeSheetId: id } });
        await tx.employeeEquipmentLog.deleteMany({
          where: { timeSheetId: id },
        });
      } else if (data.form.workType === "LABOR") {
        // Update EmployeeEquipmentLogs
        await Promise.all(
          data.laborLogs.map((log: any) =>
            tx.employeeEquipmentLog.update({
              where: { id: log.id },
              data: {
                equipmentId: log.equipment.id,
                startTime: log.startTime,
                endTime: log.endTime,
              },
            })
          )
        );
        // Delete other logs
        await tx.maintenanceLog.deleteMany({ where: { timeSheetId: id } });
        await tx.truckingLog.deleteMany({ where: { timeSheetId: id } });
        await tx.tascoLog.deleteMany({ where: { timeSheetId: id } });
      }
    });
    revalidateTag("timesheets");
    return true;
  } catch (error) {
    console.error(`Error updating timesheet with ID ${id}:`, error);
    throw error;
  }
}
