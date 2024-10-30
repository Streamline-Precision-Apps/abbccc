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
import { z } from "zod";
import { EquipmentCodes } from "@/lib/types";

// Custom date parsing schema for string date formats
const parseDate = z
  .string()
  .or(z.date())
  .transform((value) => (typeof value === "string" ? new Date(value) : value));

// Jobsites schema
const JobsitesSchema = z.array(
  z.object({
    id: z.string(),
    qrId: z.string(),
    isActive: z.boolean().optional(),
    status: z.string().optional(),
    name: z.string(),
    streetNumber: z.string().nullable().optional(),
    streetName: z.string().optional(),
    city: z.string().optional(),
    state: z.string().nullable().optional(),
    country: z.string().optional(),
    description: z.string().nullable().optional(),
    comment: z.string().nullable().optional(),
  })
);

// CostCodes schema
const CostCodesSchema = z.array(
  z.object({
    id: z.number(),
    name: z.string(),
    description: z.string(),
    type: z.string().default("DEFAULT_TYPE"),
  })
);

// Equipment schema
const EquipmentSchema = z.array(
  z.object({
    id: z.string(),
    qrId: z.string(),
    name: z.string(),
    description: z.string().optional(),
    equipmentTag: z.string().default("EQUIPMENT"),
    lastInspection: parseDate.nullable().optional(),
    lastRepair: parseDate.nullable().optional(),
    status: z.string().optional(),
    make: z.string().nullable().optional(),
    model: z.string().nullable().optional(),
    year: z.string().nullable().optional(),
    licensePlate: z.string().nullable().optional(),
    registrationExpiration: parseDate.nullable().optional(),
    mileage: z.number().nullable().optional(),
    isActive: z.boolean().optional(),
    image: z.string().nullable().optional(),
    inUse: z.boolean().optional(),
  })
);

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

        // Validate fetched data with Zod
        try {
          const validatedJobSites = JobsitesSchema.parse(jobSites);
          const validatedRecentJobSites = JobsitesSchema.parse(recentJobSites);
          const validatedCostCodes = CostCodesSchema.parse(costCodes);
          const validatedRecentCostCodes =
            CostCodesSchema.parse(recentCostCodes);
          const validatedEquipment = EquipmentSchema.parse(equipment);
          const validatedRecentEquipment =
            EquipmentSchema.parse(recentEquipment);
          const validatedEquipmentList =
            EquipmentSchema.parse(recentEquipmentList);

          // Update state with the validated data
          setJobsiteResults(
            validatedJobSites.map((jobSite) => ({
              ...jobSite,
              toLowerCase: () => jobSite.name.toLowerCase(),
            }))
          );
          setRecentlyUsedJobCodes(
            validatedRecentJobSites.map((jobSite) => ({
              ...jobSite,
              toLowerCase: () => jobSite.name.toLowerCase(),
            }))
          );
          setCostcodeResults(validatedCostCodes);
          setRecentlyUsedCostCodes(validatedRecentCostCodes);
          setEquipmentResults(validatedEquipment as EquipmentCodes[]);
          setRecentlyUsedEquipment(
            validatedRecentEquipment as EquipmentCodes[]
          );
          setEquipmentListResults(validatedEquipmentList);
        } catch (error) {
          if (error instanceof z.ZodError) {
            console.error("Validation error:", error.errors);
          }
        }
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
