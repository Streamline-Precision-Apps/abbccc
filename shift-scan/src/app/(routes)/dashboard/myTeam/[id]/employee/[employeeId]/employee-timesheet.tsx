"use client";
import { useEffect, useRef, useState } from "react";
import { fetchTimesheets } from "@/actions/timeSheetActions";
import EditWork from "./editWork";
import { Holds } from "@/components/(reusable)/holds";
import { Titles } from "@/components/(reusable)/titles";
import { fetchEq } from "@/actions/equipmentActions";
import { Contents } from "@/components/(reusable)/contents";
import { Inputs } from "@/components/(reusable)/inputs";
import { useTranslations } from "next-intl";
import { z } from "zod";

// Zod schema for props
const PropsSchema = z.object({
  employeeId: z.string(),
});

// Zod schema for timesheet data
const TimeSheetSchema = z.array(
  z.object({
    id: z.string().optional(),
    startTime: z.union([z.string(), z.date()]).optional(),
    endTime: z.union([z.string(), z.date(), z.null()]).optional(),
    duration: z.number().nullable().optional(),
    submitDate: z.date().optional(),
    jobsiteId: z.string().optional(),
    costcode: z.string().optional(),
  })
);

// Zod schema for equipment data
const EquipmentSchema = z.array(
  z.object({
    id: z.string(),
    name: z.string(),
    qrId: z.string(),
  })
);

type Props = z.infer<typeof PropsSchema>;

export const EmployeeTimeSheets = ({ employeeId }: Props) => {
  // Validate props using Zod
  try {
    PropsSchema.parse({ employeeId });
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error("Validation error in props:", error.errors);
    }
  }

  const t = useTranslations("MyTeam");
  const [timesheets, setTimesheets] = useState<any[]>([]);
  const [filteredEquipmentData, setFilteredEquipmentData] = useState<any[]>([]);
  const [message, setMessage] = useState("");
  const [edit, setEdit] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const [date, setDate] = useState("");
  const [costcodesData, setCostcodesData] = useState([]);
  const [jobsitesData, setJobsitesData] = useState([]);
  const [equipmentData, setEquipmentData] = useState([]);
  const [equipment, setEquipment] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [costcodes, jobsites, equipment] = await Promise.all([
          fetch("/api/getCostCodes").then((res) => res.json()),
          fetch("/api/getJobsites").then((res) => res.json()),
          fetch("/api/getAllEquipment").then((res) => res.json()),
        ]);

        // Validate fetched data using Zod
        try {
          EquipmentSchema.parse(equipment);
          TimeSheetSchema.parse(costcodes); // Reusing timesheet schema for cost codes for simplicity
          TimeSheetSchema.parse(jobsites); // Reusing timesheet schema for jobsites for simplicity
        } catch (error) {
          if (error instanceof z.ZodError) {
            console.error("Validation error in fetched data:", error.errors);
          }
        }

        setCostcodesData(costcodes);
        setJobsitesData(jobsites);
        setEquipment(equipment);
      } catch (error) {
        console.error("Failed to fetch initial data:", error);
      }
    };
    fetchData();
  }, []);

  const handleFormSubmitWrapper = async (date: string, message?: string) => {
    try {
      const results = await fetchTimesheets(employeeId, date);
      const eqResults = await fetchEq(employeeId, date);

      // Validate fetched timesheet data
      try {
        TimeSheetSchema.parse(results);
        EquipmentSchema.parse(eqResults);
      } catch (error) {
        if (error instanceof z.ZodError) {
          console.error("Validation error in timesheet/equipment data:", error.errors);
        }
      }

      setTimesheets(results);
      setFilteredEquipmentData(eqResults);
      setMessage(message || "");
    } catch (error) {
      console.error("Error fetching timesheet/equipment data:", error);
    }
  };

  const handleFormChange = () => {
    formRef.current?.requestSubmit();
  };

  const handleFormSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(formRef.current!);
    const date = formData.get("date") as string;
    setDate(date);
    handleFormSubmitWrapper(date);
  };

  const handleFormSubmitFromEditWork = async (
    employeeId: string,
    date: string,
    message?: string
  ) => {
    handleFormSubmitWrapper(date, message);
  };

  useEffect(() => {
    setMessage("");
  }, [edit]);

  return (
    <>
      <Holds background={"darkBlue"}>
        <Contents width={"section"}>
          <Holds>
            <Titles text={"white"} position={"left"}>
              {t("SelectDate")}
            </Titles>
            <form
              ref={formRef}
              onChange={handleFormChange}
              onSubmit={handleFormSubmit}
            >
              <Inputs
                type="date"
                name="date"
                id="date"
                className="flex justify-center m-auto text-black text-2xl bg-white p-2 rounded border-2 border-black rounded-2xl"
              />
              <Inputs type="hidden" name="id" value={employeeId} />
            </form>
            <Titles>{message}</Titles>
          </Holds>

          {date && (
            <Holds size={"full"} background={"white"} className="my-5">
              <EditWork
                timesheetData={timesheets}
                edit={edit}
                costcodesData={costcodesData}
                jobsitesData={jobsitesData}
                equipmentData={filteredEquipmentData}
                handleFormSubmit={handleFormSubmitFromEditWork}
                setEdit={setEdit}
                employeeId={employeeId}
                date={date}
                equipment={equipment}
              />
            </Holds>
          )}
        </Contents>
      </Holds>
    </>
  );
};
