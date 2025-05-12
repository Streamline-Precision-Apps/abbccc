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
import { TitleBoxes } from "@/components/(reusable)/titleBoxes";
import { Titles } from "@/components/(reusable)/titles";
import { Clock } from "@/components/clock";
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
};

export const LaborClockOut = ({
  scanResult,
  savedCostCode,
  prevStep,
  commentsValue,
  pendingTimeSheets,
}: {
  scanResult: string | undefined;
  savedCostCode: string | null;
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
          <Grids rows={"7"} gap={"5"} className="h-full w-full">
            <Holds className="h-full w-full row-start-1 row-end-2 ">
              <TitleBoxes onClick={prevStep}>
                <Holds className="h-full justify-end">
                  <Holds position={"row"} className="justify-center gap-2">
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
              <Grids rows={"10"} cols={"5"}>
                <Holds className="row-start-2 row-end-7 col-start-1 col-end-6 h-full pt-1">
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
                        data={pendingTimeSheets?.Jobsite.name || ""}
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
                        data={pendingTimeSheets?.costcode || ""}
                      />
                    </Contents>
                  </Holds>
                </Holds>

                <Holds className="row-start-7 row-end-11 col-start-1 col-end-6 h-full">
                  <Holds
                    background={"darkBlue"}
                    className="h-full w-[100%] sm:w-[90%] md:w-[90%] lg:w-[80%] xl:w-[80%] 2xl:w-[80%]  border-[3px]   border-black p-8 "
                  >
                    {/* Cancel out the button shadow with none background  and then add a class name */}
                    <Buttons
                      onClick={awaitAllProcesses}
                      className="bg-app-green flex justify-center items-center p-4 rounded-[10px] text-black font-bold"
                    >
                      <Clock time={date.getTime()} />
                    </Buttons>
                  </Holds>
                </Holds>
              </Grids>
            </Holds>
          </Grids>
        </Holds>
      </Contents>
    </Bases>
  );
};
