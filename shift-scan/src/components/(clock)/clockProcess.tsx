"use client";
import React, { useContext, useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import QRStep from "@/components/(clock)/qr-step";
import StepButtons from "@/components/(clock)/step-buttons";
import CodeStep from "@/components/(clock)/code-step";
import VerificationStep from "./verification-step";
import VerificationEQStep from "./verification-eq-step";
import { useScanData } from "@/app/context/JobSiteContext";
import RedirectAfterDelay from "@/components/redirectAfterDelay";
import { useSavedClockInTime } from "@/app/context/ClockInTimeContext";
import { useSavedCostCode } from "@/app/context/CostCodeContext";
import { useEQScanData } from "@/app/context/equipmentContext";
import { useDBJobsite } from "@/app/context/dbJobsiteContext";
import { useDBEquipment } from "@/app/context/dbEquipmentContext";
import { useDBCostcode } from "@/app/context/dbCostcodeContext";

type jobCodes = {
    id: number;
    jobsite_id: string;
    jobsite_name: string;
}
type CostCode = {
    id: number;
    cost_code: string;
    cost_code_description: string;
}

type equipment = {
    id: string;
    qr_id: string;
    name: string;
}

interface clockProcessProps{
    scannerType: string;
    id: string | null;
    type: string;
    jobCodes: jobCodes[];
    CostCodes: CostCode[];
    equipment: equipment[];
};

const ClockProcessor: React.FC<clockProcessProps> = ({
id,
type,
equipment,
scannerType,
jobCodes,
CostCodes
}) => {
const t = useTranslations("page2");
const [step, setStep] = useState(1);
const [useQrCode, setUseQrCode] = useState(true);
const { savedCostCode } = useSavedCostCode();
const { scanResult } = useScanData();
const { scanEQResult } = useEQScanData();
const [path, setPath] = useState("");
const [scanner, setScanner] = useState("");
const { jobsiteResults, setJobsiteResults } = useDBJobsite();
const { costcodeResults, setCostcodeResults } = useDBCostcode();
const { equipmentResults, setEquipmentResults } = useDBEquipment();

useEffect(() => {
    setStep(1);
    setJobsiteResults(jobCodes);
    setCostcodeResults(CostCodes);
    setEquipmentResults(equipment);
}, [jobCodes, CostCodes, equipment]);





console.log(jobCodes, CostCodes, equipment);

useEffect(() => {
if (scannerType === "EQ") {
    setScanner(scanEQResult?.data || "");
} else {
    setScanner(scanResult?.data || "");
}
}, [scanResult, scanEQResult, scannerType]);

const handleNextStep = () => {
setStep((prevStep) => prevStep + 1);
};

useEffect(() => {
if (scanner) {
    let processFilter = scanner.slice(0, 1).toUpperCase();
    if (processFilter === "J") {
    setPath("jobsite");
    }
    if (processFilter === "E") {
    setPath("equipment");
    }
    setStep(3);
}
}, [scanner]);


const handleAlternativePath = () => {
setUseQrCode(false);
handleNextStep();
};


if (type === "equipment") {
return (
    <div className="mt-16 h-screen lg:w-1/2 block m-auto">
    <div className="bg-white h-full flex flex-col items-center p-5 rounded-t-2xl">
        {step === 1 && (
        <QRStep
            type="equipment"
            handleAlternativePath={handleAlternativePath}
            handleNextStep={handleNextStep}
        />
        )}
        {step === 2 && (
        <CodeStep
            datatype="equipment"
            handleNextStep={handleNextStep}
        />
        )}
        {step === 3 && (
        <VerificationEQStep
            type={type}
            id={id}
            equipment={equipment}
            handleNextStep={handleNextStep}
        />
        )}
        {step === 4 && (
        <>
            <h1 className="flex justify-center text-2xl font-bold pt-10 pb-10">
            Process Completed
            </h1>
            <p className="text-lg">
            Thank you! Your Equipment has been successfully Logged.
            </p>
            <RedirectAfterDelay delay={2000} to="/dashboard" />
        </>
        )}
    </div>
    </div>
);
}

return (
<div className="mt-16 h-screen lg:w-1/2 block m-auto">
    <div className="bg-white h-full flex flex-col items-center p-5 rounded-t-2xl">
    {step === 1 && (
        <QRStep
        type="jobsite"
        handleAlternativePath={handleAlternativePath}
        handleNextStep={handleNextStep}
        />
    )}
    {step === 2 && (
        <CodeStep
        datatype="jobsite"
        handleNextStep={handleNextStep}

        />
    )}
    {step === 3 && path === "jobsite" && (
        <CodeStep
        datatype="costcode"
        handleNextStep={handleNextStep}
        />
    )}
    {step === 4 && path === "jobsite" && (
        <VerificationStep
        type={type}
        id={id}
        handleNextStep={handleNextStep}
        />
    )}
    {step === 5 && path === "jobsite" && (
        <>
        <h1 className="flex justify-center text-2xl font-bold pt-10 pb-10">
            Process Completed
        </h1>
        <p className="text-lg">
            Thank you! Your timesheet has been successfully created.
        </p>
        <div className="bg-pink-100 h-1/2 w-1/2 flex flex-col items-center p-5 rounded-t-2xl text-xl">
            <h2 className="my-5">
            {t("lN2")} {scanResult?.data}
            </h2>
            <h2 className="my-5">
            {t("lN3")} {savedCostCode}
            </h2>
            <h2 className="my-5">
            {t("lN4")}{" "}
            {new Date().toLocaleDateString("en-US", {
                hour: "numeric",
                minute: "numeric",
                second: "numeric",
            })}
            </h2>
        </div>
        <RedirectAfterDelay delay={3000} to="/dashboard" />
        </>
    )}
    </div>
</div>
);
};

export default ClockProcessor;