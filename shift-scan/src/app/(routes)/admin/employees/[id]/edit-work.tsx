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
import { CostCodes, Jobsites, EquipmentLog, EquipmentCodes } from "@/lib/types";

type TimeSheet = {
  endDate: Date | string | null;
  startDate: Date | string | null;
  submitDate?: Date;
  id: string;
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
  equipment: EquipmentCodes[];
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
}: EditWorkProps) => {
  const [timesheets, setTimesheets] = useState<TimeSheet[]>([]);
  const [equipmentLogs, setEquipmentLogs] = useState<EquipmentLog[]>([]);
  const [message, setMessage] = useState<string | null>(null);
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
              .slice(0, 5)
          : "";
        const endDate = timesheet.endTime
          ? new Date(timesheet.endTime).toISOString().split("T")[0]
          : "";
        const endTime = timesheet.endTime
          ? new Date(timesheet.endTime).toISOString().split("T")[1].slice(0, 5)
          : "";
        const durationBackup =
          (new Date(timesheet.endTime ?? new Date()).getTime() -
            new Date(timesheet.startTime ?? new Date()).getTime()) /
          (1000 * 60 * 60);

        return {
          ...timesheet,
          startDate,
          startTime,
          endDate,
          endTime,
          duration: timesheet.duration || durationBackup,
        };
      });
      setTimesheets(initializedTimesheets);
    }
  }, [timesheetData]);

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
          log.duration !== null ? parseFloat(log.duration as string) : null,
      }));

      for (const timesheet of timesheets) {
        const formData = new FormData();
        formData.append("id", timesheet.id);
        if (timesheet.submitDate) {
          formData.append("submitDate", timesheet.submitDate.toISOString());
        }
        formData.append("employeeId", employeeId);
        formData.append("costcode", timesheet.costcode?.toString() ?? "");
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
        formData1.append("qrId", log.Equipment.qrId);
        formData1.append("duration", (log.duration || 0).toString());
        formData1.append("employeeId", employeeId);
        await updateEq(formData1);
      }

      if (timesheets.length > 0 && timesheets[0].userId) {
        const submitDate = timesheets[0].submitDate;
        const message = "Changes saved successfully.";

        if (submitDate !== undefined) {
          handleFormSubmit(
            timesheets[0].userId,
            submitDate.toISOString(),
            message
          );
        } else {
          console.error("submitDate is undefined");
        }
      } else {
        console.error("No timesheet found or userId is undefined");
      }
      setEdit(false);
    } catch (error) {
      console.error("Failed to save changes", error);
      setMessage("Failed to save changes.");
      setEdit(false);
      handleFormSubmit(
        timesheets[0].userId ?? "",
        timesheets[0].submitDate?.toISOString() ?? ""
      );
    }
  };

  useEffect(() => {
    if (timesheetData.length === 0) {
      setMessage("No Timesheets Found");
    }
  }, [timesheetData]);
  return (
    <Contents>
      <Holds>
        {timesheetData.length === 0 ? null : (
          <>
            <Buttons onClick={() => setEdit(!edit)} />
            {edit && (
              <Buttons
                className="flex bg-app-blue text-white font-bold p-2 rounded"
                onClick={handleSaveChanges}
              >
                <Images titleImg={"/save.svg"} titleImgAlt={"Save Changes"} />
              </Buttons>
            )}
          </>
        )}
        {message ? (
          <>
            <Texts>{message}</Texts>
          </>
        ) : (
          <ul>
            <br />
            <li>{t("Timesheets")}</li>
            {timesheets.map((timesheet) => (
              <li key={timesheet.id}>
                <>
                  <Titles>
                    {timesheet.submitDate
                      ? new Date(timesheet.submitDate).toLocaleDateString()
                      : ""}
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
                    {t("Duration")}{" "}
                    {edit ? <span>{t("Duration-Comment")}</span> : null}
                  </Labels>
                  <Inputs
                    variant={"default"}
                    id="duration"
                    type="text"
                    value={timesheet.duration ?? ""}
                    onChange={(e) =>
                      handleInputChange(e, timesheet.id, "duration")
                    }
                    readOnly
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
                        value={timesheet.startDate?.toString()}
                        onChange={(e) =>
                          handleInputChangeDate(e, timesheet.id, "startDate")
                        }
                        readOnly={!edit}
                      />
                      <Inputs
                        variant={"default"}
                        id="startDate"
                        type="date"
                        value={timesheet.startDate?.toString()}
                        onChange={(e) =>
                          handleInputChangeDate(e, timesheet.id, "startDate")
                        }
                        readOnly={!edit}
                      />{" "}
                    </>
                  </Labels>
                  <Labels>
                    {t("ClockOut")}
                    <>
                      <Inputs
                        variant={"default"}
                        id="endDate"
                        type="date"
                        value={timesheet.endDate?.toString()}
                        onChange={(e) =>
                          handleInputChangeDate(e, timesheet.id, "endDate")
                        }
                        readOnly={!edit}
                      />
                      <Inputs
                        variant={"default"}
                        id="startDate"
                        type="date"
                        value={timesheet.startDate?.toString()}
                        onChange={(e) =>
                          handleInputChangeDate(e, timesheet.id, "startDate")
                        }
                        readOnly={!edit}
                      />
                    </>
                  </Labels>
                </>
                <>
                  <Labels>{t("JobSites")}</Labels>
                  <Selects
                    variant={"default"}
                    id="jobsiteId"
                    value={timesheet.jobsiteId}
                    onChange={(e) =>
                      handleCodeChange(e, timesheet.id, "jobsiteId")
                    }
                    disabled={!edit}
                  >
                    {jobsitesData.map((jobsite) => (
                      <option key={jobsite.id} value={jobsite.qrId}>
                        {jobsite.qrId}
                      </option>
                    ))}
                  </Selects>
                  <Labels>{t("CostCode")}</Labels>
                  <Selects
                    variant={"default"}
                    id="costcode"
                    value={timesheet.costcode}
                    onChange={(e) =>
                      handleCodeChange(e, timesheet.id, "costcode")
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
            <li key={log.id}>
              <Selects
                variant={"default"}
                value={log.Equipment.name}
                onChange={(e) => handleEquipmentChange(e, log.id)}
                disabled={!edit}
              >
                {equipment.map((equipmentLog) => (
                  <option key={equipmentLog.id} value={equipmentLog.name}>
                    {equipmentLog.name.slice(0, 10)} - {equipmentLog.qrId}
                  </option>
                ))}
              </Selects>
              <Labels>{t("Duration")} </Labels>
              <Inputs
                variant={"default"}
                type="text"
                name="eq-duration"
                value={log.duration !== null ? log.duration.toString() : ""}
                onChange={(e) => handleDurationChange(e, log.id)}
                readOnly={!edit}
              />
            </li>
          ))}
          <br />
          <div className="border border-black"></div>
          <br />
        </ul>
      </Holds>
    </Contents>
  );
};

export default EditWork;
