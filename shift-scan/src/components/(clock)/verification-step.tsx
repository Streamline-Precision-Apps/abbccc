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
import { TitleBoxes } from "../(reusable)/titleBoxes";
import { Buttons } from "../(reusable)/buttons";
import { Contents } from "../(reusable)/contents";
import { Labels } from "../(reusable)/labels";
import { Inputs } from "../(reusable)/inputs";
import { Forms } from "../(reusable)/forms";
import { Images } from "../(reusable)/images";
import { Texts } from "../(reusable)/texts";
import { useSession } from "next-auth/react";
import { useTruckScanData } from "@/app/context/TruckScanDataContext";
import { useStartingMileage } from "@/app/context/StartingMileageContext";
import { Holds } from "../(reusable)/holds";
import { Grids } from "../(reusable)/grids";
import { useCommentData } from "@/app/context/CommentContext";
import {
  setCurrentPageView,
  setEquipment,
  setLaborType,
  setWorkRole,
} from "@/actions/cookieActions";
import { useRouter } from "next/navigation";
import { useOperator } from "@/app/context/operatorContext";
import { set } from "date-fns";

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

export default function VerificationStep({
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
  const { setStartingMileage } = useStartingMileage();
  const { savedCommentData, setCommentData } = useCommentData();
  const { setTruckScanData } = useTruckScanData();
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
          const tId = await fetch(
            "/api/cookies?method=get&name=timeSheetId"
          ).then((res) => res.json());
          const formData2 = new FormData();
          formData2.append("id", tId?.toString() || "");
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
          console.log("role before set", role);
          // logic to set truck scan data null
          if (laborType === "operator" && role === "truck") {
            await setEquipment(equipmentId || "");
            setTruckScanData(null);
          }
          // set Equipment to null
          if (laborType === "truckDriver" && role === "truck") {
            setTruckScanData(truck || null);
            setStartingMileage(startingMileage || null);
            setEquipment("");
          }
          // set Equipment and truck to null
          if (laborType === "manualLabor" && role === "truck") {
            setTruckScanData(null);
            setEquipment("");
            setStartingMileage(null);
          }
          await setWorkRole(role);
          await setLaborType(laborType || "");

          router.push("/dashboard");
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
        await setWorkRole(role);
        await setEquipment(equipmentId || "");
        setTruckScanData(truck || null);
        setStartingMileage(startingMileage || null);
        if (laborType) {
          await setLaborType(laborType);
        }
        router.push("/dashboard");
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
