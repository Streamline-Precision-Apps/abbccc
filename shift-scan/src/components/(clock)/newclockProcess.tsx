"use client";
import { use, useEffect, useState } from "react";
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

  const handleAlternativePathEQ = () => {
    setStep(1);
  };

  const handleReturn = () => {
    const jobsite = localStorage.getItem("jobSite");
    const costCode = localStorage.getItem("costCode");
    const clockInRoleRes = localStorage.getItem("clockInRole") || clockInRole;

    if (jobsite && costCode && clockInRole === "general") {
      setClockInRole(clockInRoleRes || "");
      setScanResult({ data: jobsite });
      setCostCode(costCode);
      setAuthStep("success");
      setStep(4);
    } else if (jobsite && costCode && clockInRole === "truck") {
      setClockInRole(clockInRoleRes || "");
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
    if (type === "switchJobs") {
      setStep(0);
    } else {
      setStep(role === "" ? 0 : 1);
    }
  }, [mechanicView, truckView, tascoView, laborView, type]);

  useEffect(() => {
    console.log("step", step);
  }), [step, ];


  // Conditional render for equipment path
  if (type === "equipment") {
    return (
      <>
        {step === 0 && (
          <QRStep
            option="equipment"
            type="equipment"
            handleAlternativePath={handleAlternativePathEQ}
            handleNextStep={handleNextStep}
            url="/dashboard"
            clockInRole={""}
          />
        )}
        {step === 1 && (
          <CodeStep datatype="equipment" handleNextStep={handleNextStep} />
        )}
        {step === 2 && (
          <VerificationEQStep handleNextStep={handleNextStep} />
        )}
        {step === 3 && (
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
  /* 
Clock In Process method 
-----------------------------------------------------------------------------------------------
STEP 0:
  a: If you switch roles you will be prompted to write a comment in the Multiple role section
    1: Comment will be saved to local storage and in a context
  b: You will then will select a role if you have multiple roles

General Role, Mechanic Role, Truck Driver Role, T.A.S.C.O Role: (scanner will be different for each)
STEP 1:
  a: Scan a QR code to select a jobsite
  b: Optional selection of jobsite
STEP 2: Select a Cost Code for the jobsite selected
Step 3: Verify page for all Information capture and then submit it to the backend
step 4: Confirmation page and redirect to dashboard with authorization


trucker role:
-----------------------------------------------------------------------------------------------
STEP 1:
a: scan a QR code to select your truck
b: optional selection of truck code
Step 2: scan a QR code to select for driver
Step 3: Verify page for all Information capture, enter starting mileage, etc and then submit it to the backend
step 4 : confirmation page and redirect to dashboard with authorization
*/

  return (
    <Holds className="h-full w-full">
      {/* Multiple Role Selection */}

      {step === 0 && (
        <MultipleRoles
          handleNextStep={handleNextStep}
          setClockInRole={setClockInRole}
          clockInRole={clockInRole}
          option={option}
          handleReturn={handleReturn}
          type={type}
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
          role={clockInRole}
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
          type={type}
          role={clockInRole}
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
