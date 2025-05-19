"use client";
import { updateTimeSheet } from "@/actions/timeSheetActions";
import Spinner from "@/components/(animations)/spinner";
import { Bases } from "@/components/(reusable)/bases";
import { Buttons } from "@/components/(reusable)/buttons";
import { Contents } from "@/components/(reusable)/contents";
import { Grids } from "@/components/(reusable)/grids";
import { Holds } from "@/components/(reusable)/holds";
import { Images } from "@/components/(reusable)/images";
import { Inputs } from "@/components/(reusable)/inputs";
import { Labels } from "@/components/(reusable)/labels";
import { Texts } from "@/components/(reusable)/texts";
import { TitleBoxes } from "@/components/(reusable)/titleBoxes";
import { Titles } from "@/components/(reusable)/titles";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useState } from "react";

export type TimeSheet = {
  submitDate: string;
  date: Date | string;
  id: string;
  userId: string;
  jobsiteId: string;
  costcode: string;
  startTime: string;
  endTime: string | null;
  workType: string;
  Jobsite: {
    name: string;
  };
  TascoLogs: {
    laborType: string;
    shiftType: string;
  }[];
};

export const LaborClockOut = ({
  prevStep,
  commentsValue,
  pendingTimeSheets,
}: {
  prevStep: () => void;
  commentsValue: string;
  pendingTimeSheets: TimeSheet | undefined;
}) => {
  const t = useTranslations("ClockOut");
  const [date] = useState(new Date());
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();

  const awaitAllProcesses = async () => {
    // Fetch data for a form submit and process them concurrently
    setLoading(true);
    await processOne();
    // remove cookies from previous session and clear local storage
    await processTwo();
    setLoading(false);
    return router.push("/dashboard");
  };

  async function processOne() {
    try {
      // Step 1: Get the recent timecard ID.
      const response = await fetch("/api/getRecentTimecard");
      const tsId = await response.json();
      const timeSheetId = tsId.id;

      if (!timeSheetId) {
        alert("No valid TimeSheet ID was found. Please try again later.");
        return;
      }

      const formData = new FormData();
      formData.append("id", timeSheetId);
      formData.append("endTime", new Date().toISOString());
      formData.append("timeSheetComments", commentsValue);

      await updateTimeSheet(formData);
    } catch (error) {
      console.error("Failed to process the time sheet:", error);
    }
  }

  async function processTwo() {
    try {
      // Step 4: Delete cookies and clear localStorage.
      await fetch("/api/cookies?method=deleteAll");
      localStorage.clear();
    } catch (error) {
      console.error("Failed to process the time sheet:", error);
    }
  }

  return (
    <Bases>
      <Contents>
        {loading && (
          <Holds className="h-full absolute justify-center items-center">
            <Spinner size={40} />
          </Holds>
        )}
        <Holds
          background={"white"}
          className={
            loading ? `h-full w-full  opacity-[0.50]` : `h-full w-full `
          }
        >
          <Grids rows={"8"} gap={"5"} className="h-full w-full">
            <Holds className="h-full w-full row-start-1 row-end-2 ">
              <TitleBoxes onClick={prevStep}>
                <Holds className="h-full justify-end">
                  <Holds position={"row"} className="justify-center gap-3">
                    <Titles size={"h1"} position={"right"}>
                      {t("ClockOut")}
                    </Titles>

                    <Images
                      titleImg="/clockOut.svg"
                      titleImgAlt="Verify"
                      className="max-w-8 h-auto"
                    />
                  </Holds>
                </Holds>
              </TitleBoxes>
            </Holds>

            {/* form Grid */}
            <Holds className="row-start-2 row-end-8 h-full w-full ">
              <Contents width={"section"}>
                <Holds
                  background={"timeCardYellow"}
                  className="h-full w-full rounded-[10px] border-[3px] border-black mt-8"
                >
                  <Holds className="h-full w-full px-3 py-2">
                    <Holds position={"row"} className="justify-between">
                      <Texts size={"p7"} className="font-bold">
                        {date.toLocaleDateString()}
                      </Texts>
                      <Texts size={"p7"}>
                        {date.toLocaleTimeString("en-US", {
                          hour: "numeric",
                          minute: "numeric",
                          second: "numeric",
                          hour12: false,
                        })}
                      </Texts>
                    </Holds>
                    <Holds className="h-full w-full py-5">
                      <Labels htmlFor="laborType" size={"p5"} position={"left"}>
                        {t("LaborType")}
                      </Labels>
                      {pendingTimeSheets?.workType === "TASCO" ? (
                        <Inputs
                          state="disabled"
                          name="laborType"
                          className="text-center"
                          variant={"white"}
                          data={
                            pendingTimeSheets?.TascoLogs[0].laborType ===
                            "tascoAbcdLabor"
                              ? t("TascoLabor")
                              : t("TascoOperator")
                          }
                        />
                      ) : (
                        <Inputs
                          state="disabled"
                          name="laborType"
                          className="text-center"
                          variant={"white"}
                          data={
                            pendingTimeSheets?.workType === "LABOR"
                              ? t("GeneralLabor")
                              : pendingTimeSheets?.workType === "TRUCK_DRIVER"
                              ? t("TruckDriver")
                              : pendingTimeSheets?.workType === "MECHANIC"
                              ? t("Mechanic")
                              : ""
                          }
                        />
                      )}
                      {pendingTimeSheets?.workType === "TASCO" && (
                        <>
                          <Labels
                            htmlFor="laborType"
                            size={"p5"}
                            position={"left"}
                          >
                            {t("ShiftType")}
                          </Labels>
                          <Inputs
                            state="disabled"
                            name="laborType"
                            className="text-center"
                            variant={"white"}
                            data={
                              pendingTimeSheets?.TascoLogs[0].shiftType || ""
                            }
                          />
                        </>
                      )}
                      <Labels htmlFor="jobsiteId" size={"p5"} position={"left"}>
                        {t("JobSite")}
                      </Labels>
                      <Inputs
                        state="disabled"
                        name="jobsiteId"
                        className="text-center"
                        variant={"white"}
                        data={pendingTimeSheets?.Jobsite.name || ""}
                      />
                      <Labels htmlFor="costcode" size={"p6"} position={"left"}>
                        {t("CostCode")}
                      </Labels>
                      <Inputs
                        state="disabled"
                        name="costcode"
                        variant={"white"}
                        className="text-center"
                        data={pendingTimeSheets?.costcode || ""}
                      />
                    </Holds>
                  </Holds>
                </Holds>
              </Contents>
            </Holds>
            <Holds className="row-start-8 row-end-9 w-full h-full pb-5 ">
              <Contents width={"section"} className="">
                <Buttons background={"red"} onClick={awaitAllProcesses}>
                  <Titles size={"h2"}>{t("EndDay")}</Titles>
                </Buttons>
              </Contents>
            </Holds>
          </Grids>
        </Holds>
      </Contents>
    </Bases>
  );
};
