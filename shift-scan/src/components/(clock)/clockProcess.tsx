"use client";
import React, { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import QRStep from "@/components/(clock)/qr-step";
import CodeStep from "@/components/(clock)/code-step";
import VerificationStep from "./verification-step";
import VerificationEQStep from "./verification-eq-step";
import { useScanData } from "@/app/context/JobSiteScanDataContext";
import RedirectAfterDelay from "@/components/redirectAfterDelay";
import { useSavedCostCode } from "@/app/context/CostCodeContext";
import { useEQScanData } from "@/app/context/equipmentContext";
import { Titles } from "../(reusable)/titles";
import { setAuthStep } from "@/app/api/auth";
import { useTruckScanData } from "@/app/context/TruckScanDataContext";
import { useStartingMileage } from "@/app/context/StartingMileageContext";

import useFetchAllData from "@/app/(content)/FetchData";
// import { Banners } from "../(reusable)/banners";
import TruckClockInForm from "./truckClockInForm";
type clockProcessProps = {
  scannerType: string;
  type: string;
  locale: string;
  option?: string;
  returnpath: string;
};

export default function ClockProcessor({
  type,
  scannerType,
  locale,
  option,
  returnpath,
}: clockProcessProps) {
  const data = useFetchAllData(); //  the data fetching call
  console.log(data);
  const t = useTranslations("Clock");
  const [step, setStep] = useState(1);
  const [, setUseQrCode] = useState(true);
  const { savedCostCode, setCostCode } = useSavedCostCode();
  const { scanResult, setScanResult } = useScanData();
  const { scanEQResult } = useEQScanData();
  const [path, setPath] = useState("");
  const [scanner, setScanner] = useState("");
  // const [banner, setBanner] = useState("");
  const { truckScanData } = useTruckScanData();
  const { startingMileage } = useStartingMileage();
  const [comments, setComments] = useState("");

  useEffect(() => {
    // sets step to 1 on mount
    setStep(1);
    // sets step to 1 on unmount
    return () => {
      setStep(1);
    };
  }, []);

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
      const processFilter = scanner.slice(0, 1).toUpperCase();
      if (processFilter === "J") {
        setPath("jobsite");
      }
      if (processFilter === "E") {
        setPath("equipment");
      }
    }
  }, [scanner]);

  const handleAlternativePath = () => {
    setUseQrCode(false);
    setPath("jobsite");
    handleNextStep();
  };

  const handleChangeJobsite = () => {
    try {
      setUseQrCode(false);
      const jobsite = localStorage.getItem("jobSite");
      if (jobsite !== null) {
        setScanResult({ data: jobsite });
        if (type === "equipment") {
          throw new Error("Error");
        } else {
          setStep(3);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleReturn = () => {
    try {
      setStep(4);
      const jobsite = localStorage.getItem("jobSite");
      const costCode = localStorage.getItem("costCode");
      if (jobsite !== null && costCode !== null) {
        setScanResult({ data: jobsite });
        setCostCode(costCode);
        setAuthStep("success");
      } else {
        setStep(1);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleScanTruck = () => {
    setPath("truck");
    handleNextStep();
  };

  const handleScanJobsite = () => {
    setPath("jobsite");
    handleNextStep();
    handleNextStep();
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
          <CodeStep datatype="equipment" handleNextStep={handleNextStep} />
        )}
        {step === 3 && (
          <VerificationEQStep type={type} handleNextStep={handleNextStep} />
        )}
        {step === 4 && (
          <>
            <Titles size={"h1"} className="bg-red-500">
              {t("Confirmation-eq-message-1")}
            </Titles>
            <Titles size={"h4"}>{t("Confirmation-eq-message-2")}</Titles>
            <RedirectAfterDelay delay={5000} to="/dashboard" />{" "}
            {/* In Order for bug to be overcomed, the refresh must occur otherwise the unmounted qr code wont work*
                best solution for now is this becuase at least it does it behind the modal*/}
          </>
        )}
      </>
    );
  }

  return (
    <>
      {step === 1 && (
        <>
          {/* {banner !== "" && <Banners background="green">{banner}</Banners>} */}
          <QRStep
            type="jobsite"
            handleAlternativePath={handleAlternativePath}
            handleNextStep={handleNextStep}
            handleChangeJobsite={handleChangeJobsite}
            handleReturn={handleReturn}
            handleScanTruck={handleScanTruck}
            handleScanJobsite={handleScanJobsite}
            url={returnpath}
            option={option}
          />
        </>
      )}
      {step === 2 && path === "jobsite" && (
        <CodeStep datatype="jobsite" handleNextStep={handleNextStep} />
      )}
      {step === 2 && path === "truck" && (
        <TruckClockInForm
          handleNextStep={handleNextStep}
          setComments={setComments}
        />
      )}
      {step === 3 && path === "jobsite" && (
        <CodeStep datatype="costcode" handleNextStep={handleNextStep} />
      )}

      {step === 3 && path === "truck" && (
        <VerificationStep
          type={type}
          handleNextStep={handleNextStep}
          option={option}
          comments={comments}
        />
      )}
      {step === 4 && path === "jobsite" && (
        <VerificationStep
          type={type}
          handleNextStep={handleNextStep}
          option={option}
          comments={undefined}
        />
      )}
      {(step === 5 && path === "jobsite"&& (
          <div>
            <Titles size={"h1"}>{t("Confirmation-job-message-1")}</Titles>
            {option === "break" ? (
              <Titles size={"h4"}>Hope you enjoyed your Break!</Titles>
            ) : null}
            {type === "switchJobs" ? (
              <>
                <Titles size={"h4"}>{t("Confirmation-job-message-3")}</Titles>
                <Titles size={"h4"}>{t("Confirmation-job-message-4")}</Titles>
              </>
            ) : (
              <Titles size={"h4"}>{t("Confirmation-job-message-2")}</Titles>
            )}
            <Titles size={"h2"}>
              {t("JobSite-label")} {scanResult?.data}
            </Titles>

            <Titles size={"h2"}>
              {t("CostCode-label")} {savedCostCode}{" "}
            </Titles>
            {truckScanData !== "" && (
              <Titles size={"h2"}>
                {t("Truck-label")} {truckScanData}{" "}
              </Titles>
            )}
            {startingMileage !== 0 && (
              <Titles size={"h2"}>
                {t("Mileage")} {startingMileage}{" "}
              </Titles>
            )}
            <Titles size={"h2"}>
              {t("Confirmation-time")}{" "}
              {new Date().toLocaleDateString(locale, {
                hour: "numeric",
                minute: "numeric",
                second: "numeric",
              })}
            </Titles>
            <RedirectAfterDelay delay={5000} to="/dashboard" />
          </div>
        ))}
      {(step === 4 && path === "truck" && (
          <div>
            <Titles size={"h1"}>{t("Confirmation-job-message-1")}</Titles>
            {option === "break" ? (
              <Titles size={"h4"}>Hope you enjoyed your Break!</Titles>
            ) : null}
            {type === "switchJobs" ? (
              <>
                <Titles size={"h4"}>{t("Confirmation-job-message-3")}</Titles>
                <Titles size={"h4"}>{t("Confirmation-job-message-4")}</Titles>
              </>
            ) : (
              <Titles size={"h4"}>{t("Confirmation-job-message-2")}</Titles>
            )}
            <Titles size={"h2"}>
              {t("JobSite-label")} {scanResult?.data}
            </Titles>

            <Titles size={"h2"}>
              {t("CostCode-label")} {savedCostCode}{" "}
            </Titles>
            {truckScanData !== "" && (
              <Titles size={"h2"}>
                {t("Truck-label")} {truckScanData}{" "}
              </Titles>
            )}
            {startingMileage !== 0 && (
              <Titles size={"h2"}>
                {t("Mileage")} {startingMileage}{" "}
              </Titles>
            )}
            <Titles size={"h2"}>
              {t("Confirmation-time")}{" "}
              {new Date().toLocaleDateString(locale, {
                hour: "numeric",
                minute: "numeric",
                second: "numeric",
              })}
            </Titles>
            <RedirectAfterDelay delay={5000} to="/dashboard" />
          </div>
        ))}
    </>
  );
}
