"use client";
import { useState, useEffect } from "react";

export type PersonnelSummary = {
  id: string;
  username: string;
  firstName: string;
  middleName: string | null;
  lastName: string;
  secondLastName: string | null;
  image: string | null;
  email: string | null;
  DOB: Date;
  terminationDate: Date | null;
  accountSetup: boolean;
  permission: string;
  truckView: boolean;
  tascoView: boolean;
  mechanicView: boolean;
  laborView: boolean;
  Contact: {
    phoneNumber: string | null;
    emergencyContact: string | null;
    emergencyContactNumber: string | null;
  };
};

export const usePersonnelData = () => {
  const [personnelDetails, setPersonnelDetails] = useState<PersonnelSummary[]>(
    [],
  );
  const [loading, setLoading] = useState<boolean>(true);
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
    const fetchPersonnelSummaries = async () => {
      try {
        setLoading(true);
        let url = "";
        const encodedSearch = encodeURIComponent(searchTerm.trim());
        if (showInactive) {
          url = `/api/personnelManager?status=inactive${searchTerm ? `&search=${encodedSearch}` : ""}`;
        } else {
          url = `/api/personnelManager?page=${page}&pageSize=${pageSize}${searchTerm ? `&search=${encodedSearch}` : ""}`;
        }
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`HTTP error ${response.status}`);
        }
        const data = await response.json();
        setPersonnelDetails(data.users);
        setTotal(data.total);
        setTotalPages(data.totalPages);
      } catch (error) {
        console.error("Failed to fetch personnel details:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPersonnelSummaries();
  }, [refreshKey, page, pageSize, showInactive, searchTerm]);

  return {
    personnelDetails,
    setPersonnelDetails,
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
    // Show inactive employee only
    setShowInactive,
    showInactive,
    // Search
    searchTerm: searchInput,
    setSearchTerm: setSearchInput,
  };
};
