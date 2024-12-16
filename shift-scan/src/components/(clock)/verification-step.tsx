"use client";
import React, { useState } from "react";
import { useTranslations } from "next-intl";
import { useScanData } from "@/app/context/JobSiteScanDataContext";
import { useSavedCostCode } from "@/app/context/CostCodeContext";
import { useTimeSheetData } from "@/app/context/TimeSheetIdContext";
import {
  CreateTimeSheet,
  // updateTimeSheetBySwitch,
} from "@/actions/timeSheetActions";
import { Clock } from "../clock";
import { setAuthStep } from "@/app/api/auth";
import { TitleBoxes } from "../(reusable)/titleBoxes";
import { Buttons } from "../(reusable)/buttons";
import { Contents } from "../(reusable)/contents";
import { Labels } from "../(reusable)/labels";
import { Inputs } from "../(reusable)/inputs";
import { Forms } from "../(reusable)/forms";
import { Images } from "../(reusable)/images";
import { Texts } from "../(reusable)/texts";
import { useSession } from "next-auth/react";
import { useTruckScanData } from "@/app/context/TruckScanDataContext";
import { useStartingMileage } from "@/app/context/StartingMileageContext";
import { Holds } from "../(reusable)/holds";
import { Grids } from "../(reusable)/grids";

type VerifyProcessProps = {
  handleNextStep?: () => void;
  type: string;
  option?: string;
  comments?: string;
};

export default function VerificationStep({
  type,
  handleNextStep,
  comments,
}: VerifyProcessProps) {
  const t = useTranslations("Clock");
  const { scanResult } = useScanData();
  const { savedCostCode } = useSavedCostCode();
  const { setTimeSheetData } = useTimeSheetData();
  const [date] = useState(new Date());
  const { data: session } = useSession();
  const { truckScanData } = useTruckScanData(); // Move this hook call to the top level.
  const { startingMileage } = useStartingMileage();

  if (!session) return null; // Conditional rendering for session

  const { id } = session.user;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    try {
      e.preventDefault();

      if (!id) {
        throw new Error("User id does not exist");
      }

      if (type === "switchJobs") {
        try {
          const localeValue = localStorage.getItem("savedtimeSheetData");
          const tId = JSON.parse(localeValue || "{}").id;
          const formData2 = new FormData();
          formData2.append("id", tId?.toString() || "");
          formData2.append("endTime", new Date().toISOString());
          formData2.append("timesheetComments", "");
          formData2.append("appComment", "Switched jobs");

          // await updateTimeSheetBySwitch(formData2);

          const formData = new FormData();
          if (truckScanData) {
            formData.append("vehicleId", truckScanData);
          }
          formData.append("submitDate", new Date().toISOString());
          formData.append("userId", id?.toString() || "");
          formData.append("date", new Date().toISOString());
          formData.append("jobsiteId", scanResult?.data || "");
          formData.append("costcode", savedCostCode?.toString() || "");
          formData.append("startTime", new Date().toISOString());
          formData.append("endTime", "");

          // const response = await CreateTimeSheet(formData);
          // const result = { id: response.id.toString() };
          // setTimeSheetData(result);
          setAuthStep("success");

          if (handleNextStep) {
            handleNextStep();
          }
        } catch (error) {
          console.error(error);
        }
      } else {
        const formData = new FormData();
        if (truckScanData) {
          formData.append("vehicleId", truckScanData);
        }
        if (startingMileage !== undefined) {
          formData.append(
            "startingMileage",
            startingMileage?.toString() || "0"
          );
        }
        formData.append("submitDate", new Date().toISOString());
        formData.append("userId", id.toString());
        formData.append("date", new Date().toISOString());
        formData.append("jobsiteId", scanResult?.data || "");
        formData.append("costcode", savedCostCode?.toString() || "");
        formData.append("startTime", new Date().toISOString());

        // const response = await CreateTimeSheet(formData);
        // const result = { id: response.id.toString() };
        // setTimeSheetData(result);
        setAuthStep("success");

        if (handleNextStep) {
          handleNextStep();
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <Contents width={"section"} className="h-full my-5">
        <TitleBoxes
          title={t("VerifyJobSite")}
          titleImg="/clock-in.svg"
          titleImgAlt="Verify"
          variant="row"
          size="default"
          type="row"
        />
        <Forms onSubmit={handleSubmit} className="h-full my-5">
          <Holds className="h-full w-full">
            <Contents width={"section"} className="h-full">
              <Grids cols={"5"} rows={"5"} gap={"5"}>
                <Holds className="row-start-1 row-end-2 col-start-5 col-end-6 h-full ">
                  <Buttons type="submit" className="w-1/2 h-1/2 justify-center">
                    <Images
                      titleImg={"/downArrow.svg"}
                      titleImgAlt={"downArrow"}
                      className="mx-auto"
                    />
                  </Buttons>
                </Holds>
                <Holds className="row-start-2 row-end-5 col-start-1 col-end-6 h-full ">
                  <Contents width={"section"} className="h-full">
                    <Labels>
                      <Texts size={"p4"} position={"left"}>
                        {t("Date-label")}
                      </Texts>
                      <Inputs
                        state="disabled"
                        variant={"white"}
                        data={date.toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "numeric",
                          day: "numeric",
                        })}
                      />
                    </Labels>
                    {truckScanData && (
                      <Labels>
                        <Texts size={"p4"} position={"left"}>
                          {t("Truck-label")}
                        </Texts>
                        <Inputs
                          state="disabled"
                          name="jobsiteId"
                          variant={"white"}
                          data={truckScanData}
                        />
                      </Labels>
                    )}
                    {truckScanData && (
                      <Labels>
                        <Texts size={"p4"} position={"left"}>
                          {t("Mileage")}
                        </Texts>
                        <Inputs
                          state="disabled"
                          name="startingMileage"
                          variant={"white"}
                          data={startingMileage?.toString() || "0"}
                        />
                      </Labels>
                    )}
                    <Labels>
                      <Texts size={"p4"} position={"left"}>
                        {t("JobSite-label")}
                      </Texts>
                      <Inputs
                        state="disabled"
                        name="jobsiteId"
                        variant={"white"}
                        data={scanResult?.data || ""}
                      />
                    </Labels>
                    <Labels>
                      <Texts size={"p4"} position={"left"}>
                        {t("CostCode-label")}
                      </Texts>
                      <Inputs
                        state="disabled"
                        name="costcode"
                        variant={"white"}
                        data={savedCostCode?.toString() || ""}
                      />
                    </Labels>
                    {comments !== undefined && (
                      <Labels>
                        <Texts size={"p4"} position={"left"}>
                          {t("Comments")}
                        </Texts>
                        <Inputs
                          state="disabled"
                          name="timeSheetComments"
                          variant={"white"}
                          data={comments}
                        />
                      </Labels>
                    )}
                  </Contents>
                </Holds>
                <Holds className="row-start-5 row-end-6 col-start-1 col-end-6 h-full">
                  <Buttons
                    type="submit"
                    className="bg-app-green mx-auto flex justify-center items-center w-full h-full py-4 px-5 rounded-lg text-black font-bold"
                  >
                    <Clock time={date.getTime()} />
                  </Buttons>
                </Holds>
                <Inputs
                  type="hidden"
                  name="submitDate"
                  value={new Date().toISOString()}
                />
                <Inputs type="hidden" name="userId" value={id} />
                <Inputs
                  type="hidden"
                  name="date"
                  value={new Date().toISOString()}
                />
                <Inputs
                  type="hidden"
                  name="startTime"
                  value={new Date().toISOString()}
                />
              </Grids>
            </Contents>
          </Holds>
        </Forms>
      </Contents>
    </>
  );
}
