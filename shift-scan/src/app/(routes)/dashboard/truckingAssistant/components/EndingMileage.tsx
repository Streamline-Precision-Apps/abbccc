import { Inputs } from "@/components/(reusable)/inputs";
import { updateTruckingMileage } from "@/actions/truckingActions";
import { useTranslations } from "next-intl";
import { useState, useEffect } from "react";
import { Texts } from "@/components/(reusable)/texts";

type StateMileage = {
  id: string;
  truckingLogId: string;
  state?: string;
  stateLineMileage?: number;
  createdAt?: Date;
};

type Refueled = {
  id: string;
  employeeEquipmentLogId: string | null;
  truckingLogId: string | null;
  gallonsRefueled: number | null;
  milesAtFueling: number | null;
  tascoLogId: string | null;
};

export const EndingMileage = ({
  truckingLog,
  endMileage,
  setEndMileage,
  startingMileage,
  stateMileage,
  refuelLogs,
}: {
  truckingLog: string | undefined;
  endMileage: number | null;
  setEndMileage: React.Dispatch<React.SetStateAction<number | null>>;
  startingMileage: number | null;
  stateMileage?: StateMileage[];
  refuelLogs?: Refueled[];
}) => {
  const t = useTranslations("TruckingAssistant");
  const [validationMessage, setValidationMessage] = useState("");
  const [isValid, setIsValid] = useState(true);

  // Calculate minimum required end mileage
  const getMinimumEndMileage = (): number | null => {
    if (!startingMileage) return null;

    let maxMileage = startingMileage;

    // Check state mileage logs
    if (stateMileage && stateMileage.length > 0) {
      stateMileage.forEach((log) => {
        if (log.stateLineMileage && log.stateLineMileage > maxMileage) {
          maxMileage = log.stateLineMileage;
        }
      });
    }

    // Check refuel logs
    if (refuelLogs && refuelLogs.length > 0) {
      refuelLogs.forEach((log) => {
        if (log.milesAtFueling && log.milesAtFueling > maxMileage) {
          maxMileage = log.milesAtFueling;
        }
      });
    }

    return maxMileage;
  };

  // Validation function
  const validateEndMileage = (value: number | null) => {
    const minRequired = getMinimumEndMileage();

    if (minRequired === null) {
      setValidationMessage("");
      setIsValid(true);
      return true;
    }

    // Show validation message for empty/null values
    if (value === null || value === 0) {
      setValidationMessage(
        `End mileage required, must be ${minRequired.toLocaleString()} or greater`
      );
      setIsValid(false);
      return false;
    }

    if (value < minRequired) {
      setValidationMessage(
        `End mileage must be ${minRequired.toLocaleString()} or greater`
      );
      setIsValid(false);
      return false;
    }

    setValidationMessage("");
    setIsValid(true);
    return true;
  };

  // Validate on mount and when dependencies change
  useEffect(() => {
    validateEndMileage(endMileage);
  }, [startingMileage, stateMileage, refuelLogs, endMileage]);

  const updateEndingMileage = async () => {
    if (!validateEndMileage(endMileage)) return;

    const formData = new FormData();
    formData.append("endingMileage", endMileage?.toString() || "");
    formData.append("id", truckingLog ?? "");
    updateTruckingMileage(formData);
    console.log("Mileage Updated:", endMileage);
  };

  const handleMileageChange = (value: string) => {
    // Strip non-numeric characters
    const numericValue = value.replace(/[^0-9]/g, "");
    const number = numericValue ? parseInt(numericValue) : null;

    setEndMileage(number);
    validateEndMileage(number);
  };

  return (
    <div className="w-full">
      <Inputs
        type="text"
        name="endingMileage"
        value={endMileage ? endMileage.toLocaleString() : ""}
        onChange={(e) => handleMileageChange(e.target.value)}
        onBlur={updateEndingMileage}
        placeholder={t("EnterEndingMileageHere")}
        className={`w-full ${
          endMileage === null || !isValid
            ? "placeholder:text-app-red border-red-500"
            : "border-black"
        } border-[3px] rounded-[10px] pl-3 text-base py-2 focus:outline-hidden focus:ring-transparent focus:border-current`}
      />
      {validationMessage && (
        <div className="text-xs  text-app-red text-center leading-tight">
          {validationMessage}
        </div>
      )}
    </div>
  );
};
