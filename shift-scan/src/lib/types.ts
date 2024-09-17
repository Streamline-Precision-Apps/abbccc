// This file holds all the types that will be used in the app
import { Permission } from "@prisma/client";
// this imports the session types for the app, it works client and server-side
import { Session } from "next-auth";

//--------------------------------------------------------------------------------------
// example of using zod for types
// this synchronize the type needed and updates based on zod data validation.

import {z} from "zod";
import { clockInFormSchema } from "./validation";
// whatever i am looking for in the zod data validation will automatically update here

export type clockInForm = z.infer<typeof clockInFormSchema>;
// -------------------------------------------------------------------------------------

export type User = {
  id: string,
  username?: string;
  firstName?: string,
  lastName?: string,
  permission?: Permission,
  DOB?: string,
  email?: string,
  phone?: string,
  };

  export type Employee = {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    image: string | null;
    imageUrl?: string | null;
  };
export type Contact = {
    id: number;
    phoneNumber: string;
    email: string;
    emergencyContact: string;
    emergencyContactNumber: string;
};

export type UserTraining = {
    id: number;
    userId: string;
    trainingId: string;
    isCompleted: boolean;
};

export type SearchUser = {
  id: string,
  firstName: string,
  lastName: string,
  username: string;
  permission: Permission,
  DOB: string,
  truckView: boolean;
  mechanicView: boolean;
  laborView: boolean;
  tascoView: boolean;
  image: string | null,
};
  
  export type CustomSession = {
    user?: User | null;
  };
  
  
  export type Logs = {
    id: string;
    userId: string;
    equipment: EquipmentCodes | null;
    submitted: boolean;
  };
  
  export type PayPeriodTimesheets = {
    start_time: Date; // Correct field name
    duration: number | null;
  };

  export type inboxContent = {
    sentContent : sentContent[];
    receivedContent? : receivedContent[];
    session: Session | null;
  }

export type receivedContent = {
    id: number;
    date: Date;
    requestedStartDate: Date;
    requestedEndDate: Date;
    requestType: string;
    comments: string;
    mangerComments: string | null;
    status: string;
    employeeId: string;
    createdAt: Date;
    updatedAt: Date;
    decidedBy: String | null
}

export type sentContent = {
    id: number;
    date: Date;
    requestedStartDate: Date;
    requestedEndDate: Date;
    requestType: string;
    comments: string;
    mangerComments: string | null;
    status: string;
    employeeId: string;
    createdAt: Date;
    updatedAt: Date;
    decidedBy: String | null;
}

  export type clockProcessProps = {
    session: any;
    locale: string;
    jobCodes: JobCodes[];
    costCodes: CostCodes[];
    equipment: EquipmentCodes[];
    recentJobSites: JobCodes[];
    recentCostCodes: CostCodes[];
    recentEquipment: EquipmentCodes[];
    payPeriodSheets: TimeSheets[];
    logs: Logs[];
  }
  
  
  export type TimeSheet = {
    submitDate?: Date;
    id?: number;
    userId?: string;
    date?: Date;
    jobsiteId?: string;
    costcode?: string;
    nu?: string;
    Fp?: string;
    vehicleId?: number | null;
    startTime?: Date;
    endTime?: Date | null;
    duration?: number | null;
    startingMileage?: number | null;
    endingMileage?: number | null;
    leftIdaho?: boolean | null;
    equipmentHauled?: string | null;
    materialsHauled?: string | null;
    hauledLoadsQuantity?: number | null;
    refuelingGallons?: number | null;
    timeSheetComments?: string | null;
    status?: string;
  };
  
  export type EquipmentLog = {
    id: number;
    employeeId: string;
    duration:  string | null;
    Equipment: EquipmentCodes;
  };
  
  export type RequestForm = {
    session: Session | null;
    signature: {Signature: string | null} | null;
    }
    
  export type TimeSheets = {
      start_time: Date;
      duration: number | null;
  };
      
      // This is used in the admin section for assets.
  
  export type UserSettings = {
    userId: string;
    language?: string;
    approvedRequests?: boolean;
    timeOffRequests?: boolean;
    generalReminders?: boolean;
    biometric?: boolean;
    cameraAccess?: boolean;
    LocationAccess?: boolean;
  };
  
  // --------------------------------------
  // this are used to get only the qr data, name, and description
  export type JobCodes = {
    id: string;
    qrId: string;
    name: string;
  };

  
  export type CostCodes = {
    id: number;
    name: string;
    description: string;
  };
  
  export type EquipmentCodes = {
    id: string;
    qrId: string;
    name: string;
    
};

  //--------------------------------------------

  export type Equipment = {
    id: string;
    qrId: string;
    name: string;
    description?: string;
    equipmentTag: string;
    lastInspection?: Date | null;
    lastRepair?: Date | null;
    status?: string;
    make?: string | null;
    model?: string | null;
    year?: string | null;
    licensePlate?: string | null;
    registrationExpiration?: Date | null;
    mileage?: number | null | undefined;
    isActive?: boolean;
    image?: string | null;
    inUse?: boolean;
  };


  export type Jobsites = {
    id: string;
    qrId: string;
    name: string;
    streetNumber?: string | null;
    streetName?: string | null;
    city?: string | null;
    state?: string | null;
    country?: string | null;
    phone?: string;
    description?: string | null;
    isActive: boolean;
    comments?: string | null;
    status?: string;
  }

  export type  costCodes = {
    id: number;
    name: string;
    description: string;
    type: string;
  }