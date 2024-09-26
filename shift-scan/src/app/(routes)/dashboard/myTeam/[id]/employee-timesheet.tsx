"use client";
import { useEffect, useRef, useState } from "react";
import { fetchTimesheets } from "@/actions/timeSheetActions";
import EditWork from "./edit-work";
import { Holds } from "@/components/(reusable)/holds";
import { Titles } from "@/components/(reusable)/titles";
import { fetchEq } from "@/actions/equipmentActions";
import { Contents } from "@/components/(reusable)/contents";
import { Inputs } from "@/components/(reusable)/inputs";

type Props = {
employeeId: string;
costcodeData: any[];
jobsiteData: any[];
equipmentData: any[];
equipment: any[];
};

export const EmployeeTimeSheets = ({ employeeId, costcodeData, equipmentData, equipment, jobsiteData }: Props) => {
const [timesheets, setTimesheets] = useState<any[]>([]);
const [filteredEquipmentData, setFilteredEquipmentData] = useState<any[]>([]);
const [message, setMessage] = useState("");
const [edit, setEdit] = useState(false);
const formRef = useRef<HTMLFormElement>(null);
const [date, setDate] = useState("");

const handleFormSubmitWrapper = async (date: string, message?: string) => {
const results = await fetchTimesheets(employeeId, date);
setTimesheets(results);

const eqResults = await fetchEq(employeeId, date);
setFilteredEquipmentData(eqResults);

setMessage(message || "");
};

const handleFormChange = () => {
formRef.current?.requestSubmit();
};

const handleFormSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
event.preventDefault();
const formData = new FormData(formRef.current!);
const date = formData.get('date') as string;
setDate(date);
handleFormSubmitWrapper(date);
};

const handleFormSubmitFromEditWork = async (employeeId: string, date: string, message?: string) => {
handleFormSubmitWrapper(date, message);
};

useEffect(() => {
setMessage("");
}, [edit]);

return (
<>
<Contents>
    <Holds>
    <Holds 
    background={"darkBlue"}
    className="mb-3">
        <Holds>
            <Titles>Select Date</Titles>{/* Make this a label? */}
        </Holds>
        <form ref={formRef} onChange={handleFormChange} onSubmit={handleFormSubmit}>
            <Inputs type="date" name="date" id="date" className="flex justify-center m-auto text-black text-2xl bg-white p-2 rounded border-2 border-black rounded-2xl" />
            <Inputs type="hidden" name="id" value={employeeId} />
        </form>
        <Titles>{message}</Titles>
    </Holds>
    <Holds background={"white"}>
        <EditWork
        timesheetData={timesheets}
        edit={edit}
        costcodesData={costcodeData}
        jobsitesData={jobsiteData}
        equipmentData={filteredEquipmentData}
        handleFormSubmit={handleFormSubmitFromEditWork}
        setEdit={setEdit}
        employeeId={employeeId}
        date={date}
        equipment={equipment}
        />
    </Holds>
    </Holds>
        </Contents>
</>
);
};