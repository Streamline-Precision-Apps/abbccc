"use client";
import { editTimeSheet } from "@/actions/timeSheetActions";
import { updateEq } from "@/actions/equipmentActions";
import { Images } from "@/components/(reusable)/images";
import { useTranslations } from "next-intl";
import React from "react";
import { useState, useEffect } from "react";
import { Holds } from "@/components/(reusable)/holds";
import { Contents } from "@/components/(reusable)/contents";
import { Selects } from "@/components/(reusable)/selects";
import { Inputs } from "@/components/(reusable)/inputs";
import { Buttons } from "@/components/(reusable)/buttons";
import { Titles } from "@/components/(reusable)/titles";
import { Texts } from "@/components/(reusable)/texts";
import { Labels } from "@/components/(reusable)/labels";
import { CostCodes, Jobsites, EquipmentLog, Equipment } from "@/lib/types";
import Spinner from "@/components/(animations)/spinner";

type EditWorkProps = {
  edit: boolean;
  costcodesData: CostCodes[];
  jobsitesData: Jobsites[];
  timesheetData: TimeSheet[];
  equipmentData: EquipmentLog[];
  handleFormSubmit: (
    employeeId: string,
    date: string,
    message?: string
  ) => void;
  setEdit: (edit: boolean) => void;
  employeeId: string;
  date: string;
  equipment: Equipment[];
};

export type TimeSheet = {
  endDate: string | undefined;
  startDate: string | null;
  submitDate?: Date;
  id?: string;
  userId?: string;
  date?: Date;
  jobsiteId?: string;
  costcode?: string;
  nu?: string;
  Fp?: string;
  vehicleId?: number | null;
  startTime?: Date | string;
  endTime?: Date | string | null;
  duration?: number | null;
  startingMileage?: number | null;
  endingMileage?: number | null;
  leftIdaho?: boolean | null;
  equipmentHauled?: string | null;
  materialsHauled?: string | null;
  hauledLoadsQuantity?: number | null;
  refuelingGallons?: number | null;
  timeSheetComments?: string | null;
  status?: string;
};

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
        console.log(date);
        const data = await fetch(
          `/api/getEmployeeEquipmentByDate?date=${date}`
        );
        const res = await data.json();
        console.log(res); // Logs filtered by date
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

  const handleDurationChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    id: number
  ) => {
    const value = e.target.value;
    setEquipmentLogs((prevLogs) =>
      prevLogs.map((log) => (log.id === id ? { ...log, duration: value } : log))
    );
  };

  const handleSaveChanges = async () => {
    try {
      const updatedLogs = equipmentLogs.map((log) => ({
        ...log,
        duration:
          log.duration !== null
            ? parseFloat(log.duration as unknown as string)
            : null,
      }));

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

      for (const log of updatedLogs) {
        const formData1 = new FormData();
        formData1.append("id", log.id.toString());
        formData1.append("qrId", log.Equipment.qrId ?? "");
        formData1.append("duration", (log.duration || 0).toString());
        formData1.append("employeeId", employeeId);
        await updateEq(formData1);
      }

      handleFormSubmit(employeeId, date, "Changes saved successfully.");
      setEdit(false);
    } catch (error) {
      console.error("Failed to save changes", error);
      setMessage("Failed to save changes.");
      setEdit(false);
      handleFormSubmit(employeeId, date);
    }
  };

  useEffect(() => {
    if (!timesheetData || timesheetData.length === 0) {
      setMessage("No Timesheets Found");
    } else {
      setMessage(null);
      const initializedTimesheets = timesheetData.map((timesheet) => ({
        ...timesheet,
        startDate: timesheet.startTime
          ? new Date(timesheet.startTime).toISOString().split("T")[0]
          : "",
        startTime: timesheet.startTime
          ? new Date(timesheet.startTime)
              .toISOString()
              .split("T")[1]
              .split(":")
              .slice(0, 2)
              .join(":")
          : "",
        endDate: timesheet.endTime
          ? new Date(timesheet.endTime).toISOString().split("T")[0]
          : "",
        endTime: timesheet.endTime
          ? new Date(timesheet.endTime)
              .toISOString()
              .split("T")[1]
              .split(":")
              .slice(0, 2)
              .join(":")
          : "",
        jobsiteId: (
          timesheet.jobsiteId?.toString() ||
          jobsitesData[0]?.id ||
          ""
        ).toString(),
        costcode: timesheet.costcode || costcodesData[0]?.name || "",
      }));
      setTimesheets(initializedTimesheets);
    }
  }, [timesheetData]);

  const editHandler = () => {
    setEdit(!edit);
  };

  useEffect(() => {
    setMessage("");
  }, [edit]);

  return loading ? (
    <>
      <Contents width={"section"}>
        <Holds>
          <Holds className="my-5">
            <Titles>{t("Timesheets")}</Titles>
            <br />
            <Spinner />
          </Holds>

          <div className="border border-black"></div>
          <Holds className="my-5">
            <Titles>{t("EquipmentLogs")}</Titles>
            <br />
            <div className="border border-black"></div>
            <br />
            <Spinner />
          </Holds>
        </Holds>
      </Contents>
    </>
  ) : (
    <Contents width={"section"} className="my-5">
      <Holds>
        <Holds position={"row"} className="my-5">
          {timesheetData.length === 0 ? null : (
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
          )}
        </Holds>
        {message ? (
          <>
            <Titles>{t("Timesheets")}</Titles>
            <br />
            <Texts>{message}</Texts>
            <br />
            <div className="border border-black"></div>
            <br />
          </>
        ) : (
          <ul>
            <br />
            <Titles>{t("Timesheets")}</Titles>
            <br />
            <div className="border border-black"></div>
            <br />
            {timesheets.map((timesheet) => (
              <li key={timesheet.id}>
                <>
                  <Titles>
                    {new Date(timesheet.submitDate ?? "").toLocaleDateString()}
                  </Titles>
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
                </>
                <>
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
                </>
                <>
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
                </>
                <>
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
                </>
                <br />
                <div className="border border-black"></div>
                <br />
              </li>
            ))}
          </ul>
        )}
      </Holds>
      <Holds>
        <Titles>{t("EquipmentLogs")}</Titles>
        <ul>
          {equipmentLogs.map((log) => (
            <li key={log.id} className="my-5">
              <br />
              <div className="border border-black"></div>
              <br />
              <Labels> Equipment Used</Labels>
              <Selects
                variant={"default"}
                value={log.Equipment.name}
                onChange={(e) => handleEquipmentChange(e, log.id)}
                disabled={!edit}
              >
                {equipment.map((equipmentLog) => (
                  <option key={equipmentLog.id} value={equipmentLog.name}>
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
            </li>
          ))}
          <br />
          {equipmentLogs.length === 0 && (
            <div className="border border-black"></div>
          )}
          <br />
          {equipmentLogs.length === 0 && <Texts>{t("NoEquipmentLogs")}</Texts>}
        </ul>
      </Holds>
    </Contents>
  );
};

export default EditWork;
