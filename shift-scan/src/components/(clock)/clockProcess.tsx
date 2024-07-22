"use client";
import React, { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import QRStep from "@/components/(clock)/qr-step";
import StepButtons from "@/components/(clock)/step-buttons";
import CodeStep from "@/components/(clock)/code-step";
import VerificationStep from "./verification-step";
import Clock from "@/app/(routes)/clock/page";
import { useScanData } from "@/app/context/JobSiteContext";
import RedirectAfterDelay from "@/components/redirectAfterDelay";
import { useSavedClockInTime } from "@/app/context/ClockInTimeContext";
import { useSavedCostCode } from "@/app/context/CostCodeContext";

type clockProcessProps = {
    id: string | null;
    type: string;
    jobCodes: any[]; 
    CostCodes: any[]; // providing a future method of adding costcodes switch
    equipment: any[]; 
    Vehicles: any[]; 
    trailers: any[]; 
};

const ClockProcessor: React.FC<clockProcessProps> = ({ id,type }) => {
const t = useTranslations("page2");
const [step, setStep] = useState(1);
const [useQrCode, setUseQrCode] = useState(true);
const { savedCostCode } = useSavedCostCode();
const { scanResult } = useScanData();
const [path, setPath] = useState("");

const handleNextStep = () => {
    setStep((prevStep) => prevStep + 1);

};
useEffect(() => {
    if (scanResult?.data) {
      // Skip the jobsite step if scanResult is available
        let processFilter = scanResult.data.slice(0, 1).toUpperCase();

        if (processFilter === "J") {
            setPath("jobsite"); // Set path to jobsite Process;
        }

        // for future use of costcodes
        // if (processFilter === "GP") {
        //     setPath("General"); // Set path to general Process;
        // }

        // if (processFilter === "TK") {
        //     setPath("Truck"); // Set path to truck Process;;
        // }

        // if (processFilter === "AG") { // TASCO - The Algumated Sugar company 
        //     setPath("Algumated"); // Set path to "vehicles";
        // }

        // if (processFilter === "ME") {
        //     setPath("Mechanic"); // Set path to mechanic;
        // }
        // // these next if statements are for Equipment Changes and Vehicles

        // if (processFilter === "EQ") {
        //     setPath("Equipment"); // Set path to "costcode";
        // }


        setStep(3);
}
}, [scanResult]);

const handlePrevStep = () => {
    setStep((prevStep) => (prevStep > 1 ? prevStep - 1 : 1));
};

const handleAlternativePath = () => {
    setUseQrCode(false);
    handleNextStep();
};

const handleBackAction = () => {
    setStep(1);
};

return (
    <div className="mt-16 h-screen lg:w-1/2 block m-auto">
    <div className="bg-white h-full flex flex-col items-center p-5 rounded-t-2xl">
        {step === 1 &&  (
        <QRStep handleAlternativePath={handleAlternativePath} handleNextStep={handleNextStep} />
        )}
        {step === 2 &&  (
        <CodeStep datatype="jobsite" handlePrevStep={handlePrevStep} handleNextStep={handleNextStep} />
        )}
        {step === 3 && path === "jobsite" && (
        <CodeStep datatype="costcode" handlePrevStep={handlePrevStep} handleNextStep={handleNextStep} />
        )}
        {step === 4 && path === "jobsite" && (
        <VerificationStep type={type} id={id} handleNextStep={handleNextStep} />
        )}
        {step === 5 && path === "jobsite" && (
        <>
            <h1 className="flex justify-center text-2xl font-bold pt-10 pb-10">Process Completed</h1>
            <p className="text-lg">Thank you! Your timesheet has been successfully created.</p>
            <div className="bg-pink-100 h-1/2 w-1/2 flex flex-col items-center p-5 rounded-t-2xl text-xl">
                <h2 className="my-5">{t("lN2")} {scanResult?.data}</h2>
                <h2 className="my-5">{t("lN3")} {savedCostCode}</h2>
                <h2 className="my-5">{t("lN4")} {new Date().toLocaleDateString('en-US', { hour: 'numeric', minute: 'numeric', second: 'numeric' })}</h2>
            </div>
            <RedirectAfterDelay delay={3000} to="/dashboard" />
        </>
        )}
    </div>
    </div>
);
};

export default ClockProcessor;