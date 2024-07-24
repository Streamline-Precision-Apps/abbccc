import { useState, useEffect, ChangeEvent } from "react";

type Timesheet = {
  id: string;
  start_time: string;
  end_time: string;
  total_break_time: string;
  jobsite_id: string;
  costcode: string;
  duration: string;
};

type EditWorkProps = {
  edit: boolean;
  timesheetData: Timesheet[];
};

export default function EditWork({ timesheetData, edit }: EditWorkProps) {
  const [timesheets, setTimesheets] = useState<Timesheet[]>([]);
  const [message, setMessage] = useState<string | null>(null);


  const calculateDuration = (startTime: string, endTime: string) => {
    const start = new Date(startTime).getTime();
    const end = new Date(endTime).getTime();
    const durationMs = end - start; // duration in milliseconds
    const durationHours = Math.floor(durationMs / (1000 * 60 * 60)); // convert to hours
    const durationMinutes = Math.floor((durationMs % (1000 * 60 * 60)) / (1000 * 60)); // convert to minutes
    return `${durationHours}h ${durationMinutes}m`; // return as human-readable string
  };

  const formatDateForInput = (date: string) => {
    const d = new Date(date);
    const pad = (num: number) => (num < 10 ? '0' : '') + num;
    return `${d.getUTCFullYear()}-${pad(d.getUTCMonth() + 1)}-${pad(d.getUTCDate())}T${pad(d.getUTCHours())}:${pad(d.getUTCMinutes())}`;
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    id: string,
    field: keyof Timesheet
  ) => {
    let value = e.target.value;
    console.log(e.target.value);

    if (field === "start_time" || field === "end_time") {
      value = new Date(e.target.value).toISOString();
      console.log(value);
    }

    setTimesheets((prevData) =>
      prevData.map((timesheet) =>
        timesheet.id === id ? { ...timesheet, [field]: value } : timesheet
      )
    );
  };

  useEffect(() => {
    if (!timesheetData || timesheetData.length === 0) {
      setMessage("No Timesheets Found");
    } else {
      setMessage(null);
      setTimesheets(timesheetData);
    }
  }, [timesheetData]);

  return (
    <div>
      {message ? (
        <p className="text-center">{message}</p>
      ) : (
        <ul>
          {edit ? (<button>Save Changes</button>) : null}
          {timesheets.map((timesheet) => (
            <li
              key={timesheet.id}
              className="flex flex-col justify-center m-auto text-black text-2xl bg-white p-2 rounded border-2 border-black lg:text-2xl lg:p-3"
            >
              <div className="flex flex-row justify-center">
                <label>
                  Start Time:
                  <input
                    className="border border-black"
                    type="datetime-local"
                    value={formatDateForInput(timesheet.start_time)}
                    onChange={(e) => handleInputChange(e, timesheet.id, "start_time")}
                    readOnly={!edit}
                  />
                </label>
                <label>
                  End Time:
                  <input
                    className="border border-black"
                    type="datetime-local"
                    value={formatDateForInput(timesheet.end_time)}
                    onChange={(e) => handleInputChange(e, timesheet.id, "end_time")}
                    readOnly={!edit}
                  />
                </label>
              </div>
              <div>
                <label htmlFor="total_break_time">Total Break Time:</label>
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
                <label htmlFor="jobsite_id">Jobsite ID:</label>
                <input
                  id="jobsite_id"
                  className="w-full text-center border border-black"
                  type="text"
                  value={timesheet.jobsite_id}
                  onChange={(e) => handleInputChange(e, timesheet.id, "jobsite_id")}
                  readOnly={!edit}
                />
              </div>
              <div>
                <label htmlFor="costcode">Costcode:</label>
                <input
                  id="costcode"
                  className="w-full text-center border border-black"
                  type="text"
                  value={timesheet.costcode}
                  onChange={(e) => handleInputChange(e, timesheet.id, "costcode")}
                  readOnly={!edit}
                />
              </div>
              <div>
                <label htmlFor="duration">Duration:</label>
                <input
                  id="duration"
                  className="w-full text-center border border-black"
                  type="text"
                  value={timesheet.duration}
                  readOnly
                />
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}