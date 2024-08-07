// This file holds all the types that will be used in the app

export type User = {
    id: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
    firstName?: string | null;
    lastName?: string | null;
    permission?: string | null;
  };
  
  export type CustomSession = {
    user?: User | null;
  };
  
  // src/lib/types.ts
  export type Equipment = {
    id: string;
    qr_id: string;
    name: string;
  };
  
  export type EquipmentDetails = {
    id: string;
    qr_id: string;
    name: string;
  };
  
  export type Logs = {
    id: string;
    employee_id: string;
    equipment: EquipmentDetails | null;
    submitted: boolean;
  };
  
  export type PayPeriodTimesheets = {
    start_time: Date; // Correct field name
    duration: number | null;
  };
  