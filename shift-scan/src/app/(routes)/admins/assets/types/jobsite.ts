// Placeholder for Jobsite types
export type Jobsite = {
  CCTags: CCTag[];
  id: string;
  clientId: string;
  Client?: { id: string; name: string };
  qrId: string;
  isActive: boolean;
  approvalStatus: "PENDING" | "APPROVED" | "DENIED";
  name: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  description: string;
  comment: string;
};

type CCTag = {
  id: string;
  name: string;
};
