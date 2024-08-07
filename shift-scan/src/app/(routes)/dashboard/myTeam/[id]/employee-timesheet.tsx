"use client";
import { useEffect, useRef, useState } from "react";
import { fetchTimesheets } from "@/actions/timeSheetActions";
import EditWork from "./edit-work";
import { Sections } from "@/components/(reusable)/sections";
import { Titles } from "@/components/(reusable)/titles";
import { fetchEq } from "@/actions/equipmentActions";

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
    <Sections size={"dynamic"} variant={"default"}>
    <Sections size={"titleBox"} variant={"default"}>
        <h1>Select Date</h1>
        <form ref={formRef} onChange={handleFormChange} onSubmit={handleFormSubmit}>
        <input type="date" name="date" id="date" className="flex justify-center m-auto text-black text-2xl bg-white p-2 rounded border-2 border-black rounded-2xl" />
        <input type="hidden" name="id" value={employeeId} />
        </form>
        <Titles variant={"green"}>{message}</Titles>
    </Sections>
    <Sections size={"dynamic"}>
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
    </Sections>
    </Sections>
</>
);
};