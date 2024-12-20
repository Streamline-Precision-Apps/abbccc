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
  // fetching data for the clock process:
  const data = useFetchAllData();
  console.log(data);
  // useState Section ---------------------------------------------------------------------
  const [step, setStep] = useState(0);
  const [clockInRole, setClockInRole] = useState(""); // handleNextStep function to incremen
  // useContext Section -------------------------------------------------------------------
  const { savedCostCode, setCostCode } = useSavedCostCode();
  const { scanResult, setScanResult } = useScanData();
  const { scanEQResult } = useEQScanData();
  const { truckScanData } = useTruckScanData();
  const { startingMileage } = useStartingMileage();

  const [scanner, setScanner] = useState("");
  const [path, setPath] = useState("");
  const t = useTranslations("Clock");

  // handleNextStep function to increment the step
  const handleNextStep = () => {
    setStep((prevStep) => prevStep + 1);
  };
  //  handleNextStep function to increment the step
  const handleChangeJobsite = () => {
    try {
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

  // skip over the Cost Code step
  const handleAlternativePath = () => {
    setStep(2);
    handleNextStep();
  };

  // handleReturn function to return to the previous step
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
        setStep(0);
      }
    } catch (error) {
      console.log(error);
    }
  };

  // useEffect Section -------------------------------------------------------------------
  // set scanner data based on the scanner type
  useEffect(() => {
    if (scannerType === "EQ") {
      setScanner(scanEQResult?.data || "");
    } else {
      setScanner(scanResult?.data || "");
    }
  }, [scanEQResult?.data, scanResult, scannerType]);

  // set path based on scanner data
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

  // reset step to 0 on mount
  useEffect(() => {
    setStep(0);
    setClockInRole("");
    // reset step to 0 on unmount
    return () => {
      setStep(0);
      setClockInRole("");
    };
  }, []);
  // chooseRole function to determine the role of the user
  // if the user has multiple roles, it will choose the first role that is true
  useEffect(() => {
    const chooseRole = () => {
      {
        /* if no roles are selected, set step to 1 and set clockInRole to "general" */
      }
      if (!mechanicView && !truckView && !tascoView && laborView) {
        setStep(1);
        setClockInRole("general");
      } else if (mechanicView && !truckView && !tascoView && !laborView) {
        setStep(1);
        setClockInRole("mechanic");
      } else if (truckView && !mechanicView && !tascoView && !laborView) {
        setStep(1);
        setClockInRole("truck");
      } else if (tascoView && !mechanicView && !truckView && !laborView) {
        setStep(1);
        setClockInRole("tasco");
      } else {
        setStep(0);
      }
    };
    chooseRole();
  }, [mechanicView, truckView, tascoView, laborView, setStep, setClockInRole]);
  // --------------------------------------------------------------------------------------
  // equipment or jobsite path
  if (path === "equipment") {
    return (
      <Holds>
        {/* Step 1 - choose work type if needed */}
        {step === 0 && (
          <>
            <div>Step 0 equipment</div>
          </>
        )}
      </Holds>
    );
  }
  // --------------------------------------------------------------------------------------
  return (
    <Holds className="p-5 h-full w-full">
      {/* Step 1 - choose work type if needed */}
      {step === 0 && (
        <>
          <MultipleRoles
            handleNextStep={handleNextStep}
            setClockInRole={setClockInRole}
            clockInRole={clockInRole}
          />
        </>
      )}

      {/*----------------------------Scanner with certain Type of roles------------------------------------------------*/}

      {/* Step 2 - clock in for general Labor role */}
      {step === 1 && clockInRole === "general" && (
        <>
          <div>Step 1 General</div>
          <QRStep
            type="jobsite"
            handleAlternativePath={handleAlternativePath}
            handleNextStep={handleNextStep}
            handleChangeJobsite={handleChangeJobsite}
            handleReturn={handleReturn}
            url={returnpath}
            option={option}
          />
        </>
      )}

      {/* Step 2 - clock in for mechanic  */}
      {step === 1 && clockInRole === "mechanic" && (
        <>
          <div>Step 1 mechanic</div>
        </>
      )}
      {/* Step 2 - clock in for truck  */}
      {step === 1 && clockInRole === "truck" && (
        <>
          <div>Step 1 truck </div>
        </>
      )}
      {/* Step 2 - clock in for tasco  */}
      {step === 1 && clockInRole === "tasco" && (
        <>
          <div>Step 1 - tasco</div>
        </>
      )}

      {/*----------------------------------------------------------------------------*/}

      {/* Step 3  special forms section based on role */}
      {step === 2 && (
        <>
          <div>Step 2</div>
        </>
      )}
      {/*----------------------------------------------------------------------------*/}
      {/* Step 4  select jobsite section */}
      {step === 3 && (
        <>
          <CodeStep datatype="jobsite" handleNextStep={handleNextStep} />
        </>
      )}

      {/*----------------------------------------------------------------------------*/}
      {/* Step 4  select cost code section */}
      {step === 4 && (
        <>
          <CodeStep datatype="costcode" handleNextStep={handleNextStep} />
        </>
      )}

      {/*----------------------------------------------------------------------------*/}
      {/* Step 5 Verification Page*/}
      {step === 5 && (
        <VerificationStep
          type={clockInRole}
          handleNextStep={handleNextStep}
          option={option}
          comments={undefined}
        />
      )}

      {/*----------------------------------------------------------------------------*/}
      {/* Step 6  */}
      {step === 6 && (
        <>
          <div>
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
              {truckScanData && (
                <Titles size={"h2"}>
                  {t("Truck-label")} {truckScanData}{" "}
                </Titles>
              )}
              {truckScanData && (
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
          </div>
        </>
      )}
    </Holds>
  );
}
