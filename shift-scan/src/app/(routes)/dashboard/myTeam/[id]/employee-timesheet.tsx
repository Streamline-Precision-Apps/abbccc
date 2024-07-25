"use client";

import { useEffect, useRef, useState } from "react";
import { fetchTimesheets } from "@/actions/timeSheetActions";
import EditWork from "./edit-work";

type Props = {
    employeeId: string;
    costcodeData: any[];
    jobsiteData: any[];
};

export const EmployeeTimeSheets = ({ employeeId, costcodeData, jobsiteData }: Props) => {
    const [timesheets, setTimesheets] = useState<any[]>([]);
    const [message, setMessage] = useState("");
    const [edit, setEdit] = useState(false);
    const formRef = useRef<HTMLFormElement>(null);
    const [date, setDate] = useState(""); 

    const handleFormSubmitWrapper = async (date: string, message?: string) => {
        const results = await fetchTimesheets(employeeId, date);
        setTimesheets(results);
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

    const editHandler = () => {
        setEdit(!edit);
        console.log(edit);
    }
    useEffect(() => {
        setMessage("");
    }, [edit]);
    

    const buttonClass = edit
    ? "bg-app-red text-4xl font-semibold text-white w-fit h-fit p-2 rounded-lg mb-10 border-2 border-black flex m-auto"
    : "bg-app-orange text-4xl font-semibold text-black w-fit h-fit p-2 rounded-lg mb-10 border-2 border-black flex m-auto";

    const word = edit ? "Cancel" : "Edit";

    return (
        <>
        <div className="mx-auto h-auto w-full lg:w-1/2 flex flex-col justify-center bg-gradient-to-b from-app-dark-blue via-app-dark-blue to-app-blue py-20 border-l-2 border-r-2 border-black">
            <div className="flex flex-col py-5 px-2 w-11/12 mx-auto h-1/4 border-2 border-black rounded-2xl text-white text-3xl">
                <h1 className="text-2xl pl-5 lg:text-3xl mb-5">Select Date</h1>
                <form ref={formRef} onChange={handleFormChange} onSubmit={handleFormSubmit} >
                    <input type="date" name="date" id="date" className="flex justify-center m-auto text-black text-2xl bg-white p-2 rounded border-2 border-black rounded-2xl lg:text-2xl lg:p-3"/>
                    <input type="hidden" name="id" value={employeeId} />
                </form>
                <button className="text-xl text-black font-bold text-center mb-10 bg-app-green">{message}</button>
                <button className={buttonClass} onClick={editHandler}>{word}</button>
                <EditWork 
                    timesheetData={timesheets} 
                    edit={edit} 
                    costcodesData={costcodeData} 
                    jobsitesData={jobsiteData} 
                    handleFormSubmit={handleFormSubmitFromEditWork}
                    setEdit= {setEdit}
                    />
            </div>
        </div>
    </>
    );
};