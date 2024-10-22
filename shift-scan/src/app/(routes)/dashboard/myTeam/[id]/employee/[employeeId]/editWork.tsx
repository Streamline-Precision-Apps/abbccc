"use client";

import { editTimeSheet } from "@/actions/timeSheetActions";
import { fetchEq, updateEq } from "@/actions/equipmentActions";
import { Images } from "@/components/(reusable)/images";
import { useTranslations } from "next-intl";
import React, { useState, useEffect } from "react";
import { Holds } from "@/components/(reusable)/holds";
import { Contents } from "@/components/(reusable)/contents";
import { Selects } from "@/components/(reusable)/selects";
import { Inputs } from "@/components/(reusable)/inputs";
import { Buttons } from "@/components/(reusable)/buttons";
import { Titles } from "@/components/(reusable)/titles";
import { Texts } from "@/components/(reusable)/texts";
import { Labels } from "@/components/(reusable)/labels";
import Spinner from "@/components/(animations)/spinner";
import { CostCodes, Jobsites, EquipmentLog, Equipment } from "@/lib/types";
import { z } from "zod";

// Zod schema for TimeSheet type
const TimeSheetSchema = z.object({
  endDate: z.any(),
  startDate: z.any(),
  submitDate: z.date().optional(),
  id: z.string().optional(),
  userId: z.string().optional(),
  date: z.date().optional(),
  jobsiteId: z.string().optional(),
  costcode: z.string().optional(),
  nu: z.string().optional(),
  Fp: z.string().optional(),
  vehicleId: z.number().nullable().optional(),
  startTime: z.union([z.date(), z.string()]).optional(),
  endTime: z.union([z.date(), z.string(), z.null()]).optional(),
  duration: z.number().nullable().optional(),
  startingMileage: z.number().nullable().optional(),
  endingMileage: z.number().nullable().optional(),
  leftIdaho: z.boolean().nullable().optional(),
  equipmentHauled: z.string().nullable().optional(),
  materialsHauled: z.string().nullable().optional(),
  hauledLoadsQuantity: z.number().nullable().optional(),
  refuelingGallons: z.number().nullable().optional(),
  timeSheetComments: z.string().nullable().optional(),
  status: z.string().optional(),
});

// Zod schema for EditWorkProps
const EditWorkPropsSchema = z.object({
  edit: z.boolean(),
  costcodesData: z.array(
    z.object({
      id: z.string(),
      name: z.string(),
      description: z.string(),
    })
  ),
  jobsitesData: z.array(
    z.object({
      id: z.string(),
      name: z.string(),
      qrId: z.string(),
    })
  ),
  timesheetData: z.array(TimeSheetSchema),
  equipmentData: z.array(
    z.object({
      id: z.number(),
      employeeId: z.string(),
      duration: z.union([z.string(), z.number()]).nullable(),
      Equipment: z.object({
        id: z.string(),
        qrId: z.string(),
        name: z.string(),
      }),
    })
  ),
  handleFormSubmit: z.function().args(z.string(), z.string(), z.string().optional()).returns(z.void()),
  setEdit: z.function().args(z.boolean()).returns(z.void()),
  employeeId: z.string(),
  date: z.string(),
  equipment: z.array(
    z.object({
      id: z.string(),
      name: z.string(),
      qrId: z.string(),
    })
  ),
});

type EditWorkProps = z.infer<typeof EditWorkPropsSchema>;

export type TimeSheet = z.infer<typeof TimeSheetSchema>;

const EditWork = ({
  timesheetData,
  jobsitesData,
  costcodesData,
  edit,
  equipment,
  handleFormSubmit,
  setEdit,
  employeeId,
  date,
}: EditWorkProps) => {
  // Validate props using Zod
  try {
    EditWorkPropsSchema.parse({
      timesheetData,
      jobsitesData,
      costcodesData,
      edit,
      equipment,
      handleFormSubmit,
      setEdit,
      employeeId,
      date,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error("Validation error in EditWork props:", error.errors);
    }
  }

  const [timesheets, setTimesheets] = useState<TimeSheet[]>([]);
  const [equipmentLogs, setEquipmentLogs] = useState<EquipmentLog[]>([]);
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const t = useTranslations("MyTeam");

  useEffect(() => {
    if (!timesheetData || timesheetData.length === 0) {
      setMessage("No Timesheets Found");
    } else {
      setMessage(null);
      const initializedTimesheets = timesheetData.map((timesheet) => {
        const startDate = timesheet.startTime
          ? new Date(timesheet.startTime).toISOString().split("T")[0]
          : "";
        const startTime = timesheet.startTime
          ? new Date(timesheet.startTime)
              .toISOString()
              .split("T")[1]
              .split(":")
              .slice(0, 2)
              .join(":")
          : "";
        const endDate = timesheet.endTime
          ? new Date(timesheet.endTime).toISOString().split("T")[0]
          : "";
        const endTime = timesheet.endTime
          ? new Date(timesheet.endTime)
              .toISOString()
              .split("T")[1]
              .split(":")
              .slice(0, 2)
              .join(":")
          : "";

        const durationBackup =
          timesheet.startTime && timesheet.endTime
            ? (new Date(timesheet.endTime).getTime() -
                new Date(timesheet.startTime).getTime()) /
              (1000 * 60 * 60)
            : 0;

        return {
          ...timesheet,
          startDate,
          startTime,
          endDate,
          endTime,
          duration: timesheet.duration ?? durationBackup,
        };
      });
      setTimesheets(initializedTimesheets);
    }
  }, [timesheetData]);

  useEffect(() => {
    const fetchEquipmentLogs = async () => {
      try {
        setLoading(true);
        const data = await fetch(
          `/api/getEmployeeEquipmentByDate?date=${date}`
        );
        const res = await data.json();

        // Validate fetched data using Zod
        try {
          EditWorkPropsSchema.shape.equipmentData.parse(res);
        } catch (error) {
          if (error instanceof z.ZodError) {
            console.error("Validation error in equipment data:", error.errors);
          }
        }

        setEquipmentLogs(res);
      } catch {
      } finally {
        setLoading(false);
      }
    };
    fetchEquipmentLogs();
  }, [date]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    id: string,
    field: keyof TimeSheet
  ) => {
    const value = e.target.value;
    setTimesheets((prevData) =>
      prevData.map((timesheet) =>
        timesheet.id === id ? { ...timesheet, [field]: value } : timesheet
      )
    );
  };

  const handleInputChangeDate = (
    e: React.ChangeEvent<HTMLInputElement>,
    id: string,
    field: "startDate" | "startTime" | "endDate" | "endTime"
  ) => {
    const value = e.target.value;
    setTimesheets((prevTimesheets) =>
      prevTimesheets.map((timesheet) =>
        timesheet.id === id ? { ...timesheet, [field]: value } : timesheet
      )
    );
  };

  const handleCodeChange = (
    e: React.ChangeEvent<HTMLSelectElement>,
    id: string,
    field: keyof TimeSheet
  ) => {
    const value = e.target.value;
    setTimesheets((prevTimesheets) =>
      prevTimesheets.map((timesheet) =>
        timesheet.id === id ? { ...timesheet, [field]: value } : timesheet
      )
    );
  };

  const handleSaveChanges = async () => {
    try {
      for (const timesheet of timesheets) {
        const formData = new FormData();
        formData.append("id", timesheet.id ?? "");
        formData.append(
          "submitDate",
          timesheet.submitDate?.toISOString() ?? ""
        );
        formData.append("employeeId", employeeId);
        formData.append("costcode", timesheet.costcode ?? "");
        formData.append(
          "startTime",
          `${timesheet.startDate}T${timesheet.startTime}`
        );
        formData.append("endTime", `${timesheet.endDate}T${timesheet.endTime}`);
        formData.append("jobsiteId", timesheet.jobsiteId ?? "");
        await editTimeSheet(formData);
      }

      handleFormSubmit(employeeId, date, "Changes saved successfully.");
      setEdit(false);
    } catch (error) {
      console.error("Failed to save changes", error);
      setMessage("Failed to save changes.");
      setEdit(false);
      handleFormSubmit(employeeId, date, "Changes not saved.");
    }
  };

  const editHandler = () => {
    setEdit(!edit);
  };

  return loading ? (
    <Contents width={"section"}>
      <Holds>
        <Holds className="my-5">
          <Titles>{t("Timesheets")}</Titles>
          <br />
          <Spinner />
        </Holds>
      </Holds>
    </Contents>
  ) : (
    <Contents width={"section"} className="my-5">
      <Holds>
        {/* Render timesheets and equipment logs */}
      </Holds>
    </Contents>
  );
};

export default EditWork;
