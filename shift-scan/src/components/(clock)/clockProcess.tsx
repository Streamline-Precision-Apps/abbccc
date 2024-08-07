"use client";
import React, { useContext, useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import QRStep from "@/components/(clock)/qr-step";
import CodeStep from "@/components/(clock)/code-step";
import VerificationStep from "./verification-step";
import VerificationEQStep from "./verification-eq-step";
import { useScanData } from "@/app/context/JobSiteContext";
import RedirectAfterDelay from "@/components/redirectAfterDelay";
import { useSavedCostCode } from "@/app/context/CostCodeContext";
import { useEQScanData } from "@/app/context/equipmentContext";
interface clockProcessProps{
    scannerType: string;
    id: string | undefined;
    type: string;
    isModalOpen: boolean;
};

const ClockProcessor: React.FC<clockProcessProps> = ({
id,
type,
scannerType,
isModalOpen,
}) => {
const t = useTranslations("Clock");
const [step, setStep] = useState(1);
const [useQrCode, setUseQrCode] = useState(true);
const { savedCostCode } = useSavedCostCode();
const { scanResult, setScanResult } = useScanData();
const { scanEQResult } = useEQScanData();
const [path, setPath] = useState("");
const [scanner, setScanner] = useState("");

useEffect(() => {
    setStep(1);
}, [isModalOpen]);

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

useEffect(() => {
if (!isModalOpen) {
    window.location.reload();
}
}, [isModalOpen]);



const handleAlternativePath = () => {
setUseQrCode(false);
handleNextStep();
};

const handleChangeJobsite = () => {
    try{
    setUseQrCode(false);
    const jobsite = localStorage.getItem("jobSite");
    if (jobsite !== null) {
        setScanResult({ data: jobsite });
        if (type === "equipment"){
            throw new Error("Error");
        }
        else{
            setStep(3);
        }
}
} catch (error) {
    console.log(error);
}
};


if (type === "equipment") {
return (
    <>
        {step === 1 && (
        <QRStep
            type="equipment"
            handleAlternativePath={handleAlternativePath}
            handleNextStep={handleNextStep}
            url="/dashboard"
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
            handleNextStep={handleNextStep}
        />
        )}
        {step === 4 && (
        <>
            <h1 className="flex justify-center text-2xl font-bold pt-10 pb-10">
            {t("Confirmation-eq-message-1")}
            </h1>
            <p className="text-lg">
            {t("Confirmation-eq-message-2")}
            </p>
            <RedirectAfterDelay delay={2000} to="/dashboard" />
        </>
        )}
    </>

);
}

return (

    <>
    {step === 1 && (
        <QRStep
        type="jobsite"
        handleAlternativePath={handleAlternativePath}
        handleNextStep={handleNextStep}
        handleChangeJobsite={handleChangeJobsite}
        url={(type === "switchJobs") ? "/dashboard/switch-jobs" : "/"}
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
        <div className="flex flex-col items-center w-full h-full">
        <h1 className="flex justify-center text-2xl font-bold ">
        {t("Confirmation-job-message-1")}
        </h1>
        {(type === "switchJobs") ? 
        (<><p>{t("Confirmation-job-message-3")}</p>
            <p>{t("Confirmation-job-message-4")}</p>
        </>
        )
        : (<p className="text-lg">{t("Confirmation-job-message-2")}</p>)
        }
            <h2 className="my-5">
            {t("JobSite-label")} {scanResult?.data}
            </h2>
            <h2 className="my-5">
            {t("CostCode-label")} {savedCostCode}
            </h2>
            <h2 className="my-5">
            {t("Confirmation-time")}{" "}
            {new Date().toLocaleDateString("en-US", {
                hour: "numeric",
                minute: "numeric",
                second: "numeric",
            })}
            </h2>
        <RedirectAfterDelay delay={2000} to="/dashboard" /> {/* In Order for bug to be overcomed, the refresh must occur otherwise the unmounted qr code wont work*/}
        </div>
    )}
    </>
);
};

export default ClockProcessor;