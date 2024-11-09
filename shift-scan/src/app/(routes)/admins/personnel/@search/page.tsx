"use client";
import { Contents } from "@/components/(reusable)/contents";
import { Grids } from "@/components/(reusable)/grids";
import { Holds } from "@/components/(reusable)/holds";
import { Tab } from "@/components/(reusable)/tab";
import { Texts } from "@/components/(reusable)/texts";

import { useEffect, useState } from "react";
import { Personnel } from "./_components/Personnel";
import { Permission, SearchUser } from "@/lib/types";
import { z } from "zod";
import { Selects } from "@/components/(reusable)/selects";
import { Options } from "@/components/(reusable)/options";

export default function Search() {
  const [activeTab, setActiveTab] = useState(1);
  const [employees, setEmployees] = useState<SearchUser[]>([]);
  const [filter, setFilter] = useState<string>("all");

  const employeesSchema = z.array(
    z.object({
      id: z.string(),
      firstName: z.string(),
      lastName: z.string(),
      username: z.string(),
      permission: z.nativeEnum(Permission),
      DOB: z.string(), // Updated this line to parse DOB as a Date
      truckView: z.boolean(),
      mechanicView: z.boolean(),
      laborView: z.boolean(),
      tascoView: z.boolean(),
      image: z.string(),
      terminationDate: z.preprocess((arg) => {
        if (typeof arg === "string" && arg.trim() !== "") {
          const parsedDate = new Date(arg);
          if (!isNaN(parsedDate.getTime())) {
            return parsedDate;
          }
        } else if (arg instanceof Date && !isNaN(arg.getTime())) {
          return arg;
        }
        // Return null for invalid or missing dates
        return null;
      }, z.union([z.date(), z.null()])),
    })
  );
  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const employeesRes = await fetch(
          "/api/getAllEmployees?filter=" + filter
        );
        const employeesData = await employeesRes.json();
        const validatedEmployees = employeesSchema.parse(employeesData);
        setEmployees(validatedEmployees);
      } catch (error) {
        if (error instanceof z.ZodError) {
          console.error("Validation Error:", error.errors);
        } else {
          console.error("Failed to fetch employees data:", error);
        }
      }
    };

    fetchEmployees();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Holds className="h-full ">
      <Grids rows={"10"}>
        <Holds position={"row"} className="row-span-1 h-full gap-2">
          <Tab
            onClick={() => setActiveTab(1)}
            tabLabel={"Personnel"}
            isTabActive={activeTab === 1}
          />
          <Tab
            onClick={() => setActiveTab(2)}
            tabLabel={"TimeSheets"}
            isTabActive={activeTab === 2}
          />
        </Holds>
        <Holds className="bg-whiterow-span-1 h-full">
          <Selects
            defaultValue={"all"}
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="all">All</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </Selects>
        </Holds>
        <Holds
          background={"white"}
          className="rounded-t-none row-span-8 h-full"
        >
          <Contents width={"section"} className=" pt-3 pb-5">
            {activeTab === 1 && <Personnel employees={employees} />}
            {activeTab === 2 && <Texts>hi</Texts>}
          </Contents>
        </Holds>
      </Grids>
    </Holds>
  );
}
