  "use client";
  import { editTimeSheet } from "@/actions/timeSheetActions";
  import { fetchEq, updateEq } from "@/actions/equipmentActions";
  import { Images } from "@/components/(reusable)/images";
  import { useTranslations } from "next-intl";
  import React from "react";
  import { useState, useEffect} from "react";
  import { Holds } from "@/components/(reusable)/holds";
  import { Contents } from "@/components/(reusable)/contents";
  import { Selects } from "@/components/(reusable)/selects";
  import { Inputs } from "@/components/(reusable)/inputs";
  import { Buttons } from "@/components/(reusable)/buttons";
  import { Titles } from "@/components/(reusable)/titles";
  import { Texts } from "@/components/(reusable)/texts";
  import { Labels } from "@/components/(reusable)/labels";
  import { CostCodes, Jobsites, EquipmentLog, Equipment } from "@/lib/types";

  type EditWorkProps = {
    edit: boolean;
    costcodesData: CostCodes[];
    jobsitesData: Jobsites[];
    timesheetData: TimeSheet[];
    equipmentData: EquipmentLog[];
    handleFormSubmit: (employeeId: string, date: string, message?: string) => void;
    setEdit: (edit: boolean) => void;
    employeeId: string;
    date: string;
    equipment: Equipment[];
  };
  
  export type TimeSheet = {
    endDate: any;
    startDate: any;
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
  
    const t = useTranslations("MyTeam");
  
    useEffect(() => {
      if (!timesheetData || timesheetData.length === 0) {
        setMessage("No Timesheets Found");
      } else {
        setMessage(null);
        const initializedTimesheets = timesheetData.map((timesheet) => {
          const start_date = timesheet.startTime
            ? new Date(timesheet.startTime).toISOString().split("T")[0]
            : "";
          const start_time = timesheet.startTime
            ? new Date(timesheet.startTime).toISOString().split("T")[1].split(":").slice(0, 2).join(":")
            : "";
          const end_date = timesheet.endTime
            ? new Date(timesheet.endTime).toISOString().split("T")[0]
            : "";
          const end_time = timesheet.endTime
            ? new Date(timesheet.endTime).toISOString().split("T")[1].split(":").slice(0, 2).join(":")
            : "";
  
          const durationBackup =
            timesheet.startTime && timesheet.endTime
              ? (new Date(timesheet.endTime).getTime() - new Date(timesheet.startTime).getTime()) /
                (1000 * 60 * 60)
              : 0;
  
          return {
            ...timesheet,
            start_date,
            start_time,
            end_date,
            end_time,
            duration: timesheet.duration ?? durationBackup,
          };
        });
        setTimesheets(initializedTimesheets);
      }
    }, [timesheetData]);
  
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>, id: string, field: keyof TimeSheet) => {
      const value = e.target.value;
      setTimesheets((prevData) =>
        prevData.map((timesheet) => (timesheet.id === id ? { ...timesheet, [field]: value } : timesheet))
      );
    };
  
    const handleInputChangeDate = (
      e: React.ChangeEvent<HTMLInputElement>,
      id: string,
      field: "start_date" | "start_time" | "end_date" | "end_time"
    ) => {
      const value = e.target.value;
      setTimesheets((prevTimesheets) =>
        prevTimesheets.map((timesheet) =>
          timesheet.id === id ? { ...timesheet, [field]: value } : timesheet
        )
      );
    };
  
    const handleCodeChange = (e: React.ChangeEvent<HTMLSelectElement>, id: string, field: keyof TimeSheet) => {
      const value = e.target.value;
      setTimesheets((prevTimesheets) =>
        prevTimesheets.map((timesheet) => (timesheet.id === id ? { ...timesheet, [field]: value } : timesheet))
      );
    };
  
    const handleEquipmentChange = (e: React.ChangeEvent<HTMLSelectElement>, id: number) => {
      const value = e.target.value;
      setEquipmentLogs((prevLogs) =>
        prevLogs.map((log) => (log.id === id ? { ...log, Equipment: { ...log.Equipment, name: value } } : log))
      );
    };
  
    const handleDurationChange = (e: React.ChangeEvent<HTMLInputElement>, id: number) => {
      const value = e.target.value;
      setEquipmentLogs((prevLogs) =>
        prevLogs.map((log) => (log.id === id ? { ...log, duration: value } : log))
      );
    };
  
    const handleSaveChanges = async () => {
      try {
        const updatedLogs = equipmentLogs.map((log) => ({
          ...log,
          duration: log.duration !== null ? parseFloat(log.duration as unknown as string) : null,
        }));
  
        for (const timesheet of timesheets) {
          const formData = new FormData();
          formData.append("id", timesheet.id ?? "");
          formData.append("submit_date", timesheet.submitDate?.toISOString() ?? "");
          formData.append("employeeId", employeeId);
          formData.append("costcode", timesheet.costcode ?? "");
          formData.append("start_time", `${timesheet.startDate}T${timesheet.startTime}`);
          formData.append("end_time", `${timesheet.endDate}T${timesheet.endTime}`);
          formData.append("jobsite_id", timesheet.jobsiteId ?? "");
          await editTimeSheet(formData);
        }
  
        for (const log of updatedLogs) {
          const formData1 = new FormData();
          formData1.append("id", log.id.toString());
          formData1.append("qr_id", log.Equipment.qrId ?? "");
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
          start_date: timesheet.startTime ? new Date(timesheet.startTime).toISOString().split("T")[0] : "",
          start_time: timesheet.startTime
            ? new Date(timesheet.startTime).toISOString().split("T")[1].split(":").slice(0, 2).join(":")
            : "",
          end_date: timesheet.endTime ? new Date(timesheet.endTime).toISOString().split("T")[0] : "",
          end_time: timesheet.endTime
            ? new Date(timesheet.endTime).toISOString().split("T")[1].split(":").slice(0, 2).join(":")
            : "",
        }));
        setTimesheets(initializedTimesheets);
      }
    }, [timesheetData]);
  
    useEffect(() => {
      const fetchData = async () => {
        if (date) {
          const equipmentLogs = await fetchEq(employeeId, date);
          const filteredEquipmentLogs = equipmentLogs
            .filter((log: any) => log.duration !== null && log.Equipment !== null)
            .map((log : any) => ({
              ...log,
              duration: log.duration ? log.duration.toString() : "0",
              id: Number(log.id),
              Equipment: {
                ...log.Equipment,
                id: log.Equipment?.id ?? "Unknown",
                name: log.Equipment?.name ?? "Unknown",
                qr_id: log.Equipment?.qr_id ?? "Unknown",
                description: log.Equipment?.description ?? "",
                status: log.Equipment?.status ?? "UNKNOWN",
                equipment_tag: log.Equipment?.equipment_tag ?? "UNKNOWN",
                last_inspection: log.Equipment?.last_inspection ?? null,
                last_repair: log.Equipment?.last_repair ?? null,
                equipment_status: log.Equipment?.equipment_status ?? "UNKNOWN",
                createdAt: log.Equipment?.createdAt ?? new Date(),
                updatedAt: log.Equipment?.updatedAt ?? new Date(),
                make: log.Equipment?.make ?? "Unknown",
                model: log.Equipment?.model ?? "Unknown",
                year: log.Equipment?.year ?? "Unknown",
                license_plate: log.Equipment?.license_plate ?? "Unknown",
                registration_expiration: log.Equipment?.registration_expiration ?? null,
                mileage: log.Equipment?.mileage ?? 0,
                is_active: log.Equipment?.is_active ?? false,
              },
            }));
          setEquipmentLogs(filteredEquipmentLogs);
        }
      };
      fetchData();
    }, [date, employeeId]);
  
    const editHandler = () => {
      setEdit(!edit);
    };
  
    useEffect(() => {
      setMessage("");
    }, [edit]);
  
    return (
      <Contents variant={"default"} size={"default"}>
        <Holds size={"dynamic"}>
          <Contents variant={"rowCenter"} size={"default"}>
            {timesheetData.length === 0 ? null : (
              <>
                <Buttons onClick={editHandler} className={edit ? "bg-app-red" : "bg-app-orange"}>
                  <Images
                    titleImg={edit ? "/undo-edit.svg" : "/edit-form.svg"}
                    titleImgAlt={edit ? "Undo Edit" : "Edit Form"}
                    variant={"icon"}
                    size={"backButton"}
                    className="p-2"
                  />
                </Buttons>
                {edit ? (
                  <Buttons className="flex bg-app-green text-white font-bold p-2 rounded" onClick={handleSaveChanges}>
                    <Images
                      titleImg={"/save-edit.svg"}
                      titleImgAlt={"Save Changes"}
                      variant={"icon"}
                      size={"backButton"}
                    />
                  </Buttons>
                ) : null}
              </>
            )}
          </Contents>
          {message ? (
            <>
              <Texts>{message}</Texts>
            </>
          ) : (
            <ul>
              <br />
              <Titles size={"default"} variant={"default"}>
                {t("Timesheets")}
              </Titles>
              <br />
              <div className="border border-black"></div>
              <br />
              {timesheets.map((timesheet) => (
                <li key={timesheet.id}>
                  <>
                    <Titles size={"default"} variant={"default"}>
                      {new Date(timesheet.submitDate ?? "").toLocaleDateString()}
                    </Titles>
                    <Inputs
                      variant={"default"}
                      id="submit_date"
                      type="date"
                      value={timesheet.submitDate ? new Date(timesheet.submitDate).toISOString().split("T")[0] : ""}
                      hidden
                    />
                  </>
                  <>
                    <Labels size={"default"} variant={"default"}>
                      {t("Duration")} {edit ? <span>{t("Duration-Comment")}</span> : null}
                    </Labels>
                    <Inputs
                      variant={"default"}
                      id="duration"
                      type="text"
                      value={timesheet.duration ? timesheet.duration.toString() : ""}
                      onChange={(e) => handleInputChange(e, timesheet.id ?? "", "duration")}
                      readOnly={!edit}
                    />
                  </>
                  <>
                    <Labels size={"default"} variant={"default"}>
                      {t("ClockIn")}
                      <>
                        <Inputs
                          variant={"default"}
                          id="start_date"
                          type="date"
                          value={timesheet.startDate?.toString() || ""}
                          onChange={(e) => handleInputChangeDate(e, timesheet.id ?? "", "start_date")}
                          readOnly={!edit}
                        />
                        <Inputs
                          variant={"default"}
                          id="start_time"
                          type="time"
                          value={timesheet.startTime?.toString() || ""}
                          onChange={(e) => handleInputChangeDate(e, timesheet.id ?? "", "start_time")}
                          readOnly={!edit}
                        />
                      </>
                    </Labels>
                    <Labels size={"default"} variant={"default"}>
                      {t("ClockOut")}
                      <>
                        <Inputs
                          variant={"default"}
                          id="end_date"
                          type="date"
                          value={timesheet.endDate?.toString() || ""}
                          onChange={(e) => handleInputChangeDate(e, timesheet.id ?? "", "end_date")}
                          readOnly={!edit}
                        />
                        <Inputs
                          variant={"default"}
                          id="end_time"
                          type="time"
                          value={timesheet.endTime?.toString() || ""}
                          onChange={(e) => handleInputChangeDate(e, timesheet.id ?? "", "end_time")}
                          readOnly={!edit}
                        />
                      </>
                    </Labels>
                  </>
                  <>
                    <Labels size={"default"} variant={"default"}>
                      {t("JobSites")}
                    </Labels>
                    <Selects
                      variant={"default"}
                      id="jobsite_id"
                      value={timesheet.jobsiteId ?? ""}
                      onChange={(e) => handleCodeChange(e, timesheet.id ?? "", "jobsiteId")}
                      disabled={!edit}
                    >
                      {jobsitesData.map((jobsite) => (
                        <option key={jobsite.id} value={jobsite.id}>
                          {jobsite.name}
                        </option>
                      ))}
                    </Selects>
                    <Labels size={"default"} variant={"default"}>
                      {t("CostCode")}
                    </Labels>
                    <Selects
                      variant={"default"}
                      id="costcode"
                      value={timesheet.costcode ?? ""}
                      onChange={(e) => handleCodeChange(e, timesheet.id ?? "", "costcode")}
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
        <Holds size={"dynamic"}>
          <Titles size={"default"} variant={"default"}>
            {t("EquipmentLogs")}
          </Titles>
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
                <Labels size={"default"} variant={"default"}>
                  {t("Duration")}
                </Labels>
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
            {equipmentLogs.length === 0 && (
              <Texts size={"default"} variant={"default"}>
                {t("NoEquipmentLogs")}
              </Texts>
            )}
          </ul>
        </Holds>
      </Contents>
    );
  };
  
  export default EditWork;