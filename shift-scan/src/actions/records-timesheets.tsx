type MaterialFormData = {
  location: string;
  name: string;
  materialWeight: string;
  lightWeight: string;
  grossWeight: string;
  loadType: string;
  id?: string;
};

type RefuelFormData = {
  gallonsRefueled: string;
  milesAtFueling: string;
  id?: string;
};

/**
 * Type guard for MaterialFormData
 */
function isMaterialFormData(m: unknown): m is MaterialFormData {
  return typeof m === "object" && m !== null && "location" in m && "name" in m;
}

/**
 * Type guard for RefuelFormData
 */
function isRefuelFormData(r: unknown): r is RefuelFormData {
  return typeof r === "object" && r !== null && "gallonsRefueled" in r;
}
("use server");
import type { TimeSheet, Material, Refueled } from "@/lib/types";
import { LoadType, WorkType } from "@/lib/enums";
import prisma from "@/lib/prisma";
import { Prisma, PrismaClient } from "@prisma/client";
import { DefaultArgs } from "@prisma/client/runtime/library";
import { revalidatePath, revalidateTag } from "next/cache";
import { ApprovalStatus } from "@prisma/client";
import { el } from "date-fns/locale";

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
              : undefined,
            lightWeight: mat.lightWeight
              ? parseFloat(mat.lightWeight)
              : undefined,
            grossWeight: mat.grossWeight
              ? parseFloat(mat.grossWeight)
              : undefined,
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

export async function adminUpdateTimesheet(id: string, data: TimeSheet) {
  // Update the main timesheet and all related logs in a transaction
  console.log("Updating timesheet with data:", data);

  await prisma.$transaction(async (tx) => {
    // Update main timesheet
    const timesheetData: Prisma.TimeSheetUpdateInput = {
      date: typeof data.date === "string" ? data.date : data.date.toISOString(),
      workType: data.workType,
      status: data.status as ApprovalStatus,
      startTime: data.startTime ? new Date(data.startTime) : undefined,
      endTime: data.endTime ? new Date(data.endTime) : undefined,
      ...(data.userId && { User: { connect: { id: data.userId } } }),
      ...(data.jobsiteId && { Jobsite: { connect: { id: data.jobsiteId } } }),
      ...(data.costcode && { CostCode: { connect: { name: data.costcode } } }),
    };
    await tx.timeSheet.update({
      where: { id },
      data: timesheetData,
    });

    // Delete all logs for work types that are NOT the selected one
    if (data.workType !== "MECHANIC") {
      await tx.maintenanceLog.deleteMany({ where: { timeSheetId: id } });
    }
    if (data.workType !== "TRUCK_DRIVER") {
      const truckingLogs = await tx.truckingLog.findMany({
        where: { timeSheetId: id },
      });
      const truckingLogIds = truckingLogs.map((tl: { id: string }) => tl.id);
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
      const tascoLogs = await tx.tascoLog.findMany({
        where: { timeSheetId: id },
      });
      const tascoLogIds = tascoLogs.map((tl: { id: string }) => tl.id);
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
      const existingMaintenance = await tx.maintenanceLog.findMany({
        where: { timeSheetId: id },
      });
      const updatedIds = (data.maintenanceLogs ?? [])
        .map((log: { id: string }) => log.id)
        .filter(Boolean);
      for (const old of existingMaintenance) {
        if (!updatedIds.includes(old.id)) {
          await tx.maintenanceLog.delete({ where: { id: old.id } });
        }
      }
      for (const log of data.maintenanceLogs ?? []) {
        const maintenanceLogData: Prisma.MaintenanceLogCreateInput = {
          TimeSheet: { connect: { id: data.id } },
          User: { connect: { id: data.userId } },
          Maintenance: { connect: { id: log.maintenanceId } },
          startTime: log.startTime ? new Date(log.startTime) : new Date(),
          endTime: log.endTime ? new Date(log.endTime) : new Date(),
        };
        const exists = existingMaintenance.find(
          (l: { id: string }) => l.id === log.id
        );
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
      const existingTrucking = await tx.truckingLog.findMany({
        where: { timeSheetId: id },
      });
      const updatedTruckingIds = (data.truckingLogs ?? [])
        .map((log: { id: string }) => log.id)
        .filter(Boolean);
      for (const old of existingTrucking) {
        if (!updatedTruckingIds.includes(old.id)) {
          await tx.truckingLog.delete({ where: { id: old.id } });
        }
      }
      for (const tlog of data.truckingLogs ?? []) {
        let truckingLogId = tlog.id;
        const truckingLogData: Prisma.TruckingLogCreateInput = {
          TimeSheet: { connect: { id } },
          laborType: "truckDriver",
          Equipment: tlog.equipmentId
            ? { connect: { id: tlog.equipmentId } }
            : undefined,
          startingMileage: tlog.startingMileage ?? undefined,
          endingMileage: tlog.endingMileage ?? undefined,
        };
        if (
          tlog.id &&
          existingTrucking.find((l: { id: string }) => l.id === tlog.id)
        ) {
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
        const existingEq = await tx.equipmentHauled.findMany({
          where: { truckingLogId },
        });
        const updatedEqIds = (tlog.equipmentHauled ?? [])
          .map((eq: { id: string }) => eq.id)
          .filter(Boolean);
        for (const old of existingEq) {
          if (!updatedEqIds.includes(old.id)) {
            await tx.equipmentHauled.delete({ where: { id: old.id } });
          }
        }
        for (const eq of tlog.equipmentHauled ?? []) {
          const eqData: Prisma.EquipmentHauledCreateInput = {
            TruckingLog: { connect: { id: truckingLogId } },
            Equipment: eq.equipmentId
              ? { connect: { id: eq.equipmentId } }
              : undefined,
            // If you have jobsiteId, use it; otherwise, remove this line
          };
          if (eq.id && existingEq.find((e: { id: string }) => e.id === eq.id)) {
            await tx.equipmentHauled.update({
              where: { id: eq.id },
              data: eqData,
            });
          } else {
            await tx.equipmentHauled.create({ data: eqData });
          }
        }
        const existingMat = await tx.material.findMany({
          where: { truckingLogId },
        });
        const updatedMatIds = (tlog.material ?? [])
          .map((mat: { id: string }) => mat.id)
          .filter(Boolean);
        for (const old of existingMat) {
          if (!updatedMatIds.includes(old.id)) {
            await tx.material.delete({ where: { id: old.id } });
          }
        }
        for (const mat of tlog.material ?? []) {
          if (isMaterialFormData(mat)) {
            const matData: Prisma.MaterialCreateInput = {
              TruckingLog: { connect: { id: truckingLogId } },
              LocationOfMaterial: mat.location,
              name: mat.name,
              materialWeight:
                mat.materialWeight !== undefined
                  ? Number(mat.materialWeight)
                  : undefined,
              lightWeight:
                mat.lightWeight !== undefined
                  ? Number(mat.lightWeight)
                  : undefined,
              grossWeight:
                mat.grossWeight !== undefined
                  ? Number(mat.grossWeight)
                  : undefined,
              loadType: mat.loadType
                ? (mat.loadType.toUpperCase() as LoadType)
                : undefined,
            };
            if (
              mat.id &&
              existingMat.find((m: { id: string }) => m.id === mat.id)
            ) {
              await tx.material.update({
                where: { id: mat.id },
                data: matData,
              });
            } else {
              await tx.material.create({ data: matData });
            }
          } else {
            // fallback for Material type with additional properties
            const materialData = mat as Material & {
              LocationOfMaterial?: string;
              materialWeight?: number;
              lightWeight?: number;
              grossWeight?: number;
              loadType?: LoadType;
            };
            await tx.material.create({
              data: {
                TruckingLog: { connect: { id: truckingLogId } },
                LocationOfMaterial: materialData.LocationOfMaterial || null,
                name: materialData.name || null,
                materialWeight: materialData.materialWeight || null,
                lightWeight: materialData.lightWeight || null,
                grossWeight: materialData.grossWeight || null,
                loadType: materialData.loadType || null,
              },
            });
          }
        }
        const existingRef = await tx.refuelLog.findMany({
          where: { truckingLogId },
        });
        const updatedRefIds = (tlog.refueled ?? [])
          .map((ref: { id: string }) => ref.id)
          .filter(Boolean);
        for (const old of existingRef) {
          if (!updatedRefIds.includes(old.id)) {
            await tx.refuelLog.delete({ where: { id: old.id } });
          }
        }
        for (const ref of tlog.refueled ?? []) {
          if (isRefuelFormData(ref)) {
            const refData: Prisma.RefuelLogCreateInput = {
              TruckingLog: { connect: { id: truckingLogId } },
              gallonsRefueled:
                ref.gallonsRefueled !== undefined
                  ? Number(ref.gallonsRefueled)
                  : undefined,
              milesAtFueling:
                ref.milesAtFueling !== undefined
                  ? Number(ref.milesAtFueling)
                  : undefined,
            };
            if (
              ref.id &&
              existingRef.find((r: { id: string }) => r.id === ref.id)
            ) {
              await tx.refuelLog.update({
                where: { id: ref.id },
                data: refData,
              });
            } else {
              await tx.refuelLog.create({ data: refData });
            }
          } else {
            // fallback for Refueled type
            const refuelData = ref as Refueled & {
              gallonsRefueled?: number;
              milesAtFueling?: number;
            };
            await tx.refuelLog.create({
              data: {
                TruckingLog: { connect: { id: truckingLogId } },
                gallonsRefueled: refuelData.gallonsRefueled || null,
                milesAtFueling: refuelData.milesAtFueling || null,
              },
            });
          }
        }
        const existingSM = await tx.stateMileage.findMany({
          where: { truckingLogId },
        });
        const updatedSMIds = (tlog.stateMileage ?? [])
          .map((sm: { id: string }) => sm.id)
          .filter(Boolean);
        for (const old of existingSM) {
          if (!updatedSMIds.includes(old.id)) {
            await tx.stateMileage.delete({ where: { id: old.id } });
          }
        }
        for (const sm of tlog.stateMileage ?? []) {
          const smData: Prisma.StateMileageCreateInput = {
            TruckingLog: { connect: { id: truckingLogId } },
            state: sm.state,
            stateLineMileage:
              sm.stateLineMileage !== undefined
                ? Number(sm.stateLineMileage)
                : undefined,
          };
          if (sm.id && existingSM.find((s: { id: string }) => s.id === sm.id)) {
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
      const existingTasco = await tx.tascoLog.findMany({
        where: { timeSheetId: id },
      });
      const updatedTascoIds = (data.tascoLogs ?? [])
        .map((log) => log.id)
        .filter((id): id is string => Boolean(id));
      for (const old of existingTasco) {
        if (!updatedTascoIds.includes(old.id)) {
          await tx.tascoLog.delete({ where: { id: old.id } });
        }
      }
      for (const tlog of data.tascoLogs ?? []) {
        let tascoLogId = tlog.id;
        const tascoLogData: Prisma.TascoLogCreateInput = {
          TimeSheet: { connect: { id } },
          shiftType: tlog.shiftType,
          laborType: tlog.laborType,
          LoadQuantity: tlog.loadsHauled ? Number(tlog.loadsHauled) : undefined,
          Equipment: tlog.equipmentId
            ? { connect: { id: tlog.equipmentId } }
            : undefined,
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
        const existingRef = await tx.refuelLog.findMany({
          where: { tascoLogId },
        });
        const updatedRefIds = (tlog.refueled ?? [])
          .map((ref) => ref.id)
          .filter((id): id is string => Boolean(id));
        for (const old of existingRef) {
          if (!updatedRefIds.includes(old.id)) {
            await tx.refuelLog.delete({ where: { id: old.id } });
          }
        }
        for (const ref of tlog.refueled ?? []) {
          const refData: Prisma.RefuelLogCreateInput = {
            TascoLog: { connect: { id: tascoLogId } },
            gallonsRefueled: ref.gallonsRefueled
              ? Number(ref.gallonsRefueled)
              : undefined,
          };
          if (ref.id && existingRef.find((r) => r.id === ref.id)) {
            await tx.refuelLog.update({ where: { id: ref.id }, data: refData });
          } else {
            await tx.refuelLog.create({ data: refData });
          }
        }
      }
    } else if (data.workType === "LABOR") {
      const existingEmpEq = await tx.employeeEquipmentLog.findMany({
        where: { timeSheetId: id },
      });
      const updatedEmpEqIds = (data.employeeEquipmentLogs ?? [])
        .map((log: { id: string }) => log.id)
        .filter(Boolean);
      for (const old of existingEmpEq) {
        if (!updatedEmpEqIds.includes(old.id)) {
          await tx.employeeEquipmentLog.delete({ where: { id: old.id } });
        }
      }
      for (const log of data.employeeEquipmentLogs ?? []) {
        const empEqData: Prisma.EmployeeEquipmentLogCreateInput = {
          Equipment: log.equipmentId
            ? { connect: { id: log.equipmentId } }
            : undefined,
          startTime: log.startTime ? new Date(log.startTime) : undefined,
          endTime: log.endTime ? new Date(log.endTime) : undefined,
          TimeSheet: { connect: { id } },
        };
        if (
          log.id &&
          existingEmpEq.find((l: { id: string }) => l.id === log.id)
        ) {
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
