"use client";
import React, { Dispatch, SetStateAction, useState } from "react";
import { useTranslations } from "next-intl";
import { useScanData } from "@/app/context/JobSiteScanDataContext";
import { useTimeSheetData } from "@/app/context/TimeSheetIdContext";
import { handleTascoTimeSheet } from "@/actions/timeSheetActions"; // Updated import
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
import { useSavedCostCode } from "@/app/context/CostCodeContext";
import { useOperator } from "@/app/context/operatorContext";
import Spinner from "../(animations)/spinner";

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
      formData.append("costcode", savedCostCode?.toString() || "");
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
      formData.append("equipment", equipmentId || "");

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
        <Grids rows={"7"} gap={"5"} className="h-full w-full">
          <Holds className="h-full w-full row-start-1 row-end-2 ">
            <Holds className="h-full w-full px-3">
              <TitleBoxes
                title={t("VerifyJobSite")}
                titleImg="/mechanic.svg"
                titleImgAlt="Mechanic"
                onClick={handlePreviousStep}
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

          <Forms
            onSubmit={handleSubmit}
            className="h-full w-full row-start-2 row-end-8"
          >
            <Holds className="h-full w-full">
              <Grids rows={"10"} className="h-full w-full">
                <Holds className="row-start-2 row-end-7 w-full h-full pt-1">
                  <Holds
                    background={"lightBlue"}
                    className="h-full w-[95%] sm:w-[85%] md:w-[75%] lg:w-[60%] xl:w-[50%] 2xl:w-[40%]  border-[3px] rounded-b-none  border-black "
                  >
                    <Contents width={"section"} className="h-full py-5">
                      <Grids
                        cols={"2"}
                        rows={
                          clockInRoleTypes === "tascoAbcdEquipment"
                            ? "4"
                            : clockInRoleTypes === "tascoAbcdLabor"
                            ? "4"
                            : "3"
                        }
                        gap={"3"}
                        className="h-full w-full"
                      >
                        <Holds className={"row-span-1 col-span-1"}>
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
                            className="pl-2 text-base"
                          />
                        </Holds>
                        <Holds className={"row-span-1 col-span-1 "}>
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
                            className="pl-2 text-base"
                          />
                        </Holds>

                        <Holds className="row-span-1 col-span-2 h-full">
                          <Labels
                            htmlFor="clockInRoleTypes"
                            text={"white"}
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
                                ? "ABCD - Labor"
                                : clockInRoleTypes === "tascoAbcdEquipment"
                                ? "ABCD - EQ Operator"
                                : clockInRoleTypes === "tascoEEquipment"
                                ? "E - EQ Operator"
                                : clockInRoleTypes
                            }
                            className="pl-2 text-base"
                          />
                        </Holds>
                        {clockInRoleTypes !== "tascoEEquipment" && (
                          <Holds className="row-span-1 col-span-2 h-full">
                            <Labels
                              htmlFor="materialType-label"
                              text={"white"}
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
                              className="pl-2 text-base"
                            />
                          </Holds>
                        )}
                        {equipmentId && (
                          <Holds className="row-span-1 col-span-2 h-full">
                            <Labels
                              htmlFor="Equipment-label"
                              text={"white"}
                              size={"p6"}
                              position={"left"}
                            >
                              {t("Equipment-label")}
                            </Labels>
                            <Inputs
                              state="disabled"
                              name="Equipment-label"
                              variant={"white"}
                              data={equipmentId || ""}
                              className="pl-2 text-base"
                            />
                          </Holds>
                        )}
                      </Grids>
                    </Contents>
                  </Holds>
                </Holds>

                <Holds className="row-start-7 row-end-11 w-full h-full  ">
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
      </Holds>
    </>
  );
}
