"use client";

import { useEffect, useState } from "react";
import {
  useDBJobsite,
  useDBCostcode,
  useDBEquipment,
} from "@/app/context/dbCodeContext";
import {
  useRecentDBJobsite,
  useRecentDBCostcode,
  useRecentDBEquipment,
} from "@/app/context/dbRecentCodesContext";

import { useDBCompleteEquipmentList } from "../context/dbCompleteEquipmentList";

const useFetchAllData = () => {
  const [, setLoading] = useState(true);

  const { setJobsiteResults } = useDBJobsite();
  const { setRecentlyUsedJobCodes } = useRecentDBJobsite();
  const { setCostcodeResults } = useDBCostcode();
  const { setRecentlyUsedCostCodes } = useRecentDBCostcode();
  const { setEquipmentResults } = useDBEquipment();
  const { setRecentlyUsedEquipment } = useRecentDBEquipment();
  const { setEquipmentListResults } = useDBCompleteEquipmentList();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch all data concurrently
        const [
          jobsiteResponse,
          recentJobsiteResponse,
          costcodeResponse,
          recentCostcodeResponse,
          equipmentResponse,
          recentEquipmentResponse,
          equipmentListResponse,
        ] = await Promise.all([
          fetch("/api/getJobsites"),
          fetch("/api/getRecentJobsites"),
          fetch("/api/getCostCodes"),
          fetch("/api/getRecentCostCodes"),
          fetch("/api/getEquipment"),
          fetch("/api/getRecentEquipment"),
          fetch("/api/getEquipmentList"),
        ]);

        // Parse the responses concurrently
        const [
          jobSites,
          recentJobSites,
          costCodes,
          recentCostCodes,
          equipment,
          recentEquipment,
          recentEquipmentList,
        ] = await Promise.all([
          jobsiteResponse.json(),
          recentJobsiteResponse.json(),
          costcodeResponse.json(),
          recentCostcodeResponse.json(),
          equipmentResponse.json(),
          recentEquipmentResponse.json(),
          equipmentListResponse.json(),
        ]);

        // Update state with the fetched data
        setJobsiteResults(jobSites);
        setRecentlyUsedJobCodes(recentJobSites);
        setCostcodeResults(costCodes);
        setRecentlyUsedCostCodes(recentCostCodes);
        setEquipmentResults(equipment);
        setRecentlyUsedEquipment(recentEquipment);
        setEquipmentListResults(recentEquipmentList);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [
    setJobsiteResults,
    setRecentlyUsedJobCodes,
    setCostcodeResults,
    setRecentlyUsedCostCodes,
    setEquipmentResults,
    setRecentlyUsedEquipment,
    setEquipmentListResults,
  ]);
};

export default useFetchAllData;
