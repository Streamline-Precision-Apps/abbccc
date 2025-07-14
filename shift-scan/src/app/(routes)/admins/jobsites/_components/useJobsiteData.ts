"use client";
import { ApprovalStatus } from "@/lib/enums";
import { useState, useEffect } from "react";

export type JobsiteSummary = {
  id: string;
  name: string;
  qrId: string;
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
  const [total, setTotal] = useState<number>(0);
  const [page, setPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(25);
  const [totalPages, setTotalPages] = useState<number>(0);

  const rerender = () => setRefreshKey((k) => k + 1);

  useEffect(() => {
    const fetchEquipmentSummaries = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `/api/jobsiteManager?page=${page}&pageSize=${pageSize}`
        );
        if (!response.ok) {
          throw new Error(`HTTP error ${response.status}`);
        }
        const data = await response.json();
        setJobsiteDetails(data.jobsites);
        setTotal(data.total);
        setTotalPages(data.totalPages);
      } catch (error) {
        console.error("Failed to fetch jobsite details:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchEquipmentSummaries();
  }, [refreshKey, page, pageSize]);

  return {
    jobsiteDetails,
    setJobsiteDetails,
    loading,
    setLoading,
    rerender,
    // Pagination state
    total,
    page,
    pageSize,
    totalPages,
    // Pagination handlers
    setTotal,
    setPage,
    setPageSize,
    setTotalPages,
  };
};
