// employee-timesheet.tsx
"use client";

import { useState } from "react";
import { fetchTimesheets} from "@/actions/timeSheetActions";
import { Form } from "./form";
import EditButton from "@/components/editButton";
import EditWork from "./edit-work";

export const EmployeeTimeSheets = ({ employeeId }: { employeeId: string }) => {
    const [timesheets, setTimesheets] = useState<any[]>([]);
    const [edit, setEdit] = useState(false);

    const handleFormSubmitWrapper = async (date: string) => {
        const results = await fetchTimesheets(employeeId, date);
        setTimesheets(results);
    };

    return (
        <div className="mx-auto h-auto w-full lg:w-1/2 flex flex-col justify-center bg-gradient-to-b from-app-dark-blue via-app-dark-blue to-app-blue py-20 border-l-2 border-r-2 border-black">
        <div className="flex flex-col py-5 px-2 w-11/12 mx-auto h-1/4 border-2 border-black rounded-2xl text-white text-3xl">
            <h1 className="text-2xl pl-5 lg:text-3xl mb-5">Select Date</h1>
            <Form employeeId={employeeId} onFormSubmit={handleFormSubmitWrapper} />
            <EditButton edit={edit} setEdit={setEdit} />
            <EditWork timesheetData={timesheets} edit={edit} />
        </div>
        </div>
    );
    };

