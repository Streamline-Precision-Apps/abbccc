"use client";
import React, { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { useEQScanData } from "@/app/context/equipmentContext";
import { useScanData } from "@/app/context/JobSiteContext";
import { useSavedCostCode } from "@/app/context/CostCodeContext";
import { useSavedClockInTime } from "@/app/context/ClockInTimeContext";
import { useSavedTimeSheetData } from "@/app/context/TimeSheetIdContext";
import { useSavedUserData } from "@/app/context/UserContext";
import { CreateEmployeeEquipmentLog } from "@/actions/equipmentActions";


type VerifyProcessProps = {
id: string | undefined;
handleNextStep: () => void;
type: string;
option?: string;
}

const VerificationEQStep: React.FC<VerifyProcessProps> = ({
id,
type,
handleNextStep,
option,
}) => {
const [filteredEquipmentName, setFilteredEquipmentName] = useState<string | null>(null);
const t = useTranslations("Clock");
const { scanEQResult } = useEQScanData();
const { scanResult, setScanResult } = useScanData();
const { savedUserData } = useSavedUserData();

// if the jobsite is not in the case it will be stored in local storage
if (!scanResult?.data) {
const jobSiteId = localStorage.getItem("jobSite");
setScanResult({ data: jobSiteId || "" });
}


const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
e.preventDefault();
try {
    if (id === null) {
    throw new Error("User id does not exist");
    }

    const formData = new FormData();
    formData.append("employee_id", id?.toString() || "");
    formData.append("jobsite_id", scanResult?.data || "");
    formData.append("equipment_id", scanEQResult?.data || "");
    formData.append("start_time", new Date().toISOString());
    await CreateEmployeeEquipmentLog(formData);

    handleNextStep();
} catch (error) {
    console.log(error);
}
};

return (
<>

    <h1 className="flex justify-center text-2xl font-bold">
        {t("VerifyEquipment")}
    </h1>
    <form
    onSubmit={handleSubmit}
    className="h-full w-[500px] bg-white flex flex-col items-center rounded-t-2xl"
    >
    <label htmlFor="name">{t("Equipment-result")}</label>
    <input
        type="text"
        name="name"
        value={scanEQResult?.data || ""}
        className="p-2 text-center"
        readOnly
    />
    <label htmlFor="equipment_notes" className="">
    {t("Equipment-notes-title")}
    </label>
    <textarea
        name="equipment_notes"
        className="p-2 border-2 border-black w-full"
        placeholder="Enter notes here..."
    />
    <button
        type="submit"
        className="bg-app-blue w-full h-1/6 py-4 rounded-lg text-black font-bold mt-5"
    >
        {t("Next-btn")}
    </button>
    
    <input type="hidden" name="equipment_id" value={scanEQResult?.data || ""} />
    <input type="hidden" name="jobsite_id" value={scanResult?.data || ""} />
    <input type="hidden" name="start_time" value={new Date().toISOString()} />
    <input type="hidden" name="employee_id" value={savedUserData?.id || ""} />
    </form>
</>
);
};

export default VerificationEQStep;