"use client";
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

export const CostCodeOptions = (
  dataType: string,
  searchTerm?: string
): Option[] => {
  const { jobsiteResults } = useDBJobsite();
  const { recentlyUsedJobCodes } = useRecentDBJobsite();
  const { costcodeResults } = useDBCostcode();
  const { recentlyUsedCostCodes } = useRecentDBCostcode();
  const { equipmentResults } = useDBEquipment();
  const { recentlyUsedEquipment } = useRecentDBEquipment();

  let options: Option[] = [];

  switch (dataType) {
    case "costcode":
      if (!costcodeResults) {
        throw new Error("costcodeResults is undefined");
      }

      // Check if recentlyUsedCostCodes contains any null values
      const hasNullInRecent = recentlyUsedCostCodes.some(
        (costcode) => costcode === null
      );

      // Use recent codes if no search term and no nulls, otherwise use costcodeResults
      options =
        searchTerm === "" && !hasNullInRecent
          ? recentlyUsedCostCodes.map((costcode: CostCodes) => ({
              code: costcode.name,
              label: costcode.name + " - " + costcode.description,
            }))
          : costcodeResults
              .filter((costcode: CostCodes | null) => costcode !== null) // Check for null in costcodeResults
              .map((costcode: CostCodes) => ({
                code: costcode.name,
                label: costcode.name + " - " + costcode.description,
              }));
      break;

    case "jobsite":
      if (!jobsiteResults) {
        throw new Error("jobsiteResults is undefined");
      }
      options =
        searchTerm === ""
          ? recentlyUsedJobCodes
              .filter(
                (jobcode: JobCodes) =>
                  jobcode.name !== "Tasco Jobsite" &&
                  jobcode.name !== "Mechanic Jobsite" &&
                  jobcode.name !== "Truck Jobsite"
              )
              .map((jobcode: JobCodes) => ({
                code: jobcode.qrId,
                label: jobcode.name,
              }))
          : jobsiteResults
              .filter(
                (jobcode: JobCodes) =>
                  jobcode.name !== "Tasco Jobsite" &&
                  jobcode.name !== "Mechanic Jobsite" &&
                  jobcode.name !== "Truck Jobsite"
              )
              .map((jobcode: JobCodes) => ({
                code: jobcode.qrId,
                label: jobcode.name,
              }));
      break;
    case "jobsite-mechanic":
      if (!jobsiteResults) {
        throw new Error("jobsiteResults is undefined");
      }
      options =
        searchTerm === ""
          ? recentlyUsedJobCodes
              .filter(
                (jobcode: JobCodes) => jobcode.name === "Mechanic Jobsite"
              )
              .map((jobcode: JobCodes) => ({
                code: jobcode.qrId,
                label: jobcode.name,
              }))
          : jobsiteResults
              .filter(
                (jobcode: JobCodes) => jobcode.name === "Mechanic Jobsite"
              )
              .map((jobcode: JobCodes) => ({
                code: jobcode.qrId,
                label: jobcode.name,
              }));
      break;

    case "equipment":
      if (!equipmentResults) {
        throw new Error("equipmentResults is undefined");
      }
      options =
        searchTerm === ""
          ? recentlyUsedEquipment.map((equipment: EquipmentCode) => ({
              code: equipment.qrId,
              label: equipment.name,
            }))
          : equipmentResults.map((equipment: EquipmentCode) => ({
              code: equipment.qrId,
              label: equipment.name,
            }));
      break;

    default:
      throw new Error("Invalid data type");
  }

  // Filter options based on the search term
  if (searchTerm) {
    options = options.filter((option) =>
      option.label.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }

  return options;
};
