// This stores the previous 5 cost codes, jobsites, and equipment that the user has selected. This will make it easier to change cost codes.

import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  use,
  useEffect,
} from "react";
import {
  JobCodes,
  CostCodes,
  EquipmentCodes,
  EquipmentCode,
} from "@/lib/types";
import { z } from "zod";
import { usePathname } from "next/navigation";

const CostCodesRecentSchema = z
  .array(
    z.object({
      id: z.string(),
      name: z.string(),
      description: z.string(),
      type: z.string().default("DEFAULT_TYPE"),
    })
  )
  .nullable();

const EquipmentSchema = z.array(
  z.object({
    id: z.string(),
    qrId: z.string(),
    name: z.string(),
  })
);

const JobsitesRecentSchema = z
  .array(
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
  )
  .nullable();

type RecentJobSiteContextType = {
  recentlyUsedJobCodes: JobCodes[];
  setRecentlyUsedJobCodes: React.Dispatch<React.SetStateAction<JobCodes[]>>;
  addRecentlyUsedJobCode: (code: JobCodes) => void;
};

const RecentJobSiteContext = createContext<RecentJobSiteContextType>({
  recentlyUsedJobCodes: [],
  setRecentlyUsedJobCodes: () => {},
  addRecentlyUsedJobCode: () => {},
});

export const RecentJobSiteProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [recentlyUsedJobCodes, setRecentlyUsedJobCodes] = useState<JobCodes[]>(
    []
  );
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
          const response = await fetch("/api/getRecentJobsites");
          const recentJobSites = await response.json();
          const validatedRecentJobSites =
            JobsitesRecentSchema.parse(recentJobSites);
          if (validatedRecentJobSites === null) {
            setRecentlyUsedJobCodes([]);
          } else {
            setRecentlyUsedJobCodes(
              validatedRecentJobSites.map((jobSite) => ({
                ...jobSite,
                toLowerCase: () => jobSite.name.toLowerCase(),
              }))
            );
          }
        }
      } catch (error) {
        if (error instanceof z.ZodError) {
          console.error(
            "Validation error in Recent JobSites schema:",
            error.errors
          );
        }
      }
    };
    fetchData();
  }, [url]);

  const addRecentlyUsedJobCode = (code: JobCodes) => {
    setRecentlyUsedJobCodes((prev) => {
      const updatedList = [code, ...prev.filter((c) => c.qrId !== code.qrId)];
      return updatedList.slice(0, 5);
    });
  };

  return (
    <RecentJobSiteContext.Provider
      value={{
        recentlyUsedJobCodes,
        setRecentlyUsedJobCodes,
        addRecentlyUsedJobCode,
      }}
    >
      {children}
    </RecentJobSiteContext.Provider>
  );
};

export const useRecentDBJobsite = () => useContext(RecentJobSiteContext);

interface RecentCostCodeContextType {
  recentlyUsedCostCodes: CostCodes[];
  setRecentlyUsedCostCodes: React.Dispatch<React.SetStateAction<CostCodes[]>>;
  addRecentlyUsedCostCode: (code: CostCodes) => void;
}

const RecentCostCodeContext = createContext<RecentCostCodeContextType>({
  recentlyUsedCostCodes: [],
  setRecentlyUsedCostCodes: () => {},
  addRecentlyUsedCostCode: () => {},
});

export const RecentCostCodeProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [recentlyUsedCostCodes, setRecentlyUsedCostCodes] = useState<
    CostCodes[]
  >([]);
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
          const response = await fetch("/api/getRecentCostCodes");
          const recentCostCodes = await response.json();
          const validatedRecentCostCodes =
            CostCodesRecentSchema.parse(recentCostCodes);
          if (validatedRecentCostCodes === null) {
            setRecentlyUsedCostCodes([]);
          } else {
            setRecentlyUsedCostCodes(validatedRecentCostCodes);
          }
        }
      } catch (error) {
        if (error instanceof z.ZodError) {
          console.error(
            "Validation error in Recent CostCodes schema:",
            error.errors
          );
        }
      }
    };
    fetchData();
  }, [url]);

  const addRecentlyUsedCostCode = (code: CostCodes) => {
    setRecentlyUsedCostCodes((prev) => {
      const updatedList = [
        code,
        ...prev.filter((c) => c !== null && c.name !== code.name), // Check if c is not null
      ];
      return updatedList.slice(0, 5);
    });
  };

  return (
    <RecentCostCodeContext.Provider
      value={{
        recentlyUsedCostCodes,
        setRecentlyUsedCostCodes,
        addRecentlyUsedCostCode,
      }}
    >
      {children}
    </RecentCostCodeContext.Provider>
  );
};

export const useRecentDBCostcode = () => useContext(RecentCostCodeContext);

interface RecentEquipmentContextType {
  recentlyUsedEquipment: EquipmentCode[];
  setRecentlyUsedEquipment: React.Dispatch<
    React.SetStateAction<EquipmentCode[]>
  >;
  addRecentlyUsedEquipment: (equipment: EquipmentCode) => void;
}

const RecentEquipmentContext = createContext<RecentEquipmentContextType>({
  recentlyUsedEquipment: [],
  setRecentlyUsedEquipment: () => {},
  addRecentlyUsedEquipment: () => {},
});

export const RecentEquipmentProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [recentlyUsedEquipment, setRecentlyUsedEquipment] = useState<
    EquipmentCode[]
  >([]);
  const url = usePathname();
  useEffect(() => {
    const fetchData = async () => {
      try {
        if (
          url === "/clock" ||
          url === "/dashboard/log-new" ||
          url === "/dashboard/switch-jobs" ||
          url === "/break"
        ) {
          const response = await fetch("/api/getRecentEquipment");
          const recentEquipment = await response.json();
          const validatedRecentEquipment =
            EquipmentSchema.parse(recentEquipment);
          setRecentlyUsedEquipment(validatedRecentEquipment as EquipmentCode[]);
        }
      } catch (error) {
        if (error instanceof z.ZodError) {
          console.error(
            "Validation error in Recent Equipment schema:",
            error.errors
          );
        }
      }
    };
    fetchData();
  }, [url]);

  const addRecentlyUsedEquipment = (equipment: EquipmentCode) => {
    setRecentlyUsedEquipment((prev) => {
      const updatedList = [
        equipment,
        ...prev.filter((e) => e.qrId !== equipment.qrId),
      ];
      return updatedList.slice(0, 5);
    });
  };

  return (
    <RecentEquipmentContext.Provider
      value={{
        recentlyUsedEquipment,
        setRecentlyUsedEquipment,
        addRecentlyUsedEquipment,
      }}
    >
      {children}
    </RecentEquipmentContext.Provider>
  );
};

export const useRecentDBEquipment = () => useContext(RecentEquipmentContext);
