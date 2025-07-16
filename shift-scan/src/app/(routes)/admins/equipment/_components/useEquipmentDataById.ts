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
export type Equipment = {
  id: string;
  qrId: string;
  name: string;
  description?: string;
  equipmentTag: string;
  approvalStatus: "PENDING" | "APPROVED" | "REJECTED" | "DRAFT";
  state: "AVAILABLE" | "IN_USE" | "MAINTENANCE" | "NEEDS_REPAIR" | "RETIRED";
  isDisabledByAdmin: boolean;
  overWeight: boolean;
  currentWeight: number | null;
  createdById: string;
  createdVia: string;
  updatedAt: Date;
  creationReason?: string;
  equipmentVehicleInfo?: {
    make: string | null;
    model: string | null;
    year: string | null;
    licensePlate: string | null;
    registrationExpiration: Date | null;
    mileage: number | null;
  };
};
export const useEquipmentDataById = (id: string) => {
  const [equipmentDetails, setEquipmentDetails] = useState<Equipment | null>(
    null
  );
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshKey, setRefreshKey] = useState(0);

  const rerender = () => setRefreshKey((k) => k + 1);

  useEffect(() => {
    const fetchEquipmentSummaries = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/getEquipmentByEquipmentId/" + id);
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
