import { ApprovalStatus } from "@/lib/enums";

/**
 * Equipment domain type matching the current Prisma schema.
 * - Removed obsolete fields: status, isActive, inUse
 * - Added: approvalStatus, state, isDisabledByAdmin
 */
export type Equipment = {
  id: string;
  qrId: string;
  name: string;
  description?: string;
  equipmentTag: string;
  approvalStatus: "PENDING" | "APPROVED" | "REJECTED" | "CHANGES_REQUESTED";
  state: "AVAILABLE" | "IN_USE" | "MAINTENANCE" | "NEEDS_REPAIR" | "RETIRED";
  isDisabledByAdmin: boolean;
  overWeight: boolean;
  currentWeight: number | null;
  equipmentVehicleInfo?: {
    make: string | null;
    model: string | null;
    year: string | null;
    licensePlate: string | null;
    registrationExpiration: Date | null;
    mileage: number | null;
  };
};
// Summary type for equipment listing
export type EquipmentSummary = {
  id: string;
  name: string;
  approvalStatus: ApprovalStatus;
};
