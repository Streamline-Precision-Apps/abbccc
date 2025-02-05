"use client";
import React, { useState } from "react";
import { useTranslations } from "next-intl";
import { useScanData } from "@/app/context/JobSiteScanDataContext";
import { useSavedCostCode } from "@/app/context/CostCodeContext";
import { useTimeSheetData } from "@/app/context/TimeSheetIdContext";

import {
  CreateTruckDriverTimeSheet,
  updateTruckDriverTSBySwitch,
} from "@/actions/timeSheetActions";
import { Clock } from "../clock";
import { TitleBoxes } from "../(reusable)/titleBoxes";
import { Buttons } from "../(reusable)/buttons";
import { Contents } from "../(reusable)/contents";
import { Labels } from "../(reusable)/labels";
import { Inputs } from "../(reusable)/inputs";
import { Forms } from "../(reusable)/forms";
import { Images } from "../(reusable)/images";
import { useSession } from "next-auth/react";
import { Holds } from "../(reusable)/holds";
import { Grids } from "../(reusable)/grids";
import { useCommentData } from "@/app/context/CommentContext";
import {
  setCurrentPageView,
  setLaborType,
  setWorkRole,
} from "@/actions/cookieActions";
import { useRouter } from "next/navigation";
import { useOperator } from "@/app/context/operatorContext";

type VerifyProcessProps = {
  handleNextStep?: () => void;
  type: string;
  role: string;
  option?: string;
  comments?: string;
  laborType?: string;
  truck?: string;
  startingMileage?: number;
};

export default function TruckVerificationStep({
  type,
  handleNextStep,
  comments,
  role,
  truck,
  startingMileage,
  laborType,
}: VerifyProcessProps) {
  const t = useTranslations("Clock");
  const { scanResult } = useScanData();
  const { savedCostCode } = useSavedCostCode();
  const { setTimeSheetData } = useTimeSheetData();
  const { equipmentId } = useOperator();
  const [date] = useState(new Date());
  const { data: session } = useSession();
  const { savedCommentData, setCommentData } = useCommentData();
  const router = useRouter();
  if (!session) return null; // Conditional rendering for session

  const { id } = session.user;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    try {
      e.preventDefault();
      if (!id) {
        throw new Error("User id does not exist");
      }

      await setWorkRole(role);

      if (type === "switchJobs") {
        try {
          // retrieve old time Sheet Id, end Time set to now, and the Time Sheet Comment data recorded
          let timeSheetId = null;
          // retrieving cookie to get timeSheetId or use recent one from api call

          const res = await fetch("/api/getRecentTimecard");
          const tsId = await res.json();
          timeSheetId = tsId.id;

          if (!timeSheetId) {
            throw new Error(
              "No valid TimeSheet ID was found. Please try again later."
            );
          }

          const formData2 = new FormData();
          formData2.append("id", timeSheetId?.toString() || "");
          formData2.append("endTime", new Date().toISOString());
          formData2.append(
            "timeSheetComments",
            savedCommentData?.id.toString() || ""
          );

          // send data to update and close out the previous time Sheet, log will be update another way.
          const responseOldSheet = await updateTruckDriverTSBySwitch(formData2);
          if (responseOldSheet) {
            // removing the old sheet comment so it doesn't show up on the new sheet
            setCommentData(null);
            localStorage.removeItem("savedCommentData"); // update this to a cookie for consistency
          }
          // create new form for the new Time Sheet
          const formData = new FormData();

          formData.append("submitDate", new Date().toISOString());
          formData.append("userId", id?.toString() || "");
          formData.append("date", new Date().toISOString());
          formData.append("jobsiteId", scanResult?.data || "");
          formData.append("costcode", savedCostCode?.toString() || "");
          formData.append("startTime", new Date().toISOString());
          formData.append("workType", role);
          formData.append("laborType", laborType || ""); // sets the title of task to the labor type worked on
          formData.append("startingMileage", startingMileage?.toString() || ""); // sets new starting mileage
          formData.append("truck", truck || ""); // sets truck ID if applicable
          formData.append("equipment", equipmentId || ""); // sets equipment Id if applicable

          // set a cookie for: recent timecard, pageView, workRole, LaborRole
          const response = await CreateTruckDriverTimeSheet(formData);
          const result = { id: response.id.toString() };
          setTimeSheetData(result);
          setCurrentPageView("dashboard");
          setWorkRole(role);
          setLaborType(laborType || "");
          // go to dashboard
          setTimeout(() => {
            router.push("/dashboard");
          }, 100);
        } catch (error) {
          console.error(error);
        }
      } else {
        //create a new Time Sheet with a Truck Log
        const formData = new FormData();
        formData.append("submitDate", new Date().toISOString());
        formData.append("userId", id.toString());
        formData.append("date", new Date().toISOString());
        formData.append("jobsiteId", scanResult?.data || "");
        formData.append("costcode", savedCostCode?.toString() || "");
        formData.append("startTime", new Date().toISOString());
        formData.append("workType", role);
        formData.append("laborType", laborType || "");
        formData.append("startingMileage", startingMileage?.toString() || "");
        formData.append("truck", truck || "");
        formData.append("equipment", equipmentId || "");

        // set a cookie for: recent timecard, pageView, workRole, LaborRole
        const response = await CreateTruckDriverTimeSheet(formData);
        const result = { id: response.id.toString() };
        setTimeSheetData(result); // set new recent timecard
        setLaborType(laborType || ""); // set labor role
        setCurrentPageView("dashboard"); // set page view
        setWorkRole(role); // set work role
        // go to dashboard
        setTimeout(() => {
          router.push("/dashboard");
        }, 100);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <Holds background={"white"} className="h-full w-full">
        <Grids rows={"10"} gap={"2"} className="h-full w-full">
          <Contents width={"section"} className="h-full row-span-1 ">
            <TitleBoxes
              title={t("VerifyJobSite")}
              titleImg="/clock-in.svg"
              titleImgAlt="Verify"
              variant="row"
              size="default"
              type="row"
            />
          </Contents>
          <Forms onSubmit={handleSubmit} className="h-full w-full row-span-9">
            <Holds className="h-full w-full">
              <Grids cols={"5"} rows={"10"} className="h-full w-full">
                <Holds className="row-start-2 row-end-3 col-start-5 col-end-6 w-full h-full">
                  <Holds className="h-full w-full pr-1">
                    <Buttons
                      type="submit"
                      className="w-full h-full"
                      background={"none"}
                    >
                      <Holds
                        background={"lightBlue"}
                        className="w-full h-full items-center justify-center "
                      >
                        <Images
                          titleImg={"/downArrow.svg"}
                          titleImgAlt={"downArrow"}
                          className="p-1 w-10 h-10"
                        />
                      </Holds>
                    </Buttons>
                  </Holds>
                </Holds>
                <Holds className="row-start-3 row-end-7 col-start-1 col-end-6 h-full pt-1">
                  <Holds
                    background={"lightBlue"}
                    className="h-full w-[95%] sm:w-[85%] md:w-[75%] lg:w-[60%] xl:w-[50%] 2xl:w-[40%]  border-[3px] rounded-b-none  border-black "
                  >
                    <Contents width={"section"} className="h-full">
                      <Labels
                        htmlFor="date"
                        text={"white"}
                        size={"p4"}
                        position={"left"}
                      >
                        {t("Date-label")}
                      </Labels>
                      <Inputs
                        name="date"
                        state="disabled"
                        variant={"white"}
                        data={date.toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "numeric",
                          day: "numeric",
                        })}
                      />
                      <Labels
                        htmlFor="jobsiteId"
                        text={"white"}
                        size={"p4"}
                        position={"left"}
                      >
                        {t("JobSite-label")}
                      </Labels>
                      <Inputs
                        state="disabled"
                        name="jobsiteId"
                        variant={"white"}
                        data={scanResult?.data || ""}
                      />
                      <Labels
                        htmlFor="costcode"
                        text={"white"}
                        size={"p4"}
                        position={"left"}
                      >
                        {t("CostCode-label")}
                      </Labels>
                      <Inputs
                        state="disabled"
                        name="costcode"
                        variant={"white"}
                        data={savedCostCode?.toString() || ""}
                      />
                      {comments !== undefined && (
                        <>
                          <Labels
                            htmlFor="timeSheetComments"
                            text={"white"}
                            size={"p4"}
                            position={"left"}
                          >
                            {t("Comments")}
                          </Labels>
                          <Inputs
                            state="disabled"
                            name="timeSheetComments"
                            variant={"white"}
                            data={comments}
                          />
                        </>
                      )}
                    </Contents>
                  </Holds>
                </Holds>

                <Holds className="row-start-7 row-end-11 col-start-1 col-end-6 h-full  ">
                  <Holds
                    background={"darkBlue"}
                    className="h-full w-[100%] sm:w-[90%] md:w-[90%] lg:w-[80%] xl:w-[80%] 2xl:w-[80%]  border-[3px]   border-black p-8 "
                  >
                    <Buttons
                      type="submit"
                      background={"none"}
                      className="bg-app-green mx-auto flex justify-center items-center w-full h-full py-4 px-5 rounded-lg text-black font-bold border-[3px] border-black"
                    >
                      <Clock time={date.getTime()} />
                    </Buttons>
                  </Holds>
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
            </Holds>
          </Forms>
        </Grids>
      </Holds>
    </>
  );
}
