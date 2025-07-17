"use client";
import { ApprovalStatus } from "@/lib/enums";
import { useState, useEffect, useCallback } from "react";

export type Client = {
  id: string;
  name: string;
  description?: string;
  creationReason?: string;
  approvalStatus: ApprovalStatus;
  contactPerson?: string;
  contactEmail?: string;
  contactPhone?: string;
  createdAt: Date;
  updatedAt: Date;
  createdById: string;
  createdVia: "ADMIN" | "API";
  Address: {
    id: string;
    street: string;
    city: string;
    state: string;
    zipCode: string;
  };
};

export const useClientDataById = (id: string) => {
  const [clientDetails, setClientDetails] = useState<Client | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshKey, setRefreshKey] = useState(0);

  const rerender = () => setRefreshKey((k) => k + 1);

  useEffect(() => {
    const fetchEquipmentSummaries = async () => {
      try {
        setLoading(true);
        const [clientDetails] = await Promise.all([
          fetch("/api/getClientById/" + id),
        ]).then((res) => Promise.all(res.map((r) => r.json())));

        setClientDetails(clientDetails);
      } catch (error) {
        console.error("Failed to fetch client details:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchEquipmentSummaries();
  }, [refreshKey]);

  return {
    clientDetails,
    setClientDetails,
    loading,
    setLoading,
    rerender,
  };
};
