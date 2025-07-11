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
  name: string;
  description: string;
  equipmentTag: "EQUIPMENT" | "VEHICLE" | "TRUCK" | "TRAILER";
  state: "AVAILABLE" | "NEEDS_REPAIR" | "IN_USE" | "MAINTENANCE" | "RETIRED";
  approvalStatus: "PENDING" | "APPROVED" | "REJECTED" | string;
  createdAt: string;
  updatedAt: string;
  equipmentVehicleInfo: EquipmentVehicleInfo | null;
}
export const useEquipmentData = () => {
  const [equipmentDetails, setEquipmentDetails] = useState<EquipmentSummary[]>(
    []
  );
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshKey, setRefreshKey] = useState(0);

  const rerender = () => setRefreshKey((k) => k + 1);

  useEffect(() => {
    const fetchEquipmentSummaries = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/getEquipmentDetails");
        if (!response.ok) {
          throw new Error(`HTTP error ${response.status}`);
        }
        const data = await response.json();
        setEquipmentDetails(data);
      } catch (error) {
        console.error("Failed to fetch equipment details:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchEquipmentSummaries();
  }, [refreshKey]);

  return {
    equipmentDetails,
    setEquipmentDetails,
    loading,
    setLoading,
    rerender,
  };
};
