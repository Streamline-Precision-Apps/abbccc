"use client";
import {
  useDBJobsite,
  useDBCostcode,
  useDBEquipment,
} from "@/app/context/dbCodeContext";
import { EquipmentTags } from "../../../prisma/generated/prisma/client";

// import {
//   useRecentDBJobsite,
//   useRecentDBCostcode,
//   useRecentDBEquipment,
// } from "@/app/context/dbRecentCodesContext";

export type JobCodes = {
  id: string;
  qrId: string;
  name: string;
};

export type CostCodes = {
  id: string;
  name: string;
};

export type EquipmentCode = {
  id: string;
  qrId: string;
  name: string;
  equipmentTag: EquipmentTags;
};

interface Option {
  code: string;
  label: string;
}

export const CostCodeOptions = (
  _dataType: string,
  _searchTerm?: string,
): Option[] => {
  // Deprecated: Use useCostCodeOptions hook instead.
  // Kept as a no-op to avoid breaking imports during refactor.
  return [];
};
