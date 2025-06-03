"use client";
import { useState, useEffect, useCallback } from "react";
import {
  Equipment,
  Jobsite,
  CostCode,
  Tag,
  EquipmentSummary,
  JobsiteSummary,
  CostCodeSummary,
  TagSummary,
} from "../types";

/**
 * Custom hook for managing asset data fetching and state
 * Handles all API calls for summaries and detailed asset data
 */
export const useAssets = () => {
  // Summary state (for sidebar lists)
  const [equipmentSummaries, setEquipmentSummaries] = useState<
    EquipmentSummary[]
  >([]);
  const [jobsiteSummaries, setJobsiteSummaries] = useState<JobsiteSummary[]>(
    []
  );
  const [costCodeSummaries, setCostCodeSummaries] = useState<CostCodeSummary[]>(
    []
  );
  const [tagSummaries, setTagSummaries] = useState<TagSummary[]>([]);

  // Detailed state (for selected items)
  const [selectEquipment, setSelectEquipment] = useState<Equipment | null>(
    null
  );
  const [selectJobsite, setSelectJobsite] = useState<Jobsite | null>(null);
  const [selectCostCode, setSelectCostCode] = useState<CostCode | null>(null);
  const [selectTag, setSelectTag] = useState<Tag | null>(null);

  // Loading state
  const [loading, setLoading] = useState<boolean>(false);

  // Generic fetch helper to reduce code duplication
  const fetchData = async <T>(
    url: string,
    errorMessage: string,
    setData?: (data: T) => void
  ): Promise<T | null> => {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error ${response.status}`);
      }
      const data = await response.json();
      if (setData) {
        setData(data);
      }
      return data;
    } catch (error) {
      console.error(errorMessage, error);
      return null;
    }
  };

  // Summary fetch functions
  const fetchEquipmentSummaries = useCallback(async () => {
    await fetchData<EquipmentSummary[]>(
      "/api/getEquipmentSummary",
      "Failed to fetch equipment summaries:",
      setEquipmentSummaries
    );
  }, []);

  const fetchJobsiteSummaries = useCallback(async () => {
    await fetchData<JobsiteSummary[]>(
      "/api/getJobsiteSummary",
      "Failed to fetch jobsite summaries:",
      setJobsiteSummaries
    );
  }, []);

  const fetchCostCodeSummaries = useCallback(async () => {
    await fetchData<CostCodeSummary[]>(
      "/api/getCostCodeSummary",
      "Failed to fetch cost code summaries:",
      setCostCodeSummaries
    );
  }, []);

  const fetchTagSummaries = useCallback(async () => {
    await fetchData<TagSummary[]>(
      "/api/getTagSummary",
      "Failed to fetch tag summaries:",
      setTagSummaries
    );
  }, []);

  // Detailed data fetch functions with loading state
  const fetchEquipmentDetails = useCallback(async (equipmentId: string) => {
    setLoading(true);
    try {
      const data = await fetchData<Equipment>(
        `/api/getEquipmentByEquipmentId/${equipmentId}`,
        "Failed to fetch equipment details:"
      );
      if (data) {
        setSelectEquipment(data);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchJobsiteDetails = useCallback(async (jobsiteId: string) => {
    setLoading(true);
    try {
      const data = await fetchData<Jobsite>(
        `/api/getJobsiteById/${jobsiteId}`,
        "Failed to fetch jobsite details:"
      );
      if (data) {
        setSelectJobsite(data);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchCostCodeDetails = useCallback(async (costCodeId: string) => {
    setLoading(true);
    try {
      const data = await fetchData<CostCode>(
        `/api/getCostCodeById/${costCodeId}`,
        "Failed to fetch cost code details:"
      );
      if (data) {
        setSelectCostCode(data);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchTagDetails = useCallback(async (tagId: string) => {
    setLoading(true);
    try {
      const data = await fetchData<Tag>(
        `/api/getTagById/${tagId}`,
        "Failed to fetch tag details:"
      );
      if (data) {
        setSelectTag(data);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  // Selection handlers
  const handleEquipmentSelect = useCallback(
    (equipmentId: string) => {
      fetchEquipmentDetails(equipmentId);
    },
    [fetchEquipmentDetails]
  );

  const handleJobsiteSelect = useCallback(
    (jobsiteId: string) => {
      fetchJobsiteDetails(jobsiteId);
    },
    [fetchJobsiteDetails]
  );

  const handleCostCodeSelect = useCallback(
    (costCodeId: string) => {
      fetchCostCodeDetails(costCodeId);
    },
    [fetchCostCodeDetails]
  );

  const handleTagSelect = useCallback(
    (tagId: string) => {
      fetchTagDetails(tagId);
    },
    [fetchTagDetails]
  );

  // Clear selections helper
  const clearAllSelections = useCallback(() => {
    setSelectEquipment(null);
    setSelectJobsite(null);
    setSelectCostCode(null);
    setSelectTag(null);
  }, []);

  // Fetch all summaries on hook initialization
  useEffect(() => {
    fetchEquipmentSummaries();
    fetchJobsiteSummaries();
    fetchCostCodeSummaries();
    fetchTagSummaries();
  }, [
    fetchEquipmentSummaries,
    fetchJobsiteSummaries,
    fetchCostCodeSummaries,
    fetchTagSummaries,
  ]);

  return {
    // Summary data
    equipmentSummaries,
    jobsiteSummaries,
    costCodeSummaries,
    tagSummaries,

    // Selected data
    selectEquipment,
    selectJobsite,
    selectCostCode,
    selectTag,

    // Loading state
    loading,

    // Setters for direct manipulation when needed
    setSelectEquipment,
    setSelectJobsite,
    setSelectCostCode,
    setSelectTag,

    // Fetch functions for refreshing data
    fetchEquipmentSummaries,
    fetchJobsiteSummaries,
    fetchCostCodeSummaries,
    fetchTagSummaries,

    // Selection handlers
    handleEquipmentSelect,
    handleJobsiteSelect,
    handleCostCodeSelect,
    handleTagSelect,

    // Utility functions
    clearAllSelections,
  };
};
