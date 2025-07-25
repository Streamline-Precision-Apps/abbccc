"use client";
import { ApprovalStatus } from "@/lib/enums";
import { useState, useEffect, useCallback } from "react";

export type Jobsite = {
  id: string;
  name: string;
  description?: string;
  creationReason?: string;
  approvalStatus: ApprovalStatus;
  isActive: boolean;
  archivedDate: boolean;
  createdById: string;
  updatedAt: Date;
  createdVia: "ADMIN" | "API";
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
  CCTags: Array<{
    id: string;
    name: string;
  }>;
};

type ClientsSummary = {
  id: string;
  name: string;
};

export const useJobsiteDataById = (id: string) => {
  const [jobSiteDetails, setJobSiteDetails] = useState<Jobsite | null>(null);
  const [tagSummaries, setTagSummaries] = useState<
    Array<{
      id: string;
      name: string;
    }>
  >([]);
  const [clients, setClients] = useState<ClientsSummary[]>();
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshKey, setRefreshKey] = useState(0);

  const rerender = () => setRefreshKey((k) => k + 1);

  useEffect(() => {
    const fetchEquipmentSummaries = async () => {
      try {
        setLoading(true);
        const [jobsiteDetails, tag, client] = await Promise.all([
          fetch("/api/getJobsiteById/" + id),
          fetch("/api/getTagSummary"),
          fetch("/api/getClientsSummary"),
        ]).then((res) => Promise.all(res.map((r) => r.json())));

        setJobSiteDetails(jobsiteDetails);
        const filteredTags = tag.tags.map(
          (tag: { id: string; name: string }) => ({
            id: tag.id,
            name: tag.name,
          })
        );
        setTagSummaries(filteredTags);
        setClients(client);
      } catch (error) {
        console.error("Failed to fetch job site details:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchEquipmentSummaries();
  }, [refreshKey]);

  return {
    jobSiteDetails,
    setJobSiteDetails,
    tagSummaries,
    clients,
    loading,
    setLoading,
    rerender,
  };
};
