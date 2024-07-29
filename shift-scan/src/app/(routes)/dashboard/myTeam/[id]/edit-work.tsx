import { editTimeSheet } from "@/actions/timeSheetActions";
import { useState, useEffect } from "react";

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

type EditWorkProps = {
  edit: boolean;
  costcodesData: CostCode[];
  jobsitesData: Jobsite[];
  timesheetData: Timesheet[];
  handleFormSubmit: (employeeId: string, date: string, message?: string) => void;
  setEdit: (edit: boolean) => void;
};

export default function EditWork({ timesheetData, jobsitesData, costcodesData, edit, handleFormSubmit, setEdit}: EditWorkProps) {
  const [timesheets, setTimesheets] = useState<Timesheet[]>([]);
  const [prevtimesheets, setprevTimesheets] = useState<Timesheet[]>(timesheetData);
  const [jobsites] = useState<Jobsite[]>(jobsitesData);
  const [costcodes] = useState<CostCode[]>(costcodesData);
  const [message, setMessage] = useState<string | null>(null);


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
    console.log(`Date input change: id=${id}, field=${field}, value=${value}`);

    setTimesheets((prevTimesheets) =>
      prevTimesheets.map((timesheet) => {
        if (timesheet.id === id) {
          const updatedTimesheet = { ...timesheet, [field]: value };

          console.log(`Saving changes: id=${timesheet.id}, start_time=${updatedTimesheet.start_time}, end_time=${updatedTimesheet.end_time}`);

          return {
            ...updatedTimesheet,
          };
        }
        return timesheet;
      })
    );
  };

  const handleCodeChange = (e: React.ChangeEvent<HTMLSelectElement>, id: string) => {
    const newJobsiteId = e.target.value;
    setTimesheets((prevTimesheets) =>
      prevTimesheets.map((timesheet) =>
        timesheet.id === id ? { ...timesheet, jobsite_id: newJobsiteId } : timesheet
      )
    );
  };

  const handleSaveChanges = async () => {
    try {
      for (const timesheet of timesheets) {
        const formData = new FormData();
        formData.append("id", timesheet.id);
        formData.append("submit_date", timesheet.submit_date);
        formData.append("employeeId", ""); // Add employeeId if available
        formData.append("costcode", timesheet.costcode);
        formData.append("start_time", `${timesheet.start_date}T${timesheet.start_time}`);
        formData.append("end_time", `${timesheet.end_date}T${timesheet.end_time}`);
        formData.append("total_break_time", timesheet.total_break_time);
        formData.append("jobsite_id", timesheet.jobsite_id); // Add jobsite ID to form data

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
      console.log("Initialized timesheets:", initializedTimesheets);
      setTimesheets(initializedTimesheets);
    }
  }, [timesheetData]);


  return (
    <div>
      {message ? (
        <p className="text-center">{message}</p>
      ) : (
        <ul>
          {edit ? <button onClick={handleSaveChanges}>Save Changes</button> : null}
          {timesheets.map((timesheet) => (
            <li
              key={timesheet.id}
              className="flex flex-col justify-center items-center m-auto text-black text-2xl bg-white p-2 rounded border-2 border-black lg:text-2xl lg:p-3"
            >
              <div className=" flex flex-col justify-center items-center">
              <h2>{new Date(timesheet.submit_date).toLocaleDateString()}</h2>
              <input
                className=""
                id="submit_date"
                type="date"
                value={new Date(timesheet.submit_date).toISOString().split('T')[0]}
                hidden
                />
              </div>
              <div>
              <label htmlFor="duration">
                Duration {edit ? (
                    <span className="text-red-500 italic text-sm flex flex-wrap">
                      The duration updates when editing changes are saved.
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
                  Clock In
                  <div className="flex flex-row w-full border border-black">
                    <input
                      id="start_date"
                      className=""
                      type="date"
                      value={timesheet.start_date || ''}
                      onChange={(e) => handleInputChangeDate(e, timesheet.id, "start_date")}
                      readOnly={!edit}
                    />
                    <input
                      id="start_time"
                      className=""
                      type="time"
                      value={timesheet.start_time || ''}
                      onChange={(e) => handleInputChangeDate(e, timesheet.id, "start_time")}
                      readOnly={!edit}
                    />
                  </div>
                </label>
                <label>
                  Clock Out
                  <div className="flex flex-row w-full border border-black">
                    <input
                      id="end_date"
                      className=""
                      type="date"
                      value={timesheet.end_date || ''}
                      onChange={(e) => handleInputChangeDate(e, timesheet.id, "end_date")}
                      readOnly={!edit}
                    />
                    <input
                      id="end_time"
                      className=""
                      type="time"
                      value={timesheet.end_time || ''}
                      onChange={(e) => handleInputChangeDate(e, timesheet.id, "end_time")}
                      readOnly={!edit}
                    />
                  </div>
                </label>
              </div>
              <div>
                <label htmlFor="total_break_time">Total Break Time</label>
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
                <label htmlFor="jobsite_id">Job Sites:</label>
                <select
                  id="jobsite_id"
                  className=" text-center border border-black"
                  value={timesheet.jobsite_id}
                  onChange={(e) => handleCodeChange(e, timesheet.id)}
                  disabled={!edit}
                >
                  <option>Select a Jobsite ID</option>
                  {jobsites.map((jobsite) => (
                    <option key={jobsite.id} value={jobsite.jobsite_id}>
                      {jobsite.jobsite_id}
                  </option>
                  ))}
                </select>
                <label htmlFor="costcode">Cost Codes</label>
                <select
                  id="costcode"
                  className=" text-center border border-black"
                  value={timesheet.costcode}
                  onChange={(e) => handleCodeChange(e, timesheet.id)}
                  disabled={!edit}
                >
                  {costcodes.map((costcode) => (
                    <option key={costcode.id} value={costcode.cost_code}>
                      {costcode.cost_code}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="jobsite_id">Equipment</label>
                <select
                  id="jobsite_id"
                  className=" text-center border border-black"
                  value={timesheet.jobsite_id}
                  onChange={(e) => handleCodeChange(e, timesheet.id)}
                  disabled={!edit}
                >
                  <option>Select a Jobsite ID</option>
                  {jobsites.map((jobsite) => (
                    <option key={jobsite.id} value={jobsite.jobsite_id}>
                      {jobsite.jobsite_id}
                  </option>
                  ))}
                </select>
                <label>
                 Total Time {/* this is the total time for equipment */}
                <input
                      id=""
                      className=" text-center border border-black"
                      type="time"
                      value={timesheet.end_time || ''}
                      onChange={(e) => handleInputChangeDate(e, timesheet.id, "end_time")}
                      readOnly={!edit}
                    />
                </label>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}