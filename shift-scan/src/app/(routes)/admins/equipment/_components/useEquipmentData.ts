"use client";
import { useState, useEffect, useCallback } from "react";

/**
 * EquipmentVehicleInfo type for vehicle-specific info
 */
export interface EquipmentVehicleInfo {
  make: string;
  model: string;
  year: string;
}

/**
 * EquipmentSummary type for equipment/vehicle/truck/trailer asset
 */
export interface EquipmentSummary {
  id: string;
  qrId: string;
  name: string;
  description: string;
  equipmentTag: "EQUIPMENT" | "VEHICLE" | "TRUCK" | "TRAILER";
  state: "AVAILABLE" | "NEEDS_REPAIR" | "IN_USE" | "MAINTENANCE" | "RETIRED";
  approvalStatus: "PENDING" | "APPROVED" | "REJECTED" | "DRAFT";
  createdAt: string;
  updatedAt: string;
  equipmentVehicleInfo: EquipmentVehicleInfo | null;
}
export const useEquipmentData = () => {
  const [equipmentDetails, setEquipmentDetails] = useState<EquipmentSummary[]>(
    [],
  );
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshKey, setRefreshKey] = useState(0);
  const [total, setTotal] = useState<number>(0);
  const [page, setPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(25);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [pendingCount, setPendingCount] = useState<number>(0);

  //Approval Button States
  const [showPendingOnly, setShowPendingOnly] = useState(false);

  const rerender = () => setRefreshKey((k) => k + 1);

  useEffect(() => {
    const fetchEquipmentSummaries = async () => {
      try {
        setLoading(true);
        let url = "";
        if (showPendingOnly) {
          url = `/api/getEquipmentDetails?status=pending`;
        } else {
          url = `/api/getEquipmentDetails?page=${page}&pageSize=${pageSize}`;
        }
        const response = await fetch(url);
        const data = await response.json();
        if (!response.ok) {
          throw new Error(`HTTP error ${response.status}`);
        }
        setEquipmentDetails(data.equipment);
        setTotal(data.total);
        setTotalPages(data.totalPages);
        setPendingCount(
          data.equipment.filter(
            (item: EquipmentSummary) => item.approvalStatus === "PENDING",
          ).length,
        );
      } catch (error) {
        console.error("Failed to fetch equipment details:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchEquipmentSummaries();
  }, [refreshKey, page, pageSize, showPendingOnly]);

  return {
    equipmentDetails,
    setEquipmentDetails,
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
    // Approval Button States
    showPendingOnly,
    setShowPendingOnly,
    pendingCount,
  };
};
