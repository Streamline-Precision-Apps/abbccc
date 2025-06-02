// Cost Code type definition based on Prisma schema
export type CostCode = {
  id: string;
  name: string;
  createdAt?: Date;
  updatedAt?: Date;
  Timesheets?: any[]; // Using any[] as placeholder, replace with TimeSheet type when needed
  CCTags?: { id: string; name: string }[]; // Simple version to avoid circular reference
};

// Summary type (used for listing)
export type CostCodeSummary = {
  id: string;
  name: string;
};
