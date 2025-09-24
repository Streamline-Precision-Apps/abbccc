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
  selectedJobSite: string | null;
  setSelectedJobSite: (jobSite: string | null) => void;
};

const JobSiteContext = createContext<JobSiteContextType | undefined>(undefined);

export const JobSiteProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [selectedJobSite, setSelectedJobSite] = useState<string | null>(null);

  return (
    <JobSiteContext.Provider value={{ selectedJobSite, setSelectedJobSite }}>
      {children}
    </JobSiteContext.Provider>
  );
};

export const useJobSite = () => {
  const context = useContext(JobSiteContext);
  if (context === undefined) {
    throw new Error("useJobSite must be used within a JobSiteProvider");
  }
  return context;
};

// Equipment Context
type EquipmentContextType = {
  selectedEquipment: string | null;
  setSelectedEquipment: (equipment: string | null) => void;
};

const EquipmentContext = createContext<EquipmentContextType | undefined>(
  undefined,
);

export const EquipmentProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [selectedEquipment, setSelectedEquipment] = useState<string | null>(
    null,
  );

  return (
    <EquipmentContext.Provider
      value={{ selectedEquipment, setSelectedEquipment }}
    >
      {children}
    </EquipmentContext.Provider>
  );
};

export const useEquipment = () => {
  const context = useContext(EquipmentContext);
  if (context === undefined) {
    throw new Error("useEquipment must be used within an EquipmentProvider");
  }
  return context;
};

// CostCode Context
type CostCodeContextType = {
  selectedCostCode: string | null;
  setSelectedCostCode: (costCode: string | null) => void;
};

const CostCodeContext = createContext<CostCodeContextType | undefined>(
  undefined,
);

export const CostCodeProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [selectedCostCode, setSelectedCostCode] = useState<string | null>(null);

  return (
    <CostCodeContext.Provider value={{ selectedCostCode, setSelectedCostCode }}>
      {children}
    </CostCodeContext.Provider>
  );
};

export const useCostCode = () => {
  const context = useContext(CostCodeContext);
  if (context === undefined) {
    throw new Error("useCostCode must be used within a CostCodeProvider");
  }
  return context;
};
