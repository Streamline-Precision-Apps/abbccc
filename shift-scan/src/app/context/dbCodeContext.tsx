import React, { createContext, useContext, useState, ReactNode } from 'react';

// Define types for each context
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

// Define JobSite Context
interface JobSiteContextType {
jobsiteResults: JobCode[];
recentlyUsedJobCodes: JobCode[];
setJobsiteResults: React.Dispatch<React.SetStateAction<JobCode[]>>;
addRecentlyUsedJobCode: (code: JobCode) => void;
}

const JobSiteContext = createContext<JobSiteContextType>({
jobsiteResults: [],
recentlyUsedJobCodes: [],
setJobsiteResults: () => {},
addRecentlyUsedJobCode: () => {},
});

export const JobSiteProvider = ({ children }: { children: ReactNode }) => {
const [jobsiteResults, setJobsiteResults] = useState<JobCode[]>([]);
const [recentlyUsedJobCodes, setRecentlyUsedJobCodes] = useState<JobCode[]>([]);

const addRecentlyUsedJobCode = (code: JobCode) => {
setRecentlyUsedJobCodes(prev => {
    const updatedList = [code, ...prev.filter(c => c.id !== code.id)];
    return updatedList.slice(0, 5);
});
};

return (
<JobSiteContext.Provider value={{ jobsiteResults, setJobsiteResults, recentlyUsedJobCodes, addRecentlyUsedJobCode }}>
    {children}
</JobSiteContext.Provider>
);
};

export const useDBJobsite = () => useContext(JobSiteContext);

// Define CostCode Context
interface CostCodeContextType {
costcodeResults: CostCode[];
recentlyUsedCostCodes: CostCode[];
setCostcodeResults: React.Dispatch<React.SetStateAction<CostCode[]>>;
addRecentlyUsedCostCode: (code: CostCode) => void;
}

const CostCodeContext = createContext<CostCodeContextType>({
costcodeResults: [],
recentlyUsedCostCodes: [],
setCostcodeResults: () => {},
addRecentlyUsedCostCode: () => {},
});

export const CostCodeProvider = ({ children }: { children: ReactNode }) => {
const [costcodeResults, setCostcodeResults] = useState<CostCode[]>([]);
const [recentlyUsedCostCodes, setRecentlyUsedCostCodes] = useState<CostCode[]>([]);

const addRecentlyUsedCostCode = (code: CostCode) => {
setRecentlyUsedCostCodes(prev => {
    const updatedList = [code, ...prev.filter(c => c.id !== code.id)];
    return updatedList.slice(0, 5);
});
};

return (
<CostCodeContext.Provider value={{ costcodeResults, setCostcodeResults, recentlyUsedCostCodes, addRecentlyUsedCostCode }}>
    {children}
</CostCodeContext.Provider>
);
};

export const useDBCostcode = () => useContext(CostCodeContext);

// Define Equipment Context
interface EquipmentContextType {
equipmentResults: Equipment[];
recentlyUsedEquipment: Equipment[];
setEquipmentResults: React.Dispatch<React.SetStateAction<Equipment[]>>;
addRecentlyUsedEquipment: (equipment: Equipment) => void;
}

const EquipmentContext = createContext<EquipmentContextType>({
equipmentResults: [],
recentlyUsedEquipment: [],
setEquipmentResults: () => {},
addRecentlyUsedEquipment: () => {},
});

export const EquipmentProvider = ({ children }: { children: ReactNode }) => {
const [equipmentResults, setEquipmentResults] = useState<Equipment[]>([]);
const [recentlyUsedEquipment, setRecentlyUsedEquipment] = useState<Equipment[]>([]);

const addRecentlyUsedEquipment = (equipment: Equipment) => {
setRecentlyUsedEquipment(prev => {
    const updatedList = [equipment, ...prev.filter(e => e.id !== equipment.id)];
    return updatedList.slice(0, 5);
});
};

return (
<EquipmentContext.Provider value={{ equipmentResults, setEquipmentResults, recentlyUsedEquipment, addRecentlyUsedEquipment }}>
    {children}
</EquipmentContext.Provider>
);
};

export const useDBEquipment = () => useContext(EquipmentContext);