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
import { Titles } from "../(reusable)/titles";
import { Forms } from "../(reusable)/forms";
import { Contents } from "../(reusable)/contents";
import { Buttons } from "../(reusable)/buttons";
import { TextAreas } from "../(reusable)/textareas";
import { Labels } from "../(reusable)/labels";
import { Inputs } from "../(reusable)/inputs";
import { Images } from "../(reusable)/images";
import { Texts } from "../(reusable)/texts";

interface Equipment {
    id: string;
    name: string;
    qr_id: string;
    images?: string;
}

type VerifyProcessProps = {
id: string | undefined;
handleNextStep: () => void;
type: string;
option?: string;
equipment: Equipment[];
}

const VerificationEQStep: React.FC<VerifyProcessProps> = ({
id,
type,
handleNextStep,
option,
equipment,
}) => {
const [filteredEquipmentName, setFilteredEquipmentName] = useState<string | null>(null);
const t = useTranslations("Clock");
const { scanEQResult } = useEQScanData();
const { scanResult, setScanResult } = useScanData();
const { savedUserData } = useSavedUserData();
const [selectedEquipment, setEquipment] = useState<Equipment | null>(null);

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
<Titles variant={"default"} size={"h1"}>
        {t("VerifyEquipment")}
</Titles>
    <Contents variant={"default"} size={"default"}>
    <Forms 

    onSubmit={handleSubmit}
    className="h-full w-[500px] bg-white flex flex-col items-center rounded-t-2xl"
    >
    <label htmlFor="name">{t("Equipment-result")}</label>
    <Titles variant="default" size="default">
        {equipment?.find((equipment) => equipment.qr_id === scanEQResult?.data)?.name}
    </Titles>
    <Images variant="default" size="default" titleImg={equipment?.find((equipment) => equipment.qr_id === scanEQResult?.data)?.images ?? ""} titleImgAlt="
    Equipment Image not found" />

    <Inputs
        type="hidden"
        name="name"
        value={scanEQResult?.data || ""}
        className="p-2 text-center"
        readOnly
    />

    {/* <Labels variant="default" size="default" >
    {t("Equipment-notes-title")}
    </Labels>
    <TextAreas
        name="equipment_notes"
        className="p-2 border-2 border-black w-full"
        placeholder="Enter notes here..."
    /> */}
    <Buttons
        variant={"default"}
        size={"listLg"}
        type="submit"
    >
    <Texts size="p0" variant={"default"}>
        {t("Next-btn")}
        </Texts>
    </Buttons>
    
    <Inputs type="hidden" name="equipment_id" value={scanEQResult?.data || ""} />
    <Inputs type="hidden" name="jobsite_id" value={scanResult?.data || ""} />
    <Inputs type="hidden" name="start_time" value={new Date().toISOString()} />
    <Inputs type="hidden" name="employee_id" value={savedUserData?.id || ""} />
    </Forms>
    </Contents>
</>
);
};

export default VerificationEQStep;