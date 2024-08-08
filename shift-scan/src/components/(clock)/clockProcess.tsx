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
import { Titles } from "../(reusable)/titles";
interface clockProcessProps{
    scannerType: string;
    id: string | undefined;
    type: string;
    isModalOpen: boolean;
    locale: string;
};

const ClockProcessor: React.FC<clockProcessProps> = ({
id,
type,
scannerType,
isModalOpen,
locale
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
            <Titles variant={"default"} size={"h1"}>
            {t("Confirmation-eq-message-1")}
            </Titles>
            <Titles variant={"default"} size={"h4"}>
            {t("Confirmation-eq-message-2")}
            </Titles>
            <RedirectAfterDelay delay={500} to="/dashboard" /> {/* In Order for bug to be overcomed, the refresh must occur otherwise the unmounted qr code wont work*
                best solution for now is this becuase at least it does it behind the modal*/}
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
        <div >
        <Titles variant={"default"} size={"h1"}>
        {t("Confirmation-job-message-1")}
        </Titles>
        {(type === "switchJobs") ? 
        (<><Titles variant={"default"} size={"h4"}>{t("Confirmation-job-message-3")}</Titles>
        <Titles variant={"default"} size={"h4"}>{t("Confirmation-job-message-4")}</Titles>
        </>
        )
        : (
            <Titles variant={"default"} size={"h4"}>{t("Confirmation-job-message-2")}</Titles>
        )
        }
            <Titles variant={"default"} size={"h2"}>{t("JobSite-label")} {scanResult?.data}</Titles>
            
            <Titles variant={"default"} size={"h2"}>{t("CostCode-label")} {savedCostCode} </Titles>
            <Titles variant={"default"} size={"h2"}>
            {t("Confirmation-time")}{" "}
            {new Date().toLocaleDateString( locale, {
                hour: "numeric",
                minute: "numeric",
                second: "numeric",
            })}
            </Titles>
        <RedirectAfterDelay delay={500} to="/dashboard" /> {/* In Order for bug to be overcomed, the refresh must occur otherwise the unmounted qr code wont work*
            best solution for now is this becuase at least it does it behind the modal*/}
        </div>
    )}
    </>
);
};

export default ClockProcessor;