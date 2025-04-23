"use client";
import { createContext, useContext, useState, ReactNode } from "react";

type Option = {
  label: string;
  code: string;
};

type ClockProcessContextType = {
  // Step management
  step: number;
  setStep: (step: number) => void;
  handleNextStep: () => void;
  handlePrevStep: () => void;
  handleScannedPrevStep: () => void;

  // Role management
  clockInRole: string | undefined;
  setClockInRole: (role: string | undefined) => void;
  clockInRoleTypes: string | undefined;
  setClockInRoleTypes: (types: string | undefined) => void;
  numberOfRoles: number;
  setNumberOfRoles: (count: number) => void;

  // Scan state
  scanned: boolean;
  setScanned: (scanned: boolean) => void;

  // Truck states
  truck: Option;
  setTruck: (truck: Option) => void;
  equipment: Option;
  setEquipment: (equipment: Option) => void;
  startingMileage: number;
  setStartingMileage: (mileage: number) => void;

  // Tasco states
  materialType: string;
  setMaterialType: (type: string) => void;
  shiftType: string;
  setShiftType: (type: string) => void;
  laborType: string;
  setLaborType: (type: string) => void;

  // Job site and cost code
  profitId: Option;
  setProfitId: (id: Option) => void;
  CC: Option;
  setCC: (cc: Option) => void;

  // Navigation
  handleReturnPath: () => void;
  handleReturn: () => Promise<void>;
  handleScanJobsite: (type: string) => void;
  handleAlternativePath: () => void;
  handleAlternativePathEQ: () => void;

  // Other state
  returnPathUsed: boolean;
  setReturnPathUsed: (used: boolean) => void;
};

const ClockProcessContext = createContext<ClockProcessContextType | undefined>(
  undefined
);

export function ClockProcessProvider({
  children,
  returnpath,
  initialRole,
  initialRoleTypes,
  initialNumberOfRoles = 0,
}: {
  children: ReactNode;
  returnpath: string;
  initialRole?: string;
  initialRoleTypes?: string;
  initialNumberOfRoles?: number;
}) {
  const [step, setStep] = useState<number>(0);
  const [clockInRole, setClockInRole] = useState<string | undefined>(
    initialRole
  );
  const [clockInRoleTypes, setClockInRoleTypes] = useState<string | undefined>(
    initialRoleTypes
  );
  const [numberOfRoles, setNumberOfRoles] = useState(initialNumberOfRoles);
  const [scanned, setScanned] = useState(false);

  // Truck states
  const [truck, setTruck] = useState<Option>({ label: "", code: "" });
  const [equipment, setEquipment] = useState<Option>({ label: "", code: "" });
  const [startingMileage, setStartingMileage] = useState<number>(0);

  // Tasco states
  const [materialType, setMaterialType] = useState<string>("");
  const [shiftType, setShiftType] = useState<string>("");
  const [laborType, setLaborType] = useState<string>("");

  // Job site and cost code
  const [profitId, setProfitId] = useState<Option>({ label: "", code: "" });
  const [CC, setCC] = useState<Option>({ label: "", code: "" });

  // Navigation state
  const [returnPathUsed, setReturnPathUsed] = useState(false);

  // Navigation functions
  const handleNextStep = () => setStep((prevStep) => prevStep + 1);
  const handlePrevStep = () => setStep((prevStep) => prevStep - 1);
  const handleScannedPrevStep = () => setStep(2);
  const handleAlternativePath = () => setStep(3);
  const handleAlternativePathEQ = () => setStep(2);

  // Scan handler
  const handleScanJobsite = (type: string) => {
    switch (type) {
      case "general":
      case "mechanic":
      case "tasco":
      case "truck":
        setStep(4);
        break;
      default:
        break;
    }
  };

  // Return handler would be implemented here
  const handleReturn = async () => {
    // Implementation would go here
  };

  // Return path handler would use the provided returnpath
  const handleReturnPath = () => {
    // Implementation would use the router to navigate to returnpath
  };

  return (
    <ClockProcessContext.Provider
      value={{
        step,
        setStep,
        handleNextStep,
        handlePrevStep,
        handleScannedPrevStep,
        clockInRole,
        setClockInRole,
        clockInRoleTypes,
        setClockInRoleTypes,
        numberOfRoles,
        setNumberOfRoles,
        scanned,
        setScanned,
        truck,
        setTruck,
        equipment,
        setEquipment,
        startingMileage,
        setStartingMileage,
        materialType,
        setMaterialType,
        shiftType,
        setShiftType,
        laborType,
        setLaborType,
        profitId,
        setProfitId,
        CC,
        setCC,
        handleReturnPath,
        handleReturn,
        handleScanJobsite,
        handleAlternativePath,
        handleAlternativePathEQ,
        returnPathUsed,
        setReturnPathUsed,
      }}
    >
      {children}
    </ClockProcessContext.Provider>
  );
}

export function useClockProcess() {
  const context = useContext(ClockProcessContext);
  if (context === undefined) {
    throw new Error(
      "useClockProcess must be used within a ClockProcessProvider"
    );
  }
  return context;
}
