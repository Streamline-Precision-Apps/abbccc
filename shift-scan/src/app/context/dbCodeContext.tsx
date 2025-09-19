// This context is used to get the data from the database and stores it in a state.

import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import { z } from "zod";
import { usePathname } from "next/navigation";
import { EquipmentTags } from "../../../prisma/generated/prisma/client";

type JobCodes = {
  id: string;
  qrId: string;
  name: string;
};

type CostCodes = {
  id: string;
  name: string;
};

type EquipmentCode = {
  id: string;
  qrId: string;
  name: string;
  equipmentTag: EquipmentTags;
};

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
  }),
);

const CostCodesSchema = z.array(
  z.object({
    id: z.string(),
    name: z.string(),
  }),
);

const EquipmentSchema = z
  .array(
    z.object({
      id: z.string(),
      qrId: z.string(),
      name: z.string(),
      equipmentTag: z.enum(["EQUIPMENT", "VEHICLE", "TRUCK", "TRAILER"]),
    }),
  )
  .nullable();

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
          url === "/dashboard/truckingAssistant" ||
          url === "/dashboard/clock-out" ||
          url === "/dashboard/qr-generator/add-equipment" ||
          url.startsWith("/hamburger/inbox/formSubmission") ||
          url.startsWith("/dashboard/myTeam/")
        ) {
          const response = await fetch("/api/getJobsites", {
            cache: "no-store",
          });
          const jobSites = await response.json();
          const validatedJobSites = JobsitesSchema.parse(
            jobSites as JobCodes[],
          );
          setJobsiteResults(
            validatedJobSites.map((jobSite) => ({
              ...jobSite,
              toLowerCase: () => jobSite.name.toLowerCase(),
            })),
          );
        }
      } catch (error) {
        if (error instanceof z.ZodError) {
          console.error("Validation error in JobSites schema:", error);
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
          url === "/break" ||
          url === "/dashboard/clock-out" ||
          url.startsWith("/hamburger/inbox/formSubmission") ||
          url.startsWith("/dashboard/myTeam/")
        ) {
          const response = await fetch("/api/getCostCodes", {
            cache: "no-store",
          });
          const costCodes = await response.json();
          const validatedCostCodes = CostCodesSchema.parse(
            costCodes as CostCodes[],
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
  }, [url]);

  return (
    <CostCodeContext.Provider value={{ costcodeResults, setCostcodeResults }}>
      {children}
    </CostCodeContext.Provider>
  );
};

export const useDBCostcode = () => useContext(CostCodeContext);

type EquipmentContextType = {
  equipmentResults: EquipmentCode[] | null;
  setEquipmentResults: React.Dispatch<
    React.SetStateAction<EquipmentCode[] | null>
  >;
};

const EquipmentContext = createContext<EquipmentContextType>({
  equipmentResults: null,
  setEquipmentResults: () => {},
});

export const EquipmentProvider = ({ children }: { children: ReactNode }) => {
  const [equipmentResults, setEquipmentResults] = useState<
    EquipmentCode[] | null
  >(null);
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
          url === "/dashboard/truckingAssistant" ||
          url === "/hamburger/inbox" ||
          url === "/dashboard/clock-out" ||
          url.startsWith("/hamburger/inbox/formSubmission") ||
          url.startsWith("/dashboard/myTeam/")
        ) {
          const response = await fetch("/api/getEquipment", {
            cache: "no-store",
          });

          // Check for error status
          if (!response.ok) {
            console.error("API error:", response.status);
            setEquipmentResults(null);
            return;
          }

          const equipment = await response.json();

          // Handle 404 or empty arrays properly
          if (
            equipment.message === "No equipment found." ||
            (Array.isArray(equipment) && equipment.length === 0)
          ) {
            setEquipmentResults(null);
            return;
          }

          const validatedEquipment = EquipmentSchema.parse(
            Array.isArray(equipment) ? equipment : null,
          );
          setEquipmentResults(validatedEquipment);
        }
      } catch (error) {
        console.error("Error fetching equipment:", error);
        setEquipmentResults(null);
        if (error instanceof z.ZodError) {
          console.error("Validation error in Equipment schema:", error);
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
