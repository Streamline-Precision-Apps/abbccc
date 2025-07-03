// Canonical union for timesheet status (not a Prisma enum)
export type TimeSheetStatus = 'PENDING' | 'APPROVED' | 'DENIED';
import {
  FormStatus,
  FieldType,
  Priority,
  ReportStatus,
  ReportVisibility,
  Permission,
  WorkType,
  EquipmentTags,
  EquipmentState,
  IsActive,
  LoadType,
  ApprovalStatus,
} from "@prisma/client";

export {
  FormStatus,
  FieldType,
  Priority,
  ReportStatus,
  ReportVisibility,
  Permission,
  WorkType,
  EquipmentTags,
  EquipmentState,
  IsActive,
  LoadType,
  ApprovalStatus,
};

// export type FormStatus = "PENDING" | "APPROVED" | "DENIED" | "DRAFT";
// export type FieldType =
//   | "TEXT"
//   | "TEXTAREA"
//   | "NUMBER"
//   | "DATE"
//   | "FILE"
//   | "DROPDOWN"
//   | "CHECKBOX";
// export type Priority = "LOW" | "MEDIUM" | "HIGH" | "URGENT";
// export type ReportStatus =
//   | "PENDING"
//   | "RUNNING"
//   | "COMPLETED"
//   | "FAILED"
//   | "CANCELED";
// export type ReportVisibility = "PRIVATE" | "COMPANY" | "MANAGEMENT";
// export type Permission = "USER" | "MANAGER" | "ADMIN" | "SUPERADMIN";
// export type WorkType = "TASCO" | "LABOR" | "MECHANIC" | "TRUCK_DRIVER";
// export type EquipmentTags = "TRUCK" | "TRAILER" | "VEHICLE" | "EQUIPMENT";
// export type EquipmentStatus =
//   | "NEEDS_REPAIR"
//   | "OPERATIONAL"
//   | "NEEDS_MAINTENANCE";
// export type IsActive = "ACTIVE" | "INACTIVE";
// export type LoadType = "UNSCREENED" | "SCREENED";
// export type TimeSheetStatus = "PENDING" | "APPROVED" | "DENIED";
// export type EquipmentUsageType =
//   | "TASCO"
//   | "LABOR"
//   | "MAINTENANCE"
//   | "TRUCKING"
//   | "GENERAL";
// export type EquipmentState =
//   | "NEEDS_REPAIR"
//   | "MAINTENANCE"
//   | "AVAILABLE"
//   | "IN_USE"
//   | "RETIRED";
// export type AuditAction = "CREATE" | "UPDATE" | "DELETE";
// export type EntityType =
//   | "COMPANY"
//   | "USER"
//   | "EQUIPMENT"
//   | "JOBSITE"
//   | "TIMESHEET";
// export type ApprovalStatus =
//   | "PENDING"
//   | "APPROVED"
//   | "REJECTED"
//   | "CHANGES_REQUESTED";
