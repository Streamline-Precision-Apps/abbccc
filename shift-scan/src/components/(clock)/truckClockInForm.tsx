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
import { useEffect, useState } from "react";
import React from "react";
import { Grids } from "@/components/(reusable)/grids";
import { useSession } from "next-auth/react";
import { useScanData } from "@/app/context/JobSiteScanDataContext";
import { useTruckScanData } from "@/app/context/TruckScanDataContext";
import { useSavedCostCode } from "@/app/context/CostCodeContext";
import { useTranslations } from "next-intl";
import { z } from "zod";
import { useStartingMileage } from "@/app/context/StartingMileageContext";
import { Images } from "../(reusable)/images";

type TruckClockInFormProps = {
  handleNextStep: () => void;
  setComments: React.Dispatch<React.SetStateAction<string>>;
  handlePreviousStep?: () => void;
};

// Define the Zod schema
const formSchema = z.object({
  startingMileage: z
    .number()
    .nonnegative({ message: "Starting mileage must be non-negative" }),
  siteNumber: z.string().min(1, { message: "Site number is required" }),
  costCode: z.string().min(1, { message: "Cost code is required" }),
  timeSheetComments: z
    .string()
    .max(40, { message: "Comments must be 40 characters or less" })
    .optional(),
});

export default function TruckClockInForm({
  handleNextStep,
  setComments,
  handlePreviousStep,
}: TruckClockInFormProps) {
  const [complete, setComplete] = useState(false);
  const [siteNumber, setSiteNumber] = useState(""); // State to track site number
  const [costCode, setCostCodeState] = useState(""); // State to track cost code
  const [errorMessages, setErrorMessages] = useState<string[]>([]);
  const { startingMileage, setStartingMileage } = useStartingMileage();
  const { data: session } = useSession(); // Always call hooks at the top level
  const { setScanResult } = useScanData();
  const { truckScanData } = useTruckScanData();
  const { setCostCode } = useSavedCostCode();
  const t = useTranslations("Clock");

  // Update the "complete" state whenever siteNumber and costCode are valid
  useEffect(() => {
    setComplete(siteNumber !== "" && costCode !== "");
  }, [siteNumber, costCode]);

  const handleValidationAndSubmit = (e: React.FormEvent) => {
    e.preventDefault(); // Prevent default form submission

    const formData = {
      startingMileage,
      siteNumber,
      costCode,
      timeSheetComments: "", // Add any default comments or pass the correct value
    };

    // Validate using Zod
    const result = formSchema.safeParse(formData);

    if (result.success) {
      handleNextStep(); // Call handleNextStep when valid
      setErrorMessages([]); // Clear any error messages
    } else {
      // Collect error messages from validation
      const errors = result.error.errors.map((err) => err.message);
      setErrorMessages(errors);
    }
  };

  // Conditional return after all hooks
  if (!session) return null;

  return (
    <>
      <Forms onSubmit={handleValidationAndSubmit}>
        <Holds background={"white"} className="mb-3">
          <Contents width="section">
            <Grids className="grid-rows-7">
            <Grids rows={"2"} cols={"5"} gap={"3"} className="">
                <Holds 
                className="row-start-1 row-end-2 col-start-1 col-end-2 h-full w-full justify-center"
                onClick={handlePreviousStep}>
                  <Images
                    titleImg="/turnBack.svg"
                    titleImgAlt="back"
                    position={"left"}
                  />
                </Holds>
              </Grids>
              <Holds className="row-span-4">
                <Labels>{t("Truck-label")}</Labels>
                <Inputs
                  type="disabled"
                  name="vehicleId"
                  id="vehicleId"
                  value={truckScanData ?? ""}
                  required
                />
                <Labels>{t("StartingMileage")}</Labels>
                <Inputs
                  type="number"
                  name="startingMileage"
                  id="startingMileage"
                  defaultValue={0}
                  value={startingMileage ?? 0} // Provide a default value of 0 when startingMileage is null
                  onChange={(e) => setStartingMileage(Number(e.target.value))}
                  required
                />
                <Labels>{t("SiteNumber")}</Labels>
                <Selects
                  id="jobsiteId"
                  name="jobsiteId"
                  defaultValue=""
                  required
                  onChange={(e) => {
                    const value = e.target.value;
                    setSiteNumber(value); // Update local state
                    setScanResult({ data: value }); // Update context
                  }}
                >
                  <option value="">{t("ChooseSite")}</option>
                  <option value="0002 - Equipment Hauling not Job Specfic">
                    {t("0002")}
                  </option>
                  <option value="0003 - Property and Grounds Work">
                    {t("0003")}
                  </option>
                </Selects>
                <Labels>{t("CostCode-Label")}</Labels>
                <Selects
                  id="costcode"
                  name="costcode"
                  defaultValue=""
                  required
                  onChange={(e) => {
                    const value = e.target.value;
                    setCostCodeState(value); // Update local state
                    setCostCode(value); // Update context
                  }}
                >
                  <option value="">{t("Title-costcode")}</option>
                  <option value="#13.10">{t("TruckingMaterial")}</option>
                  <option value="#13.20">{t("TruckingLabor")}</option>
                  <option value="#13.30">{t("TruckingSub")}</option>
                  <option value="#13.40">{t("TruckingEquipment")}</option>
                </Selects>
                <Labels>{t("Notes")}</Labels>
                <TextAreas
                  name="timeSheetComments"
                  id="timeSheetComments"
                  rows={5}
                  maxLength={40}
                  onChange={(e) => setComments(e.target.value)}
                />
              </Holds>
              {/* Error Messages */}
              {errorMessages.length > 0 && (
                <Holds>
                  {errorMessages.map((message, index) => (
                    <p key={index} className="text-red-500">
                      {message}
                    </p>
                  ))}
                </Holds>
              )}
              {/* Submit Section */}
              <Holds className="row-span-1">
                <Buttons
                  type="submit"
                  background={"green"}
                  disabled={!complete} // Disable button if fields are invalid
                >
                  <Titles size={"h2"}>Submit</Titles>
                </Buttons>
              </Holds>
            </Grids>
          </Contents>
        </Holds>
      </Forms>
    </>
  );
}
