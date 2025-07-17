"use client";
import { ApprovalStatus } from "@/lib/enums";
import { useState, useEffect } from "react";

export type ClientSummary = {
  id: string;
  name: string;
  description?: string;
  creationReason?: string;
  approvalStatus: ApprovalStatus;
  contactPerson?: string;
  contactEmail?: string;
  contactPhone?: string;
  hasProjects: boolean;
  createdAt: string;
  updatedAt: string;
  Address: {
    id: string;
    street: string;
    city: string;
    state: string;
    zipCode: string;
  };
  Jobsites: {
    id: string;
    name: string;
  }[];
};

export const useClientData = () => {
  const [ClientDetails, setClientDetails] = useState<ClientSummary[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshKey, setRefreshKey] = useState(0);
  const [total, setTotal] = useState<number>(0);
  const [page, setPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(25);
  const [totalPages, setTotalPages] = useState<number>(0);

  const rerender = () => setRefreshKey((k) => k + 1);

  useEffect(() => {
    const fetchClientSummaries = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `/api/getClientsDetails?page=${page}&pageSize=${pageSize}`
        );
        if (!response.ok) {
          throw new Error(`HTTP error ${response.status}`);
        }
        const data = await response.json();
        setClientDetails(data.clients);
        setTotal(data.total);
        setTotalPages(data.totalPages);
      } catch (error) {
        console.error("Failed to fetch client details:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchClientSummaries();
  }, [refreshKey, page, pageSize]);

  return {
    ClientDetails,
    setClientDetails,
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
