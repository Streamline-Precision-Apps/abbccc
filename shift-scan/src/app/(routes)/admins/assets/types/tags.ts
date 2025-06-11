// Tag type definition based on Prisma schema
export type Tag = {
  id: string;
  name: string;
  description: string;
  CostCodes?: Array<{ id: string; name: string }>; // Reference to CostCode typ
};

// Summary type (used for listing)
export type TagSummary = {
  id: string;
  name: string;
};
