// Tag type definition based on Prisma schema
export type Tag = {
  id: string;
  name: string;
  CostCodes?: { id: string; name: string }[]; // Using any[] as placeholder, reference to CostCode type
  Jobsites?: { id: string; name: string; qrId: string }[]; // Using any[] as placeholder, reference to Jobsite type
};

// Summary type (used for listing)
export type TagSummary = {
  id: string;
  name: string;
};
