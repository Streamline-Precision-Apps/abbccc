"use client";
import { editTimeSheet } from "@/actions/timeSheetActions";
import { fetchEq, updateEq } from "@/actions/equipmentActions";
import { Images } from "@/components/(reusable)/images";
import { useTranslations } from "next-intl";
import React, { useState, useEffect, useRef } from "react";
import { Sections } from "@/components/(reusable)/sections";

type Timesheet = {
  id: string;
  start_time: string;
  start_date?: string;
  end_time: string;
  end_date?: string;
  total_break_time: string;
  jobsite_id: string;
  costcode: string;
  duration: string;
  submit_date: string;
  employeeId: string;
};

type CostCode = {
  id: number;
  cost_code: string;
};

type Jobsite = {
  id: number;
  jobsite_id: string;
};

type Equipment = {
  id: number;
  name: string;
  qr_id: string;
};

type EquipmentLog = {
  id: number;
  employee_id: string;
  duration:  string | null;
  Equipment: Equipment;
};

type EditWorkProps = {
  edit: boolean;
  costcodesData: CostCode[];
  jobsitesData: Jobsite[];
  timesheetData: Timesheet[];
  equipmentData: EquipmentLog[];
  handleFormSubmit: (employeeId: string, date: string, message?: string) => void;
  setEdit: (edit: boolean) => void;
  employeeId: string;
  date: string;
};

const EditWork = ({ timesheetData, jobsitesData, costcodesData, edit, handleFormSubmit, setEdit, employeeId, date }: EditWorkProps) => {
  const [timesheets, setTimesheets] = useState<Timesheet[]>([]);
  const [equipmentLogs, setEquipmentLogs] = useState<EquipmentLog[]>([]);
  const [message, setMessage] = useState<string | null>(null);


  const t = useTranslations("MyTeam");
  useEffect(() => {
    if (!timesheetData || timesheetData.length === 0) {
      setMessage("No Timesheets Found");
    } else {
      setMessage(null);
      const initializedTimesheets = timesheetData.map((timesheet) => {
        const start_date = new Date(timesheet.start_time).toISOString().split('T')[0];
        const start_time = new Date(timesheet.start_time).toISOString().split('T')[1].split(':')[0] + ":" + new Date(timesheet.start_time).toISOString().split('T')[1].split(':')[1];
        const end_date = new Date(timesheet.end_time).toISOString().split('T')[0];
        const end_time = new Date(timesheet.end_time).toISOString().split('T')[1].split(':')[0] + ":" + new Date(timesheet.end_time).toISOString().split('T')[1].split(':')[1];
        
        const durationBackup = (new Date(timesheet.end_time).getTime() - new Date(timesheet.start_time).getTime()) / (1000 * 60 * 60);
  
        return {
          ...timesheet,
          start_date,
          start_time,
          end_date,
          end_time,
          duration: timesheet.duration || durationBackup.toString()
        };
      });
      setTimesheets(initializedTimesheets);
    }
  }, [timesheetData]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>, id: string, field: keyof Timesheet) => {
    let value = e.target.value;
    setTimesheets((prevData) =>
      prevData.map((timesheet) => (timesheet.id === id ? { ...timesheet, [field]: value } : timesheet))
    );
  };

  const handleInputChangeDate = (e: React.ChangeEvent<HTMLInputElement>, id: string, field: "start_date" | "start_time" | "end_date" | "end_time") => {
    const value = e.target.value;
    setTimesheets((prevTimesheets) =>
      prevTimesheets.map((timesheet) => {
        if (timesheet.id === id) {
          const updatedTimesheet = { ...timesheet, [field]: value };
          return updatedTimesheet;
        }
        return timesheet;
      })
    );
  };

  const handleCodeChange = (e: React.ChangeEvent<HTMLSelectElement>, id: string, field: keyof Timesheet) => {
    const value = e.target.value;
    setTimesheets((prevTimesheets) =>
      prevTimesheets.map((timesheet) => (timesheet.id === id ? { ...timesheet, [field]: value } : timesheet))
    );
  };

  const handleEquipmentChange = (e: React.ChangeEvent<HTMLSelectElement>, id: number) => {
    const value = e.target.value;
    setEquipmentLogs((prevLogs) =>
      prevLogs.map((log) =>
        log.id === id ? { ...log, Equipment: { ...log.Equipment, name: value } } : log
      )
    );
  };

  const handleDurationChange = (e: React.ChangeEvent<HTMLInputElement>, id: number) => {
    const value = e.target.value;
    setEquipmentLogs((prevLogs) =>
      prevLogs.map((log) =>
        log.id === id ? { ...log, duration: value } : log
      )
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
        formData.append("id", timesheet.id);
        formData.append("submit_date", timesheet.submit_date);
        formData.append("employeeId", employeeId);
        formData.append("costcode", timesheet.costcode);
        formData.append("start_time", `${timesheet.start_date}T${timesheet.start_time}`);
        formData.append("end_time", `${timesheet.end_date}T${timesheet.end_time}`);
        formData.append("total_break_time", timesheet.total_break_time);
        formData.append("jobsite_id", timesheet.jobsite_id);
        await editTimeSheet(formData);
      }

      for (const log of updatedLogs) {
        const formData1 = new FormData();
        formData1.append("id", log.id.toString());
        formData1.append("qr_id", log.Equipment.qr_id);
        formData1.append("duration", (log.duration || 0).toString());
        formData1.append("employeeId", employeeId);
        await updateEq(formData1);
      }

      handleFormSubmit(timesheets[0].employeeId, timesheets[0].submit_date, "Changes saved successfully.");
      setEdit(false);
    } catch (error) {
      console.error("Failed to save changes", error);
      setMessage("Failed to save changes.");
      setEdit(false);
      handleFormSubmit(timesheets[0].employeeId, timesheets[0].submit_date);
    }
  };

  useEffect(() => {
    if (!timesheetData || timesheetData.length === 0) {
      setMessage("No Timesheets Found");
    } else {
      setMessage(null);
      const initializedTimesheets = timesheetData.map((timesheet) => ({
        ...timesheet,
        start_date: new Date(timesheet.start_time).toISOString().split('T')[0],
        start_time: new Date(timesheet.start_time).toISOString().split('T')[1].split(':')[0] + ":" + new Date(timesheet.start_time).toISOString().split('T')[1].split(':')[1],
        end_date: new Date(timesheet.end_time).toISOString().split('T')[0],
        end_time: new Date(timesheet.end_time).toISOString().split('T')[1].split(':')[0] + ":" + new Date(timesheet.end_time).toISOString().split('T')[1].split(':')[1],
      }));
      setTimesheets(initializedTimesheets);
    }
  }, [timesheetData]);

  useEffect(() => {
    const fetchData = async () => {
      if (date) {
        const equipmentLogs = await fetchEq(employeeId, date);
        const filteredEquipmentLogs = equipmentLogs
          .filter((log) => log.duration !== null && log.Equipment !== null)
          .map((log) => ({
            ...log,
            duration: (log.duration as unknown as string),
            id: Number(log.id),
            Equipment: {
              ...log.Equipment,
              id: Number(log.Equipment?.id),
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

  const buttonClass = edit ? "flex bg-app-red text-white font-bold p-2 rounded" : "bg-app-orange text-black font-bold rounded m-auto pl-4 p-2";

  const word = edit ? (
    <Images titleImg={"/cancel.svg"} titleImgAlt={"Cancel"} variant={"icon"} size={"backButton"} />
  ) : (
    <Images titleImg={"/edit.svg"} titleImgAlt={"Edit"} variant={"icon"} size={"backButton"} />
  );

  const editHandler = () => {
    setEdit(!edit);
  };

  useEffect(() => {
    setMessage("");
  }, [edit]);

  return (
    <div>
      <Sections size={"dynamic"}>
      {timesheetData.length === 0 ? null : (
        <div className="flex flex-row justify-between p-2">
          <button className={buttonClass} onClick={editHandler}>{word}</button>
          {edit ? <button className="flex bg-app-blue text-white font-bold p-2 rounded" onClick={handleSaveChanges}><Images titleImg={"/save.svg"} titleImgAlt={"Save Changes"} variant={"icon"} size={"backButton"} /></button> : null}
        </div>
      )}
      {message ? (
        <div className="py-4">
          <p className="text-center">{message}</p>
        </div>
      ) : (
        <ul>
          <br/>
          <li className="text-center">{t("Timesheets")}</li>
          {timesheets.map((timesheet) => (
            <li key={timesheet.id}>
              <div >
                <h2>{new Date(timesheet.submit_date).toLocaleDateString()}</h2>
                <input id="submit_date" type="date" value={new Date(timesheet.submit_date).toISOString().split('T')[0]} hidden />
              </div>
              <div>
                <label className="w-full text-center text-black" htmlFor="duration">{t("Duration")} {edit ? (
                  <span className="text-red-500 italic text-sm flex flex-wrap">{t("Duration-Comment")}</span>
                ) : null}
                </label>
                <input id="duration" className="w-full text-center border text-black border-black" type="text" value={timesheet.duration} onChange={(e) => handleInputChange(e, timesheet.id, "duration")} readOnly />
              </div>
              <div>
                <label>{t("ClockIn")}
                  <div className="flex flex-row border border-black">
                    <input id="start_date" type="date" value={timesheet.start_date || ''} onChange={(e) => handleInputChangeDate(e, timesheet.id, "start_date")} readOnly={!edit} />
                    <input id="start_time" type="time" value={timesheet.start_time || ''} onChange={(e) => handleInputChangeDate(e, timesheet.id, "start_time")} readOnly={!edit} />
                  </div>
                </label>
                <label>{t("ClockOut")}
                  <div>
                    <input id="end_date" type="date" value={timesheet.end_date || ''} onChange={(e) => handleInputChangeDate(e, timesheet.id, "end_date")} readOnly={!edit} />
                    <input id="end_time" type="time" value={timesheet.end_time || ''} onChange={(e) => handleInputChangeDate(e, timesheet.id, "end_time")} readOnly={!edit} />
                  </div>
                </label>
              </div>
              <div>
                <label htmlFor="total_break_time">{t("Breaktime")}</label>
                <input id="total_break_time" className="text-center border border-black" type="text" value={timesheet.total_break_time || "0"} onChange={(e) => handleInputChange(e, timesheet.id, "total_break_time")} readOnly={!edit} />
              </div>
              <div>
                <label htmlFor="jobsite_id">{t("JobSites")}</label>
                <select id="jobsite_id" className="text-center border border-black" value={timesheet.jobsite_id} onChange={(e) => handleCodeChange(e, timesheet.id, "jobsite_id")} disabled={!edit}>
                  {jobsitesData.map((jobsite) => (
                    <option key={jobsite.id} value={jobsite.jobsite_id}>{jobsite.jobsite_id}</option>
                  ))}
                </select>
                <label htmlFor="costcode">{t("CostCode")}</label>
                <select id="costcode" className="text-center border border-black" value={timesheet.costcode} onChange={(e) => handleCodeChange(e, timesheet.id, "costcode")} disabled={!edit}>
                  {costcodesData.map((costcode) => (
                    <option key={costcode.id} value={costcode.cost_code}>{costcode.cost_code}</option>
                  ))}
                </select>
              </div>
                <br/>
              <div className="border border-black"></div>
              <br/>
            </li>
          ))}
        </ul>
      )}
      </Sections>
      <Sections size={"dynamic"}>
        <h1>{t("EquipmentLogs")}</h1>
        <ul>
          {equipmentLogs.map((log) => (
            <li key={log.id}>
              <select
                value={log.Equipment.name}
                onChange={(e) => handleEquipmentChange(e, log.id)}
                disabled={!edit}
              >
                {equipmentLogs.map((equipmentLog) => (
                  <option key={equipmentLog.Equipment.id} value={equipmentLog.Equipment.name}>
                    {equipmentLog.Equipment.name.slice(0, 10)} - {equipmentLog.Equipment.qr_id}
                  </option>
                ))}
              </select>
              <label htmlFor="eq-duration">{t("Duration")} </label>
              <input
                className="w-20"
                type="text"
                name="eq-duration"
                value={log.duration !== null ? ((log.duration)).toString() : ''}
                onChange={(e) => handleDurationChange(e, log.id)}
                readOnly={!edit}
              />
            </li>
          ))}
          <br/>
          <div className="border border-black"></div>
          <br/>
        </ul>
      </Sections>
    </div>
  );
};

export default EditWork;