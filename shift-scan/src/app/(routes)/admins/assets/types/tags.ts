// Tag type definition based on Prisma schema
export type Tag = {
  id: string;
  name: string;
  CostCodes?: any[]; // Using any[] as placeholder, reference to CostCode type
  Jobsites?: any[]; // Using any[] as placeholder, reference to Jobsite type
};

// Summary type (used for listing)
export type TagSummary = {
  id: string;
  name: string;
};
