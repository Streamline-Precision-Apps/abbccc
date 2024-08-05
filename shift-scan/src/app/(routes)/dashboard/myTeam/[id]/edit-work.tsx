import { editTimeSheet } from "@/actions/timeSheetActions";
import { Images } from "@/components/(reusable)/images";
import { useTranslations } from "next-intl";
import React from "react";
import { useState, useEffect} from "react";
import Equipment from "../../equipment/page";
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
  equipmentId: string;
};

type CostCode = {
  id: number;
  cost_code: string;
};

type Jobsite = {
  id: number;
  jobsite_id: string;
};

type EquipmentLogs = {
  id: number;
  equipment_id: string;
  jobsite_id: string;
  employee_id: string;
  start_time: Date;
  end_time: Date | null;
  duration: number | null;
  refueled: boolean;
  fuel_used: number | null;
  Equipment: Equipment[];
};

type Equipment = {
  id: number;
  name: string;
  qr_id: string;
};

type EditWorkProps = {
  edit: boolean;
  costcodesData: CostCode[];
  jobsitesData: Jobsite[];
  timesheetData: Timesheet[];
  handleFormSubmit: (employeeId: string, date: string, message?: string) => void;
  setEdit: (edit: boolean) => void;
  employeeId: string;
};

export default function EditWork({ timesheetData, jobsitesData, costcodesData, edit, handleFormSubmit, setEdit, employeeId }: EditWorkProps) {
  const [timesheets, setTimesheets] = useState<Timesheet[]>([]);
  const [prevtimesheets] = useState<Timesheet[]>(timesheetData);
  const [jobsites] = useState<Jobsite[]>(jobsitesData);
  const [costcodes] = useState<CostCode[]>(costcodesData);
  const [message, setMessage] = useState<string | null>(null);
  const t = useTranslations("MyTeam");

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    id: string,
    field: keyof Timesheet
  ) => {
    let value = e.target.value;

    setTimesheets((prevData) =>
      prevData.map((timesheet) =>
        timesheet.id === id ? { ...timesheet, [field]: value } : timesheet
      )
    );
  };

  const handleInputChangeDate = (
    e: React.ChangeEvent<HTMLInputElement>,
    id: string,
    field: "start_date" | "start_time" | "end_date" | "end_time"
  ) => {
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
      prevTimesheets.map((timesheet) =>
        timesheet.id === id ? { ...timesheet, [field]: value } : timesheet
      )
    );
  };

  const handleSaveChanges = async () => {
    try {
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
      handleFormSubmit(timesheets[0].employeeId, timesheets[0].submit_date, "Changes saved successfully.");
      setEdit(false);
    } catch (error) {
      console.error("Failed to save changes", error);
      setMessage("Failed to save changes.");
      setEdit(false);
      handleFormSubmit(prevtimesheets[0].employeeId, prevtimesheets[0].submit_date);
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

  const buttonClass = edit
    ? "flex bg-app-red text-white font-bold p-2 rounded"
    : "bg-app-orange text-black font-bold p-2 rounded m-auto";

  const word = edit ?  (<Images titleImg={"/cancel.svg"} titleImgAlt={"Cancel"} variant={"icon"} size={"backButton"}  /> ): (<Images titleImg={"/edit.svg"} titleImgAlt={"Edit"} variant={"icon"} size={"backButton"} /> );

  const editHandler = () => {
    setEdit(!edit);
  };

  useEffect(() => {
    setMessage("");
  }, [edit]);

  return (
    <div>
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
          {timesheets.map((timesheet) => (
            <li
              key={timesheet.id}
              className="flex flex-col justify-center items-center m-auto text-black text-2xl bg-white p-4 rounded lg:text-2xl lg:p-3"
            >
              <div className="flex flex-col justify-center items-center">
                <h2>{new Date(timesheet.submit_date).toLocaleDateString()}</h2>
                <input
                  id="submit_date"
                  type="date"
                  value={new Date(timesheet.submit_date).toISOString().split('T')[0]}
                  hidden
                />
              </div>
              <div>
                <label htmlFor="duration">
                  {t("Duration")} {edit ? (
                    <span className="text-red-500 italic text-sm flex flex-wrap">
                      {t("Duration-Comment")}
                    </span>
                  ) : null}
                </label>
                <input
                  id="duration"
                  className="w-full text-center border border-black"
                  type="text"
                  value={timesheet.duration}
                  readOnly
                />
              </div>
              <div className="flex flex-wrap">
                <label>
                  {t("ClockIn")}
                  <div className="flex flex-row w-full border border-black">
                    <input
                      id="start_date"
                      type="date"
                      value={timesheet.start_date || ''}
                      onChange={(e) => handleInputChangeDate(e, timesheet.id, "start_date")}
                      readOnly={!edit}
                    />
                    <input
                      id="start_time"
                      type="time"
                      value={timesheet.start_time || ''}
                      onChange={(e) => handleInputChangeDate(e, timesheet.id, "start_time")}
                      readOnly={!edit}
                    />
                  </div>
                </label>
                <label>
                  {t("ClockOut")}
                  <div className="flex flex-row w-full border border-black">
                    <input
                      id="end_date"
                      type="date"
                      value={timesheet.end_date || ''}
                      onChange={(e) => handleInputChangeDate(e, timesheet.id, "end_date")}
                      readOnly={!edit}
                    />
                    <input
                      id="end_time"
                      type="time"
                      value={timesheet.end_time || ''}
                      onChange={(e) => handleInputChangeDate(e, timesheet.id, "end_time")}
                      readOnly={!edit}
                    />
                  </div>
                </label>
              </div>
              <div>
                <label htmlFor="total_break_time">{t("Breaktime")}</label>
                <input
                  id="total_break_time"
                  className="w-full text-center border border-black"
                  type="text"
                  value={timesheet.total_break_time}
                  onChange={(e) => handleInputChange(e, timesheet.id, "total_break_time")}
                  readOnly={!edit}
                />
              </div>
              <div>
                <label htmlFor="jobsite_id">{t("JobSites")}</label>
                <select
                  id="jobsite_id"
                  className="text-center border border-black"
                  value={timesheet.jobsite_id}
                  onChange={(e) => handleCodeChange(e, timesheet.id, "jobsite_id")}
                  disabled={!edit}
                >
                  {jobsites.map((jobsite) => (
                    <option key={jobsite.id} value={jobsite.jobsite_id}>
                      {jobsite.jobsite_id}
                    </option>
                  ))}
                </select>
                <label htmlFor="costcode">{t("CostCode")}</label>
                <select
                  id="costcode"
                  className="text-center border border-black"
                  value={timesheet.costcode}
                  onChange={(e) => handleCodeChange(e, timesheet.id, "costcode")}
                  disabled={!edit}
                >
                  {costcodes.map((costcode) => (
                    <option key={costcode.id} value={costcode.cost_code}>
                      {costcode.cost_code}
                    </option>
                  ))}
                </select>
              </div>
            </li>
          ))}
        </ul>
      )}
      <div>
      </div>
    </div>
  );
}