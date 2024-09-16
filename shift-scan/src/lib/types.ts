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
    phone_number: string;
    email: string;
    emergency_contact: string;
    emergency_contact_no: string;
};

export type Training = {
    id: number;
    user_id: string;
    completed_trainings: number;
    assigned_trainings: number;
    completion: boolean;
    trainings: JSON;
};

export type SearchUser = {
  id: string,
  firstName: string,
  lastName: string,
  username: string;
  permission: Permission,
  DOB: string,
  truck_view: boolean;
  mechanic_view: boolean;
  labor_view: boolean;
  tasco_view: boolean;
  email: string,
  phone: string,
  image: string | null,
};
  
  export type CustomSession = {
    user?: User | null;
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

export type recievedContent = {
    id: number;
    date: Date;
    requestedStartDate: Date;
    requestedEndDate: Date;
    requestType: string;
    comments: string;
    mangerComments: string | null;
    status: string;
    employee_id: string;
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
    employee_id: string;
    createdAt: Date;
    updatedAt: Date;
    decidedBy: String | null;
}
export type RequestForm = {
session: Session | null;
signature: {Signature: string | null} | null;
}


export type JobCodes = {
  id: number;
  jobsite_id: string;
  jobsite_name: string;
  };
  
  export type EquipmentCode = {
      id: string;
      qr_id: string;
      name: string;
  };
    
    // This is used in the admin section for assets.
    export type AssetEquipment = {
      id: string;
      qr_id: string;
      name: string;
      description?: string;
      status?: string;
      equipment_tag: string;
      last_inspection?: Date | null;
      last_repair?: Date | null;
      equipment_status?: string;
      make?: string | null;
      model?: string | null;
      year?: string | null;
      license_plate?: string | null;
      registration_expiration?: Date | null;
      mileage?: number | null | undefined;
      is_active?: boolean;
      image?: string | null;
    };
  
  export type inboxContent = {
    sentContent : sentContent[];
    recievedContent? : recievedContent[];
    session: Session | null;
  }
  
  export type EquipmentCodes = {
    id: string;
    qr_id: string;
    name: string;
  };
  
  
  export type TimeSheets = {
    start_time: Date;
    duration: number | null;
  };
  
  export type clockProcessProps = {
    session: any;
    locale: string;
    jobCodes: JobCodes[];
    CostCodes: CostCode[];
    equipment: EquipmentCodes[];
    recentJobSites: JobCodes[];
    recentCostCodes: CostCode[];
    recentEquipment: EquipmentCodes[];
    payPeriodSheets: TimeSheets[];
  }
  
  
  export type Timesheet = {
    submit_date?: Date;
    id?: number;
    userId?: string;
    date?: Date;
    jobsite_id?: string;
    costcode?: string;
    number?: number;
    Fps?: number;
    vehicle_id?: number | null;
    start_time?: Date;
    end_time?: Date | null;
    duration?: number | null;
    starting_mileage?: number | null;
    ending_mileage?: number | null;
    left_idaho?: boolean | null;
    equipment_hauled?: string | null;
    materials_hauled?: string | null;
    hauled_loads_quantity?: number | null;
    refueling_gallons?: number | null;
    timesheet_comments?: string | null;
    app_comments?: string;
    status?: string;
  };
  
  export type EquipmentLog = {
    id: number;
    employee_id: string;
    duration:  string | null;
    Equipment: EquipmentCodes;
  };
  
  export type costCodes = {
    id: number
    cost_code: string
    cost_code_description: string
    cost_code_type: string
  }
  
  export type Jobsite = {
    id: number;
    jobsite_id: string;
    jobsite_name: string;
    street_number?: string | null;
    street_name?: string;
    city?: string;
    state?: string | null;
    country?: string;
    phone?: string;
    created_at?: Date;
    jobsite_description?: string | null;
    jobsite_active: boolean;
    comments?: string | null;
    jobsite_status?: string;
  }
  
  // This is used in the admin section for assets.
  
  export type Settings = {
    userId: string;
    language?: string;
    approvedRequests?: boolean;
    timeoffRequests?: boolean;
    GeneralReminders?: boolean;
    Biometric?: boolean;
    cameraAccess?: boolean;
    LocationAccess?: boolean;
  };
  
  type JobCode = {
    id: number;
    jobsite_id: string;
    jobsite_name: string;
  };
  
  export type CostCode = {
    id: number;
    cost_code: string;
    cost_code_description: string;
  };
  
  interface ClockProcessProps {
    locale: string;
    jobCodes: JobCode[];
    costCodes: CostCode[];
    equipment: Equipment[];
    recentJobSites: JobCode[];
    recentCostCodes: CostCode[];
    recentEquipment: Equipment[];
    logs: Logs[];
  }

  export type Equipment = {
    id: string;
    qr_id: string;
    name: string;
    description?: string;
    status?: string;
    equipment_tag: string;
    last_inspection?: Date | null;
    last_repair?: Date | null;
    equipment_status?: string;
    make?: string | null;
    model?: string | null;
    year?: string | null;
    license_plate?: string | null;
    registration_expiration?: Date | null;
    mileage?: number | null | undefined;
    is_active?: boolean;
    image?: string | null;
  };

  type jobCodes = {
    id: number;
    jobsite_id: string;
    jobsite_name: string;
    };


  export type inboxContent = {
    sentContent : sentContent[];
    recievedContent? : recievedContent[];
    session: Session | null;
}

export type recievedContent = {
    id: number;
    date: Date;
    requestedStartDate: Date;
    requestedEndDate: Date;
    requestType: string;
    comments: string;
    mangerComments: string | null;
    status: string;
    employee_id: string;
    createdAt: Date;
    updatedAt: Date;
    decidedBy:String | null
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
    employee_id: string;
    createdAt: Date;
    updatedAt: Date;
    decidedBy: String | null;
}
export type RequestForm = {
session: Session | null;
signature: {Signature: string | null} | null;
}


export type JobCodes = {
  id: number;
  jobsite_id: string;
  jobsite_name: string;
  };

  export type CostCode = {
      id: number;
      cost_code: string;
      cost_code_description: string;
  };
  
  export type EquipmentCode = {
      id: string;
      qr_id: string;
      name: string;
  };
  

  export type TimeSheets = {
      start_time: Date;
      duration: number | null;
  };
  
  export type clockProcessProps = {
      session: any;
      locale: string;
      jobCodes: JobCodes[];
      CostCodes: CostCode[];
      equipment: EquipmentCode[];
      recentJobSites: JobCodes[];
      recentCostCodes: CostCode[];
      recentEquipment: EquipmentCode[];
      payPeriodSheets: TimeSheets[];
  }
  

  export type Timesheet = {
    id: string;
    start_time: string;
    start_date?: string;
    end_time: string;
    end_date?: string;
    jobsite_id: string;
    costcode: string;
    duration: string;
    submit_date: string;
    employeeId: string;
    };

  export type EquipmentLog = {
      id: number;
      employee_id: string;
      duration:  string | null;
      Equipment: EquipmentCode;
      };

      export type costCodes = {
        id: number
        cost_code: string
        cost_code_description: string
        cost_code_type: string
    }
    
    export type Jobsite = {
        id: number;
        jobsite_id: string;
        jobsite_name: string;
        street_number?: string | null;
        street_name?: string;
        city?: string;
        state?: string | null;
        country?: string;
        phone?: string;
        created_at?: Date;
        jobsite_description?: string | null;
        jobsite_active: boolean;
        comments?: string | null;
        jobsite_status?: string;
    }
    
    // This is used in the admin section for assets.
    export type AssetEquipment = {
      id: string;
      qr_id: string;
      name: string;
      description?: string;
      status?: string;
      equipment_tag: string;
      last_inspection?: Date | null;
      last_repair?: Date | null;
      equipment_status?: string;
      make?: string | null;
      model?: string | null;
      year?: string | null;
      license_plate?: string | null;
      registration_expiration?: Date | null;
      mileage?: number | null | undefined;
      is_active?: boolean;
      image?: string | null;
    };