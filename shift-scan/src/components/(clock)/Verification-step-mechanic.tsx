"use client";
import React, { useState } from "react";
import { useTranslations } from "next-intl";
import { useScanData } from "@/app/context/JobSiteScanDataContext";
import { useTimeSheetData } from "@/app/context/TimeSheetIdContext";
import {
  CreateMechanicTimeSheet,
  updateMechanicTSBySwitch,
} from "@/actions/timeSheetActions";
import { Clock } from "../clock";
import { TitleBoxes } from "../(reusable)/titleBoxes";
import { Buttons } from "../(reusable)/buttons";
import { Contents } from "../(reusable)/contents";
import { Labels } from "../(reusable)/labels";
import { Inputs } from "../(reusable)/inputs";
import { Forms } from "../(reusable)/forms";
import { Images } from "../(reusable)/images";
import { Texts } from "../(reusable)/texts";
import { useSession } from "next-auth/react";
import { Holds } from "../(reusable)/holds";
import { Grids } from "../(reusable)/grids";
import { useCommentData } from "@/app/context/CommentContext";
import { useRouter } from "next/navigation";
import { setCurrentPageView, setWorkRole } from "@/actions/cookieActions";
import Spinner from "../(animations)/spinner";

type VerifyProcessProps = {
  handleNextStep?: () => void;
  type: string;
  role: string;
  option?: string;
  comments?: string;
};

export default function MechanicVerificationStep({
  type,
  handleNextStep,
  role,
}: VerifyProcessProps) {
  const t = useTranslations("Clock");
  const { scanResult } = useScanData();
  const { setTimeSheetData } = useTimeSheetData();
  const router = useRouter();
  const [date] = useState(new Date());
  const [loading, setLoading] = useState<boolean>(false);
  const { data: session } = useSession();
  const { savedCommentData, setCommentData } = useCommentData();

  const costCode = "#00.50";

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

  const updatePreviousTimeSheet = async (): Promise<boolean> => {
    try {
      const timeSheetId = await fetchRecentTimeSheetId();
      if (!timeSheetId) throw new Error("No valid TimeSheet ID found.");

      const formData = new FormData();
      formData.append("id", timeSheetId);
      formData.append("endTime", new Date().toISOString());
      formData.append(
        "timeSheetComments",
        savedCommentData?.id.toString() || ""
      );
      await updateMechanicTSBySwitch(formData);
      setCommentData(null);
      localStorage.removeItem("savedCommentData");
      return true;
    } catch (error) {
      console.error("Failed to update previous timesheet:", error);
      return false;
    }
  };

  const createNewTimeSheet = async (): Promise<void> => {
    const formData = new FormData();
    formData.append("submitDate", new Date().toISOString());
    formData.append("userId", id?.toString() || "");
    formData.append("date", new Date().toISOString());
    formData.append("jobsiteId", scanResult?.data || "");
    formData.append("costcode", costCode);
    formData.append("startTime", new Date().toISOString());
    formData.append("workType", role);
    try {
      const response = await CreateMechanicTimeSheet(formData);
      const result = { id: response.id.toString() };
      await Promise.all([
        setTimeSheetData(result),
        setCurrentPageView("dashboard"),
        setWorkRole(role),
      ]).then(() => router.push("/dashboard"));
    } catch (error) {
      console.error(error);
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
      if (type === "switchJobs") {
        const isUpdated = await updatePreviousTimeSheet();
        if (isUpdated) {
          await createNewTimeSheet();
        }
      } else {
        await createNewTimeSheet();
      }
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
        className={loading ? `h-full w-full opacity-[0.50]` : `h-full w-full`}
      >
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
