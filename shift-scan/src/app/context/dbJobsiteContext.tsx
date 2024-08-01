import React, { createContext, useContext, useState, ReactNode } from 'react';

// Define types for JobSite context
type JobCode = {
id: number;
jobsite_id: string;
jobsite_name: string;
};

interface JobSiteContextType {
jobsiteResults: JobCode[];
recentlyUsedJobCodes: JobCode[];
setJobsiteResults: React.Dispatch<React.SetStateAction<JobCode[]>>;
addRecentlyUsedJobCode: (code: JobCode) => void;
}

// Create context
const JobSiteContext = createContext<JobSiteContextType>({
jobsiteResults: [],
recentlyUsedJobCodes: [],
setJobsiteResults: () => {},
addRecentlyUsedJobCode: () => {},
});

// Provider component
export const JobSiteProvider = ({ children }: { children: ReactNode }) => {
const [jobsiteResults, setJobsiteResults] = useState<JobCode[]>([]);
const [recentlyUsedJobCodes, setRecentlyUsedJobCodes] = useState<JobCode[]>([]);

// Function to add a code to the recently used list
const addRecentlyUsedJobCode = (code: JobCode) => {
setRecentlyUsedJobCodes((prev) => {
    const updatedList = [code, ...prev.filter((c) => c.id !== code.id)];
    return updatedList.slice(0, 5); // Keep only the last 5 entries
});
};

return (
<JobSiteContext.Provider
    value={{ jobsiteResults, setJobsiteResults, recentlyUsedJobCodes, addRecentlyUsedJobCode }}
>
    {children}
</JobSiteContext.Provider>
);
};

// Custom hook to use the JobSite context
export const useDBJobsite = () => useContext(JobSiteContext);