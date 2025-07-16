"use server";
import { LoadType, WorkType, materialUnit } from "@/lib/enums";
import prisma from "@/lib/prisma";
import { revalidatePath, revalidateTag } from "next/cache";
import { ApprovalStatus, Prisma } from "@prisma/client";
import { TimesheetData } from "@/app/(routes)/admins/timesheets/_components/Edit/types";

export type TimesheetSubmission = {
  form: {
    date: Date;
    user: { id: string; firstName: string; lastName: string };
    jobsite: { id: string; name: string };
    costcode: { id: string; name: string };
    startTime: string | null;
    endTime: string | null;
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
      quantity: string;
      unit: string;
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
    loadsHauled: string;
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

    // Use startTime and endTime as ISO strings (or null)
    const timesheetData: Prisma.TimeSheetCreateInput = {
      date: data.form.date.toISOString(),
      User: { connect: { id: data.form.user.id } },
      Jobsite: { connect: { id: data.form.jobsite.id } },
      CostCode: { connect: { name: data.form.costcode.name } },
      workType: data.form.workType as WorkType,
      createdByAdmin: true,
      status: "APPROVED" as ApprovalStatus,
      startTime: data.form.startTime
        ? new Date(data.form.startTime)
        : new Date(),
      endTime: data.form.endTime ? new Date(data.form.endTime) : new Date(),
    };
    const timesheet = await tx.timeSheet.create({
      data: timesheetData,
    });

    // Maintenance Logs
    for (const log of data.maintenanceLogs) {
      if (!log.maintenanceId) continue;
      const maintenanceLogData: Prisma.MaintenanceLogCreateInput = {
        TimeSheet: { connect: { id: timesheet.id } },
        User: { connect: { id: data.form.user.id } },
        Maintenance: { connect: { id: log.maintenanceId } },
        startTime: log.startTime ? new Date(log.startTime) : new Date(),
        endTime: log.endTime ? new Date(log.endTime) : new Date(),
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
            quantity: mat.quantity ? parseFloat(mat.quantity) : null,
            unit: mat.unit ? (mat.unit as materialUnit) : null,
            loadType: mat.loadType
              ? (mat.loadType.toUpperCase() as LoadType)
              : undefined,
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
              : undefined,
            milesAtFueling: ref.milesAtFueling
              ? parseInt(ref.milesAtFueling)
              : undefined,
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
          LoadQuantity: tlog.loadsHauled
            ? parseInt(tlog.loadsHauled)
            : undefined,
          equipmentId:
            tlog.equipment && tlog.equipment.length > 0
              ? tlog.equipment[0].id
              : undefined,
        },
      });
      // Refuel Logs for Tasco
      for (const ref of tlog.refuelLogs) {
        await tx.refuelLog.create({
          data: {
            tascoLogId: tascoLog.id,
            gallonsRefueled: ref.gallonsRefueled
              ? parseFloat(ref.gallonsRefueled)
              : undefined,
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
          ...(log.startTime ? { startTime: new Date(log.startTime) } : {}),
          ...(log.endTime ? { endTime: new Date(log.endTime) } : {}),
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

export async function adminUpdateTimesheet(formData: FormData) {
  const id = formData.get("id") as string;
  if (!id) {
    throw new Error("Timesheet ID is required for update.");
  }

  revalidatePath("/admins/records/timesheets");
  revalidateTag("timesheets");
}
