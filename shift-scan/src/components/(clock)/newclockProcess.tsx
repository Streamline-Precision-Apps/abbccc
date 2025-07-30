"use client";
import { useEffect, useState } from "react";
import { Holds } from "../(reusable)/holds";
import MultipleRoles from "./multipleRoles";
import QRStep from "./qr-handler";
import VerificationStep from "./verification-step";
import TruckClockInForm from "./(Truck)/truckClockInForm";
import TrailerSelector from "./(Truck)/trailerSelector";
import { Titles } from "../(reusable)/titles";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { setWorkRole } from "@/actions/cookieActions";
import SwitchJobsMultiRoles from "./switchJobsMultipleRoles";
import { returnToPrevWork } from "@/actions/timeSheetActions";
import { useSession } from "next-auth/react";
import QRMultiRoles from "./QRMultiRoles";
import ClockLoadingPage from "./clock-loading-page";
import { Contents } from "../(reusable)/contents";
import StepButtons from "./step-buttons";
import { Grids } from "../(reusable)/grids";
import { TitleBoxes } from "../(reusable)/titleBoxes";
import { CostCodeSelector } from "./(General)/costCodeSelector";
import { JobsiteSelector } from "./(General)/jobsiteSelector";
import MechanicVerificationStep from "./(Mechanic)/Verification-step-mechanic";
import TascoVerificationStep from "./(Tasco)/Verification-step-tasco";
import TascoClockInForm from "./(Tasco)/tascoClockInForm";
import TruckVerificationStep from "./(Truck)/Verification-step-truck";
import { fetchWithOfflineCache } from "@/utils/offlineApi";
import { useServerAction } from "@/utils/serverActionWrapper";

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
type Option = {
  id: string;
  label: string;
  code: string;
};

export default function NewClockProcess({
  mechanicView,
  tascoView,
  truckView,
  laborView,
  type,
  returnpath,
  option,
  workRole,
  switchLaborType,
}: NewClockProcessProps) {
  // State management
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
  const [truck, setTruck] = useState<Option>({
    id: "",
    label: "",
    code: "",
  });
  // Trailer state
  const [trailer, setTrailer] = useState<Option>({
    id: "",
    label: "",
    code: "",
  });
  // Equipment state
  const [equipment, setEquipment] = useState<Option>({
    id: "",
    label: "",
    code: "",
  });
  // JobSite state
  const [jobsite, setJobsite] = useState<Option>({
    id: "",
    label: "",
    code: "",
  });
  // CostCode state
  const [cc, setCC] = useState<Option>({
    id: "",
    label: "",
    code: "",
  });
  // Truck states
  const [startingMileage, setStartingMileage] = useState<number>(0);
  // Tasco states
  const [materialType, setMaterialType] = useState<string>("");
  const [shiftType, setShiftType] = useState<string>("");
  const [returnPathUsed, setReturnPathUsed] = useState(false);

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
    // console.log("Available roles:", availableRoles); // Debugging line to check available roles
    setNumberOfRoles(availableRoles.length);

    // Auto-select if exactly one role is available.
    if (availableRoles.length === 1) {
      const selectedRole = availableRoles[0];
      // console.log("Auto-selecting role:", selectedRole); // Debugging line to check selected role
      const autoSelectRole = async () => {
        setClockInRole(selectedRole);
        await execute("setWorkRole", setWorkRole, selectedRole); // Use wrapped server action
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
  // Helper functions

  const handleNextStep = () => setStep((prevStep) => prevStep + 1);
  const handlePrevStep = () => setStep((prevStep) => prevStep - 1);
  const handleScannedPrevStep = () => setStep(2);

  const handleAlternativePath = () => {
    setStep(3);
  };
  const handleAlternativePathEQ = () => {
    setStep(2);
  };
  const { execute } = useServerAction();

  // Lets the user return to the previous work after break
  const handleReturn = async () => {
    try {
      // setting the cookies below to fetch the prev TimeSheet
      const fetchRecentTimeSheetId = await fetchWithOfflineCache(
        "recentTimecardReturn",
        () => fetch("/api/getRecentTimecardReturn").then((res) => res.json())
      );
      const tId = fetchRecentTimeSheetId.id;
      const formData = new FormData();
      formData.append("id", tId?.toString() || "");
      const response = await execute(
        "returnToPrevWork",
        returnToPrevWork,
        formData
      );
      console.log("response:", response);

      if (response) {
        // Set basic information from previous timesheet
        setJobsite({
          id: response.Jobsite.id,
          label: response.Jobsite.name,
          code: response.Jobsite.qrId,
        });
        setCC({
          id: response.CostCode.id,
          label: response.CostCode.name,
          code: response.CostCode.name,
        });

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
        if (response.TascoLogs && response.TascoLogs.length > 0) {
          const firstTascoLog = response.TascoLogs[0];

          if (firstTascoLog.laborType) {
            setClockInRoleTypes(firstTascoLog.laborType);
          }
          if (firstTascoLog.Equipment) {
            setEquipment({
              id: firstTascoLog.Equipment.qrId, // Use qrId as id
              label: firstTascoLog.Equipment.name,
              code: firstTascoLog.Equipment.qrId,
            });
          }

          if (firstTascoLog.materialType) {
            setMaterialType(firstTascoLog.materialType);
          }

          if (firstTascoLog.shiftType) {
            setShiftType(firstTascoLog.shiftType);
          }

          const workTypes = response.TascoLogs.map((log) => log.laborType);
          setClockInRoleTypes(workTypes.toString());
        }

        // Handle Truck-specific data
        if (response.TruckingLogs && response.TruckingLogs.length > 0) {
          const firstTruckLog = response.TruckingLogs[0];

          if (firstTruckLog.laborType) {
            setLaborType(firstTruckLog.laborType);
          }

          if (firstTruckLog.Equipment) {
            const equipment = {
              id: firstTruckLog.Equipment.qrId, // Use qrId as id
              label: firstTruckLog.Equipment.name,
              code: firstTruckLog.Equipment.qrId,
            };
            setEquipment(equipment);
            setTruck(equipment);
          }

          const workTypes = response.TruckingLogs.map(
            (log) => log.laborType
          ).filter(Boolean);
          setClockInRoleTypes(workTypes.toString());
        }

        // Make step navigation consistent
        switch (prevWorkRole) {
          case "general":
          case "mechanic":
          case "tasco":
          case "truck":
            setStep(4); // All roles should start at step 4 for verification
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
        </>
      )}
      {step === 2 && (
        <>
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
              setJobsite={setJobsite}
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
              setJobsite={setJobsite}
            />
          )}
        </>
      )}

      {step === 3 && (
        <Holds background={"white"} className="h-full w-full">
          <Grids rows={"7"} gap={"5"} className="h-full w-full">
            <Holds className="row-start-1 row-end-2 h-full w-full">
              <TitleBoxes onClick={handlePrevStep}>
                <Titles size={"h4"}>{t("Title-jobsite")}</Titles>
              </TitleBoxes>
            </Holds>
            <Holds className="row-start-2 row-end-8 h-full w-full">
              <Contents width="section">
                <Grids rows={"7"} gap={"5"} className="h-full w-full pb-5">
                  <Holds className={"row-start-1 row-end-7 h-full w-full "}>
                    <JobsiteSelector
                      onJobsiteSelect={(jobsite) => {
                        if (jobsite) {
                          setJobsite(jobsite); // Update the equipment state with the full Option object
                        } else {
                          setJobsite({ id: "", code: "", label: "" }); // Reset if null
                        }
                      }}
                      initialValue={jobsite}
                    />
                  </Holds>
                  <Holds className="row-start-7 row-end-8 w-full justify-center">
                    <StepButtons
                      handleNextStep={handleNextStep}
                      disabled={jobsite.code === ""}
                    />
                  </Holds>
                </Grids>
              </Contents>
            </Holds>
          </Grids>
        </Holds>
      )}

      {/* Mechanic Roles START ---------------------*/}
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
          jobsite={jobsite}
        />
      )}
      {/* ------------------------- Mechanic Role END */}

      {/* Trucking Role start ---------------------*/}
      {step === 4 && clockInRole === "truck" && (
        <Holds background={"white"} className="h-full w-full">
          <Grids rows={"7"} gap={"5"} className="h-full w-full">
            <Holds className="row-start-1 row-end-2 h-full w-full">
              <TitleBoxes onClick={handlePrevStep}>
                <Titles size={"h4"}>{t(`Title-costcode`)}</Titles>
              </TitleBoxes>
            </Holds>

            <Holds className={"row-start-2 row-end-8 h-full w-full"}>
              <Contents width="section">
                <Grids rows={"7"} gap={"5"} className="h-full w-full pb-5">
                  <Holds className={"row-start-1 row-end-7 h-full w-full "}>
                    <CostCodeSelector
                      onCostCodeSelect={(costCode) => {
                        if (costCode) {
                          setCC(costCode); // Update the equipment state with the full Option object
                        } else {
                          setCC({ id: "", code: "", label: "" }); // Reset if null
                        }
                      }}
                      initialValue={cc}
                    />
                  </Holds>

                  <Holds className="row-start-7 row-end-8 w-full justify-center">
                    <StepButtons
                      handleNextStep={handleNextStep}
                      disabled={cc.code === ""}
                    />
                  </Holds>
                </Grids>
              </Contents>
            </Holds>
          </Grids>
        </Holds>
      )}
      {step === 5 && clockInRole === "truck" && (
        <TruckClockInForm
          handleNextStep={handleNextStep}
          handlePrevStep={handlePrevStep}
          setLaborType={setLaborType}
          truck={truck}
          setTruck={setTruck}
          equipment={equipment}
          setEquipment={setEquipment}
          setStartingMileage={setStartingMileage}
          startingMileage={startingMileage}
          laborType={laborType}
          clockInRoleTypes={clockInRoleTypes}
          returnPathUsed={returnPathUsed}
          setStep={setStep}
        />
      )}
      {/* Trailer selection step for trucking */}
      {step === 6 && clockInRole === "truck" && (
        <Holds background={"white"} className="h-full w-full">
          <Grids rows={"7"} gap={"5"} className="h-full w-full">
            <Holds className="row-start-1 row-end-2 h-full w-full">
              <TitleBoxes onClick={handlePrevStep}>
                <Titles size={"h4"}>{t("Trailer-label")}</Titles>
              </TitleBoxes>
            </Holds>
            <Holds className="row-start-2 row-end-8 h-full w-full">
              <Contents width="section">
                <Grids rows={"7"} gap={"5"} className="h-full w-full pb-5">
                  <Holds className={"row-start-1 row-end-7 h-full w-full "}>
                    <TrailerSelector
                      onTrailerSelect={(trailer) =>
                        setTrailer(trailer || { id: "", code: "", label: "" })
                      }
                      initialValue={trailer}
                    />
                  </Holds>
                  <Holds className="row-start-7 row-end-8 w-full justify-center">
                    <StepButtons
                      handleNextStep={handleNextStep}
                      disabled={trailer.id === ""}
                    />
                  </Holds>
                </Grids>
              </Contents>
            </Holds>
          </Grids>
        </Holds>
      )}
      {step === 7 && clockInRole === "truck" && (
        <TruckVerificationStep
          jobsite={jobsite}
          laborType={laborType}
          truck={truck}
          trailer={trailer}
          handlePrevStep={handlePrevStep}
          startingMileage={startingMileage}
          type={type}
          role={clockInRole}
          equipment={equipment}
          clockInRoleTypes={clockInRoleTypes}
          handleNextStep={handleNextStep}
          option={option}
          comments={undefined}
          cc={cc}
        />
      )}
      {/* ------------ End of Trucking Role section */}

      {step === 4 && clockInRole === "tasco" && (
        <Holds background={"white"} className="h-full w-full">
          <Grids rows={"7"} gap={"5"} className="h-full w-full">
            <Holds className="row-start-1 row-end-2 h-full w-full">
              <TitleBoxes onClick={handlePrevStep}>
                <Titles size={"h4"}>{t(`Title-costcode`)}</Titles>
              </TitleBoxes>
            </Holds>

            <Holds className={"row-start-2 row-end-8 h-full w-full"}>
              <Contents width="section">
                <Grids rows={"7"} gap={"5"} className="h-full w-full pb-5">
                  <Holds className={"row-start-1 row-end-7 h-full w-full "}>
                    <CostCodeSelector
                      onCostCodeSelect={(costCode) => {
                        if (costCode) {
                          setCC(costCode); // Update the equipment state with the full Option object
                        } else {
                          setCC({ id: "", code: "", label: "" }); // Reset if null
                        }
                      }}
                      initialValue={cc}
                    />
                  </Holds>

                  <Holds className="row-start-7 row-end-8 w-full justify-center">
                    <StepButtons
                      handleNextStep={handleNextStep}
                      disabled={cc.code === ""}
                    />
                  </Holds>
                </Grids>
              </Contents>
            </Holds>
          </Grids>
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
          clockInRoleTypes={clockInRoleTypes}
          returnPathUsed={returnPathUsed}
          setStep={setStep}
          equipment={equipment}
          setEquipment={setEquipment}
        />
      )}
      {step === 6 && clockInRole === "tasco" && (
        <TascoVerificationStep
          jobsite={jobsite}
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
          cc={cc}
          equipment={equipment}
        />
      )}
      {/* --------------------- Tasco Role End */}

      {/* General Role ---------------------*/}
      {step === 4 && clockInRole === "general" && (
        <Holds background={"white"} className="h-full w-full">
          <Grids rows={"7"} gap={"5"} className="h-full w-full">
            <Holds className="row-start-1 row-end-2 h-full w-full">
              <TitleBoxes onClick={handlePrevStep}>
                <Titles size={"h4"}>{t(`Title-costcode`)}</Titles>
              </TitleBoxes>
            </Holds>

            <Holds className={"row-start-2 row-end-8 h-full w-full"}>
              <Contents width="section">
                <Grids rows={"7"} gap={"5"} className="h-full w-full pb-5">
                  <Holds className={"row-start-1 row-end-7 h-full w-full "}>
                    <CostCodeSelector
                      onCostCodeSelect={(costCode) => {
                        if (costCode) {
                          setCC(costCode); // Update the equipment state with the full Option object
                        } else {
                          setCC({ id: "", code: "", label: "" }); // Reset if null
                        }
                      }}
                      initialValue={cc}
                    />
                  </Holds>

                  <Holds className="row-start-7 row-end-8 w-full justify-center">
                    <StepButtons
                      handleNextStep={handleNextStep}
                      disabled={cc.code === ""}
                    />
                  </Holds>
                </Grids>
              </Contents>
            </Holds>
          </Grids>
        </Holds>
      )}
      {step === 5 && clockInRole === "general" && (
        <VerificationStep
          jobsite={jobsite}
          type={type}
          role={clockInRole}
          option={option}
          comments={undefined}
          handlePreviousStep={handlePrevStep}
          clockInRoleTypes={clockInRoleTypes}
          returnPathUsed={returnPathUsed}
          setStep={setStep}
          cc={cc}
        />
      )}
      {/* ------------------ General Role End */}
    </>
  );
}
