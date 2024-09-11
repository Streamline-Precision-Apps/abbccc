"use client";
import React, { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { useEQScanData } from "@/app/context/equipmentContext";
import { useScanData } from "@/app/context/JobSiteScanDataContext";
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
import { TitleBoxes } from "../(reusable)/titleBoxes";
import {AssetEquipment} from "@/lib/types";

// interface Equipment {
//     id: string;
//     name: string;
//     qr_id: string;
//     images?: string;
// }

type VerifyProcessProps = {
id: string | undefined;
handleNextStep: () => void;
type: string;
option?: string;
equipment: AssetEquipment[];
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
const [selectedEquipment, setEquipment] = useState<AssetEquipment | null>(null);

// if the jobsite is not in the case it will be stored in local storage
if (!scanResult?.data) {
const jobSiteId = localStorage.getItem("jobSite");
setScanResult({ data: jobSiteId || "" });
}


return (
<>
<TitleBoxes title= {t("VerifyEquipment")} titleImg="/new/equipment.svg" titleImgAlt="Equipment icon" variant="row" size="default" type="row" />
<Forms action={CreateEmployeeEquipmentLog} onSubmit={()=> handleNextStep()}>
    <Labels variant="default" size="default">
    {t("Equipment-result")}
    <Inputs
        defaultValue={equipment?.find((equipment) => equipment.qr_id === scanEQResult?.data)?.name}
    />
        </Labels>
{/*If image is not found it will be null */}
    {(equipment?.find((equipment) => equipment.qr_id === scanEQResult?.data)?.image) ? 
    <Images variant="default" size="default" titleImg={equipment?.find((equipment) => equipment.qr_id === scanEQResult?.data)?.image ?? ""} titleImgAlt="
    Equipment Image not found" /> : null}
    

    <Inputs
        type="hidden"
        name="name"
        value={scanEQResult?.data || ""}
        className="p-2 text-center"
        readOnly
    />
    <Labels variant="default" size="default" >
    {t("Equipment-notes-title")} 

    <TextAreas
        name="equipment_notes"
        className="p-2 border-2 border-black w-full"
        rows={5}
        placeholder="You get 40 characters for notes. You can edit notes later."
        maxLength={40}
    />
    </Labels>
    <Buttons
        variant={"default"}
        size={"maxBtn"}
        type="submit"
    >
    <Texts size="p0" variant={"default"} >
        {t("Next-btn")}
        </Texts>
    </Buttons>
    
    <Inputs type="hidden" name="equipment_id" value={scanEQResult?.data || ""} />
    <Inputs type="hidden" name="jobsite_id" value={scanResult?.data || ""} />
    <Inputs type="hidden" name="start_time" value={new Date().toISOString()} />
    <Inputs type="hidden" name="employee_id" value={id || ""} />
    </Forms>
</>
);
};

export default VerificationEQStep;