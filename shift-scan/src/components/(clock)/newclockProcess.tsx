"use client";
import { useEffect, useState } from "react";
import { Holds } from "../(reusable)/holds";
import MultipleRoles from "./multipleRoles";
import QRStep from "./qr-handler";
import { useSavedCostCode } from "@/app/context/CostCodeContext";
import { useScanData } from "@/app/context/JobSiteScanDataContext";
import { setAuthStep } from "@/app/api/auth";
import useFetchAllData from "@/app/(content)/FetchData";
import CodeStep from "./code-step";
import VerificationStep from "./verification-step";
import { useTruckScanData } from "@/app/context/TruckScanDataContext";
import { useStartingMileage } from "@/app/context/StartingMileageContext";
import TruckClockInForm from "./truckClockInForm";
import { ConfirmationPage } from "./confirmation-Page";
import VerificationEQStep from "./verification-eq-step";
import { Titles } from "../(reusable)/titles";
import RedirectAfterDelay from "../redirectAfterDelay";
import { useTranslations } from "next-intl";

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
  locale,
}: NewClockProcessProps) {
  useFetchAllData(); // Fetch data on mount

  // State management
  const [step, setStep] = useState(0);
  const [clockInRole, setClockInRole] = useState("");
  const [comments, setComments] = useState(""); // for trucking
  const t = useTranslations("Clock");
  // Contexts
  const { savedCostCode, setCostCode } = useSavedCostCode();
  const { scanResult, setScanResult } = useScanData();
  const { truckScanData } = useTruckScanData();
  const { startingMileage } = useStartingMileage();

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
    const clockInRole = localStorage.getItem("clockInRole");
    if (jobsite && costCode && clockInRole === "general") {
      setClockInRole(clockInRole || "");
      setScanResult({ data: jobsite });
      setCostCode(costCode);
      setAuthStep("success");
      setStep(4);
    } else if (jobsite && costCode && clockInRole === "truck") {
      setClockInRole(clockInRole || "");
      setScanResult({ data: jobsite });
      setCostCode(costCode);
      setAuthStep("success");
      setStep(3);
    } else {
      setStep(0);
    }
  };

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
    let role = "";
    if (mechanicView && !laborView && !truckView && !tascoView)
      role = "mechanic";
    else if (laborView && !mechanicView && !truckView && !tascoView)
      role = "general";
    else if (truckView && !mechanicView && !laborView && !tascoView)
      role = "truck";
    else if (tascoView && !mechanicView && laborView && !truckView)
      role = "tasco";
    else {
      role = "";
    }

    setClockInRole(role);
    setStep(role === "" ? 0 : 1);
  }, [mechanicView, truckView, tascoView, laborView]);

  // Conditional render for equipment path
  if (type === "equipment") {
    return (
      <>
        {step === 1 && (
          <QRStep
            type="equipment"
            handleAlternativePath={handleAlternativePath}
            handleNextStep={handleNextStep}
            url="/dashboard"
            clockInRole={""}
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
    <Holds className="h-full w-full py-5">
      {/* Multiple Role Selection */}
      {step === 0 && (
        <MultipleRoles
          handleNextStep={handleNextStep}
          setClockInRole={setClockInRole}
          clockInRole={clockInRole}
          option={option}
          handleReturn={handleReturn}
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
          clockInRole={clockInRole}
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
          clockInRole={clockInRole} // clock in role will make the qr know which role to use
        />
      )}
      {/* ------------------------- Trucking Role section ---------------------*/}
      {/* Truck Role */}
      {step === 1 && clockInRole === "truck" && (
        <QRStep
          type="jobsite" // two types of types for qr, jobsite or equipment
          handleAlternativePath={handleAlternativePath} // handle alternative path
          handleNextStep={handleNextStep}
          handleChangeJobsite={handleChangeJobsite}
          handleReturn={handleReturn}
          url={returnpath}
          option={option}
          clockInRole={clockInRole}
        />
      )}
      {/* Special Forms Section */}
      {step === 3 && clockInRole === "truck" && (
        <TruckClockInForm
          handleNextStep={handleNextStep}
          setComments={setComments}
        />
      )}

      {/* Verification Page for truck drivers */}
      {step === 4 && clockInRole === "truck" && (
        <VerificationStep
          type={type}
          handleNextStep={handleNextStep}
          option={option}
          comments={comments}
        />
      )}
      {step === 4 && clockInRole === "truck" && (
        <ConfirmationPage
          option={option}
          savedCostCode={savedCostCode}
          scanResult={scanResult?.data}
          truckScanData={truckScanData}
          type={type}
          startingMileage={startingMileage}
          locale={locale}
        />
      )}
      {/* ------------------------- End of Trucking Role section ---------------------*/}
      {/* Tasco Role */}
      {step === 1 && clockInRole === "tasco" && <div>Step 1 - Tasco</div>}

      {/* ----------------------------------------- General Role ---------------------*/}
      {/* Select Jobsite Section */}
      {step === 3 && clockInRole === "general" && (
        <CodeStep datatype="jobsite" handleNextStep={handleNextStep} />
      )}

      {/* Select Cost Code Section */}
      {step === 4 && clockInRole === "general" && (
        <CodeStep datatype="costcode" handleNextStep={handleNextStep} />
      )}

      {/* Verification Page */}
      {step === 5 && clockInRole === "general" && (
        <VerificationStep
          type={clockInRole}
          handleNextStep={handleNextStep}
          option={option}
          comments={undefined}
        />
      )}

      {/* Confirmation Page */}
      {step === 6 && clockInRole === "general" && (
        <ConfirmationPage
          option={option}
          savedCostCode={savedCostCode}
          scanResult={scanResult?.data}
          truckScanData={truckScanData}
          type={type}
          startingMileage={startingMileage}
          locale={locale}
        />
      )}
    </Holds>
  );
}
