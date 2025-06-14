"use client";
import React, { Dispatch, SetStateAction, useState } from "react";
import { useTranslations } from "next-intl";
import { useScanData } from "@/app/context/JobSiteScanDataContext";
import { useSavedCostCode } from "@/app/context/CostCodeContext";
import { useTimeSheetData } from "@/app/context/TimeSheetIdContext";
import { handleGeneralTimeSheet } from "@/actions/timeSheetActions";
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
import { Titles } from "../(reusable)/titles";
import { useRouter } from "next/navigation";
import Spinner from "../(animations)/spinner";
import { TitleBoxes } from "../(reusable)/titleBoxes";
import { Texts } from "../(reusable)/texts";

type Options = {
  id: string;
  label: string;
  code: string;
};
type VerifyProcessProps = {
  type: string;
  role: string;
  option?: string;
  comments?: string;
  handlePreviousStep?: () => void;
  laborType?: string;
  clockInRoleTypes: string | undefined;
  returnPathUsed: boolean;
  setStep: Dispatch<SetStateAction<number>>;
  jobsite: Options | null;
  cc: Options | null;
};

export default function VerificationStep({
  type,
  comments,
  role,
  handlePreviousStep,
  laborType,
  clockInRoleTypes,
  returnPathUsed,
  setStep,
  jobsite,
  cc,
}: VerifyProcessProps) {
  const t = useTranslations("Clock");
  const { scanResult } = useScanData();
  const { savedCostCode } = useSavedCostCode();
  const { setTimeSheetData } = useTimeSheetData();
  const [date] = useState(new Date());
  const [loading, setLoading] = useState<boolean>(false);
  const { data: session } = useSession();
  const { savedCommentData, setCommentData } = useCommentData();
  const router = useRouter();

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
      formData.append("userId", id?.toString() || "");
      formData.append("date", new Date().toISOString());
      formData.append("jobsiteId", jobsite?.id || "");
      formData.append("costcode", cc?.code || "");
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
      const response = await handleGeneralTimeSheet(formData);

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
    <Holds className="h-full w-full relative">
      {loading && (
        <Holds className="h-full absolute justify-center items-center">
          <Spinner size={40} />
        </Holds>
      )}
      <Holds
        background={"white"}
        className={loading ? `h-full w-full opacity-[0.50]` : `h-full w-full `}
      >
        <Grids rows={"7"} gap={"5"} className="h-full w-full">
          <Holds className="row-start-1 row-end-2 h-full w-full">
            <TitleBoxes position={"row"} onClick={handlePreviousStep}>
              <Titles position={"right"} size={"h1"}>
                {t("VerifyJobSite")}
              </Titles>
              <Images
                titleImg="/clockIn.svg"
                titleImgAlt="Verify"
                className="w-10 h-10"
              />
            </TitleBoxes>
          </Holds>
          <Holds className="row-start-2 row-end-8 h-full w-full">
            <Contents width={"section"}>
              <Grids rows={"7"} gap={"5"} className="h-full w-full pb-5">
                <Holds
                  background={"timeCardYellow"}
                  className="row-start-1 row-end-7 h-full border-[3px] rounded-[10px] border-black"
                >
                  <Contents width={"section"} className="h-full py-2">
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

                    <Labels htmlFor="jobsiteId" size={"p3"} position={"left"}>
                      {t("LaborType")}
                    </Labels>
                    <Inputs
                      state="disabled"
                      name="jobsiteId"
                      variant={"white"}
                      data={"General Labor"}
                      className="text-center"
                    />

                    <Labels htmlFor="jobsiteId" size={"p3"} position={"left"}>
                      {t("JobSite-label")}
                    </Labels>
                    <Inputs
                      state="disabled"
                      name="jobsiteId"
                      variant={"white"}
                      data={jobsite?.label || ""}
                      className="text-center"
                    />
                    <Labels htmlFor="costcode" size={"p3"} position={"left"}>
                      {t("CostCode-label")}
                    </Labels>
                    <Inputs
                      state="disabled"
                      name="costcode"
                      variant={"white"}
                      data={cc?.label || ""}
                      className="text-center"
                    />
                  </Contents>
                </Holds>

                <Holds className="row-start-7 row-end-8   ">
                  <Buttons
                    onClick={() => handleSubmit()}
                    background={"green"}
                    className=" w-full h-full py-2"
                  >
                    <Titles size={"h2"}>{t("StartDay")}</Titles>
                  </Buttons>
                </Holds>
              </Grids>
            </Contents>
          </Holds>
        </Grids>
      </Holds>
    </Holds>
  );
}
