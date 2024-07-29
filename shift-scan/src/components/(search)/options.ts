import { useDBEquipment } from "@/app/context/dbEquipmentContext";
import { useDBJobsite } from "@/app/context/dbJobsiteContext";
import { useDBCostcode } from "@/app/context/dbCostcodeContext";

type jobCodes = {
    id: number;
    jobsite_id: string;
    jobsite_name: string;
}
type CostCode = {
    id: number;
    cost_code: string;
    cost_code_description: string;
}

type equipment = {
    id: string;
    qr_id: string;
    name: string;
}

export const CostCodeOptions = (data: string) => {
    const { jobsiteResults } = useDBJobsite();
    const { costcodeResults } = useDBCostcode();
    const { equipmentResults } = useDBEquipment();

    if (data === 'costcode') {
        const options = costcodeResults.map((costcode: CostCode) => ({
            code: costcode.cost_code,
            label: costcode.cost_code_description
        }));
        return options;
    }

    if (data === 'jobsite') {
        const options = jobsiteResults.map((jobcode: jobCodes) => ({
            code: jobcode.jobsite_id,
            label: jobcode.jobsite_name
        }));
        return options;
    }

    if (data === 'equipment') {
        const options = equipmentResults.map((equipment: equipment) => ({
            code: equipment.id,
            label: equipment.name
        }));
        return options;
    }

    throw new Error('Invalid data');
}