"use client";
import React, { Dispatch, SetStateAction, useState } from "react";
import { useTranslations } from "next-intl";
import { useScanData } from "@/app/context/JobSiteScanDataContext";
import { useTimeSheetData } from "@/app/context/TimeSheetIdContext";
import { handleTascoTimeSheet } from "@/actions/timeSheetActions"; // Updated import
import { Buttons } from "../(reusable)/buttons";
import { Contents } from "../(reusable)/contents";
import { Labels } from "../(reusable)/labels";
import { Inputs } from "../(reusable)/inputs";
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
import { useSavedCostCode } from "@/app/context/CostCodeContext";
import { useOperator } from "@/app/context/operatorContext";
import Spinner from "../(animations)/spinner";
import { Titles } from "../(reusable)/titles";
import { Texts } from "../(reusable)/texts";

type Option = {
  label: string;
  code: string;
};
type VerifyProcessProps = {
  handleNextStep?: () => void;
  type: string;
  role: string;
  option?: string;
  comments?: string;
  laborType: string;
  materialType: string;
  shiftType: string;
  clockInRoleTypes: string | undefined;
  handlePreviousStep: () => void;
  returnPathUsed: boolean;
  setStep: Dispatch<SetStateAction<number>>;
  jobsite: Option | null;
  cc: Option | null;
  equipment: Option | null;
};

export default function TascoVerificationStep({
  type,
  handleNextStep,
  role,
  laborType,
  materialType,
  shiftType,
  comments,
  clockInRoleTypes,
  handlePreviousStep,
  returnPathUsed,
  setStep,
  jobsite,
  cc,
  equipment,
}: VerifyProcessProps) {
  const t = useTranslations("Clock");
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
      formData.append("userId", id);
      formData.append("date", new Date().toISOString());
      formData.append("jobsiteId", jobsite?.code || "");
      formData.append("costcode", cc?.code || "");
      formData.append("startTime", new Date().toISOString());
      formData.append("laborType", clockInRoleTypes || "");

      if (clockInRoleTypes === "tascoAbcdEquipment") {
        formData.append("materialType", materialType || "");
        formData.append("shiftType", "ABCD Shift");
      }
      if (clockInRoleTypes === "tascoAbcdLabor") {
        formData.append("materialType", materialType || "");
        formData.append("shiftType", "ABCD Shift");
      }
      if (clockInRoleTypes === "tascoEEquipment") {
        formData.append("shiftType", "E shift");
      }
      formData.append("workType", role);
      formData.append("equipment", equipment?.code || "");

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
      const response = await handleTascoTimeSheet(formData);

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
          loading ? `h-full w-full p-5 opacity-[0.50]` : `h-full w-full p-5`
        }
      >
        <Grids rows={"8"} gap={"5"} className="h-full w-full">
          <Holds className="h-full w-full row-start-1 row-end-2 ">
            <Holds className="h-full w-full">
              <Grids cols={"3"} rows={"2"} className="w-full h-full p-3">
                <Holds className="col-span-1 row-span-1 flex items-center justify-center">
                  <Buttons
                    onClick={handlePreviousStep}
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
          </Holds>

          <Holds
            background={"timeCardYellow"}
            className="row-start-2 row-end-8 w-full h-full rounded-[10px] border-[3px] border-black pt-1"
          >
            <Contents width={"section"} className="h-full ">
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
              <Holds>
                <Labels
                  htmlFor="clockInRoleTypes"
                  size={"p6"}
                  position={"left"}
                >
                  {t("LaborType")}
                </Labels>
                <Inputs
                  state="disabled"
                  name="jobsiteId"
                  variant={"white"}
                  data={
                    clockInRoleTypes === "tascoAbcdLabor"
                      ? "TASCO ABCD Labor"
                      : clockInRoleTypes === "tascoAbcdEquipment"
                      ? "TASCO ABCD EQ Operator"
                      : clockInRoleTypes === "tascoEEquipment"
                      ? "TASCO E EQ Operator"
                      : clockInRoleTypes
                  }
                  className="text-center text-base"
                />
              </Holds>
              <Holds>
                <Labels htmlFor="jobsiteId" size={"p6"} position={"left"}>
                  {t("JobSite-label")}
                </Labels>
                <Inputs
                  state="disabled"
                  name="jobsiteId"
                  variant={"white"}
                  data={jobsite?.label || ""}
                  className="text-center text-base"
                />
              </Holds>
              <Holds>
                <Labels htmlFor="costcode" size={"p6"} position={"left"}>
                  {t("CostCode-label")}
                </Labels>
                <Inputs
                  state="disabled"
                  name="costcode"
                  variant={"white"}
                  data={cc?.label || ""}
                  className="text-center text-base"
                />
              </Holds>

              {clockInRoleTypes !== "tascoEEquipment" && (
                <Holds>
                  <Labels
                    htmlFor="materialType-label"
                    size={"p6"}
                    position={"left"}
                  >
                    {t("MaterialType")}
                  </Labels>
                  <Inputs
                    state="disabled"
                    name="materialType-label"
                    variant={"white"}
                    data={materialType || ""}
                    className="text-center text-base"
                  />
                </Holds>
              )}
              {equipment?.label && (
                <Holds>
                  <Labels
                    htmlFor="Equipment-label"
                    size={"p6"}
                    position={"left"}
                  >
                    {t("Equipment")}
                  </Labels>
                  <Inputs
                    state="disabled"
                    name="Equipment-label"
                    variant={"white"}
                    data={equipment?.label || ""}
                    className="text-center text-base"
                  />
                </Holds>
              )}
            </Contents>
          </Holds>

          <Holds className="row-start-8 row-end-9 w-full h-full  ">
            <Buttons
              onClick={() => handleSubmit()}
              background={"green"}
              className=" w-full h-full"
            >
              <Titles size={"h2"}>{t("StartDay")}</Titles>
            </Buttons>
          </Holds>
        </Grids>
      </Holds>
    </>
  );
}
