"use client";
import { useEffect, useState } from "react";
import { Holds } from "../(reusable)/holds";
import MultipleRoles from "./multipleRoles";
import QRStep from "./qr-step";
import { useSavedCostCode } from "@/app/context/CostCodeContext";
import { useScanData } from "@/app/context/JobSiteScanDataContext";
import { setAuthStep } from "@/app/api/auth";
import useFetchAllData from "@/app/(content)/FetchData";
import { useEQScanData } from "@/app/context/equipmentContext";
import { Titles } from "../(reusable)/titles";
import { useTranslations } from "next-intl";
import CodeStep from "./code-step";
import VerificationStep from "./verification-step";
import RedirectAfterDelay from "../redirectAfterDelay";
import { useTruckScanData } from "@/app/context/TruckScanDataContext";
import { useStartingMileage } from "@/app/context/StartingMileageContext";

type NewClockProcessProps = {
  mechanicView: boolean;
  tascoView: boolean;
  truckView: boolean;
  laborView: boolean;
  returnpath: string;
  option: string;
  type: string;
  scannerType: string;
  locale: string;
};

export default function NewClockProcess({
  mechanicView,
  tascoView,
  truckView,
  laborView,
  type,
  returnpath,
  option,
  scannerType,
  locale,
}: NewClockProcessProps) {
  useFetchAllData(); // Fetch data on mount

  // State management
  const [step, setStep] = useState(0);
  const [clockInRole, setClockInRole] = useState("");
  const [scanner, setScanner] = useState("");
  const [path, setPath] = useState("");

  // Contexts
  const { savedCostCode, setCostCode } = useSavedCostCode();
  const { scanResult, setScanResult } = useScanData();
  const { scanEQResult } = useEQScanData();
  const { truckScanData } = useTruckScanData();
  const { startingMileage } = useStartingMileage();

  const t = useTranslations("Clock");

  // Helper functions
  const handleNextStep = () => setStep((prevStep) => prevStep + 1);

  const handleChangeJobsite = () => {
    const jobsite = localStorage.getItem("jobSite");
    if (jobsite) {
      setScanResult({ data: jobsite });
      setStep(type === "equipment" ? 0 : 3); // Avoid throwing errors here
    }
  };

  const handleAlternativePath = () => {
    setStep(2);
    handleNextStep();
  };

  const handleReturn = () => {
    const jobsite = localStorage.getItem("jobSite");
    const costCode = localStorage.getItem("costCode");
    if (jobsite && costCode) {
      setScanResult({ data: jobsite });
      setCostCode(costCode);
      setAuthStep("success");
      setStep(4);
    } else {
      setStep(0);
    }
  };

  // useEffect to handle scanner type
  useEffect(() => {
    const scannedData =
      scannerType === "EQ" ? scanEQResult?.data : scanResult?.data;
    setScanner(scannedData || "");
  }, [scanEQResult?.data, scanResult?.data, scannerType]);

  // useEffect to set path based on scanner
  useEffect(() => {
    if (scanner) {
      const processFilter = scanner.slice(0, 1).toUpperCase();
      setPath(
        processFilter === "J"
          ? "jobsite"
          : processFilter === "E"
          ? "equipment"
          : ""
      );
    } else {
      setPath("");
    }
  }, [scanner]);

  // useEffect to reset step and role on mount/unmount
  useEffect(() => {
    setStep(0);
    setClockInRole("");
    return () => {
      setStep(0);
      setClockInRole("");
    };
  }, []);

  // useEffect to choose role
  useEffect(() => {
    let role = "general";
    if (mechanicView) role = "mechanic";
    else if (truckView) role = "truck";
    else if (tascoView) role = "tasco";
    else if (!laborView) role = ""; // Default to no role if no valid views

    setClockInRole(role);
    setStep(role ? 1 : 0);
  }, [mechanicView, truckView, tascoView, laborView]);

  // Conditional render for equipment path
  if (path === "equipment") {
    return <Holds>{step === 0 && <div>Step 0 - Equipment</div>}</Holds>;
  }

  return (
    <Holds className="p-5 h-full w-full">
      {/* Multiple Role Selection */}
      {step === 0 && (
        <MultipleRoles
          handleNextStep={handleNextStep}
          setClockInRole={setClockInRole}
          clockInRole={clockInRole}
        />
      )}

      {/* General Role */}
      {step === 1 && clockInRole === "general" && (
        <QRStep
          type="jobsite"
          handleAlternativePath={handleAlternativePath}
          handleNextStep={handleNextStep}
          handleChangeJobsite={handleChangeJobsite}
          handleReturn={handleReturn}
          url={returnpath}
          option={option}
        />
      )}

      {/* Mechanic Role */}
      {step === 1 && clockInRole === "mechanic" && (
        <QRStep
          type="jobsite"
          handleAlternativePath={handleAlternativePath}
          handleNextStep={handleNextStep}
          handleChangeJobsite={handleChangeJobsite}
          handleReturn={handleReturn}
          url={returnpath}
          option={option}
        />
      )}

      {/* Truck Role */}
      {step === 1 && clockInRole === "truck" && <div>Step 1 - Truck</div>}

      {/* Tasco Role */}
      {step === 1 && clockInRole === "tasco" && <div>Step 1 - Tasco</div>}

      {/* Special Forms Section */}
      {step === 2 && <div>Step 2</div>}

      {/* Select Jobsite Section */}
      {step === 3 && (
        <CodeStep datatype="jobsite" handleNextStep={handleNextStep} />
      )}

      {/* Select Cost Code Section */}
      {step === 4 && (
        <CodeStep datatype="costcode" handleNextStep={handleNextStep} />
      )}

      {/* Verification Page */}
      {step === 5 && (
        <VerificationStep
          type={clockInRole}
          handleNextStep={handleNextStep}
          option={option}
          comments={undefined}
        />
      )}

      {/* Confirmation Page */}
      {step === 6 && (
        <div>
          <Titles size="h1">{t("Confirmation-job-message-1")}</Titles>
          {option === "break" && (
            <Titles size="h4">Hope you enjoyed your Break!</Titles>
          )}
          {type === "switchJobs" ? (
            <>
              <Titles size="h4">{t("Confirmation-job-message-3")}</Titles>
              <Titles size="h4">{t("Confirmation-job-message-4")}</Titles>
            </>
          ) : (
            <Titles size="h4">{t("Confirmation-job-message-2")}</Titles>
          )}
          <Titles size="h2">
            {t("JobSite-label")} {scanResult?.data}
          </Titles>
          <Titles size="h2">
            {t("CostCode-label")} {savedCostCode}
          </Titles>
          {truckScanData && (
            <Titles size="h2">
              {t("Truck-label")} {truckScanData}
            </Titles>
          )}
          {truckScanData && (
            <Titles size="h2">
              {t("Mileage")} {startingMileage}
            </Titles>
          )}
          <Titles size="h2">
            {t("Confirmation-time")}{" "}
            {new Date().toLocaleDateString(locale, {
              hour: "numeric",
              minute: "numeric",
              second: "numeric",
            })}
          </Titles>
          <RedirectAfterDelay delay={5000} to="/dashboard" />
        </div>
      )}
    </Holds>
  );
}
