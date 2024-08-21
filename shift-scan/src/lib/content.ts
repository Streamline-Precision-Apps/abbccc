import { CustomSession } from "./types";

// holds the same types so they dont need to be re declared over and over again
type jobCodes = {
id: number;
jobsite_id: string;
jobsite_name: string;
};
type CostCode = {
    id: number;
    cost_code: string;
    cost_code_description: string;
};

type Equipment = {
    id: string;
    qr_id: string;
    name: string;
};

type TimeSheets = {
    start_time: Date;
    duration: number | null;
};

interface clockProcessProps {
    session: CustomSession | null;
    locale: string;
    jobCodes: jobCodes[];
    CostCodes: CostCode[];
    equipment: Equipment[];
    recentJobSites: jobCodes[];
    recentCostCodes: CostCode[];
    recentEquipment: Equipment[];
    payPeriodSheets: TimeSheets[];
}
export type { clockProcessProps, jobCodes, CostCode, Equipment, TimeSheets };