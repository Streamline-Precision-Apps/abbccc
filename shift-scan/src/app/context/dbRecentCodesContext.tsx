import React, { createContext, useContext, useState, ReactNode } from 'react';

type JobCode = {
  id: number;
  jobsite_id: string;
  jobsite_name: string;
};

type CostCode = {
    id: number;
    cost_code: string;
    cost_code_description: string;
  };

type Equipment = {
id: string;
qr_id: string;
name: string;
};

interface RecentJobSiteContextType {
  recentlyUsedJobCodes: JobCode[];
  setRecentlyUsedJobCodes: React.Dispatch<React.SetStateAction<JobCode[]>>;
  addRecentlyUsedJobCode: (code: JobCode) => void;
}

const RecentJobSiteContext = createContext<RecentJobSiteContextType>({
  recentlyUsedJobCodes: [],
  setRecentlyUsedJobCodes: () => {},
  addRecentlyUsedJobCode: () => {},
});

export const RecentJobSiteProvider = ({ children }: { children: ReactNode }) => {
  const [recentlyUsedJobCodes, setRecentlyUsedJobCodes] = useState<JobCode[]>([]);

  const addRecentlyUsedJobCode = (code: JobCode) => {
    setRecentlyUsedJobCodes((prev) => {
      const updatedList = [code, ...prev.filter((c) => c.id !== code.id)];
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
    recentlyUsedCostCodes: CostCode[];
    setRecentlyUsedCostCodes: React.Dispatch<React.SetStateAction<CostCode[]>>;
    addRecentlyUsedCostCode: (code: CostCode) => void;
  }
  
  const RecentCostCodeContext = createContext<RecentCostCodeContextType>({
    recentlyUsedCostCodes: [],
    setRecentlyUsedCostCodes: () => {},
    addRecentlyUsedCostCode: () => {},
  });
  
  export const RecentCostCodeProvider = ({ children }: { children: ReactNode }) => {
    const [recentlyUsedCostCodes, setRecentlyUsedCostCodes] = useState<CostCode[]>([]);
  
    const addRecentlyUsedCostCode = (code: CostCode) => {
      setRecentlyUsedCostCodes((prev) => {
        const updatedList = [code, ...prev.filter((c) => c.id !== code.id)];
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
    recentlyUsedEquipment: Equipment[];
    setRecentlyUsedEquipment: React.Dispatch<React.SetStateAction<Equipment[]>>;
    addRecentlyUsedEquipment: (equipment: Equipment) => void;
  }
  
  const RecentEquipmentContext = createContext<RecentEquipmentContextType>({
    recentlyUsedEquipment: [],
    setRecentlyUsedEquipment: () => {},
    addRecentlyUsedEquipment: () => {},
  });
  
  export const RecentEquipmentProvider = ({ children }: { children: ReactNode }) => {
    const [recentlyUsedEquipment, setRecentlyUsedEquipment] = useState<Equipment[]>([]);
  
    const addRecentlyUsedEquipment = (equipment: Equipment) => {
      setRecentlyUsedEquipment((prev) => {
        const updatedList = [equipment, ...prev.filter((e) => e.id !== equipment.id)];
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