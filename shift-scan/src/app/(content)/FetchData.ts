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

const JobsitesRecentSchema = z
  .array(
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
  )
  .nullable();

// CostCodes schema
const CostCodesSchema = z.array(
  z.object({
    id: z.number(),
    name: z.string(),
    description: z.string(),
    type: z.string().default("DEFAULT_TYPE"),
  })
);

const CostCodesRecentSchema = z
  .array(
    z.object({
      id: z.number(),
      name: z.string(),
      description: z.string(),
      type: z.string().default("DEFAULT_TYPE"),
    })
  )
  .nullable();

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

        // Validate each dataset separately with schema-specific error handling
        try {
          const validatedJobSites = JobsitesSchema.parse(jobSites);
          setJobsiteResults(
            validatedJobSites.map((jobSite) => ({
              ...jobSite,
              toLowerCase: () => jobSite.name.toLowerCase(),
            }))
          );
        } catch (error) {
          if (error instanceof z.ZodError) {
            console.error("Validation error in JobSites schema:", error.errors);
          }
        }

        try {
          const validatedRecentJobSites =
            JobsitesRecentSchema.parse(recentJobSites);
          if (validatedRecentJobSites === null) {
            setRecentlyUsedJobCodes([]);
          } else {
            setRecentlyUsedJobCodes(
              validatedRecentJobSites.map((jobSite) => ({
                ...jobSite,
                toLowerCase: () => jobSite.name.toLowerCase(),
              }))
            );
          }
        } catch (error) {
          if (error instanceof z.ZodError) {
            console.error(
              "Validation error in Recent JobSites schema:",
              error.errors
            );
          }
        }

        try {
          const validatedCostCodes = CostCodesSchema.parse(costCodes);
          setCostcodeResults(validatedCostCodes);
        } catch (error) {
          if (error instanceof z.ZodError) {
            console.error(
              "Validation error in CostCodes schema:",
              error.errors
            );
          }
        }

        try {
          const validatedRecentCostCodes =
            CostCodesRecentSchema.parse(recentCostCodes);
          if (validatedRecentCostCodes === null) {
            setRecentlyUsedCostCodes([]);
          } else {
            setRecentlyUsedCostCodes(validatedRecentCostCodes);
          }
        } catch (error) {
          if (error instanceof z.ZodError) {
            console.error(
              "Validation error in Recent CostCodes schema:",
              error.errors
            );
          }
        }

        try {
          const validatedEquipment = EquipmentSchema.parse(equipment);
          setEquipmentResults(validatedEquipment as EquipmentCodes[]);
        } catch (error) {
          if (error instanceof z.ZodError) {
            console.error(
              "Validation error in Equipment schema:",
              error.errors
            );
          }
        }

        try {
          const validatedRecentEquipment =
            EquipmentSchema.parse(recentEquipment);
          setRecentlyUsedEquipment(
            validatedRecentEquipment as EquipmentCodes[]
          );
        } catch (error) {
          if (error instanceof z.ZodError) {
            console.error(
              "Validation error in Recent Equipment schema:",
              error.errors
            );
          }
        }

        try {
          const validatedEquipmentList =
            EquipmentSchema.parse(recentEquipmentList);
          setEquipmentListResults(validatedEquipmentList);
        } catch (error) {
          if (error instanceof z.ZodError) {
            console.error(
              "Validation error in Equipment List schema:",
              error.errors
            );
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
