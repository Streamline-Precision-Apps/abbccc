"use client";
import { ApprovalStatus } from "@/lib/enums";
import { useState, useEffect } from "react";

export type CostCodeSummary = {
  id: string;
  code: string;
  name: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  CCTags: Array<{
    id: string;
    name: string;
  }>;
};

export const useCostCodeData = () => {
  const [CostCodeDetails, setCostCodeDetails] = useState<CostCodeSummary[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshKey, setRefreshKey] = useState(0);
  const [total, setTotal] = useState<number>(0);
  const [page, setPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(25);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [inputValue, setInputValue] = useState("");

  // Debounce search input
  useEffect(() => {
    const handler = setTimeout(() => {
      setSearchTerm(inputValue);
    }, 500);
    return () => clearTimeout(handler);
  }, [inputValue]);

  const rerender = () => setRefreshKey((k) => k + 1);

  useEffect(() => {
    const fetchEquipmentSummaries = async () => {
      try {
        setLoading(true);
        const encodedSearch = encodeURIComponent(searchTerm.trim());
        const response = await fetch(
          `/api/getCostCodeDetails?page=${page}&pageSize=${pageSize}&search=${encodedSearch}`,
        );
        if (!response.ok) {
          throw new Error(`HTTP error ${response.status}`);
        }
        const data = await response.json();
        setCostCodeDetails(data.costCodes);
        setTotal(data.total);
        setTotalPages(data.totalPages);
      } catch (error) {
        console.error("Failed to fetch CostCode details:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchEquipmentSummaries();
  }, [refreshKey, page, pageSize, searchTerm]);

  return {
    CostCodeDetails,
    setCostCodeDetails,
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
    inputValue,
    setInputValue,
  };
};
