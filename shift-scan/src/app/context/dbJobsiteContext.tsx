'use client';

import React, { createContext, useState, ReactNode, useContext } from 'react';

interface JobSite {
    id: number;
    jobsite_id: string;
    jobsite_name: string;
}

interface DbjobsiteContextProps {
    jobsiteResults: JobSite[];
    setJobsiteResults: (jobsiteResults: JobSite[]) => void;
}

const DbjobsiteContext = createContext<DbjobsiteContextProps | undefined>(undefined);

export const DbjobsiteProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [jobsiteResults, setJobsiteResults] = useState<JobSite[]>([]);

    return (
        <DbjobsiteContext.Provider value={{ jobsiteResults, setJobsiteResults }}>
            {children}
        </DbjobsiteContext.Provider>
    );
};

export const useDBJobsite = () => {
    const context = useContext(DbjobsiteContext);
    if (context === undefined) {
        throw new Error('useDBJobsite must be used within a DbjobsiteProvider');
    }
    return context;
};