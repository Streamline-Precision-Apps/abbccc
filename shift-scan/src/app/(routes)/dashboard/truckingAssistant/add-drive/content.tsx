"use client";
import { Buttons } from "@/components/(reusable)/buttons";
import { Contents } from "@/components/(reusable)/contents";
import { Forms } from "@/components/(reusable)/forms";
import { Inputs } from "@/components/(reusable)/inputs";
import { Labels } from "@/components/(reusable)/labels";
import { Holds } from "@/components/(reusable)/holds";
import { Selects } from "@/components/(reusable)/selects";
import { TextAreas } from "@/components/(reusable)/textareas";
import { Titles } from "@/components/(reusable)/titles";
import { z } from "zod";
import React, { use, useEffect, useMemo, useRef, useState } from "react";
import { useTimeSheetData } from "@/app/context/TimeSheetIdContext";
import { useCurrentView } from "@/app/context/CurrentViewContext";
import { useRouter } from "next/navigation";
import { updateTimeSheet } from "@/actions/timeSheetActions";
import { useTruckScanData } from "@/app/context/TruckScanDataContext";
import { useStartingMileage } from "@/app/context/StartingMileageContext";
import { useScanData } from "@/app/context/JobSiteScanDataContext";
import { useSavedCostCode } from "@/app/context/CostCodeContext";

// Zod schema for form validation
const haulingRequestSchema = z.object({
  jobsiteId: z.string().nonempty({ message: "Site number is required" }),
  vehicleId: z.string().nonempty({ message: "Equipment operated is required" }),
  costcode: z.string().nonempty({ message: "Cost code is required" }),
  notes: z.string().max(200, { message: "Max 200 characters" }),
  materialHauled: z
    .string()
    .nonempty({ message: "Material hauled is required" }),
  quantity: z
    .number()
    .int()
    .positive({ message: "Quantity must be a positive integer" }),
  userId: z.string().nonempty({ message: "User ID is required" }),
});

type HaulingFormProps = {
  user: string | undefined;
};

export default function HaulingForm({ user }: HaulingFormProps) {
  const [quantity, setQuantity] = useState(0);
  const [errorMessage, setErrorMessage] = useState("");
  const { savedTimeSheetData } = useTimeSheetData();
  const { currentView, setCurrentView } = useCurrentView();
  const router = useRouter();
  const { truckScanData, setTruckScanData } = useTruckScanData();
  const { startingMileage, setStartingMileage } = useStartingMileage();
  const formRef = useRef<HTMLFormElement>(null);
  const [step, setStep] = useState(1);
  const { scanResult } = useScanData();
  const { savedCostCode } = useSavedCostCode();

  useEffect(() => {
    if (currentView !== "truck") {
      router.push("/");
    }
  }, []);

  const localStorageData = useMemo(() => {
    return typeof window !== "undefined"
      ? {
          jobsite: localStorage.getItem("jobSite"),
          costCode: localStorage.getItem("costCode"),
          timesheet: JSON.parse(
            localStorage.getItem("savedtimeSheetData") || "{}"
          ),
        }
      : {};
  }, []);

  // Handle submit from clockout:
  const handleSubmit = async () => {
    try {
      const formData = new FormData(formRef.current as HTMLFormElement);
      await updateTimeSheet(formData);
      localStorage.clear();
      setCurrentView("");
      setTruckScanData("");
      setStartingMileage(null);
      router.push("/dashboard");
    } catch (error) {
      console.error("Failed to submit the time sheet:", error);
    }
  };

  // Clock in handle submit:
  // const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
  //   try {
  //     e.preventDefault();

  //     if (!id) {
  //       throw new Error("User id does not exist");
  //     }

  //     if (type === "switchJobs") {
  //       try {
  //         const localeValue = localStorage.getItem("savedtimeSheetData");
  //         const tId = JSON.parse(localeValue || "{}").id;
  //         const formData2 = new FormData();
  //         formData2.append("id", tId?.toString() || "");
  //         formData2.append("endTime", new Date().toISOString());
  //         formData2.append("timesheetComments", "");
  //         formData2.append("appComment", "Switched jobs");

  //         await updateTimeSheetBySwitch(formData2);

  //         const formData = new FormData();
  //         if (truckScanData) {
  //           formData.append("vehicleId", truckScanData);
  //         }
  //         formData.append("submitDate", new Date().toISOString());
  //         formData.append("userId", id?.toString() || "");
  //         formData.append("date", new Date().toISOString());
  //         formData.append("jobsiteId", scanResult?.data || "");
  //         formData.append("costcode", savedCostCode?.toString() || "");
  //         formData.append("startTime", new Date().toISOString());
  //         formData.append("endTime", "");

  //         const response = await CreateTimeSheet(formData);
  //         const result = { id: response.id.toString() };
  //         setTimeSheetData(result);
  //         setAuthStep("success");

  //         if (handleNextStep) {
  //           handleNextStep();
  //         }
  //       } catch (error) {
  //         console.error(error);
  //       }
  //     } else {
  //       const formData = new FormData();
  //       if (truckScanData) {
  //         formData.append("vehicleId", truckScanData);
  //       }
  //       if (startingMileage !== undefined) {
  //         formData.append("startingMileage", startingMileage?.toString() || "0");
  //       }
  //       formData.append("submitDate", new Date().toISOString());
  //       formData.append("userId", id.toString());
  //       formData.append("date", new Date().toISOString());
  //       formData.append("jobsiteId", scanResult?.data || "");
  //       formData.append("costcode", savedCostCode?.toString() || "");
  //       formData.append("startTime", new Date().toISOString());

  //       const response = await CreateTimeSheet(formData);
  //       const result = { id: response.id.toString() };
  //       setTimeSheetData(result);
  //       setAuthStep("success");

  //       if (handleNextStep) {
  //         handleNextStep();
  //       }
  //     }
  //   } catch (error) {
  //     console.error(error);
  //   }
  // };

  const incrementStep = () => {
    setStep((prevStep) => prevStep + 1); // Increment function
  };

  if (step === 1) {
  return (
    <>
      {/* Display error message if validation fails */}
      {errorMessage && <Titles>{errorMessage}</Titles>} 

      <form
        ref={formRef}
        onSubmit={(e) => {
          e.preventDefault(); // Prevent the default form submission
          handleSubmit(); // Call your custom submit logic
        }}
      >
        <Holds background={"white"} className="mb-3">
          <Holds>
            <Inputs
              type="hidden"
              name="id"
              value={(
                savedTimeSheetData?.id || localStorageData?.timesheet.id
              )?.toString()}
              readOnly
            />
            <Inputs
              type="hidden"
              name="endTime"
              value={new Date().toISOString()}
              readOnly
            />
          </Holds>
          <Contents width="section">
            <Holds>
              <Labels>Vehicle ID</Labels>
              <Inputs type="text" name="bvehicleId" value={truckScanData ?? ""} readOnly />
            </Holds>
            <Holds>
              <Labels>Site Number</Labels>
              <Inputs type="text" name="jobsiteId" value={scanResult?.data ?? ""} readOnly />
            </Holds>
            <Holds>
              <Labels>Cost Code</Labels>
              <Inputs type="text" name="costcode" value={savedCostCode ?? ""} readOnly />
            </Holds>
            <Holds>
              <Labels>Material Hauled</Labels>
              <Selects name="materialHauled">
                <option value="">None</option>
                <option value="Steel">Steel</option>
                <option value="Wood">Wood</option>
                <option value="Concrete">Concrete</option>
              </Selects>
            </Holds>

            {/* Quantity Control */}
            <Holds className="flex justify-between items-center mt-4">
              <Buttons
                type="button"
                onClick={() => setQuantity((prev) => prev + 1)}
                className="bg-green-500"
              >
                <Titles size="h2">+</Titles>
              </Buttons>
              <Titles size="h2">{quantity}</Titles>
              <Buttons
                type="button"
                onClick={() => setQuantity((prev) => Math.max(0, prev - 1))}
                className="bg-red-500"
              >
                <Titles size="h2">-</Titles>
              </Buttons>
            </Holds>

            {/* Submit Section */}
            <Holds className="mt-4">
              <Buttons type="submit" background={"green"}>
                <Titles size="h2">Submit</Titles>
              </Buttons>
            </Holds>
          </Contents>
        </Holds>
      </form>
    </>
  );
} else if (step === 2) {
  return (
    <>
    </>
  )
} else {
  return null;
}
}
