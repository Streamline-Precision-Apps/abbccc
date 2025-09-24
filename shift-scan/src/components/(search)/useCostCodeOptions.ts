"use client";
import { useEffect, useMemo, useState } from "react";
import { fetchWithOfflineCache } from "@/utils/offlineApi";
import { EquipmentTags } from "../../../prisma/generated/prisma/client";

export type JobCodes = {
  id: string;
  qrId: string;
  name: string;
};

export type CostCodes = {
  id: string;
  name: string;
};

export type EquipmentCode = {
  id: string;
  qrId: string;
  name: string;
  equipmentTag: EquipmentTags;
};

interface Option {
  code: string;
  label: string;
}

export const useCostCodeOptions = (
  dataType: string,
  searchTerm?: string,
): Option[] => {
  const [jobsiteResults, setJobsiteResults] = useState<JobCodes[]>([]);
  const [costcodeResults, setCostcodeResults] = useState<CostCodes[]>([]);
  const [equipmentResults, setEquipmentResults] = useState<EquipmentCode[]>(
    [],
  );

  useEffect(() => {
    let mounted = true;
    const loadAll = async () => {
      try {
        const [jobsites, costcodes, equipment] = await Promise.all([
          fetchWithOfflineCache("getJobsiteSummary", () =>
            fetch("/api/getJobsiteSummary").then((r) =>
              r.json() as Promise<Array<{ id: string; name: string; qrId?: string }>>,
            ),
          ),
          fetchWithOfflineCache("getCostCodes", () =>
            fetch("/api/getCostCodes").then((r) =>
              r.json() as Promise<CostCodes[]>,
            ),
          ),
          fetchWithOfflineCache("getAllEquipmentIdAndQrId", () =>
            fetch("/api/getAllEquipmentIdAndQrId").then((r) =>
              r.json() as Promise<Array<{ id: string; qrId: string; name: string }>>,
            ),
          ),
        ]);

        if (!mounted) return;

        // Normalize types
        setJobsiteResults(
          Array.isArray(jobsites)
            ? jobsites
                .filter((j): j is { id: string; name: string; qrId: string } =>
                  typeof j?.id === "string" &&
                  typeof j?.name === "string" &&
                  typeof (j as { qrId?: string })?.qrId === "string",
                )
                .map((j) => ({ id: j.id, name: j.name, qrId: j.qrId }))
            : [],
        );
        setCostcodeResults(Array.isArray(costcodes) ? costcodes : []);
        setEquipmentResults(
          Array.isArray(equipment)
            ? equipment.map((e) => ({
                id: e.id,
                qrId: e.qrId,
                name: e.name,
                equipmentTag: EquipmentTags.EQUIPMENT, // placeholder tag if not provided
              }))
            : [],
        );
      } catch (e) {
        // Soft-fail to empty lists
        if (!mounted) return;
        setJobsiteResults([]);
        setCostcodeResults([]);
        setEquipmentResults([]);
      }
    };
    loadAll();
    return () => {
      mounted = false;
    };
  }, []);

  const options = useMemo(() => {
    let opts: Option[] = [];

    switch (dataType) {
      case "costcode":
        if (!costcodeResults) throw new Error("costcodeResults is undefined");

        opts = costcodeResults.map((costcode: CostCodes) => ({
          code: costcode.name,
          label: `${costcode.name}`,
          // isRecent: recentlyUsedCostCodes.some(
          //   (recent) => recent?.name === costcode.name
          // ),
        }));
        break;

      case "jobsite":
        if (!jobsiteResults) throw new Error("jobsiteResults is undefined");

        opts = jobsiteResults.map((jobcode: JobCodes) => ({
          code: jobcode.qrId,
          label: jobcode.name,
          // isRecent: recentlyUsedJobCodes.some(
          //   (recent) => recent?.qrId === jobcode.qrId
          // ),
        }));
        break;

      case "equipment-operator":
      case "equipment":
        if (!equipmentResults)
          throw new Error("equipmentResults is undefined");

        opts = equipmentResults.map((equipment: EquipmentCode) => ({
          code: equipment.qrId,
          label: equipment.name,
          // isRecent: recentlyUsedEquipment.some(
          //   (recent) => recent?.qrId === equipment.qrId
          // ),
        }));
        break;
      case "truck":
        if (!equipmentResults) throw new Error("equipmentResults is undefined");
        opts = equipmentResults.map((equipment: EquipmentCode) => ({
          code: equipment.qrId,
          label: equipment.name,
        }));
        break;

      default:
        throw new Error("Invalid data type");
    }

    // Filter based on search term if provided
    if (searchTerm) {
      opts = opts.filter((option) =>
        option.label.toLowerCase().includes(searchTerm.toLowerCase()),
      );
    }

    return opts;
  }, [dataType, searchTerm, jobsiteResults, costcodeResults, equipmentResults]);

  return options;
};
