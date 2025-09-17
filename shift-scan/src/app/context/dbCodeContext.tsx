"use client";
import React, { createContext, useContext, useState, ReactNode } from "react";

// JobSite Context
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
