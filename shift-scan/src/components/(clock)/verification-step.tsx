"use client";
import React, { useState } from "react";
import { useTranslations } from "next-intl";
import { useScanData } from "@/app/context/JobSiteScanDataContext";
import { useSavedCostCode } from "@/app/context/CostCodeContext";
import { useTimeSheetData } from "@/app/context/TimeSheetIdContext";
import {
  CreateTimeSheet,
  updateTimeSheetBySwitch,
} from "@/actions/timeSheetActions";
import { Clock } from "../clock";
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
import { setCurrentPageView, setWorkRole } from "@/actions/cookieActions";
import { Titles } from "../(reusable)/titles";
import { useRouter } from "next/navigation";

type VerifyProcessProps = {
  type: string;
  role: string;
  option?: string;
  comments?: string;
  handlePreviousStep?: () => void;
  laborType?: string;
};

export default function VerificationStep({
  type,
  comments,
  role,
  handlePreviousStep,
  laborType,
}: VerifyProcessProps) {
  const t = useTranslations("Clock");
  const { scanResult } = useScanData();
  const { savedCostCode } = useSavedCostCode();
  const { setTimeSheetData } = useTimeSheetData();
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
          let timeSheetId = null;
          // retrieving cookie to get timeSheetId or use recent one from api call
          const tId = await fetch(
            "/api/cookies?method=get&name=timeSheetId"
          ).then((res) => res.json());
          if (tId) {
            timeSheetId = tId.toString();
          } else {
            const response = await fetch("/api/getRecentTimecard");
            const tsId = await response.json();
            timeSheetId = tsId.id;
          }

          if (!timeSheetId) {
            throw new Error(
              "No valid TimeSheet ID was found. Please try again later."
            );
          }
          const formData2 = new FormData();
          formData2.append("id", timeSheetId?.toString() || "");
          formData2.append("endTime", new Date().toISOString());
          formData2.append(
            "timesheetComments",
            savedCommentData?.id.toString() || ""
          );

          const responseOldSheet = await updateTimeSheetBySwitch(formData2);
          if (responseOldSheet) {
            // removing the old sheet comment so it doesn't show up on the new sheet
            setCommentData(null);
            localStorage.removeItem("savedCommentData");
          }

          const formData = new FormData();

          formData.append("submitDate", new Date().toISOString());
          formData.append("userId", id?.toString() || "");
          formData.append("date", new Date().toISOString());
          formData.append("jobsiteId", scanResult?.data || "");
          formData.append("costcode", savedCostCode?.toString() || "");
          formData.append("startTime", new Date().toISOString());
          formData.append("workType", role);

          const response = await CreateTimeSheet(formData);
          const result = { id: response.id.toString() };
          setTimeSheetData(result);
          setCurrentPageView("dashboard");
          setWorkRole(role);

          setTimeout(() => {
            router.push("/dashboard");
          }, 100);
        } catch (error) {
          console.error(error);
        }
      } else {
        const formData = new FormData();
        formData.append("submitDate", new Date().toISOString());
        formData.append("userId", id.toString());
        formData.append("date", new Date().toISOString());
        formData.append("jobsiteId", scanResult?.data || "");
        formData.append("costcode", savedCostCode?.toString() || "");
        formData.append("startTime", new Date().toISOString());
        formData.append("workType", role);

        const response = await CreateTimeSheet(formData);
        const result = { id: response.id.toString() };
        setTimeSheetData(result);
        setCurrentPageView("dashboard");
        setWorkRole(role);

        setTimeout(() => {
          router.push("/dashboard");
        }, 100);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Holds className="h-full w-full">
      <Holds background={"white"} className="h-full w-full py-5">
        <Contents width={"section"}>
          <Grids rows={"7"} gap={"5"} className="h-full w-full">
            <Holds className="h-full w-full row-start-1 row-end-2">
              <Grids rows={"2"} cols={"5"} gap={"3"} className=" h-full w-full">
                <Holds
                  className="row-start-1 row-end-2 col-start-1 col-end-2 h-full w-full justify-center"
                  onClick={handlePreviousStep}
                >
                  <Images
                    titleImg="/turnBack.svg"
                    titleImgAlt="back"
                    position={"left"}
                  />
                </Holds>
                <Holds className="row-start-2 row-end-3 col-span-5 h-full w-full justify-center">
                  <Grids
                    cols={"5"}
                    rows={"1"}
                    gap={"5"}
                    className="h-full w-full relative"
                  >
                    <Holds className="col-start-1 col-end-4 h-full w-full justify-center">
                      <Titles size={"h1"} position={"right"}>
                        {t("VerifyJobSite")}
                      </Titles>
                    </Holds>
                    <Holds className="col-start-4 col-end-5 h-full w-full justify-center absolute">
                      <Images
                        titleImg="/clock-in.svg"
                        titleImgAlt="Verify"
                        size={"full"}
                      />
                    </Holds>
                  </Grids>
                </Holds>
              </Grids>
            </Holds>
            <Forms
              onSubmit={handleSubmit}
              className="h-full w-full row-start-2 row-end-8"
            >
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
                <Holds className="row-start-3 row-end-8 col-start-1 col-end-6 h-full pt-1">
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
                    </Contents>
                  </Holds>
                </Holds>

                <Holds className="row-start-8 row-end-11 col-start-1 col-end-6 h-full  ">
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
            </Forms>
          </Grids>
        </Contents>
      </Holds>
    </Holds>
  );
}
