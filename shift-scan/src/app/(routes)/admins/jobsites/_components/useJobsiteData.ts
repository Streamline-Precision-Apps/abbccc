"use client";
import { ApprovalStatus } from "@/lib/enums";
import { useState, useEffect, useCallback } from "react";

export type JobsiteSummary = {
  id: string;
  name: string;
  description: string;
  isActive: boolean;
  approvalStatus: ApprovalStatus;
  createdAt: Date;
  updatedAt: Date;
  Address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
  };
  Client: {
    id: string;
    name: string;
  };
};

export const useJobsiteData = () => {
  const [jobsiteDetails, setJobsiteDetails] = useState<JobsiteSummary[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshKey, setRefreshKey] = useState(0);

  const rerender = () => setRefreshKey((k) => k + 1);

  useEffect(() => {
    const fetchEquipmentSummaries = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/jobsiteManager");
        if (!response.ok) {
          throw new Error(`HTTP error ${response.status}`);
        }
        const data = await response.json();
        setJobsiteDetails(data);
      } catch (error) {
        console.error("Failed to fetch jobsite details:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchEquipmentSummaries();
  }, [refreshKey]);

  return {
    jobsiteDetails,
    setJobsiteDetails,
    loading,
    setLoading,
    rerender,
  };
};
