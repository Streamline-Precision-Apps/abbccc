import { Permission } from "@prisma/client";
export type SearchUser = {
  id: string;
  firstName: string;
  lastName: string;
  username: string;
  permission: Permission;
  DOB: string;
  truckView: boolean;
  mechanicView: boolean;
  laborView: boolean;
  tascoView: boolean;
  image: string | null;
  terminationDate: Date | null;
};

export type SearchCrew = {
  id: string;
  name: string;
  description: string;
};
