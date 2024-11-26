"use client";
import { Contents } from "@/components/(reusable)/contents";
import { Grids } from "@/components/(reusable)/grids";
import { Holds } from "@/components/(reusable)/holds";
import { Tab } from "@/components/(reusable)/tab";

import { useEffect, useState } from "react";
import { Timesheets } from "./_components/Timesheets";
import { SearchCrew, SearchUser } from "@/lib/types";
import { z } from "zod";
import { Personnel } from "./_components/Personnel";
import { Crews } from "./_components/Crews";

export default function Search() {
  const [activeTab, setActiveTab] = useState(1);
  const [employees, setEmployees] = useState<SearchUser[]>([]);
  const [filter, setFilter] = useState("all");
  const [crew, setCrew] = useState<SearchCrew[]>([]);

  // const employeesSchema = z.array(
  //   z.object({
  //     id: z.string(),
  //     firstName: z.string(),
  //     lastName: z.string(),
  //     username: z.string(),
  //     permission: z.nativeEnum(Permission),
  //     DOB: z.string(), // Updated this line to parse DOB as a Date
  //     truckView: z.boolean(),
  //     mechanicView: z.boolean(),
  //     laborView: z.boolean(),
  //     tascoView: z.boolean(),
  //     image: z.string(),
  //     terminationDate: z.preprocess((arg) => {
  //       if (typeof arg === "string" && arg.trim() !== "") {
  //         const parsedDate = new Date(arg);
  //         if (!isNaN(parsedDate.getTime())) {
  //           return parsedDate;
  //         }
  //       } else if (arg instanceof Date && !isNaN(arg.getTime())) {
  //         return arg;
  //       }
  //       // Return null for invalid or missing dates
  //       return null;
  //     }, z.union([z.date(), z.null()])),
  //   })
  // );
  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const employeesRes = await fetch(
          "/api/getAllEmployees?filter=" + filter
        );
        const employeesData = await employeesRes.json();
        // const validatedEmployees = employeesSchema.parse(employeesData);
        setEmployees(employeesData);
      } catch (error) {
        if (error instanceof z.ZodError) {
          console.error("Validation Error:", error.errors);
        } else {
          console.error("Failed to fetch employees data:", error);
        }
      }
    };

    fetchEmployees();
  }, [filter]);

  useEffect(() => {
    const fetchCrews = async () => {
      try {
        const crewRes = await fetch("/api/getAllCrews");
        const crewData = await crewRes.json();
        // const validatedEmployees = employeesSchema.parse(employeesData);
        setCrew(crewData);
      } catch (error) {
        if (error instanceof z.ZodError) {
          console.error("Validation Error:", error.errors);
        } else {
          console.error("Failed to fetch employees data:", error);
        }
      }
    };

    fetchCrews();
  }, []);

  return (
    <Holds className="h-full ">
      <Grids rows={"10"}>
        <Holds position={"row"} className="row-span-1 h-full gap-2">
          <Tab onClick={() => setActiveTab(1)} isActive={activeTab === 1}>
            Personnel
          </Tab>
          <Tab onClick={() => setActiveTab(2)} isActive={activeTab === 2}>
            Time Sheets
          </Tab>
          <Tab onClick={() => setActiveTab(3)} isActive={activeTab === 3}>
            Crews
          </Tab>
        </Holds>

        <Holds
          background={"white"}
          className="rounded-t-none row-span-9 h-full"
        >
          <Contents width={"section"} className=" pt-3 pb-5">
            {activeTab === 1 && (
              <Personnel employees={employees} setFilter={setFilter} />
            )}
            {activeTab === 2 && (
              <Timesheets employees={employees} setFilter={setFilter} />
            )}
            {activeTab === 3 && <Crews crew={crew} />}
          </Contents>
        </Holds>
      </Grids>
    </Holds>
  );
}
