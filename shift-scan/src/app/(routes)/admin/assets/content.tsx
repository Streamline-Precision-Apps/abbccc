"use client";
import { Bases } from "@/components/(reusable)/bases";
import { Contents } from "@/components/(reusable)/contents";
import { Holds } from "@/components/(reusable)/holds";
import { Texts } from "@/components/(reusable)/texts";
import { TitleBoxes } from "@/components/(reusable)/titleBoxes";
import { Tab } from "@/components/(reusable)/tab";
import { Grids } from "@/components/(reusable)/grids";
import Spinner from "@/components/(animations)/spinner";
import Jobsite from "./(components)/jobsite";
import Equipment from "./(components)/equipment";
import Costcodes from "./(components)/costcodes";
import { useEffect, useState } from "react";
import { z } from "zod";
import { Equipment as EquipmentType, Jobsites, costCodes } from "@/lib/types";

// Zod schema for costCodes
const CostCodesSchema = z.object({
  id: z.number(),
  name: z.string(),
  description: z.string(),
  type: z.string().default("DEFAULT_TYPE"), // Set a default value for `type`
});

// Zod schema for Jobsites
const JobsitesSchema = z.object({
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
  costCode: z.array(CostCodesSchema).optional(), // Expecting an array
});

// Zod schema for Equipment
const EquipmentSchema = z.object({
  id: z.string(),
  qrId: z.string(),
  name: z.string(),
  description: z.string().optional(),
  equipmentTag: z.string().default("EQUIPMENT"), // Set a default value for equipmentTag
  lastInspection: z.date().nullable().optional(),
  lastRepair: z.date().nullable().optional(),
  status: z.string().optional(),
  make: z.string().nullable().optional(),
  model: z.string().nullable().optional(),
  year: z.string().nullable().optional(),
  licensePlate: z.string().nullable().optional(),
  registrationExpiration: z.date().nullable().optional(),
  mileage: z.number().nullable().optional(),
  isActive: z.boolean().optional(),
  image: z.string().nullable().optional(),
  inUse: z.boolean().optional(),
});

// Array schemas
const JobsitesArraySchema = z.array(JobsitesSchema);
const CostCodesArraySchema = z.array(CostCodesSchema);
const EquipmentArraySchema = z.array(EquipmentSchema);

export default function Content() {
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState(2);
  const [showBanner, setShowBanner] = useState<boolean>(false);
  const [banner, setBanner] = useState<string>("");
  const [jobsites, setJobsites] = useState<Jobsites[]>([]);
  const [equipment, setEquipment] = useState<EquipmentType[]>([]);
  const [costCodes, setCostCodes] = useState<costCodes[]>([]);

  const fetchAssets = async () => {
    setLoading(true);
    try {
      const [jobsitesRes, equipmentRes, costCodesRes] = await Promise.all([
        fetch("/api/getJobsites"),
        fetch("/api/getEquipment"),
        fetch("/api/getCostCodes"),
      ]);

      const [jobsitesData, equipmentData, costCodesData] = await Promise.all([
        jobsitesRes.json(),
        equipmentRes.json(),
        costCodesRes.json(),
      ]);

      // Validate fetched data with Zod schemas
      const validatedJobsites = JobsitesArraySchema.parse(jobsitesData).map(
        (jobsite) => ({
          ...jobsite,
          isActive: jobsite.isActive ?? false, // Ensure isActive is a boolean
          costCode: Array.isArray(jobsite.costCode) ? jobsite.costCode : [], // Ensure costCode is always an array
          status: jobsite.status ?? "unknown", // Ensure status is always a string
          comment: jobsite.comment ?? "", // Ensure comment is always a string
          description: jobsite.description ?? "", // Ensure description is always a string
          qrId: jobsite.qrId ?? "",
          streetName: jobsite.streetName ?? "",
          streetNumber: jobsite.streetNumber ?? "",
          city: jobsite.city ?? "",
          state: jobsite.state ?? "",
          country: jobsite.country ?? "",
          selectedJobsite: {
            id: jobsite.costCode?.map((costCode) => costCode.id)[0] ?? 0,
            name: jobsite.costCode?.map((costCode) => costCode.name)[0] ?? "",
            description:
              jobsite.costCode?.map((costCode) => costCode.description)[0] ??
              "",
          },
        })
      );
      const validatedEquipment = EquipmentArraySchema.parse(equipmentData);
      const validatedCostCodes = CostCodesArraySchema.parse(costCodesData);

      setJobsites(validatedJobsites);
      setEquipment(validatedEquipment);
      setCostCodes(validatedCostCodes);

      if (jobsitesData?.error || equipmentData?.error || costCodesData?.error) {
        console.log("An error occurred in one of the responses.");
      }
    } catch (error) {
      console.error("Failed to fetch profile data:", error);
      if (error instanceof z.ZodError) {
        console.error("Validation error:", error.errors);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAssets();
  }, []);

  if (loading) {
    return (
      <Grids className="grid-rows-7 gap-5">
        <Holds
          size={"full"}
          background={"white"}
          className="row-span-2 h-full"
        />
        <Holds size={"full"} background={"white"} className="row-span-5 h-full">
          <Contents width={"section"}>
            <Texts>Loading</Texts>
            <Spinner />
          </Contents>
        </Holds>
      </Grids>
    );
  }

  return (
    <Bases>
      <Holds>
        <TitleBoxes
          title="Assets"
          titleImg="/assets.svg"
          titleImgAlt="Assets"
          variant={"default"}
          size={"default"}
          type="noIcon"
        />
      </Holds>
      <Contents>
        {showBanner && (
          <Contents>
            <Texts>{banner} something</Texts>
          </Contents>
        )}
      </Contents>
      <Contents>
        <Tab
          onClick={() => setActiveTab(1)}
          tabLabel="Equipment"
          isTabActive={activeTab === 1}
        />
        <Tab
          onClick={() => setActiveTab(2)}
          tabLabel="Job Codes"
          isTabActive={activeTab === 2}
        />
        <Tab
          onClick={() => setActiveTab(3)}
          tabLabel="Cost Codes"
          isTabActive={activeTab === 3}
        />
      </Contents>
      <Holds>
        {activeTab === 1 && (
          <Equipment
            equipment={equipment}
            setBanner={setBanner}
            setShowBanner={setShowBanner}
          />
        )}
        {activeTab === 2 && (
          <Jobsite
            jobsites={jobsites}
            setBanner={setBanner}
            setShowBanner={setShowBanner}
          />
        )}
        {activeTab === 3 && (
          <Costcodes
            jobsites={jobsites}
            costCodes={costCodes}
            setBanner={setBanner}
            setShowBanner={setShowBanner}
          />
        )}
      </Holds>
    </Bases>
  );
}
