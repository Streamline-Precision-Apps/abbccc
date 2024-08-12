type JobCode = {
    id: number;
    jobsite_id: string;
    jobsite_name: string;
    };
    
    type CostCode = {
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
    type Equipment = {
        id: string;
        qr_id: string;
        name: string;
    };

    type EquipmentDetails = {
        id: string;
        qr_id: string;
        name: string;
    };

    type Logs = {
        id: string;
        employee_id: string;
        equipment: EquipmentDetails | null;
        submitted: boolean;
    };

    export type { JobCode, CostCode, ClockProcessProps, Equipment, Logs, EquipmentDetails };