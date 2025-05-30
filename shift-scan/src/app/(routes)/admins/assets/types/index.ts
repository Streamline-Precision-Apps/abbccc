// Main types export file for assets
export type { Equipment } from "./equipment";
export type { Jobsite } from "./jobsite";
export type { CostCode } from "./costcode";
export type { Tag } from "./tags";

// Asset type configuration
export const ASSET_TYPES = [
  { value: "Equipment", name: "Equipment" },
  { value: "Jobsite", name: "Jobsite" },
  { value: "CostCode", name: "Cost Codes" },
  { value: "Tags", name: "Tags" },
] as const;

export type AssetType = (typeof ASSET_TYPES)[number]["value"];
