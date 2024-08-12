"use client";
import { useDBJobsite, useDBCostcode, useDBEquipment } from "@/app/context/dbCodeContext";
import { useRecentDBJobsite, useRecentDBCostcode, useRecentDBEquipment } from "@/app/context/dbRecentCodesContext";


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

type Equipment = {
id: string;
qr_id: string;
name: string;
};

interface Option {
code: string;
label: string;
}

export const CostCodeOptions = (dataType: string, searchTerm?: string): Option[] => {
const { jobsiteResults } = useDBJobsite();
const { recentlyUsedJobCodes } = useRecentDBJobsite();
const { costcodeResults } = useDBCostcode();
const { recentlyUsedCostCodes } = useRecentDBCostcode();
const { equipmentResults } = useDBEquipment();
const { recentlyUsedEquipment } = useRecentDBEquipment();

let options: Option[] = [];

switch (dataType) {
case 'costcode':
    if (!costcodeResults) {
    throw new Error('costcodeResults is undefined');
    }
    // Use recent codes if no search term
    options = searchTerm === ''
    ? recentlyUsedCostCodes.map((costcode: CostCode) => ({
        code: costcode.cost_code,
        label: costcode.cost_code_description
    }))
    : costcodeResults.map((costcode: CostCode) => ({
        code: costcode.cost_code,
        label: costcode.cost_code_description
    }));
    break;

case 'jobsite':
    if (!jobsiteResults) {
    throw new Error('jobsiteResults is undefined');
    }
    options = searchTerm === ''
    ? recentlyUsedJobCodes.map((jobcode: JobCode) => ({
        code: jobcode.jobsite_id,
        label: jobcode.jobsite_name
    }))
    : jobsiteResults.map((jobcode: JobCode) => ({
        code: jobcode.jobsite_id,
        label: jobcode.jobsite_name
    }));
    break;

case 'equipment':
    if (!equipmentResults) {
    throw new Error('equipmentResults is undefined');
    }
    options = searchTerm === ''
    ? recentlyUsedEquipment.map((equipment: Equipment) => ({
        code: equipment.qr_id,
        label: equipment.name
    }))
    : equipmentResults.map((equipment: Equipment) => ({
        code: equipment.qr_id,
        label: equipment.name
    }));
    break;

default:
    throw new Error('Invalid data type');
}

// Filter options based on the search term
if (searchTerm) {
options = options.filter((option) =>
    option.label.toLowerCase().includes(searchTerm.toLowerCase())
);
}

return options;
};