// Placeholder for Jobsite types
export type Jobsite = {
  CCTags: CCTag[];
  id: string;
  Client: string;
  qrId: string;
  isActive: boolean;
  status: "PENDING" | "ACTIVE" | "INACTIVE"; // Adjust based on possible values
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
