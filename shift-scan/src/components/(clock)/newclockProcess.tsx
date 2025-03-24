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
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { setEquipment, setJobSite, setWorkRole } from "@/actions/cookieActions";
import MechanicVerificationStep from "./Verification-step-mechanic";
import TascoVerificationStep from "./Verification-step-tasco";
import SwitchJobsMultiRoles from "./switchJobsMultipleRoles";
import { useSavedCostCode } from "@/app/context/CostCodeContext";
import { returnToPrevWork } from "@/actions/timeSheetActions";
import TruckVerificationStep from "./Verification-step-truck";
import TascoClockInForm from "./tascoClockInForm";
import { useSession } from "next-auth/react";
import QRMultiRoles from "./QRMultiRoles";
import ClockLoadingPage from "./clock-loading-page";
import { Contents } from "../(reusable)/contents";
import { useOperator } from "@/app/context/operatorContext";

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
  timeSheetId?: string | undefined;
  jobSiteId?: string | undefined;
  costCode?: string | undefined;
  workRole?: string | undefined;
  switchLaborType?: string | undefined;
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
  timeSheetId,
  jobSiteId,
  costCode,
  workRole,
  switchLaborType,
}: NewClockProcessProps) {
  // State management
  const { setEquipmentId } = useOperator();
  const { data: session } = useSession();
  const [step, setStep] = useState<number>(0);
  const [clockInRole, setClockInRole] = useState<string | undefined>(workRole);
  const [clockInRoleTypes, setClockInRoleTypes] = useState<string | undefined>(
    switchLaborType
  ); // use to have more selections for clock processes
  const [numberOfRoles, setNumberOfRoles] = useState(0);
  const [scanned, setScanned] = useState(false);
  const t = useTranslations("Clock");
  const router = useRouter();
  const [laborType, setLaborType] = useState<string>("");
  // Truck states
  const [truck, setTruck] = useState<string>("");
  const [startingMileage, setStartingMileage] = useState<number>(0);
  // Tasco states
  const [materialType, setMaterialType] = useState<string>("");
  const [shiftType, setShiftType] = useState<string>("");
  // Contexts
  const { setScanResult } = useScanData();
  const { setCostCode } = useSavedCostCode();

  const [returnPathUsed, setReturnPathUsed] = useState(false);

  // useEffect to reset step and role on mount/unmount
  useEffect(() => {
    setStep(0);
    return () => {
      setStep(0);
    };
  }, []);

  useEffect(() => {
    console.log("step:", step);
  }, [step]);

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
    setStep(2);
  };

  // Lets the user return to the previous work after break
  const handleReturn = async () => {
    try {
      // setting the cookies below to fetch the prev TimeSheet

      let tId = await fetch("/api/cookies?method=get&name=timeSheetId").then(
        (res) => res.json()
      );

      if (!tId) {
        const fetchRecentTimeSheetId = await fetch(
          "/api/getRecentTimecardReturn"
        ).then((res) => res.json());
        tId = fetchRecentTimeSheetId.id;
      }

      const formData = new FormData();
      formData.append("id", tId?.toString() || "");
      const response = await returnToPrevWork(formData);
      console.log("response:", response);

      if (response) {
        // Set basic information from previous timesheet
        setJobSite(response.jobsiteId);
        setScanResult({ data: response.jobsiteId });
        setCostCode(response.costcode);

        // Determine the role from previous work type
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

        // Handle Tasco-specific data
        if (response.tascoLogs && response.tascoLogs.length > 0) {
          const firstTascoLog = response.tascoLogs[0];

          // Set labor type if exists
          if (firstTascoLog.laborType) {
            setClockInRoleTypes(firstTascoLog.laborType);
          }
          if (firstTascoLog.equipmentId) {
            setEquipment(firstTascoLog.equipmentId);
          }

          // Set material type if exists
          if (firstTascoLog.materialType) {
            setMaterialType(firstTascoLog.materialType);
          }

          // Set shift type if exists
          if (firstTascoLog.shiftType) {
            setShiftType(firstTascoLog.shiftType);
          }

          // Combine all relevant types for role types
          const workTypes = response.tascoLogs.map((log) => log.laborType);

          setClockInRoleTypes(workTypes.toString());
        }

        // Handle Truck-specific data
        if (response.truckingLogs && response.truckingLogs.length > 0) {
          const firstTruckLog = response.truckingLogs[0];

          // Set labor type if exists
          if (firstTruckLog.laborType) {
            setLaborType(firstTruckLog.laborType);
          }

          // Set equipment (truck) if exists
          if (firstTruckLog.equipmentId) {
            setEquipmentId(firstTruckLog.equipmentId);
          }

          const workTypes = response.truckingLogs
            .map((log) => log.laborType)
            .filter(Boolean);
          setClockInRoleTypes(workTypes.toString());
        }

        // Navigate to the correct verification step based on role
        switch (prevWorkRole) {
          case "general":
            setStep(5); // General verification step

            break;
          case "mechanic":
            setStep(4); // Mechanic verification step

            break;
          case "tasco":
            setStep(5); // Tasco verification step
            break;
          case "truck":
            setStep(5); // Truck verification step
            break;
          default:
            throw new Error("Unknown work type");
        }
        setReturnPathUsed(true);
      } else {
        throw new Error("No response from previous timesheet");
      }
    } catch (error) {
      console.error("Error returning to previous work:", error);
      // Handle error appropriately (show message to user, etc.)
    }
  };

  // Sets the page to step 4 on a successful scan
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
  // lets the user route back to previous page that calls the Clock Process
  const handleReturnPath = () => {
    return router.push(returnpath);
  };

  //Clock out equipment process
  //-----------------------------------------------------------------------------------------------
  //-----------------------------------------------------------------------------------------------
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
              url="/dashboard/equipment"
              handleReturnPath={handleReturnPath}
              clockInRole={""}
              setClockInRole={() => {}}
              setScanned={setScanned}
              setClockInRoleTypes={setClockInRoleTypes}
              clockInRoleTypes={clockInRoleTypes}
            />
          </>
        )}

        {step === 2 && (
          <VerificationEQStep
            handleNextStep={handleNextStep}
            handlePrevStep={handlePrevStep}
            handleScannedPrevStep={handleScannedPrevStep}
            scanned={scanned}
          />
        )}
        {step === 3 && (
          <>
            <Titles size={"h1"} className="bg-red-500">
              {t("Confirmation-eq-message-1")}
            </Titles>
            <Titles size={"h4"}>{t("Confirmation-eq-message-2")}</Titles>

            {/* In Order for bug to be overcome, the refresh must occur otherwise the unmounted qr code wont work*
                best solution for now is this because at least it does it behind the modal*/}
          </>
        )}
      </>
    );
  }
  //Clock In Process method
  //-----------------------------------------------------------------------------------------------
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
                clockInRoleTypes={clockInRoleTypes}
                setClockInRoleTypes={setClockInRoleTypes}
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
                setClockInRoleTypes={setClockInRoleTypes}
                clockInRoleTypes={clockInRoleTypes}
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
              setClockInRoleTypes={setClockInRoleTypes}
              clockInRoleTypes={clockInRoleTypes}
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
              setClockInRoleTypes={setClockInRoleTypes}
              clockInRoleTypes={clockInRoleTypes}
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
          clockInRoleTypes={clockInRoleTypes}
          handlePrevStep={handlePrevStep}
          returnPathUsed={returnPathUsed}
          setStep={setStep}
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
          clockInRoleTypes={clockInRoleTypes}
          returnPathUsed={returnPathUsed}
          setStep={setStep}
        />
      )}

      {/* Verification Page for truck drivers */}
      {step === 6 && clockInRole === "truck" && (
        <TruckVerificationStep
          laborType={laborType}
          truck={truck}
          handlePrevStep={handlePrevStep}
          startingMileage={startingMileage}
          type={type}
          role={clockInRole}
          clockInRoleTypes={clockInRoleTypes}
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
        <Holds className="h-full w-full">
          <TascoClockInForm
            handleNextStep={handleNextStep}
            handlePrevStep={handlePrevStep}
            setLaborType={setLaborType}
            laborType={laborType}
            materialType={materialType}
            setMaterialType={setMaterialType}
            shiftType={shiftType}
            setShiftType={setShiftType}
            clockInRoleTypes={clockInRoleTypes}
            returnPathUsed={returnPathUsed}
            setStep={setStep}
          />
        </Holds>
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
          clockInRoleTypes={clockInRoleTypes}
          handlePreviousStep={handlePrevStep}
          comments={undefined}
          returnPathUsed={returnPathUsed}
          setStep={setStep}
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
          clockInRoleTypes={clockInRoleTypes}
          returnPathUsed={returnPathUsed}
          setStep={setStep}
        />
      )}
    </>
  );
}
