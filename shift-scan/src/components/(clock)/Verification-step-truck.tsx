"use client";
import React, { Dispatch, SetStateAction, useState } from "react";
import { useTranslations } from "next-intl";
import { useScanData } from "@/app/context/JobSiteScanDataContext";
import { useSavedCostCode } from "@/app/context/CostCodeContext";
import { useTimeSheetData } from "@/app/context/TimeSheetIdContext";
import { handleTruckTimeSheet } from "@/actions/timeSheetActions";
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
import Spinner from "../(animations)/spinner";
import { Titles } from "../(reusable)/titles";
import { Texts } from "../(reusable)/texts";

type VerifyProcessProps = {
  handleNextStep?: () => void;
  type: string;
  role: string;
  option?: string;
  comments?: string;
  laborType?: string;
  truck?: string;
  startingMileage?: number;
  clockInRoleTypes: string | undefined;
  handlePrevStep: () => void;
};

export default function TruckVerificationStep({
  type,
  handleNextStep,
  comments,
  role,
  truck,
  startingMileage,
  laborType,
  clockInRoleTypes,
  handlePrevStep,
}: VerifyProcessProps) {
  const t = useTranslations("Clock");
  const { scanResult } = useScanData();
  const { savedCostCode } = useSavedCostCode();
  const { setTimeSheetData } = useTimeSheetData();
  const { equipmentId } = useOperator();
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
      formData.append("jobsiteId", scanResult?.data || "");
      formData.append("costcode", savedCostCode?.toString() || "");
      formData.append("startTime", new Date().toISOString());
      formData.append("workType", role);
      formData.append("laborType", clockInRoleTypes || ""); // sets the title of task to the labor type worked on
      formData.append("startingMileage", startingMileage?.toString() || ""); // sets new starting mileage
      formData.append("truck", truck || ""); // sets truck ID if applicable
      formData.append("equipment", equipmentId || ""); // sets equipment Id if applicable

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
      const response = await handleTruckTimeSheet(formData);

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
      <Holds className="h-full w-full relative">
        {loading && (
          <Holds className="h-full absolute justify-center items-center">
            <Spinner size={40} />
          </Holds>
        )}
        <Holds
          background={"white"}
          className={
            loading ? `h-full py-5 w-full opacity-[0.50]` : `h-full w-full py-5`
          }
        >
          <Grids rows={"8"} gap={"5"} className="h-full w-full">
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

            <Holds className="row-start-2 row-end-8  h-full pt-1">
              <Contents width={"section"} className="h-full py-5">
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

                <Holds
                  className={
                    clockInRoleTypes === "truckDriver"
                      ? "row-span-1 col-span-1"
                      : "row-span-1 col-span-2"
                  }
                >
                  <Labels
                    htmlFor="clockInRole"
                    text={"white"}
                    size={"p6"}
                    position={"left"}
                  >
                    {t("LaborType")}
                  </Labels>
                  <Inputs
                    state="disabled"
                    name="clockInRole"
                    variant={"white"}
                    data={
                      clockInRoleTypes === "truckDriver"
                        ? t("TruckDriver")
                        : clockInRoleTypes === "truckEquipmentOperator"
                        ? t("TruckEquipmentOperator")
                        : t("TruckLabor")
                    }
                    className={"pl-2 text-base"}
                  />
                </Holds>
                {clockInRoleTypes === "truckDriver" && (
                  <Holds className={"row-span-1 col-span-1"}>
                    <Labels
                      htmlFor="startingMileage"
                      text={"white"}
                      size={"p6"}
                      position={"left"}
                    >
                      {t("StartingMileage")}
                    </Labels>
                    <Inputs
                      state="disabled"
                      name="startingMileage"
                      variant={"white"}
                      data={startingMileage?.toString() || ""}
                      className={"pl-2 text-base"}
                    />
                  </Holds>
                )}
                {clockInRoleTypes === "truckDriver" && (
                  <Holds className={"row-span-1 col-span-2"}>
                    <Labels
                      htmlFor="truckId"
                      text={"white"}
                      size={"p6"}
                      position={"left"}
                    >
                      {t("Truck-label")}
                    </Labels>
                    <Inputs
                      state="disabled"
                      name="truckId"
                      variant={"white"}
                      data={truck || ""}
                      className={"pl-2 text-base"}
                    />
                  </Holds>
                )}
                <Holds className={"row-span-1 col-span-2"}>
                  <Labels
                    htmlFor="jobsiteId"
                    text={"white"}
                    size={"p6"}
                    position={"left"}
                  >
                    {t("JobSite-label")}
                  </Labels>
                  <Inputs
                    state="disabled"
                    name="jobsiteId"
                    variant={"white"}
                    data={scanResult?.data || ""}
                    className={"pl-2 text-base"}
                  />
                </Holds>
                <Holds className={"row-span-1 col-span-2"}>
                  <Labels
                    htmlFor="costcode"
                    text={"white"}
                    size={"p6"}
                    position={"left"}
                  >
                    {t("CostCode-label")}
                  </Labels>
                  <Inputs
                    state="disabled"
                    name="costcode"
                    variant={"white"}
                    data={savedCostCode?.toString() || ""}
                    className={"pl-2 text-base"}
                  />
                </Holds>
                {clockInRoleTypes === "truckEquipmentOperator" && (
                  <Holds className={"row-span-1 col-span-2"}>
                    <Labels
                      htmlFor="SelectedEquipment"
                      text={"white"}
                      size={"p6"}
                      position={"left"}
                    >
                      {t("SelectedEquipment")}
                    </Labels>
                    <Inputs
                      state="disabled"
                      name="SelectedEquipment"
                      variant={"white"}
                      data={equipmentId || ""}
                      className={"pl-2 text-base"}
                    />
                  </Holds>
                )}
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
        </Holds>
      </Holds>
    </>
  );
}
