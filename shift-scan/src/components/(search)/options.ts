"use client";
import { useDBJobsite, useDBCostcode, useDBEquipment } from "@/app/context/dbCodeContext";
import { useRecentDBJobsite, useRecentDBCostcode, useRecentDBEquipment } from "@/app/context/dbRecentCodesContext";
import { JobCodes, CostCodes, EquipmentCodes } from "@/lib/types";

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
        ? recentlyUsedCostCodes
            .filter((costcode: CostCodes | null) => costcode !== null) // Check for null
            .map((costcode: CostCodes) => ({
              code: costcode.name,
              label: costcode.description
            }))
        : costcodeResults
            .filter((costcode: CostCodes | null) => costcode !== null) // Check for null
            .map((costcode: CostCodes) => ({
              code: costcode.name,
              label: costcode.description
            }));
      break;

case 'jobsite':
    if (!jobsiteResults) {
    throw new Error('jobsiteResults is undefined');
    }
    options = searchTerm === ''
    ? recentlyUsedJobCodes.map((jobcode: JobCodes) => ({
        code: jobcode.qrId,
        label: jobcode.name
    }))
    : jobsiteResults.map((jobcode: JobCodes) => ({
        code: jobcode.qrId,
        label: jobcode.name
    }));
    break;

case 'equipment':
    if (!equipmentResults) {
    throw new Error('equipmentResults is undefined');
    }
    options = searchTerm === ''
    ? recentlyUsedEquipment.map((equipment: EquipmentCodes) => ({
        code: equipment.qrId,
        label: equipment.name
    }))
    : equipmentResults.map((equipment: EquipmentCodes) => ({
        code: equipment.qrId,
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