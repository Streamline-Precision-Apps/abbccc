// Tag type definition based on Prisma schema
export type Tag = {
  id: string;
  name: string;
  CostCodes?: Array<{ id: string; name: string }>; // Reference to CostCode type
  Jobsites?: Array<{ id: string; name: string; qrId: string }>; // Reference to Jobsite type
};

// Summary type (used for listing)
export type TagSummary = {
  id: string;
  name: string;
};
