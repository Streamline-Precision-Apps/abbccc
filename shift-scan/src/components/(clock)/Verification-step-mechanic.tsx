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
import { Texts } from "../(reusable)/texts";
import Capitalize from "@/utils/captitalize";

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
  const costCode = "#00.50 Mechanics";

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

  const handleSubmit = async () => {
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
          <Grids rows={"8"} gap={"5"} className="h-full w-full">
            <Holds className="h-full w-full">
              <Grids cols={"3"} rows={"2"} className="w-full h-full p-3">
                <Holds className="col-span-1 row-span-1 flex items-center justify-center">
                  <Buttons
                    onClick={handlePrevStep}
                    background={"none"}
                    position={"left"}
                    size={"50"}
                    shadow={"none"}
                  >
                    <Images
                      titleImg="/turnBack.svg"
                      titleImgAlt={"Back"}
                      className="max-w-8 h-auto object-contain"
                    />
                  </Buttons>
                </Holds>

                <Holds className="col-start-1 col-end-5 row-start-2 row-end-3 flex flex-row gap-2 items-center justify-center">
                  <Titles position={"right"} size={"h1"}>
                    {t("VerifyJobSite")}
                  </Titles>
                  <Images
                    titleImg="/clock-in.svg"
                    titleImgAlt="Verify"
                    className="w-8 h-8"
                  />
                </Holds>
              </Grids>
            </Holds>

            <Holds
              background={"timeCardYellow"}
              className="row-start-2 row-end-8 border-[3px] border-black h-full pt-1"
            >
              <Contents width={"section"} className="h-full">
                <Holds className="flex flex-row justify-between pb-3">
                  <Texts size={"p7"} position={"left"}>
                    {date.toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "numeric",
                      day: "numeric",
                    })}
                  </Texts>
                  <Texts size={"p7"} position={"right"}>
                    {date.toLocaleTimeString("en-US", {
                      hour: "2-digit",
                      minute: "2-digit",
                      second: "2-digit",
                      hour12: true,
                    })}
                  </Texts>
                </Holds>
                <Labels size={"p4"} position={"left"}>
                  {t("LaborType")}
                </Labels>
                <Inputs
                  state="disabled"
                  name="jobsiteId"
                  variant={"white"}
                  data={Capitalize(role)}
                />

                <Labels size={"p4"} position={"left"}>
                  {t("JobSite-label")}
                </Labels>
                <Inputs
                  state="disabled"
                  name="jobsiteId"
                  variant={"white"}
                  data={scanResult?.data || ""}
                />
                <Labels size={"p4"} position={"left"}>
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

            <Holds className="row-start-8 row-end-9 h-full  ">
              <Buttons
                onClick={() => handleSubmit()}
                background={"green"}
                className=" w-full h-full"
              >
                <Titles size={"h2"}>{t("StartDay")}</Titles>
              </Buttons>
            </Holds>
          </Grids>
        </Contents>
      </Holds>
    </>
  );
}
