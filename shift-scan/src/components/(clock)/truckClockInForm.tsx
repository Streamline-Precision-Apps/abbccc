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
// import { z } from "zod";
import { useSession } from "next-auth/react";
import { useScanData } from "@/app/context/JobSiteScanDataContext";
import { useTruckScanData } from "@/app/context/TruckScanDataContext";
import { useSavedCostCode } from "@/app/context/CostCodeContext";
import { useTranslations } from "next-intl";

// Zod schema for form validation
// const leaveRequestSchema = z.object({
//   startDate: z.string().nonempty({ message: "Start date is required" }),
//   endDate: z.string().nonempty({ message: "End date is required" }),
//   requestType: z.enum(["Vacation", "Medical", "Military", "Personal", "Sick"]),
//   description: z.string().max(40, { message: "Max 40 characters" }),
//   userId: z.string().nonempty({ message: "User ID is required" }),
//   status: z.literal("PENDING"),
//   date: z.string().nonempty({ message: "Date is required" }),
// });

type TruckClockInFormProps = {
  handleNextStep: () => void;
  startingMileage: number;
  setStartingMileage: React.Dispatch<React.SetStateAction<number>>;
  setComments: React.Dispatch<React.SetStateAction<string>>;
};

export default function TruckClockInForm({
  handleNextStep,
  startingMileage,
  setStartingMileage,
  setComments,
}: TruckClockInFormProps) {
  const [complete, setComplete] = useState(false);
  const [siteNumber, setSiteNumber] = useState(""); // State to track site number
  const [costCode, setCostCodeState] = useState(""); // State to track cost code

  const { data: session } = useSession(); // Always call hooks at the top level
  const { setScanResult } = useScanData();
  const { truckScanData } = useTruckScanData();
  const { setCostCode } = useSavedCostCode();
  const t = useTranslations("Clock");

  // Update the "complete" state whenever siteNumber and costCode are valid
  useEffect(() => {
    setComplete(siteNumber !== "" && costCode !== "");
  }, [siteNumber, costCode]);

  // Conditional return after all hooks
  if (!session) return null;

  return (
    <>
      <Forms
        onSubmit={(e) => {
          e.preventDefault(); // Prevent default form submission
          if (complete) {
            handleNextStep(); // Call handleNextStep when valid
          }
        }}
      >
        <Holds background={"white"} className="mb-3">
          <Contents width="section">
            <Grids className="grid-rows-7">
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
                  value={startingMileage ?? 0}
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
