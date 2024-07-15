"use client";
import "@/app/globals.css";
import {fetchTimesheets } from "@/actions/timeSheetActions";
import { Form } from "./form";
import { useState } from "react";
import EditButton from "@/components/editButton";

export const EmployeeTimeSheets = ({ employeeId }: { employeeId: string }) => {
const [timesheets, setTimesheets] = useState<any[]>([]);

const handleFormSubmitWrapper = async (date: string) => {
const results = await fetchTimesheets(employeeId, date);
    setTimesheets(results);
};

return (
<div className="mx-auto h-auto w-full lg:w-1/2 flex flex-col justify-center bg-gradient-to-b from-app-dark-blue via-app-dark-blue to-app-blue py-20 border-l-2 border-r-2 border-black">
<div className="flex flex-col py-5 px-2 w-11/12 mx-auto h-1/4 border-2 border-black rounded-2xl text-white text-3xl">
    <h1 className="text-2xl pl-5 lg:text-3xl mb-5">Select Date</h1>
    <Form employeeId={employeeId} onFormSubmit={handleFormSubmitWrapper} />

    {/* Editable form data */}
    <ul>
    <EditButton />
    {timesheets.length > 0 ? (
        timesheets.map((timesheet) => (
            <li
            key={timesheet.id}
            className="flex flex-col justify-center m-auto text-black text-2xl bg-white p-2 rounded border-2 border-black rounded-2xl lg:text-2xl lg:p-3"
            >
            <div className="flex flex-row justify-center">
                <label>
                Start Time:
                <input
                    className="bg-gray-200"
                    type="datetime-local"
                    value={new Date(
                    new Date(timesheet.start_time).getTime() -
                        new Date().getTimezoneOffset() * 60000
                    )
                    .toISOString()
                    .slice(0, -1)}
                    readOnly
                />
                </label>
                <label>
                End Time:
                <input
                    className="bg-gray-200"
                    type="datetime-local"
                    value={new Date(
                    new Date(timesheet.end_time).getTime() -
                        new Date().getTimezoneOffset() * 60000
                    )
                    .toISOString()
                    .slice(0, -1)}
                    readOnly
                />
                </label>
            </div>
            <div>
                <label htmlFor="total_break_time" className="">
                Total Break Time:
                </label>
                <input
                id="total_break_time"
                className="w-full flex col text-center border-2 border-black rounded-2xl bg-gray-200"
                type="text"
                value={timesheet.total_break_time}
                readOnly
                />
            </div>
            <div className="flex flex-row items-center justify-center justify-between">
                <div className="text-center">
                <label htmlFor="jobsite_id">Jobsite ID:</label>
                <input
                    id="jobsite_id"
                    className="w-36 flex col text-center border-2 border-black rounded-2xl bg-gray-200"
                    type="text"
                    value={timesheet.jobsite_id}
                    readOnly
                />
                </div>
                <div className="text-center">
                <label htmlFor="costcode">Costcode:</label>
                <input
                    id="costcode"
                    className="w-36 flex col text-center border-2 border-black rounded-2xl bg-gray-200"
                    type="text"
                    value={timesheet.costcode}
                    readOnly
                />
                </div>
                <div className="flex flex-col text-center">
                <label htmlFor="duration">Duration:</label>
                <input
                    id="duration"
                    className="w-36 flex col text-center border-2 border-black rounded-2xl bg-gray-200"
                    type="text"
                    value={timesheet.duration}
                    readOnly
                />
                </div>
            </div>
            </li>
        ))
        ) : (
        <li className="flex flex-col justify-center m-auto text-black text-2xl bg-white p-2 rounded border-2 border-black rounded-2xl lg:text-2xl lg:p-3">
            No Timesheets Found 
        </li>
        )}
    </ul>
</div>
</div>
);
};