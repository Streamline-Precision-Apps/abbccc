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
  IsActive,
  LoadType,
  EquipmentUsageType,
  EquipmentState,
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
  IsActive,
  LoadType,
  EquipmentUsageType,
  EquipmentState,
  ApprovalStatus,
};
