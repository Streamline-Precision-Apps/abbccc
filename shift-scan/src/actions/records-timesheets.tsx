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
    startTime: string;
    endTime: string;
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
    const timesheet = await tx.timeSheet.create({
      data: {
        date: data.form.date.toISOString(),
        userId: data.form.user.id,
        jobsiteId: data.form.jobsite.id,
        costcode: data.form.costcode.name, // costcode is referenced by name in schema
        startTime: new Date(
          `${data.form.date.toISOString().slice(0, 10)}T${data.form.startTime}`
        ),
        endTime: data.form.endTime
          ? new Date(
              `${data.form.date.toISOString().slice(0, 10)}T${
                data.form.endTime
              }`
            )
          : null,
        workType: data.form.workType as WorkType,
        createdByAdmin: true,
        // Add other fields as needed
      },
    });

    // Maintenance Logs
    for (const log of data.maintenanceLogs) {
      if (!log.maintenanceId) continue;
      await tx.maintenanceLog.create({
        data: {
          timeSheetId: timesheet.id,
          userId: data.form.user.id,
          maintenanceId: log.maintenanceId,
          startTime: new Date(
            `${data.form.date.toISOString().slice(0, 10)}T${log.startTime}`
          ),
          endTime: log.endTime
            ? new Date(
                `${data.form.date.toISOString().slice(0, 10)}T${log.endTime}`
              )
            : null,
        },
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
      await tx.employeeEquipmentLog.create({
        data: {
          equipmentId: log.equipment.id,
          jobsiteId: data.form.jobsite.id,
          employeeId: data.form.user.id,
          startTime: log.startTime
            ? new Date(
                `${data.form.date.toISOString().slice(0, 10)}T${log.startTime}`
              )
            : null,
          endTime: log.endTime
            ? new Date(
                `${data.form.date.toISOString().slice(0, 10)}T${log.endTime}`
              )
            : null,
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
}
