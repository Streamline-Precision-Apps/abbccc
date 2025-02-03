"use client";
import { useEffect, useState } from "react";
import { Holds } from "../(reusable)/holds";
import MultipleRoles from "./multipleRoles";
import QRStep from "./qr-handler";
import { useScanData } from "@/app/context/JobSiteScanDataContext";
import CodeStep from "./code-step";
import VerificationStep from "./verification-step";
import TruckClockInForm from "./truckClockInForm";
import VerificationEQStep from "./verification-eq-step";
import { Titles } from "../(reusable)/titles";
import RedirectAfterDelay from "../redirectAfterDelay";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { setJobSite, setWorkRole } from "@/actions/cookieActions";
import MechanicVerificationStep from "./Verification-step-mechanic";
import TascoVerificationStep from "./Verification-step-tasco";
import SwitchJobsMultiRoles from "./switchJobsMultipleRoles";
import { useSavedCostCode } from "@/app/context/CostCodeContext";
import { returnToPrevWork } from "@/actions/timeSheetActions";
import TruckVerificationStep from "./Verification-step-truck";
import TascoClockInForm from "./tascoClockInForm";
import { useSession } from "next-auth/react";
import QRMultiRoles from "./qr-multi-handler";
import ClockLoadingPage from "./clock-loading-page";
import { Contents } from "../(reusable)/contents";

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
  // State management
  const { data: session } = useSession();

  const [step, setStep] = useState<number>(0);
  const [clockInRole, setClockInRole] = useState<string | undefined>(undefined);

  const [numberOfRoles, setNumberOfRoles] = useState(0);
  const [scanned, setScanned] = useState(false);

  const t = useTranslations("Clock");
  const router = useRouter();
  // Contexts
  const { setScanResult } = useScanData();
  const { setCostCode } = useSavedCostCode();

  const [laborType, setLaborType] = useState<string>("");
  const [truck, setTruck] = useState<string>("");
  const [startingMileage, setStartingMileage] = useState<number>(0);

  const [materialType, setMaterialType] = useState<string>("");
  const [shiftType, setShiftType] = useState<string>("");

  // useEffect to reset step and role on mount/unmount
  useEffect(() => {
    setStep(0);
    return () => {
      setStep(0);
    };
  }, []);

  useEffect(() => {
    if (!session) {
      console.log("Session not available yet");
      return;
    }

    // Build a list of available roles based on the view flags.
    const availableRoles: string[] = [];
    if (mechanicView) availableRoles.push("mechanic");
    if (laborView) availableRoles.push("general");
    if (truckView) availableRoles.push("truck");
    if (tascoView) availableRoles.push("tasco");
    console.log("Available roles:", availableRoles);
    setNumberOfRoles(availableRoles.length);

    // Auto-select if exactly one role is available.
    if (availableRoles.length === 1) {
      const selectedRole = availableRoles[0];
      console.log("Auto-selecting role:", selectedRole);
      const autoSelectRole = async () => {
        setClockInRole(selectedRole);
        await setWorkRole(selectedRole); // Ensure setWorkRole returns a promise
        if (type === "switchJobs" || option === "break") {
          setStep(1);
          return;
        } else {
          setStep(2);
        }
      };
      autoSelectRole();
    } else {
      setStep(1);
    }
  }, [session, mechanicView, laborView, truckView, tascoView, type, option]);

  //------------------------------------------------------------------
  //------------------------------------------------------------------
  // Helper functions
  //------------------------------------------------------------------
  //------------------------------------------------------------------
  const handleNextStep = () => setStep((prevStep) => prevStep + 1);
  const handlePrevStep = () => setStep((prevStep) => prevStep - 1);
  const handleScannedPrevStep = () => setStep(2);
  const handleAlternativePath = () => {
    setStep(3);
  };

  const handleAlternativePathEQ = () => {
    setStep(1);
  };

  // Lets the user return to the prev jobsite
  const handleReturn = async () => {
    try {
      // setting the cookies below to fetch the prev TimeSheet
      const tId = await fetch("/api/cookies?method=get&name=timeSheetId").then(
        (res) => res.json()
      );
      const formData = new FormData();
      formData.append("id", tId?.toString() || "");
      const response = await returnToPrevWork(formData);
      // filtering response to match data with current role
      if (response) {
        setJobSite(response.jobsiteId);
        setScanResult({ data: response.jobsiteId });
        setCostCode(response.costcode);
        const prevWorkRole =
          response.workType === "LABOR"
            ? "general"
            : response.workType === "MECHANIC"
            ? "mechanic"
            : response.workType === "TASCO"
            ? "tasco"
            : response.workType === "TRUCK_DRIVER"
            ? "truck"
            : "";

        setClockInRole(prevWorkRole);
        if (prevWorkRole === "truck") {
          setStep(5);
        } else {
          setStep(5);
        }
      } else {
        throw new Error("No response");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleScanJobsite = (type: string) => {
    switch (type) {
      case "general":
        setStep(4);
        break;
      case "mechanic":
        setStep(4);
        break;
      case "tasco":
        setStep(4);
        break;
      case "truck":
        setStep(4);
        break;
      default:
        break;
    }
  };

  const handleReturnPath = () => {
    return router.push(returnpath);
  };
  //------------------------------------------------------------------
  //------------------------------------------------------------------
  // UseEffect  functions
  //------------------------------------------------------------------
  //------------------------------------------------------------------

  // Conditional render for equipment path
  if (type === "equipment") {
    return (
      <>
        {step === 1 && (
          <>
            <QRStep
              option="equipment"
              type="equipment"
              handleAlternativePath={handleAlternativePathEQ}
              handleNextStep={handleNextStep}
              handlePrevStep={handlePrevStep}
              url="/dashboard"
              handleReturnPath={handleReturnPath}
              clockInRole={""}
              setClockInRole={() => {}}
              setScanned={setScanned}
            />
          </>
        )}
        {step === 2 && (
          <CodeStep
            datatype="equipment"
            handlePrevStep={handlePrevStep}
            handleScannedPrevStep={handleScannedPrevStep}
            scanned={scanned}
          />
        )}
        {step === 3 && <VerificationEQStep handleNextStep={handleNextStep} />}
        {step === 4 && (
          <>
            <Titles size={"h1"} className="bg-red-500">
              {t("Confirmation-eq-message-1")}
            </Titles>
            <Titles size={"h4"}>{t("Confirmation-eq-message-2")}</Titles>
            <RedirectAfterDelay delay={5000} to="/dashboard" />{" "}
            {/* In Order for bug to be overcome, the refresh must occur otherwise the unmounted qr code wont work*
                best solution for now is this because at least it does it behind the modal*/}
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
    <>
      {step === 0 && (
        <>
          <ClockLoadingPage handleReturnPath={handleReturnPath} />
        </>
      )}
      {/* Multiple Role Selection */}
      {step === 1 && (
        <>
          <Holds className="h-full w-full">
            {type === "switchJobs" && (
              <SwitchJobsMultiRoles
                handleNextStep={handleNextStep}
                setClockInRole={setClockInRole}
                clockInRole={clockInRole}
                option={option}
                handleReturn={handleReturn}
                type={type}
                numberOfRoles={numberOfRoles}
                handleReturnPath={handleReturnPath}
              />
            )}
            {type === "jobsite" && (
              <MultipleRoles
                numberOfRoles={numberOfRoles}
                handleNextStep={handleNextStep}
                setClockInRole={setClockInRole}
                clockInRole={clockInRole}
                option={option}
                handleReturn={handleReturn}
                type={type}
                handleReturnPath={handleReturnPath}
              />
            )}
          </Holds>
        </>
      )}
      {step === 2 && (
        <Holds className="h-full w-full">
          {numberOfRoles === 1 && (
            <QRStep
              type="jobsite"
              handleReturnPath={handleReturnPath}
              handleAlternativePath={handleAlternativePath}
              handleNextStep={handleNextStep}
              handlePrevStep={handlePrevStep}
              handleReturn={handleReturn}
              handleScanJobsite={handleScanJobsite}
              url={returnpath}
              option={type} // type is the method of clocking in ... general, switchJobs, or equipment
              clockInRole={clockInRole} // clock in role will make the qr know which role to use
              setClockInRole={setClockInRole}
              setScanned={setScanned}
            />
          )}
          {numberOfRoles > 1 && (
            <QRMultiRoles
              type="jobsite"
              handleReturnPath={handleReturnPath}
              handleAlternativePath={handleAlternativePath}
              handleNextStep={handleNextStep}
              handleReturn={handleReturn}
              handleScanJobsite={handleScanJobsite}
              url={returnpath}
              option={type} // type is the method of clocking in ... general, switchJobs, or equipment
              clockInRole={clockInRole} // clock in role will make the qr know which role to use
              setClockInRole={setClockInRole}
              setScanned={setScanned}
            />
          )}
        </Holds>
      )}
      {/* Mechanic Role */}
      {/* ------------------------- Mechanic Role start ---------------------*/}
      {step === 3 && clockInRole === "mechanic" && (
        <Holds background={"white"} className="h-full w-full py-5">
          <Contents width="section">
            <CodeStep
              datatype="jobsite"
              handleNextStep={handleNextStep}
              handlePrevStep={handlePrevStep}
              handleScannedPrevStep={handleScannedPrevStep}
              scanned={scanned}
            />
          </Contents>
        </Holds>
      )}
      {step === 4 && clockInRole === "mechanic" && (
        <MechanicVerificationStep
          type={type}
          role={clockInRole}
          handleNextStep={handleNextStep}
          option={option}
          comments={undefined}
        />
      )}

      {/* ------------------------- Mechanic Role end ---------------------*/}

      {/* Truck Role */}
      {/* ------------------------- Trucking Role start ---------------------*/}

      {step === 3 && clockInRole === "truck" && (
        <Holds background={"white"} className="h-full w-full py-5">
          <Contents width="section">
            <CodeStep
              datatype="jobsite"
              handleNextStep={handleNextStep}
              handlePrevStep={handlePrevStep}
              handleScannedPrevStep={handleScannedPrevStep}
              scanned={scanned}
            />
          </Contents>
        </Holds>
      )}
      {/* Special Forms Section */}
      {step === 4 && clockInRole === "truck" && (
        <Holds background={"white"} className="h-full w-full py-5">
          <Contents width="section">
            <CodeStep
              datatype="costcode"
              handleNextStep={handleNextStep}
              handlePrevStep={handlePrevStep}
              handleScannedPrevStep={handleScannedPrevStep}
              scanned={scanned}
            />
          </Contents>
        </Holds>
      )}
      {step === 5 && clockInRole === "truck" && (
        <TruckClockInForm
          handleNextStep={handleNextStep}
          handlePrevStep={handlePrevStep}
          setLaborType={setLaborType}
          setTruck={setTruck}
          setStartingMileage={setStartingMileage}
          laborType={laborType}
          truck={truck}
        />
      )}

      {/* Verification Page for truck drivers */}
      {step === 6 && clockInRole === "truck" && (
        <TruckVerificationStep
          laborType={laborType}
          truck={truck}
          startingMileage={startingMileage}
          type={type}
          role={clockInRole}
          handleNextStep={handleNextStep}
          option={option}
          comments={undefined}
        />
      )}

      {/* ------------------------- End of Trucking Role section ---------------------*/}

      {/* Tasco Role */}
      {/* ------------------------- Tasco Role start ---------------------*/}
      {/* Tasco Role */}
      {step === 3 && clockInRole === "tasco" && (
        <Holds background={"white"} className="h-full w-full py-5">
          <Contents width="section">
            <CodeStep
              datatype="jobsite"
              handleNextStep={handleNextStep}
              handlePrevStep={handlePrevStep}
              handleScannedPrevStep={handleScannedPrevStep}
              scanned={scanned}
            />
          </Contents>
        </Holds>
      )}
      {step === 4 && clockInRole === "tasco" && (
        <Holds background={"white"} className="h-full w-full py-5">
          <Contents width="section">
            <CodeStep
              datatype="costcode"
              handleNextStep={handleNextStep}
              handlePrevStep={handlePrevStep}
              handleScannedPrevStep={handleScannedPrevStep}
              scanned={scanned}
            />
          </Contents>
        </Holds>
      )}
      {step === 5 && clockInRole === "tasco" && (
        <TascoClockInForm
          handleNextStep={handleNextStep}
          handlePrevStep={handlePrevStep}
          setLaborType={setLaborType}
          laborType={laborType}
          materialType={materialType}
          setMaterialType={setMaterialType}
          shiftType={shiftType}
          setShiftType={setShiftType}
        />
      )}
      {step === 6 && clockInRole === "tasco" && (
        <TascoVerificationStep
          type={type}
          role={clockInRole}
          handleNextStep={handleNextStep}
          option={option}
          laborType={laborType}
          materialType={materialType}
          shiftType={shiftType}
          comments={undefined}
        />
      )}
      {/* ------------------------- Tasco Role End ---------------------*/}

      {/* General Role */}
      {/* ------------------------- General Role ---------------------*/}
      {/* Select Jobsite Section */}
      {step === 3 && clockInRole === "general" && (
        <Holds background={"white"} className="h-full w-full py-5">
          <Contents width="section">
            <CodeStep
              datatype="jobsite"
              handleNextStep={handleNextStep}
              handlePrevStep={handlePrevStep}
              handleScannedPrevStep={handleScannedPrevStep}
              scanned={scanned}
            />
          </Contents>
        </Holds>
      )}
      {/* Select Cost Code Section */}
      {step === 4 && clockInRole === "general" && (
        <Holds background={"white"} className="h-full w-full py-5">
          <Contents width="section">
            <CodeStep
              datatype="costcode"
              handleNextStep={handleNextStep}
              handlePrevStep={handlePrevStep}
              handleScannedPrevStep={handleScannedPrevStep}
              scanned={scanned}
            />
          </Contents>
        </Holds>
      )}
      {/* Verification Page */}
      {step === 5 && clockInRole === "general" && (
        <VerificationStep
          type={type}
          role={clockInRole}
          option={option}
          comments={undefined}
          handlePreviousStep={handlePrevStep}
        />
      )}
      {/* Confirmation Page
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
      )} */}
    </>
  );
}
