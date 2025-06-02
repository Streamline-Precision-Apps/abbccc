/**
 * Type definition for Jobsite entity that matches the Prisma schema
 */
export type Jobsite = {
  CCTags: CCTag[];
  id: string;
  clientId: string;
  Client?: { id: string; name: string };
  qrId: string;
  isActive: boolean;
  approvalStatus: ApprovalStatus;
  name: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  description: string;
  comment?: string;
};

/**
 * Approval status options from Prisma schema
 */
export type ApprovalStatus =
  | "PENDING"
  | "APPROVED"
  | "REJECTED"
  | "CHANGES_REQUESTED";

/**
 * Type for Cost Code Tag relation with Jobsite
 */
type CCTag = {
  id: string;
  name: string;
};
