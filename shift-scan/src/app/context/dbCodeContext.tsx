// This context is used to get the data from the database and stores it in a state.

import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import { CostCodes, JobCodes, EquipmentCode } from "@/lib/types";
import { z } from "zod";
import { usePathname } from "next/navigation";

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
    description: z.string(),
    type: z.string().default("DEFAULT_TYPE"),
  })
);

const EquipmentSchema = z.array(
  z.object({
    id: z.string(),
    qrId: z.string(),
    name: z.string(),
  })
);

type JobSiteContextType = {
  jobsiteResults: JobCodes[];
  setJobsiteResults: React.Dispatch<React.SetStateAction<JobCodes[]>>;
};

const JobSiteContext = createContext<JobSiteContextType>({
  jobsiteResults: [],
  setJobsiteResults: () => {},
});

export const JobSiteProvider = ({ children }: { children: ReactNode }) => {
  const [jobsiteResults, setJobsiteResults] = useState<JobCodes[]>([]);
  const url = usePathname();

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (
          url === "/clock" ||
          url === "/dashboard/equipment/log-new" ||
          url === "/dashboard/switch-jobs" ||
          url === "/break" ||
          url === "/dashboard/truckingAssistant"
        ) {
          const response = await fetch("/api/getJobsites");
          const jobSites = await response.json();
          const validatedJobSites = JobsitesSchema.parse(
            jobSites as JobCodes[]
          );
          setJobsiteResults(
            validatedJobSites.map((jobSite) => ({
              ...jobSite,
              toLowerCase: () => jobSite.name.toLowerCase(),
            }))
          );
        }
      } catch (error) {
        if (error instanceof z.ZodError) {
          console.error("Validation error in JobSites schema:", error.errors);
        }
      }
    };
    fetchData();
  }, [url]);

  return (
    <JobSiteContext.Provider value={{ jobsiteResults, setJobsiteResults }}>
      {children}
    </JobSiteContext.Provider>
  );
};

export const useDBJobsite = () => useContext(JobSiteContext);

type CostCodeContextType = {
  costcodeResults: CostCodes[];
  setCostcodeResults: React.Dispatch<React.SetStateAction<CostCodes[]>>;
};

const CostCodeContext = createContext<CostCodeContextType>({
  costcodeResults: [],
  setCostcodeResults: () => {},
});

export const CostCodeProvider = ({ children }: { children: ReactNode }) => {
  const [costcodeResults, setCostcodeResults] = useState<CostCodes[]>([]);
  const url = usePathname();
  useEffect(() => {
    const fetchData = async () => {
      try {
        if (
          url === "/clock" ||
          url === "/dashboard/equipment/log-new" ||
          url === "/dashboard/switch-jobs" ||
          url === "/break"
        ) {
          const response = await fetch("/api/getCostCodes");
          const costCodes = await response.json();
          const validatedCostCodes = CostCodesSchema.parse(
            costCodes as CostCodes[]
          );
          setCostcodeResults(validatedCostCodes);
        }
      } catch (error) {
        if (error instanceof z.ZodError) {
          console.error("Validation error in CostCodes schema:", error.errors);
        }
      }
    };
    fetchData();
  }, [url]);

  return (
    <CostCodeContext.Provider value={{ costcodeResults, setCostcodeResults }}>
      {children}
    </CostCodeContext.Provider>
  );
};

export const useDBCostcode = () => useContext(CostCodeContext);

type EquipmentContextType = {
  equipmentResults: EquipmentCode[];
  setEquipmentResults: React.Dispatch<React.SetStateAction<EquipmentCode[]>>;
};

const EquipmentContext = createContext<EquipmentContextType>({
  equipmentResults: [],
  setEquipmentResults: () => {},
});

export const EquipmentProvider = ({ children }: { children: ReactNode }) => {
  const [equipmentResults, setEquipmentResults] = useState<EquipmentCode[]>([]);
  const url = usePathname();

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (
          url === "/clock" ||
          url === "/dashboard/equipment/log-new" ||
          url === "/dashboard/switch-jobs" ||
          url === "/break" ||
          url === "/dashboard/mechanic/new-repair" ||
          url === "/dashboard/truckingAssistant"
        ) {
          const response = await fetch("/api/getEquipment");
          const equipment = await response.json();
          const validatedEquipment = EquipmentSchema.parse(equipment);
          setEquipmentResults(validatedEquipment as EquipmentCode[]);
        }
      } catch (error) {
        if (error instanceof z.ZodError) {
          console.error("Validation error in Equipment schema:", error.errors);
        }
      }
    };
    fetchData();
  }, [url]);

  return (
    <EquipmentContext.Provider
      value={{ equipmentResults, setEquipmentResults }}
    >
      {children}
    </EquipmentContext.Provider>
  );
};

export const useDBEquipment = () => useContext(EquipmentContext);
