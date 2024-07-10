"use client";
import "@/app/globals.css";
import { handleFormSubmit } from "@/actions/timeSheetActions";
import { Form } from "./form";
import { useState } from "react";

export const EmployeeTimeSheets = ({ employeeId }: { employeeId: string }) => {
const [timesheets, setTimesheets] = useState<any[]>([]);

const handleFormSubmitWrapper = async (date: string) => {
    const result = await handleFormSubmit(employeeId, date);
    setTimesheets(result);
};

const handleInputChange = (id: number, field: string, value: string) => {
    setTimesheets((prev) =>
      prev.map((timesheet) =>
        timesheet.id === id ? { ...timesheet, [field]: value } : timesheet
      )
    );
  };

return (
    <div className="mx-auto h-auto w-full lg:w-1/2 flex flex-col justify-center bg-gradient-to-b from-app-dark-blue via-app-dark-blue to-app-blue py-20 border-l-2 border-r-2 border-black">
    <div className="flex flex-col py-5 px-2 w-11/12 mx-auto h-1/4 border-2 border-black rounded-2xl text-white text-3xl">
        <h1 className="text-2xl pl-5 lg:text-3xl mb-5">Select Date</h1>
        <Form employeeId={employeeId} onFormSubmit={handleFormSubmitWrapper} />
        <ul>
        {timesheets.map((timesheet) => (
            <li
            key={timesheet.id}
            className="flex flex-col justify-center m-auto text-black text-2xl bg-white p-2 rounded border-2 border-black rounded-2xl lg:text-2xl lg:p-3"
            >
            <div className="flex flex-row justify-center m-auto text-black text-2xl bg-white p-2 rounded border-2 border-black rounded-2xl lg:text-2xl lg:p-3">
                <label>
                Start Time:
                <input
                    type="datetime-local"
                    value={new Date(timesheet.start_time).toISOString().slice(0, -1)}
                    onChange={(e) =>
                    handleInputChange(
                        timesheet.id,
                        "start_time",
                        new Date(e.target.value).toISOString()
                    )
                    }
                />
                </label>
                <label>
                End Time:
                <input
                    type="datetime-local"
                    value={new Date(timesheet.end_time).toISOString().slice(0, -1)}
                    onChange={(e) =>
                    handleInputChange(
                        timesheet.id,
                        "end_time",
                        new Date(e.target.value).toISOString()
                    )
                    }
                />
                </label>
            </div>
            <div className="flex flex-col w-full border-2 border-black rounded-2xl my-5 lg:text-2xl lg:p-3">
                <label >
                Total Break Time:
                <input className="w-36"
                    type="text"
                    value={timesheet.total_break_time}
                    onChange={(e) =>
                    handleInputChange(timesheet.id, "total_break_time", e.target.value)
                    }
                />
                </label>
            </div>
            <div className="  flex flex-row justify-center m-auto text-black text-2xl bg-white p-2 rounded border-2 border-black rounded-2xl lg:text-2xl lg:p-3">
                <label>
                Jobsite ID:
                <input
                    type="text"
                    value={timesheet.jobsite_id}
                    onChange={(e) =>
                    handleInputChange(timesheet.id, "jobsite_id", e.target.value)
                    }
                />
                </label>
                <label>
                Costcode:
                <input
                    type="text"
                    value={timesheet.costcode}
                    onChange={(e) =>
                    handleInputChange(timesheet.id, "costcode", e.target.value)
                    }
                />
                </label>
                <label>
                Duration:
                <input
                    type="text"
                    value={timesheet.duration}
                    onChange={(e) =>
                    handleInputChange(timesheet.id, "duration", e.target.value)
                    }
                />
                </label>
            </div>
            </li>
        ))}
        </ul>
    </div>
    </div>
);
};