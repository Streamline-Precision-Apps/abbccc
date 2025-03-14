"use client";
import { useMemo } from "react";
import {
  useDBJobsite,
  useDBCostcode,
  useDBEquipment,
} from "@/app/context/dbCodeContext";
import {
  useRecentDBJobsite,
  useRecentDBCostcode,
  useRecentDBEquipment,
} from "@/app/context/dbRecentCodesContext";
import { JobCodes, CostCodes, EquipmentCode } from "@/lib/types";

interface Option {
  code: string;
  label: string;
}

export const useCostCodeOptions = (
  dataType: string,
  searchTerm?: string
): Option[] => {
  const { jobsiteResults } = useDBJobsite();
  const { recentlyUsedJobCodes } = useRecentDBJobsite();
  const { costcodeResults } = useDBCostcode();
  const { recentlyUsedCostCodes } = useRecentDBCostcode();
  const { equipmentResults } = useDBEquipment();
  const { recentlyUsedEquipment } = useRecentDBEquipment();

  const options = useMemo(() => {
    let opts: Option[] = [];

    switch (dataType) {
      case "costcode":
        if (!costcodeResults) throw new Error("costcodeResults is undefined");

        // Get recently used cost codes first (filtering out any nulls)
        const recentCostCodes = recentlyUsedCostCodes
          .filter((costcode) => costcode !== null)
          .map((costcode: CostCodes) => ({
            code: costcode.name,
            label: `${costcode.name} - ${costcode.description}`,
          }));

        // Append all cost codes, avoiding duplicates
        const allCostCodes = costcodeResults
          .filter((costcode) => costcode !== null)
          .map((costcode: CostCodes) => ({
            code: costcode.name,
            label: `${costcode.name} - ${costcode.description}`,
          }))
          .filter(
            (costcode) =>
              !recentCostCodes.some((recent) => recent.code === costcode.code)
          );

        opts = [...recentCostCodes, ...allCostCodes];
        break;

      case "jobsite":
        if (!jobsiteResults) throw new Error("jobsiteResults is undefined");

        // Get recently used jobsites first
        const recentJobsites = recentlyUsedJobCodes.map(
          (jobcode: JobCodes) => ({
            code: jobcode.qrId,
            label: jobcode.name,
          })
        );

        // Append all jobsites, avoiding duplicates
        const allJobsites = jobsiteResults
          .filter((jobcode) => jobcode !== null)
          .map((jobcode: JobCodes) => ({
            code: jobcode.qrId,
            label: jobcode.name,
          }))
          .filter(
            (jobcode) =>
              !recentJobsites.some((recent) => recent.code === jobcode.code)
          );

        opts = [...recentJobsites, ...allJobsites];
        break;

      case "equipment-operator":
      case "equipment":
        if (!equipmentResults) throw new Error("equipmentResults is undefined");

        // Get recently used equipment first
        const recentEquipment = recentlyUsedEquipment.map(
          (equipment: EquipmentCode) => ({
            code: equipment.qrId,
            label: equipment.name,
          })
        );

        // Append all equipment, avoiding duplicates
        const allEquipment = equipmentResults
          .map((equipment: EquipmentCode) => ({
            code: equipment.qrId,
            label: equipment.name,
          }))
          .filter(
            (equipment) =>
              !recentEquipment.some((recent) => recent.code === equipment.code)
          );

        opts = [...recentEquipment, ...allEquipment];
        break;

      default:
        throw new Error("Invalid data type");
    }

    // Filter based on search term if provided
    if (searchTerm) {
      opts = opts.filter((option) =>
        option.label.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    return opts;
  }, [
    dataType,
    searchTerm,
    jobsiteResults,
    recentlyUsedJobCodes,
    costcodeResults,
    recentlyUsedCostCodes,
    equipmentResults,
    recentlyUsedEquipment,
  ]);

  return options;
};
