"use server";
import { LoadType, WorkType, materialUnit } from "@/lib/enums";
import prisma from "@/lib/prisma";
import { revalidatePath, revalidateTag } from "next/cache";
import { ApprovalStatus } from "@prisma/client";
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

    // Use startTime and endTime as ISO strings (or null)
    const timesheetData: any = {
      date: data.form.date.toISOString(),
      User: { connect: { id: data.form.user.id } },
      Jobsite: { connect: { id: data.form.jobsite.id } },
      CostCode: { connect: { name: data.form.costcode.name } },
      workType: data.form.workType as WorkType,
      createdByAdmin: true,
      status: "APPROVED" as ApprovalStatus, // Default status, can be updated later
      // Add other fields as needed
    };
    if (data.form.startTime)
      timesheetData.startTime = new Date(data.form.startTime);
    if (data.form.endTime) timesheetData.endTime = new Date(data.form.endTime);
    const timesheet = await tx.timeSheet.create({
      data: timesheetData,
    });

    // Maintenance Logs
    for (const log of data.maintenanceLogs) {
      if (!log.maintenanceId) continue;
      const maintenanceLogData: any = {
        timeSheetId: timesheet.id,
        userId: data.form.user.id,
        maintenanceId: log.maintenanceId,
      };
      if (log.startTime) maintenanceLogData.startTime = new Date(log.startTime);
      if (log.endTime) maintenanceLogData.endTime = new Date(log.endTime);
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
          startTime: log.startTime ? new Date(log.startTime) : undefined,
          endTime: log.endTime ? new Date(log.endTime) : undefined,
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

export async function adminUpdateTimesheet(id: string, data: TimesheetData) {
  // Update the main timesheet and all related logs in a transaction
  console.log("Updating timesheet with data:", data);

  await prisma.$transaction(async (tx) => {
    // Update main timesheet
    const timesheetData: any = {
      date: typeof data.date === "string" ? data.date : data.date.toISOString(),
      userId: data.User?.id,
      jobsiteId: data.Jobsite?.id,
      costcode: data.CostCode?.name,
      workType: data.workType,
      status: data.status,
    };
    if (data.startTime) timesheetData.startTime = new Date(data.startTime);
    if (data.endTime) timesheetData.endTime = new Date(data.endTime);
    await tx.timeSheet.update({
      where: { id },
      data: timesheetData,
    });

    // Delete all logs for work types that are NOT the selected one
    if (data.workType !== "MECHANIC") {
      await tx.maintenanceLog.deleteMany({ where: { timeSheetId: id } });
    }
    if (data.workType !== "TRUCK_DRIVER") {
      // Delete all trucking logs and their nested logs
      const truckingLogs = await tx.truckingLog.findMany({
        where: { timeSheetId: id },
      });
      const truckingLogIds = truckingLogs.map((tl) => tl.id);
      if (truckingLogIds.length > 0) {
        await tx.equipmentHauled.deleteMany({
          where: { truckingLogId: { in: truckingLogIds } },
        });
        await tx.material.deleteMany({
          where: { truckingLogId: { in: truckingLogIds } },
        });
        await tx.refuelLog.deleteMany({
          where: { truckingLogId: { in: truckingLogIds } },
        });
        await tx.stateMileage.deleteMany({
          where: { truckingLogId: { in: truckingLogIds } },
        });
      }
      await tx.truckingLog.deleteMany({ where: { timeSheetId: id } });
    }
    if (data.workType !== "TASCO") {
      // Delete all tasco logs and their nested refuel logs
      const tascoLogs = await tx.tascoLog.findMany({
        where: { timeSheetId: id },
      });
      const tascoLogIds = tascoLogs.map((tl) => tl.id);
      if (tascoLogIds.length > 0) {
        await tx.refuelLog.deleteMany({
          where: { tascoLogId: { in: tascoLogIds } },
        });
      }
      await tx.tascoLog.deleteMany({ where: { timeSheetId: id } });
    }
    if (data.workType !== "LABOR") {
      await tx.employeeEquipmentLog.deleteMany({ where: { timeSheetId: id } });
    }

    if (data.workType === "MECHANIC") {
      // --- Maintenance Logs ---
      const existingMaintenance = await tx.maintenanceLog.findMany({
        where: { timeSheetId: id },
      });
      const updatedIds = data.MaintenanceLogs.map((log) => log.id).filter(
        Boolean
      );
      for (const old of existingMaintenance) {
        if (!updatedIds.includes(old.id)) {
          await tx.maintenanceLog.delete({ where: { id: old.id } });
        }
      }
      for (const log of data.MaintenanceLogs) {
        const maintenanceLogData: any = {
          timeSheetId: data.id,
          userId: data.User?.id,
          maintenanceId: log.maintenanceId,
        };
        if (log.startTime)
          maintenanceLogData.startTime = new Date(log.startTime);
        if (log.endTime) maintenanceLogData.endTime = new Date(log.endTime);
        // If the id exists in the DB, update, else create
        const exists = existingMaintenance.find((l) => l.id === log.id);
        if (log.id && exists) {
          await tx.maintenanceLog.update({
            where: { id: log.id },
            data: maintenanceLogData,
          });
        } else {
          await tx.maintenanceLog.create({ data: maintenanceLogData });
        }
      }
    } else if (data.workType === "TRUCK_DRIVER") {
      // --- Trucking Logs ---
      const existingTrucking = await tx.truckingLog.findMany({
        where: { timeSheetId: id },
      });
      const updatedTruckingIds = data.TruckingLogs.map((log) => log.id).filter(
        Boolean
      );
      for (const old of existingTrucking) {
        if (!updatedTruckingIds.includes(old.id)) {
          await tx.truckingLog.delete({ where: { id: old.id } });
        }
      }
      for (const tlog of data.TruckingLogs) {
        let truckingLogId = tlog.id;
        const truckingLogData: any = {
          timeSheetId: id,
          laborType: "truckDriver",
          equipmentId: tlog.equipmentId,
          startingMileage: tlog.startingMileage ?? null,
          endingMileage: tlog.endingMileage ?? null,
        };
        if (tlog.id && existingTrucking.find((l) => l.id === tlog.id)) {
          await tx.truckingLog.update({
            where: { id: tlog.id },
            data: truckingLogData,
          });
        } else {
          const created = await tx.truckingLog.create({
            data: truckingLogData,
          });
          truckingLogId = created.id;
        }
        // Equipment Hauled
        const existingEq = await tx.equipmentHauled.findMany({
          where: { truckingLogId },
        });
        const updatedEqIds = tlog.EquipmentHauled.map((eq) => eq.id).filter(
          Boolean
        );
        for (const old of existingEq) {
          if (!updatedEqIds.includes(old.id)) {
            await tx.equipmentHauled.delete({ where: { id: old.id } });
          }
        }
        for (const eq of tlog.EquipmentHauled) {
          const eqData: any = {
            truckingLogId,
            equipmentId: eq.equipmentId,
            jobSiteId: eq.jobSiteId,
          };
          if (eq.id && existingEq.find((e) => e.id === eq.id)) {
            await tx.equipmentHauled.update({
              where: { id: eq.id },
              data: eqData,
            });
          } else {
            await tx.equipmentHauled.create({ data: eqData });
          }
        }
        // Materials
        const existingMat = await tx.material.findMany({
          where: { truckingLogId },
        });
        const updatedMatIds = tlog.Materials.map((mat) => mat.id).filter(
          Boolean
        );
        for (const old of existingMat) {
          if (!updatedMatIds.includes(old.id)) {
            await tx.material.delete({ where: { id: old.id } });
          }
        }
        for (const mat of tlog.Materials) {
          const matData: any = {
            truckingLogId,
            LocationOfMaterial: mat.LocationOfMaterial,
            name: mat.name,
            materialWeight:
              mat.materialWeight !== undefined
                ? Number(mat.materialWeight)
                : null,
            unit: mat.unit ? (mat.unit as materialUnit) : null,
            quantity: mat.quantity ? Number(mat.quantity) : null,
            loadType: mat.loadType ? mat.loadType.toUpperCase() : null,
          };
          if (mat.id && existingMat.find((m) => m.id === mat.id)) {
            await tx.material.update({ where: { id: mat.id }, data: matData });
          } else {
            await tx.material.create({ data: matData });
          }
        }
        // Refuel Logs
        const existingRef = await tx.refuelLog.findMany({
          where: { truckingLogId },
        });
        const updatedRefIds = tlog.RefuelLogs.map((ref) => ref.id).filter(
          Boolean
        );
        for (const old of existingRef) {
          if (!updatedRefIds.includes(old.id)) {
            await tx.refuelLog.delete({ where: { id: old.id } });
          }
        }
        for (const ref of tlog.RefuelLogs) {
          const refData: any = {
            truckingLogId,
            gallonsRefueled:
              ref.gallonsRefueled !== undefined
                ? Number(ref.gallonsRefueled)
                : null,
            milesAtFueling:
              ref.milesAtFueling !== undefined
                ? Number(ref.milesAtFueling)
                : null,
          };
          if (ref.id && existingRef.find((r) => r.id === ref.id)) {
            await tx.refuelLog.update({ where: { id: ref.id }, data: refData });
          } else {
            await tx.refuelLog.create({ data: refData });
          }
        }
        // State Mileages
        const existingSM = await tx.stateMileage.findMany({
          where: { truckingLogId },
        });
        const updatedSMIds = tlog.StateMileages.map((sm) => sm.id).filter(
          Boolean
        );
        for (const old of existingSM) {
          if (!updatedSMIds.includes(old.id)) {
            await tx.stateMileage.delete({ where: { id: old.id } });
          }
        }
        for (const sm of tlog.StateMileages) {
          const smData: any = {
            truckingLogId,
            state: sm.state,
            stateLineMileage:
              sm.stateLineMileage !== undefined
                ? Number(sm.stateLineMileage)
                : null,
          };
          if (sm.id && existingSM.find((s) => s.id === sm.id)) {
            await tx.stateMileage.update({
              where: { id: sm.id },
              data: smData,
            });
          } else {
            await tx.stateMileage.create({ data: smData });
          }
        }
      }
    } else if (data.workType === "TASCO") {
      // --- Tasco Logs ---
      const existingTasco = await tx.tascoLog.findMany({
        where: { timeSheetId: id },
      });
      const updatedTascoIds = data.TascoLogs.map((log) => log.id).filter(
        Boolean
      );
      for (const old of existingTasco) {
        if (!updatedTascoIds.includes(old.id)) {
          await tx.tascoLog.delete({ where: { id: old.id } });
        }
      }
      for (const tlog of data.TascoLogs) {
        let tascoLogId = tlog.id;
        const tascoLogData: any = {
          timeSheetId: id,
          shiftType: tlog.shiftType,
          laborType: tlog.laborType,
          materialType: tlog.materialType,
          LoadQuantity: tlog.LoadQuantity ?? 0,
          equipmentId: tlog.Equipment?.id || null,
        };
        if (tlog.id && existingTasco.find((l) => l.id === tlog.id)) {
          await tx.tascoLog.update({
            where: { id: tlog.id },
            data: tascoLogData,
          });
        } else {
          const created = await tx.tascoLog.create({ data: tascoLogData });
          tascoLogId = created.id;
        }
        // Refuel Logs for Tasco
        const existingRef = await tx.refuelLog.findMany({
          where: { tascoLogId },
        });
        const updatedRefIds = tlog.RefuelLogs.map((ref) => ref.id).filter(
          Boolean
        );
        for (const old of existingRef) {
          if (!updatedRefIds.includes(old.id)) {
            await tx.refuelLog.delete({ where: { id: old.id } });
          }
        }
        for (const ref of tlog.RefuelLogs) {
          const refData: any = {
            tascoLogId,
            gallonsRefueled: ref.gallonsRefueled ?? null,
          };
          if (ref.id && existingRef.find((r) => r.id === ref.id)) {
            await tx.refuelLog.update({ where: { id: ref.id }, data: refData });
          } else {
            await tx.refuelLog.create({ data: refData });
          }
        }
      }
    } else if (data.workType === "LABOR") {
      // --- Employee Equipment Logs ---
      const existingEmpEq = await tx.employeeEquipmentLog.findMany({
        where: { timeSheetId: id },
      });
      const updatedEmpEqIds = data.EmployeeEquipmentLogs.map(
        (log) => log.id
      ).filter(Boolean);
      for (const old of existingEmpEq) {
        if (!updatedEmpEqIds.includes(old.id)) {
          await tx.employeeEquipmentLog.delete({ where: { id: old.id } });
        }
      }
      for (const log of data.EmployeeEquipmentLogs) {
        const empEqData: any = {
          equipmentId: log.equipmentId,
          startTime: log.startTime ? new Date(log.startTime) : undefined,
          endTime: log.endTime ? new Date(log.endTime) : undefined,
          timeSheetId: id,
        };
        if (log.id && existingEmpEq.find((l) => l.id === log.id)) {
          await tx.employeeEquipmentLog.update({
            where: { id: log.id },
            data: empEqData,
          });
        } else {
          await tx.employeeEquipmentLog.create({ data: empEqData });
        }
      }
    } else {
      throw new Error(`Unsupported work type: ${data.workType}`);
    }
  });
  revalidatePath("/admins/records/timesheets");
  revalidateTag("timesheets");
}
