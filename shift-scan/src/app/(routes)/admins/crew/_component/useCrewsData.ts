"use client";
import { useState, useEffect } from "react";
export interface CrewData {
  id: string;
  name: string;
  leadId: string;
  crewType: "MECHANIC" | "TRUCK_DRIVER" | "LABOR" | "TASCO" | "";
  createdAt: Date;
  Users: {
    id: string;
    firstName: string;
    middleName: string | null;
    lastName: string;
    secondLastName: string | null;
    image: string | null;
  }[];
}

export const useCrewsData = () => {
  const [crew, setCrew] = useState<CrewData[]>([]);

  const [loading, setLoading] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [total, setTotal] = useState<number>(0);
  const [page, setPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(25);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [showInactive, setShowInactive] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>(""); // debounced value
  const [searchInput, setSearchInput] = useState<string>(""); // immediate input

  // Debounce search input
  useEffect(() => {
    const handler = setTimeout(() => {
      setSearchTerm(searchInput);
    }, 500);
    return () => clearTimeout(handler);
  }, [searchInput]);

  const rerender = () => setRefreshKey((k) => k + 1);

  useEffect(() => {
    const fetchAllData = async () => {
      setLoading(true);
      try {
        let url = "";
        const encodedSearch = encodeURIComponent(searchTerm);
        if (showInactive) {
          url = `/api/crewManager?status=inactive${searchTerm ? `&search=${encodedSearch}` : ""}`;
        } else {
          url = `/api/crewManager?page=${page}&pageSize=${pageSize}${searchTerm ? `&search=${encodedSearch}` : ""}`;
        }
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`HTTP error ${response.status}`);
        }
        const data = await response.json();

        setTotal(data.total);
        setTotalPages(data.totalPages);
        setCrew(data.crews || []);
      } catch (error) {
        console.error("Failed to fetch crew details:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAllData();
  }, [refreshKey, page, pageSize, showInactive, searchTerm]);

  return {
    loading,
    crew,
    total,
    totalPages,
    page,
    pageSize,
    setPage,
    setPageSize,
    setShowInactive,
    showInactive,
    searchTerm: searchInput,
    setSearchTerm: setSearchInput,
    rerender,
  };
};
