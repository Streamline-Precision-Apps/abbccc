// This stores the previous 5 cost codes, jobsites, and equipment that the user has selected. This will make it easier to change cost codes.

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { JobCodes, CostCodes, EquipmentCodes } from '@/lib/types';

type RecentJobSiteContextType = {
  recentlyUsedJobCodes: JobCodes[];
  setRecentlyUsedJobCodes: React.Dispatch<React.SetStateAction<JobCodes[]>>;
  addRecentlyUsedJobCode: (code: JobCodes) => void;
}

const RecentJobSiteContext = createContext<RecentJobSiteContextType>({
  recentlyUsedJobCodes: [],
  setRecentlyUsedJobCodes: () => {},
  addRecentlyUsedJobCode: () => {},
});

export const RecentJobSiteProvider = ({ children }: { children: ReactNode }) => {
  const [recentlyUsedJobCodes, setRecentlyUsedJobCodes] = useState<JobCodes[]>([]);

  const addRecentlyUsedJobCode = (code: JobCodes) => {
    setRecentlyUsedJobCodes((prev) => {
      const updatedList = [code, ...prev.filter((c) => c.qrId !== code.qrId)];
      return updatedList.slice(0, 5);
    });
  };

  return (
    <RecentJobSiteContext.Provider value={{ recentlyUsedJobCodes, setRecentlyUsedJobCodes, addRecentlyUsedJobCode }}>
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
  
  export const RecentCostCodeProvider = ({ children }: { children: ReactNode }) => {
    const [recentlyUsedCostCodes, setRecentlyUsedCostCodes] = useState<CostCodes[]>([]);
  
    const addRecentlyUsedCostCode = (code: CostCodes) => {
      setRecentlyUsedCostCodes((prev) => {
        const updatedList = [
          code,
          ...prev.filter((c) => c !== null && c.name !== code.name) // Check if c is not null
        ];
        return updatedList.slice(0, 5);
      });
    };
  
    return (
      <RecentCostCodeContext.Provider value={{ recentlyUsedCostCodes, setRecentlyUsedCostCodes, addRecentlyUsedCostCode }}>
        {children}
      </RecentCostCodeContext.Provider>
    );
  };
  
  export const useRecentDBCostcode = () => useContext(RecentCostCodeContext);


  interface RecentEquipmentContextType {
    recentlyUsedEquipment: EquipmentCodes[];
    setRecentlyUsedEquipment: React.Dispatch<React.SetStateAction<EquipmentCodes[]>>;
    addRecentlyUsedEquipment: (equipment: EquipmentCodes) => void;
  }
  
  const RecentEquipmentContext = createContext<RecentEquipmentContextType>({
    recentlyUsedEquipment: [],
    setRecentlyUsedEquipment: () => {},
    addRecentlyUsedEquipment: () => {},
  });
  
  export const RecentEquipmentProvider = ({ children }: { children: ReactNode }) => {
    const [recentlyUsedEquipment, setRecentlyUsedEquipment] = useState<EquipmentCodes[]>([]);
  
    const addRecentlyUsedEquipment = (equipment: EquipmentCodes) => {
      setRecentlyUsedEquipment((prev) => {
        const updatedList = [equipment, ...prev.filter((e) => e.qrId !== equipment.qrId)];
        return updatedList.slice(0, 5);
      });
    };
  
    return (
      <RecentEquipmentContext.Provider value={{ recentlyUsedEquipment, setRecentlyUsedEquipment, addRecentlyUsedEquipment }}>
        {children}
      </RecentEquipmentContext.Provider>
    );
  };
  
  export const useRecentDBEquipment = () => useContext(RecentEquipmentContext);