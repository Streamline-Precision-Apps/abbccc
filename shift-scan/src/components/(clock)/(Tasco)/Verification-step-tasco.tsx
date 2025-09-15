"use client";
import React, { Dispatch, SetStateAction, useState } from "react";
import { useTranslations } from "next-intl";
import { useTimeSheetData } from "@/app/context/TimeSheetIdContext";
import { handleTascoTimeSheet } from "@/actions/timeSheetActions"; // Updated import
import { useSession } from "next-auth/react";
import { useCommentData } from "@/app/context/CommentContext";
import {
  setCurrentPageView,
  setLaborType,
  setWorkRole,
} from "@/actions/cookieActions";
import { useRouter } from "next/navigation";
import { Buttons } from "@/components/(reusable)/buttons";
import { Contents } from "@/components/(reusable)/contents";
import { Grids } from "@/components/(reusable)/grids";
import { Holds } from "@/components/(reusable)/holds";
import { Images } from "@/components/(reusable)/images";
import { Inputs } from "@/components/(reusable)/inputs";
import { Labels } from "@/components/(reusable)/labels";
import { Texts } from "@/components/(reusable)/texts";
import { Titles } from "@/components/(reusable)/titles";
import Spinner from "@/components/(animations)/spinner";
import { TitleBoxes } from "@/components/(reusable)/titleBoxes";

type Option = {
  id: string;
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
  const [date] = useState(new Date());
  const [loading, setLoading] = useState<boolean>(false);
  const { data: session } = useSession();
  const { savedCommentData, setCommentData } = useCommentData();
  const router = useRouter();

  if (!session) return null; // Conditional rendering for session
  const { id } = session.user;

  const fetchRecentTimeSheetId = async (): Promise<number | null> => {
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
      formData.append("jobsiteId", jobsite?.id || "");
      formData.append("costcode", cc?.code || "");
      formData.append("startTime", new Date().toISOString());

      if (clockInRoleTypes === "tascoAbcdEquipment") {
        formData.append("materialType", materialType || "");
        formData.append("shiftType", "ABCD Shift");
        formData.append("laborType", "Operator");
      }
      if (clockInRoleTypes === "tascoAbcdLabor") {
        formData.append("materialType", materialType || "");
        formData.append("shiftType", "ABCD Shift");
        formData.append("laborType", "Manual Labor");
      }
      if (clockInRoleTypes === "tascoEEquipment") {
        formData.append("shiftType", "E shift");
        formData.append("laborType", "");
      }
      formData.append("workType", role);
      formData.append("equipment", equipment?.id || "");

      // If switching jobs, include the previous timesheet ID
      if (type === "switchJobs") {
        const timeSheetId = await fetchRecentTimeSheetId();
        if (!timeSheetId) throw new Error("No valid TimeSheet ID found.");
        formData.append("id", timeSheetId.toString());
        formData.append("endTime", new Date().toISOString());
        formData.append(
          "timeSheetComments",
          savedCommentData?.id.toString() || "",
        );
        formData.append("type", "switchJobs"); // added to switch jobs
      }

      // Use the new transaction-based function
      const response = await handleTascoTimeSheet(formData);
      if (response && type === "switchJobs") {
        const response = await fetch("/api/notifications/send-multicast", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            topic: "timecard-submission",
            title: "New Timesheet Submission",
            message: `A new submission has been created and is pending approval.`,
            link: `/admins/timesheets`,
          }),
        });
        await response.json();
      }

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
        className={loading ? `h-full w-full opacity-[0.50]` : `h-full w-full`}
      >
        <Grids rows={"7"} gap={"5"} className="h-full w-full">
          <Holds className="row-start-1 row-end-2 h-full w-full">
            <TitleBoxes position={"row"} onClick={handlePreviousStep}>
              <Titles position={"right"} size={"h4"}>
                {t("VerifyJobSite")}
              </Titles>
              <Images
                titleImg="/clockIn.svg"
                titleImgAlt="Verify"
                className="w-10 h-10 "
              />
            </TitleBoxes>
          </Holds>
          <Holds className="row-start-2 row-end-8 h-full w-full">
            <Contents width={"section"}>
              <Grids rows={"7"} gap={"5"} className="h-full w-full pb-5">
                <Holds
                  background={"timeCardYellow"}
                  className="row-start-1 row-end-7 w-full h-full rounded-[10px] border-[3px] border-black pt-1"
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
                    <Holds className="pb-2">
                      <Labels
                        htmlFor="clockInRoleTypes"
                        size={"p3"}
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
                    <Holds className="pb-2">
                      <Labels htmlFor="jobsiteId" size={"p3"} position={"left"}>
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
                    <Holds className="pb-2">
                      <Labels htmlFor="costcode" size={"p3"} position={"left"}>
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
                      <Holds className="pb-2">
                        <Labels
                          htmlFor="materialType-label"
                          size={"p3"}
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
                      <Holds className="pb-2">
                        <Labels
                          htmlFor="Equipment-label"
                          size={"p3"}
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

                <Holds className="row-start-7 row-end-8 ">
                  <Buttons
                    onClick={() => handleSubmit()}
                    background={"green"}
                    className=" py-2"
                    disabled={loading}
                  >
                    <Titles size={"h2"}>{t("StartDay")}</Titles>
                  </Buttons>
                </Holds>
              </Grids>
            </Contents>
          </Holds>
        </Grids>
      </Holds>
    </>
  );
}
