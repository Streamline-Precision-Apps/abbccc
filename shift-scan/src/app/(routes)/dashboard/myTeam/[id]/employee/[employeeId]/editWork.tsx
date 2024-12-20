"use client";
import { useTranslations } from "next-intl";
import React, { useState, useEffect } from "react";
import { Holds } from "@/components/(reusable)/holds";
import { Contents } from "@/components/(reusable)/contents";
import { Titles } from "@/components/(reusable)/titles";
import Spinner from "@/components/(animations)/spinner";
import { EquipmentLog } from "@/lib/types";

import { z } from "zod";
import { editTimeSheet } from "@/actions/timeSheetActions";
import { Labels } from "@/components/(reusable)/labels";
import { Inputs } from "@/components/(reusable)/inputs";
import { Selects } from "@/components/(reusable)/selects";
import { Buttons } from "@/components/(reusable)/buttons";
import { Images } from "@/components/(reusable)/images";
import { Texts } from "@/components/(reusable)/texts";

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
  handleFormSubmit: z
    .function()
    .args(z.string(), z.string(), z.string().optional())
    .returns(z.void()),
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

  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>(
    {}
  );
  const [expandedEquipmentLogs, setExpandedEquipmentLogs] = useState<
    Record<number, boolean>
  >({});
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

  const toggleItem = (id: string) => {
    setExpandedItems((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const toggleEquipmentLog = (id: number) => {
    setExpandedEquipmentLogs((prev) => ({
      ...prev,
      [id]: !prev[id], // Toggle the expansion state of the specific equipment log
    }));
  };

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

  const handleDurationChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    id: number
  ) => {
    const value = e.target.value;
    setEquipmentLogs((prevLogs) =>
      prevLogs.map((log) => (log.id === id ? { ...log, duration: value } : log))
    );
  };

  const handleEquipmentChange = (
    e: React.ChangeEvent<HTMLSelectElement>,
    id: number
  ) => {
    const value = e.target.value;
    setEquipmentLogs((prevLogs) =>
      prevLogs.map((log) =>
        log.id === id
          ? { ...log, Equipment: { ...log.Equipment, name: value } }
          : log
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
      setMessage("Changes saved successfully.");
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
    <>
      <Holds background={"white"} className="gap-4">
        <Contents width={"section"}>
          <Holds className="my-5">
            <Titles>{t("Timesheets")}</Titles>
            <br />
            <br />
            <Spinner />
          </Holds>
        </Contents>
      </Holds>
      <br />
      <Holds background={"white"} className="gap-4">
        <Contents width={"section"}>
          <Holds className="my-5">
            <Titles>{t("EquipmentLogs")}</Titles>
            <br />

            <br />
            <Spinner />
          </Holds>
        </Contents>
      </Holds>
    </>
  ) : (
    <>
      {timesheetData.length === 0 ? null : (
        <Holds background={"white"} position={"row"} className="py-3 my-5">
          <>
            <Holds>
              <Buttons
                onClick={editHandler}
                className={edit ? "bg-app-red" : "bg-app-orange"}
                size={edit ? "30" : "20"}
              >
                <Images
                  titleImg={edit ? "/undo-edit.svg" : "/edit-form.svg"}
                  titleImgAlt={edit ? "Undo Edit" : "Edit Form"}
                  className="mx-auto p-2"
                />
              </Buttons>
            </Holds>
            {edit ? (
              <Holds>
                <Buttons
                  className="bg-app-green"
                  onClick={handleSaveChanges}
                  size={"30"}
                >
                  <Images
                    titleImg={"/save-edit.svg"}
                    titleImgAlt={"Save Changes"}
                    className="mx-auto p-2"
                  />
                </Buttons>
              </Holds>
            ) : null}
          </>
        </Holds>
      )}
      <Holds background={"white"}>
        <Contents width={"section"} className="my-5">
          {message ? (
            <Holds className="py-3">
              <Titles>{t("Timesheets")}</Titles>
              <br />
              <Texts size={"p3"}>{message}</Texts>
              <br />

              <br />
            </Holds>
          ) : (
            <ul>
              <Titles>{t("Timesheets")}</Titles>
              {timesheets.map((timesheet) => (
                <li key={timesheet.id}>
                  {/* Collapsible Header */}
                  <Holds
                    background={"lightBlue"}
                    className="cursor-pointer mt-5 mb-1"
                    onClick={() => toggleItem(timesheet.id ?? "")}
                  >
                    <Titles>
                      {new Date(
                        timesheet.submitDate ?? ""
                      ).toLocaleDateString()}
                    </Titles>
                  </Holds>

                  {/* Conditional Rendering of Content */}
                  {expandedItems[timesheet.id ?? ""] && (
                    <Holds background={"offWhite"} className="py-2">
                      <Contents width={"section"}>
                        <Inputs
                          variant={"default"}
                          id="submitDate"
                          type="date"
                          value={
                            timesheet.submitDate
                              ? new Date(timesheet.submitDate)
                                  .toISOString()
                                  .split("T")[0]
                              : ""
                          }
                          hidden
                        />

                        <Labels>
                          {t("Duration")}
                          {edit ? <span>{t("Duration-Comment")}</span> : null}
                        </Labels>
                        <Inputs
                          id="duration"
                          type="text"
                          value={
                            timesheet.duration
                              ? timesheet.duration.toFixed(2).toString()
                              : ""
                          }
                          onChange={(e) =>
                            handleInputChange(e, timesheet.id ?? "", "duration")
                          }
                          disabled={!edit}
                        />

                        <Labels>
                          {t("ClockIn")}
                          <>
                            <Inputs
                              variant={"default"}
                              id="startDate"
                              type="date"
                              value={timesheet.startDate?.toString() || ""}
                              onChange={(e) =>
                                handleInputChangeDate(
                                  e,
                                  timesheet.id ?? "",
                                  "startDate"
                                )
                              }
                              disabled={!edit}
                            />
                            <Inputs
                              variant={"default"}
                              id="startTime"
                              type="time"
                              value={timesheet.startTime?.toString() || ""}
                              onChange={(e) =>
                                handleInputChangeDate(
                                  e,
                                  timesheet.id ?? "",
                                  "startTime"
                                )
                              }
                              disabled={!edit}
                            />
                          </>
                        </Labels>

                        <Labels>
                          {t("ClockOut")}
                          <>
                            <Inputs
                              variant={"default"}
                              id="endDate"
                              type="date"
                              value={timesheet.endDate?.toString() || ""}
                              onChange={(e) =>
                                handleInputChangeDate(
                                  e,
                                  timesheet.id ?? "",
                                  "endDate"
                                )
                              }
                              disabled={!edit}
                            />
                            <Inputs
                              variant={"default"}
                              id="endTime"
                              type="time"
                              value={timesheet.endTime?.toString() || ""}
                              onChange={(e) =>
                                handleInputChangeDate(
                                  e,
                                  timesheet.id ?? "",
                                  "endTime"
                                )
                              }
                              disabled={!edit}
                            />
                          </>
                        </Labels>

                        <Labels>{t("JobSites")}</Labels>
                        <Selects
                          variant={"default"}
                          id="jobsiteId"
                          value={timesheet.jobsiteId ?? ""}
                          onChange={(e) =>
                            handleCodeChange(e, timesheet.id ?? "", "jobsiteId")
                          }
                          disabled={!edit}
                        >
                          {jobsitesData.map((jobsite) => (
                            <option key={jobsite.id} value={jobsite.id}>
                              {jobsite.name}
                            </option>
                          ))}
                        </Selects>

                        <Labels>{t("CostCode")}</Labels>
                        <Selects
                          variant={"default"}
                          id="costcode"
                          value={timesheet.costcode ?? ""}
                          onChange={(e) =>
                            handleCodeChange(e, timesheet.id ?? "", "costcode")
                          }
                          disabled={!edit}
                        >
                          {costcodesData.map((costcode) => (
                            <option key={costcode.id} value={costcode.name}>
                              {costcode.name}
                            </option>
                          ))}
                        </Selects>
                      </Contents>
                    </Holds>
                  )}
                </li>
              ))}
            </ul>
          )}
        </Contents>
      </Holds>
      <Holds background={"white"} className="py-2 mt-5">
        <Titles>{t("EquipmentLogs")}</Titles>
        <br />
        <ul>
          {equipmentLogs.map((log) => (
            <li key={log.id} className="my-5">
              {/* Collapsible Header */}
              <Contents width={"section"}>
                <Holds
                  background={"orange"}
                  className="cursor-pointer  mt-5 mb-1"
                  onClick={() => toggleEquipmentLog(log.id)}
                  style={{ cursor: "pointer" }}
                >
                  <Titles>
                    {log.Equipment.name.slice(0, 10)} {log.Equipment.qrId}
                  </Titles>
                </Holds>
              </Contents>

              {/* Conditional Rendering of Content */}
              {expandedEquipmentLogs[log.id] && (
                <Contents width={"section"}>
                  <Holds background={"offWhite"} className="py-2">
                    <Contents width={"section"}>
                      <Labels> Equipment Used</Labels>
                      <Selects
                        variant={"default"}
                        value={log.Equipment.name}
                        onChange={(e) => handleEquipmentChange(e, log.id)}
                        disabled={!edit}
                      >
                        {equipment.map((equipmentLog) => (
                          <option
                            key={equipmentLog.id}
                            value={equipmentLog.name}
                          >
                            {equipmentLog.name.slice(0, 10)} {equipmentLog.qrId}
                          </option>
                        ))}
                      </Selects>

                      <Labels>{t("Duration")}</Labels>
                      <Inputs
                        variant={"default"}
                        type="text"
                        name="eq-duration"
                        value={
                          log.duration !== null
                            ? Number(log.duration).toFixed(2).toString()
                            : ""
                        }
                        onChange={(e) => handleDurationChange(e, log.id)}
                        disabled={!edit}
                      />
                    </Contents>
                  </Holds>
                </Contents>
              )}
            </li>
          ))}

          {equipmentLogs.length === 0 && (
            <Texts size={"p3"}>{t("NoEquipmentLogs")}</Texts>
          )}
        </ul>
        <br />
        <br />
      </Holds>
    </>
  );
};

export default EditWork;
