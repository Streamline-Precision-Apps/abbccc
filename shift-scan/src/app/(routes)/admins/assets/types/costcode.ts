// Cost Code type definition based on Prisma schema
export type CostCode = {
  id: string;
  name: string;
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
  Timesheets?: Array<{ id: string }>; // Simplified TimeSheet reference
  CCTags?: Array<{ id: string; name: string }>; // Simple version to avoid circular reference
};

// Summary type (used for listing)
export type CostCodeSummary = {
  id: string;
  name: string;
  isActive: boolean;
};
