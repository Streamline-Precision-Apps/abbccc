/**
 * Validation helpers for timesheet logs and nested logs.
 * All functions are pure and reusable across the timesheet editing UI.
 *
 * @module utils/validation
 */
import {
  MaintenanceLog,
  TruckingLog,
  TascoLog,
  EmployeeEquipmentLog,
  EquipmentHauled,
  Material,
  RefuelLog,
  StateMileage,
} from "../types";

/** Checks if a maintenance log is complete. */
export function isMaintenanceLogComplete(log: MaintenanceLog): boolean {
  return !!(log.maintenanceId && log.startTime && log.endTime);
}

/** Checks if a trucking log is complete. */
export function isTruckingLogComplete(log: TruckingLog): boolean {
  return !!(
    log.truckNumber &&
    typeof log.startingMileage === "number" &&
    typeof log.endingMileage === "number"
  );
}

/** Checks if a Tasco log is complete. */
export function isTascoLogComplete(log: TascoLog): boolean {
  return !!(
    log.shiftType &&
    log.laborType &&
    log.materialType &&
    typeof log.LoadQuantity === "number" &&
    log.LoadQuantity >= 0
  );
}

/** Checks if an employee equipment log is complete. */
export function isEmployeeEquipmentLogComplete(
  log: EmployeeEquipmentLog
): boolean {
  return !!(log.equipmentId && log.startTime && log.endTime);
}

/** Checks if an Equipment Hauled entry is complete. */
export function isEquipmentHauledComplete(eq: EquipmentHauled): boolean {
  return !!eq.equipmentId;
}

/** Checks if a Material entry is complete. */
export function isMaterialComplete(mat: Material): boolean {
  return !!(
    mat.LocationOfMaterial &&
    mat.name &&
    mat.quantity &&
    mat.unit &&
    mat.loadType
  );
}

/** Checks if a Refuel Log entry is complete (Trucking or Tasco). */
export function isRefuelLogComplete(ref: RefuelLog): boolean {
  return !!(
    ref.gallonsRefueled &&
    (ref.milesAtFueling !== undefined || ref.gallonsRefueled > 0)
  );
}

/** Checks if a State Mileage entry is complete. */
export function isStateMileageComplete(sm: StateMileage): boolean {
  return !!(sm.state && sm.stateLineMileage);
}
