"use client";
import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { useScanData } from "@/app/context/JobSiteScanDataContext";
import { useTimeSheetData } from "@/app/context/TimeSheetIdContext";
import { handleMechanicTimeSheet } from "@/actions/timeSheetActions";
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
import { useRouter } from "next/navigation";
import {
  setCurrentPageView,
  setLaborType,
  setWorkRole,
} from "@/actions/cookieActions";
import Spinner from "../(animations)/spinner";
import { useSavedCostCode } from "@/app/context/CostCodeContext";
import { Titles } from "../(reusable)/titles";

type VerifyProcessProps = {
  handleNextStep?: () => void;
  type: string;
  role: string;
  option?: string;
  comments?: string;
  clockInRoleTypes: string | undefined;
  handlePrevStep: () => void;
  returnPathUsed: boolean;
  setStep: Dispatch<SetStateAction<number>>;
};

export default function MechanicVerificationStep({
  handlePrevStep,
  type,
  handleNextStep,
  role,
  clockInRoleTypes,
  returnPathUsed,
  setStep,
}: VerifyProcessProps) {
  const t = useTranslations("Clock");
  const { scanResult } = useScanData();
  const { setTimeSheetData } = useTimeSheetData();
  const router = useRouter();
  const [date] = useState(new Date());
  const [loading, setLoading] = useState<boolean>(false);
  const { data: session } = useSession();
  const { savedCommentData, setCommentData } = useCommentData();
  const { setCostCode } = useSavedCostCode();
  const costCode = "#00.50";

  useEffect(() => {
    setCostCode(costCode);
  }, [costCode]);

  if (!session) return null; // Conditional rendering for session
  const { id } = session.user;

  const fetchRecentTimeSheetId = async (): Promise<string | null> => {
    try {
      const res = await fetch("/api/getRecentTimecard");
      const data = await res.json();
      return data?.id || null;
    } catch (error) {
      console.error("Error fetching recent timesheet ID:", error);
      return null;
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!id) {
      console.error("User ID does not exist");
      return;
    }
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("submitDate", new Date().toISOString());
      formData.append("userId", id);
      formData.append("date", new Date().toISOString());
      formData.append("jobsiteId", scanResult?.data || "");
      formData.append("costcode", costCode);
      formData.append("startTime", new Date().toISOString());
      formData.append("workType", role);

      // If switching jobs, include the previous timesheet ID
      if (type === "switchJobs") {
        const timeSheetId = await fetchRecentTimeSheetId();
        if (!timeSheetId) throw new Error("No valid TimeSheet ID found.");
        formData.append("id", timeSheetId);
        formData.append("endTime", new Date().toISOString());
        formData.append(
          "timeSheetComments",
          savedCommentData?.id.toString() || ""
        );
        formData.append("type", "switchJobs"); // added to switch jobs
      }

      // Use the new transaction-based function
      const response = await handleMechanicTimeSheet(formData);

      // Update state and redirect
      setTimeSheetData({ id: response || "" });
      setCommentData(null);
      localStorage.removeItem("savedCommentData");

      await Promise.all([
        setCurrentPageView("dashboard"),
        setWorkRole(role),
        setLaborType(clockInRoleTypes || ""),
      ]).then(() => router.push("/dashboard"));
    } catch (error) {
      console.error("Error in handleSubmit:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {loading && (
        <Holds className="h-full absolute justify-center items-center">
          <Spinner size={40} />
        </Holds>
      )}
      <Holds
        background={"white"}
        className={
          loading ? `h-full w-full py-5 opacity-[0.50]` : `h-full w-full py-5`
        }
      >
        <Contents width={"section"}>
          <Grids rows={"7"} gap={"5"} className="h-full w-full">
            <Holds className="h-full w-full row-start-1 row-end-2 ">
              <Holds className="h-full w-full px-3">
                <TitleBoxes
                  title={t("VerifyJobSite")}
                  titleImg="/mechanic.svg"
                  titleImgAlt="Mechanic"
                  onClick={handlePrevStep}
                  type="noIcon-NoHref"
                />

                <Holds>
                  <Images
                    titleImg="/clock-in.svg"
                    titleImgAlt="Verify"
                    className="w-8 h-8"
                  />
                </Holds>
              </Holds>
            </Holds>

            <Forms onSubmit={handleSubmit} className="h-full w-full row-span-9">
              <Holds className="h-full w-full">
                <Grids cols={"5"} rows={"10"} className="h-full w-full">
                  <Holds className="row-start-2 row-end-7 col-start-1 col-end-6 h-full pt-1">
                    <Holds
                      background={"lightBlue"}
                      className="h-full w-[95%] sm:w-[85%] md:w-[75%] lg:w-[60%] xl:w-[50%] 2xl:w-[40%]  border-[3px] rounded-b-none  border-black "
                    >
                      <Contents width={"section"} className="h-full">
                        <Labels text={"white"} size={"p4"} position={"left"}>
                          {t("Date-label")}
                        </Labels>
                        <Inputs
                          state="disabled"
                          variant={"white"}
                          data={date.toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "numeric",
                            day: "numeric",
                          })}
                        />

                        <Labels text={"white"} size={"p4"} position={"left"}>
                          {t("JobSite-label")}
                        </Labels>
                        <Inputs
                          state="disabled"
                          name="jobsiteId"
                          variant={"white"}
                          data={scanResult?.data || ""}
                        />
                        <Labels text={"white"} size={"p4"} position={"left"}>
                          {t("CostCode-label")}
                        </Labels>
                        <Inputs
                          state="disabled"
                          name="costcode"
                          variant={"white"}
                          data={costCode}
                        />
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
                        shadow={"none"}
                        className="bg-app-green mx-auto flex justify-center items-center w-full h-full py-4 px-5 rounded-lg text-black font-bold border-[3px] border-black"
                      >
                        <Clock time={date.getTime()} />
                      </Buttons>
                    </Holds>
                  </Holds>
                  <Inputs
                    type="hidden"
                    name="submitDate"
                    value={new Date().toString()}
                  />
                  <Inputs type="hidden" name="userId" value={id} />
                  <Inputs
                    type="hidden"
                    name="date"
                    value={new Date().toString()}
                  />
                  <Inputs
                    type="hidden"
                    name="startTime"
                    value={new Date().toString()}
                  />
                </Grids>
              </Holds>
            </Forms>
          </Grids>
        </Contents>
      </Holds>
    </>
  );
}
