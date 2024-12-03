// This context is used to get the data from the database and stores it in a state.

import React, { createContext, useContext, useState, ReactNode } from "react";
import { CostCodes, JobCodes, EquipmentCodes } from "@/lib/types";

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

  return (
    <CostCodeContext.Provider value={{ costcodeResults, setCostcodeResults }}>
      {children}
    </CostCodeContext.Provider>
  );
};

export const useDBCostcode = () => useContext(CostCodeContext);

type EquipmentContextType = {
  equipmentResults: EquipmentCodes[];
  setEquipmentResults: React.Dispatch<React.SetStateAction<EquipmentCodes[]>>;
};

const EquipmentContext = createContext<EquipmentContextType>({
  equipmentResults: [],
  setEquipmentResults: () => {},
});

export const EquipmentProvider = ({ children }: { children: ReactNode }) => {
  const [equipmentResults, setEquipmentResults] = useState<EquipmentCodes[]>(
    []
  );

  return (
    <EquipmentContext.Provider
      value={{ equipmentResults, setEquipmentResults }}
    >
      {children}
    </EquipmentContext.Provider>
  );
};

export const useDBEquipment = () => useContext(EquipmentContext);
