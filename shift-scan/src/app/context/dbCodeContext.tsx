// This context is used to get the data from the database and stores it in a state.

import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import { fetchWithOfflineCache } from "@/utils/offlineApi";
import { useOnlineStatus } from "@/hooks/useOnlineStatus";
import { CostCodes, JobCodes, EquipmentCode } from "@/lib/types";
import { z } from "zod";
import { useParams, usePathname, useSearchParams } from "next/navigation";
import { equipmentTagExists } from "@/actions/equipmentActions";

const JobsitesSchema = z.array(
  z.object({
    id: z.string(),
    qrId: z.string(),
    isActive: z.boolean().optional(),
    status: z.string().optional(),
    name: z.string(),
    streetNumber: z.string().nullable().optional(),
    streetName: z.string().optional(),
    city: z.string().optional(),
    state: z.string().nullable().optional(),
    country: z.string().optional(),
    description: z.string().nullable().optional(),
    comment: z.string().nullable().optional(),
  })
);

const CostCodesSchema = z.array(
  z.object({
    id: z.string(),
    name: z.string(),
  })
);

const EquipmentSchema = z.array(
  z.object({
    id: z.string(),
    qrId: z.string(),
    name: z.string(),
    equipmentTag: z.enum(["EQUIPMENT", "VEHICLE", "TRUCK", "TRAILER"]),
  })
);

type JobSiteContextType = {
  jobsiteResults: JobCodes[];
  setJobsiteResults: React.Dispatch<React.SetStateAction<JobCodes[]>>;
};

const JobSiteContext = createContext<JobSiteContextType | undefined>(undefined);

export const JobSiteProvider = ({ children }: { children: ReactNode }) => {
  const [jobsiteResults, setJobsiteResults] = useState<JobCodes[]>([]);
  const jobsiteUrl = usePathname();
  const jobsiteOnline = useOnlineStatus();
  useEffect(() => {
    const fetchData = async () => {
      try {
        if (
          jobsiteUrl === "/clock" ||
          jobsiteUrl === "/dashboard/equipment/log-new" ||
          jobsiteUrl === "/dashboard/switch-jobs" ||
          jobsiteUrl === "/break" ||
          jobsiteUrl === "/dashboard/truckingAssistant" ||
          jobsiteUrl === "/dashboard/clock-out" ||
          jobsiteUrl === "/dashboard/qr-generator/add-equipment" ||
          jobsiteUrl.startsWith("/hamburger/inbox/formSubmission") ||
          jobsiteUrl.startsWith("/dashboard/myTeam/")
        ) {
          const jobSites = await fetchWithOfflineCache("getJobsites", () =>
            fetch("/api/getJobsites").then((res) => res.json())
          );
          const validatedJobSites = JobsitesSchema.parse(
            jobSites as JobCodes[]
          );
          setJobsiteResults(validatedJobSites);
        }
      } catch (error) {
        if (error instanceof z.ZodError) {
          console.error("Validation error in JobSites schema:", error);
        }
      }
    };
    fetchData();
  }, [jobsiteUrl, jobsiteOnline]);
  return (
    <JobSiteContext.Provider value={{ jobsiteResults, setJobsiteResults }}>
      {children}
    </JobSiteContext.Provider>
  );
};

export const useDBJobsite = () => {
  const context = useContext(JobSiteContext);
  if (!context)
    throw new Error("useDBJobsite must be used within a JobSiteProvider");
  return context;
};

type CostCodeContextType = {
  costcodeResults: CostCodes[];
  setCostcodeResults: React.Dispatch<React.SetStateAction<CostCodes[]>>;
};

const CostCodeContext = createContext<CostCodeContextType | undefined>(
  undefined
);

export const CostCodeProvider = ({ children }: { children: ReactNode }) => {
  const [costcodeResults, setCostcodeResults] = useState<CostCodes[]>([]);
  const costCodeUrl = usePathname();
  const costCodeOnline = useOnlineStatus();
  useEffect(() => {
    const fetchData = async () => {
      try {
        if (
          costCodeUrl === "/clock" ||
          costCodeUrl === "/dashboard/equipment/log-new" ||
          costCodeUrl === "/dashboard/switch-jobs" ||
          costCodeUrl === "/break"
        ) {
          const costCodes = await fetchWithOfflineCache("getCostCodes", () =>
            fetch("/api/getCostCodes").then((res) => res.json())
          );
          const validatedCostCodes = CostCodesSchema.parse(
            costCodes as CostCodes[]
          );
          setCostcodeResults(validatedCostCodes);
        }
      } catch (error) {
        if (error instanceof z.ZodError) {
          console.error("Validation error in CostCodes schema:", error);
        }
      }
    };
    fetchData();
  }, [costCodeUrl, costCodeOnline]);
  return (
    <CostCodeContext.Provider value={{ costcodeResults, setCostcodeResults }}>
      {children}
    </CostCodeContext.Provider>
  );
};

type EquipmentContextType = {
  equipmentResults: EquipmentCode[];
  setEquipmentResults: React.Dispatch<React.SetStateAction<EquipmentCode[]>>;
};

const EquipmentContext = createContext<EquipmentContextType | undefined>(
  undefined
);

export const EquipmentProvider = ({ children }: { children: ReactNode }) => {
  const [equipmentResults, setEquipmentResults] = useState<EquipmentCode[]>([]);
  const equipmentUrl = usePathname();
  const equipmentOnline = useOnlineStatus();
  useEffect(() => {
    const fetchData = async () => {
      try {
        if (
          equipmentUrl === "/clock" ||
          equipmentUrl === "/dashboard/log-new" ||
          equipmentUrl === "/dashboard/switch-jobs" ||
          equipmentUrl === "/break"
        ) {
          const equipment = await fetchWithOfflineCache("getEquipment", () =>
            fetch("/api/getEquipment").then((res) => res.json())
          );
          const validatedEquipment = EquipmentSchema.parse(
            equipment as EquipmentCode[]
          );
          setEquipmentResults(validatedEquipment);
        }
      } catch (error) {
        if (error instanceof z.ZodError) {
          console.error("Validation error in Equipment schema:", error);
        }
      }
    };
    fetchData();
  }, [equipmentUrl, equipmentOnline]);
  return (
    <EquipmentContext.Provider
      value={{ equipmentResults, setEquipmentResults }}
    >
      {children}
    </EquipmentContext.Provider>
  );
};

// ...existing code...
