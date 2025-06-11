// Main types export file for assets
export type { Equipment, EquipmentSummary } from "./equipment";
export type { Jobsite, JobsiteSummary } from "./jobsite";
export type { CostCode, CostCodeSummary } from "./costcode";
export type { Tag, TagSummary } from "./tags";

// Asset type configuration
export const ASSET_TYPES = [
  { value: "Equipment", name: "Equipment" },
  { value: "Jobsite", name: "Jobsite" },
  { value: "CostCode", name: "Cost Codes" },
] as const;

export type AssetType = (typeof ASSET_TYPES)[number]["value"];

export type ClientsSummary = {
  id: string;
  name: string;
};
