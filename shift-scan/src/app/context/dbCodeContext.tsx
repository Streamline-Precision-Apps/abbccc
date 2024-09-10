// This context is used to get the data from the database and stores it in a state.

import React, { createContext, useContext, useState, ReactNode } from 'react';

// Define types for each context
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

type JobCode = {
id: number;
jobsite_id: string;
jobsite_name: string;
};

interface JobSiteContextType {
jobsiteResults: JobCode[];
setJobsiteResults: React.Dispatch<React.SetStateAction<JobCode[]>>;
}

const JobSiteContext = createContext<JobSiteContextType>({
jobsiteResults: [],
setJobsiteResults: () => {},
});

export const JobSiteProvider = ({ children }: { children: ReactNode }) => {
const [jobsiteResults, setJobsiteResults] = useState<JobCode[]>([]);

return (
<JobSiteContext.Provider value={{ jobsiteResults, setJobsiteResults }}>
{children}
</JobSiteContext.Provider>
);
};

export const useDBJobsite = () => useContext(JobSiteContext);

interface CostCodeContextType {
costcodeResults: CostCode[];
setCostcodeResults: React.Dispatch<React.SetStateAction<CostCode[]>>;
}

const CostCodeContext = createContext<CostCodeContextType>({
costcodeResults: [],
setCostcodeResults: () => {},
});

export const CostCodeProvider = ({ children }: { children: ReactNode }) => {
const [costcodeResults, setCostcodeResults] = useState<CostCode[]>([]);

return (
    <CostCodeContext.Provider value={{ costcodeResults, setCostcodeResults }}>
    {children}
    </CostCodeContext.Provider>
);
};

export const useDBCostcode = () => useContext(CostCodeContext);



interface EquipmentContextType {
equipmentResults: Equipment[];
setEquipmentResults: React.Dispatch<React.SetStateAction<Equipment[]>>;
}

const EquipmentContext = createContext<EquipmentContextType>({
equipmentResults: [],
setEquipmentResults: () => {},
});

export const EquipmentProvider = ({ children }: { children: ReactNode }) => {
const [equipmentResults, setEquipmentResults] = useState<Equipment[]>([]);

return (
    <EquipmentContext.Provider value={{ equipmentResults, setEquipmentResults }}>
    {children}
    </EquipmentContext.Provider>
);
};

export const useDBEquipment = () => useContext(EquipmentContext);