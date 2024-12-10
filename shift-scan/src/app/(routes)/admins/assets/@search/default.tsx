"use client";
import { Contents } from "@/components/(reusable)/contents";
import { Grids } from "@/components/(reusable)/grids";
import { Holds } from "@/components/(reusable)/holds";
import { Tab } from "@/components/(reusable)/tab";

import { useEffect, useState } from "react";
import { Equipment, Jobsites, costCodes, CCTags } from "@/lib/types";
import { z } from "zod";
import { EquipmentComponent } from "./_components/EquipmentComponent";
import { JobsiteComponent } from "./_components/JobsiteComponent";
import { CostCodeComponent } from "./_components/CostCodeComponent";
import { Buttons } from "@/components/(reusable)/buttons";
import { TagsComponent } from "./_components/TagsComponent";

export default function Search() {
  const [activeTab, setActiveTab] = useState(1);
  const [equipments, setEquipments] = useState<Equipment[]>([]);
  const [jobsites, setJobsites] = useState<Jobsites[]>([]);
  const [costCodes, setCostCodes] = useState<costCodes[]>([]);
  const [tags, setTags] = useState<CCTags[]>([]);
  const [activeTab2, setActiveTab2] = useState(1);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    const fetchTags = async () => {
      try {
        const tagsRes = await fetch("/api/getAllTags");
        const tagsData = await tagsRes.json();
        setTags(tagsData);
      } catch (error) {
        console.error("Failed to fetch tags data:", error);
      }
    };
    fetchTags();
  }, [filter]);

  useEffect(() => {
    const fetchEquipments = async () => {
      try {
        const equipmentsRes = await fetch(
          "/api/getAllEquipment?filter=" + filter // Corrected path
        );

        if (!equipmentsRes.ok) {
          throw new Error(`HTTP error! status: ${equipmentsRes.status}`);
        }

        const contentType = equipmentsRes.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
          const equipmentsData = await equipmentsRes.json();
          setEquipments(equipmentsData);
        } else {
          const html = await equipmentsRes.text();
          console.error(
            "Received HTML instead of JSON:",
            html.substring(0, 100)
          );
        }
      } catch (error) {
        console.error("Failed to fetch equipments data:", error);
      }
    };

    fetchEquipments();
  }, [filter]);

  useEffect(() => {
    const fetchJobsites = async () => {
      try {
        const jobsitesRes = await fetch("/api/getAllJobsites?filter=" + filter);
        const jobsitesData = await jobsitesRes.json();
        // const validatedJobsites = jobsitesSchema.parse(jobsitesData);
        setJobsites(jobsitesData);
      } catch (error) {
        if (error instanceof z.ZodError) {
          console.error("Validation Error:", error.errors);
        } else {
          console.error("Failed to fetch jobsites data:", error);
        }
      }
    };

    fetchJobsites();
  }, [filter]);

  useEffect(() => {
    const fetchCostCodes = async () => {
      try {
        const costCodesRes = await fetch("/api/getAllCostCodes");
        const costCodesData = await costCodesRes.json();
        // const validatedCostCodes = costCodesSchema.parse(costCodesData);
        setCostCodes(costCodesData);
      } catch (error) {
        if (error instanceof z.ZodError) {
          console.error("Validation Error:", error.errors);
        } else {
          console.error("Failed to fetch costCodes data:", error);
        }
      }
    };

    fetchCostCodes();
  }, [filter]);

  return (
    <Holds className="h-full ">
      <Grids rows={"10"}>
        <Holds position={"row"} className="row-span-1 h-full gap-2">
          <Tab onClick={() => setActiveTab(1)} isActive={activeTab === 1}>
            Equipment
          </Tab>
          <Tab onClick={() => setActiveTab(2)} isActive={activeTab === 2}>
            Job Sites
          </Tab>
          <Tab onClick={() => setActiveTab(3)} isActive={activeTab === 3}>
            Cost Codes
          </Tab>
        </Holds>

        <Holds
          background={"white"}
          className="rounded-t-none row-span-9 h-full"
        >
          <Contents width={"section"} className=" pt-3 pb-5">
            {activeTab === 1 && (
              <EquipmentComponent
                equipments={equipments}
                setFilter={setFilter}
              />
            )}
            {activeTab === 2 && (
              <JobsiteComponent jobsites={jobsites} setFilter={setFilter} />
            )}
            {activeTab === 3 && (
              <Holds className="h-full w-full">
                <Grids rows="10" gap="5" className="h-full">
                  <Holds
                    background={"white"}
                    position={"row"}
                    className="row-span-1 h-full border-[3px] border-black"
                  >
                    <Buttons
                      onClick={() => setActiveTab2(1)}
                      className={`px-4 py-4 min-w-[100px] rounded-[10px] h-full flex items-center justify-center font-bold  w-full shadow-none ${
                        activeTab2 === 1
                          ? "bg-app-blue border-none "
                          : "bg-white border-none"
                      }`}
                    >
                      CostCodes
                    </Buttons>
                    <Buttons
                      onClick={() => setActiveTab2(2)}
                      className={`px-4 py-4 min-w-[100px] rounded-[10px] h-full flex items-center justify-center  font-bold w-full shadow-none ${
                        activeTab2 === 2
                          ? "bg-app-blue border-none"
                          : "bg-white border-none"
                      }`}
                    >
                      Tags
                    </Buttons>
                  </Holds>

                  {activeTab2 === 1 && (
                    <CostCodeComponent costCodes={costCodes} tags={tags} />
                  )}
                  {activeTab2 === 2 && <TagsComponent tags={tags} />}
                </Grids>
              </Holds>
            )}
          </Contents>
        </Holds>
      </Grids>
    </Holds>
  );
}
