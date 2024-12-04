"use client";
import { Contents } from "@/components/(reusable)/contents";
import { Grids } from "@/components/(reusable)/grids";
import { Holds } from "@/components/(reusable)/holds";
import { Tab } from "@/components/(reusable)/tab";

import { useEffect, useState } from "react";
import { Timesheets } from "./_components/Timesheets";
import { Equipment, Jobsites, costCodes } from "@/lib/types";
import { z } from "zod";
import { Personnel } from "./_components/Personnel";
import { Crews } from "./_components/Crews";
import { Texts } from "@/components/(reusable)/texts";

export default function Search() {
  const [activeTab, setActiveTab] = useState(1);
  const [equipments, setEquipments] = useState<Equipment[]>([]);
  const [Jobsites, setJobsites] = useState<Jobsites[]>([]);
  const [costCodes, setCostCodes] = useState<costCodes[]>([]);
  const [filter, setFilter] = useState("all");

  // useEffect(() => {
  //   const fetchEmployees = async () => {
  //     try {
  //       const employeesRes = await fetch(
  //         "/api/getAllEmployees?filter=" + filter
  //       );
  //       const employeesData = await employeesRes.json();
  //       // const validatedEmployees = employeesSchema.parse(employeesData);
  //       setEmployees(employeesData);
  //     } catch (error) {
  //       if (error instanceof z.ZodError) {
  //         console.error("Validation Error:", error.errors);
  //       } else {
  //         console.error("Failed to fetch employees data:", error);
  //       }
  //     }
  //   };

  useEffect(() => {
    const fetchEquipments = async () => {
      try {
        const equipmentsRes = await fetch(
          "/api/getAllEqipment?filter=" + filter
        );
        const equipmentsData = await equipmentsRes.json();
        // const validatedEquipments = equipmentsSchema.parse(equipmentsData);
        setEquipments(equipmentsData);
      } catch (error) {
        if (error instanceof z.ZodError) {
          console.error("Validation Error:", error.errors);
        } else {
          console.error("Failed to fetch equipments data:", error);
        }
      }
    };

    fetchEquipments();
  }, [filter]);

  useEffect(() => {
    const fetchJobsites = async () => {
      try {
        const jobsitesRes = await fetch(
          "/api/getAllJobsites?filter=" + filter
        );
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
        const costCodesRes = await fetch(
          "/api/getAllCostCodes"
        );
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
              // <Personnel employees={employees} setFilter={setFilter} />
              <Texts>Equipment</Texts>
            )}
            {activeTab === 2 && (
              // <Timesheets employees={employees} setFilter={setFilter} />
              <Texts>Job Sites</Texts>
            )}
            {activeTab === 3 && (
              // <Crews crew={crew} />
              <Texts>Cost Codes</Texts>
              )}
          </Contents>
        </Holds>
      </Grids>
    </Holds>
  );
}
