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

return (
    <div className="mx-auto h-auto w-full lg:w-1/2 flex flex-col justify-center bg-gradient-to-b from-app-dark-blue via-app-dark-blue to-app-blue py-20 border-l-2 border-r-2 border-black">
    <div className="flex flex-col py-5 px-2 w-11/12 mx-auto h-1/4 border-2 border-black rounded-2xl text-white text-3xl">
        <h1 className="text-2xl pl-5 lg:text-3xl mb-5">Select Date</h1>
        <Form employeeId={employeeId} onFormSubmit={handleFormSubmitWrapper} />
        <ul>
        {timesheets.map((timesheet) => (
            <li key={timesheet.id} className="flex justify-center m-auto text-black text-2xl bg-white p-2 rounded border-2 border-black rounded-2xl lg:text-2xl lg:p-3">
            {new Date(timesheet.start_time).toLocaleString()} - {new Date(timesheet.end_time).toLocaleString()}
            </li>
        ))}
        </ul>
        <ul>
        {timesheets.map((timesheet) => (
            <li key={timesheet.id} className="flex justify-center m-auto text-black text-2xl bg-white p-2 rounded border-2 border-black rounded-2xl lg:text-2xl lg:p-3">
            {timesheet.total_break_time}
            </li>
        ))}
        </ul>
        <ul>
        {timesheets.map((timesheet) => (
            <li key={timesheet.id} className="flex justify-center m-auto text-black text-2xl bg-white p-2 rounded border-2 border-black rounded-2xl lg:text-2xl lg:p-3">
            {timesheet.jobsite_id} - {timesheet.costcode} - {timesheet.duration}
            </li>
        ))}
        </ul>
    </div>
    </div>
);
};