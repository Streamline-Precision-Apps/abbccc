import Spinner from "@/components/(animations)/spinner";
import { Bases } from "@/components/(reusable)/bases";
import { Buttons } from "@/components/(reusable)/buttons";
import { Contents } from "@/components/(reusable)/contents";
import { Grids } from "@/components/(reusable)/grids";
import { Holds } from "@/components/(reusable)/holds";
import { Images } from "@/components/(reusable)/images";
import { Texts } from "@/components/(reusable)/texts";
import { Titles } from "@/components/(reusable)/titles";

import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";

export type TimeSheet = {
  submitDate: string;
  date: Date | string;
  id: string;
  userId: string;
  jobsiteId: string;
  costcode: string;
  startTime: string;
  endTime: string | null;
};

export default function ReviewYourDay({
  handleClick,
  prevStep,
}: {
  handleClick: () => void;
  prevStep: () => void;
}) {
  const t = useTranslations("ClockOut");
  const [timesheets, setTimesheets] = useState<TimeSheet[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchTimesheets = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/getTodaysTimesheets");
        const data = await response.json();
        setTimesheets(data);
      } catch (error) {
        console.error("Error fetching timesheets:", error);
      }
      setLoading(false);
    };
    fetchTimesheets();
  }, []);

  return (
    <Bases>
      <Contents>
        <Holds background={"white"} className="row-span-1 h-full">
          <Contents width={"section"} className="py-4">
            <Holds className="h-full w-full">
              <Grids rows={"8"} gap={"5"}>
                <Holds className="row-start-1 row-end-2 h-full w-full justify-center">
                  <Grids
                    rows={"2"}
                    cols={"5"}
                    gap={"3"}
                    className=" h-full w-full"
                  >
                    <Holds
                      className="row-start-1 row-end-2 col-start-1 col-end-2 h-full w-full justify-center"
                      onClick={prevStep}
                    >
                      <Images
                        titleImg="/arrowBack.svg"
                        titleImgAlt="back"
                        position={"left"}
                      />
                    </Holds>
                    <Holds className="row-start-2 row-end-3 col-start-1 col-end-6 h-full w-full justify-center">
                      <Titles size={"h1"}>{t("ReviewYourDay")}</Titles>
                    </Holds>
                  </Grids>
                </Holds>
                <Holds className="row-start-2 row-end-3 h-full ">
                  <Texts size={"p4"} className="mb-5">
                    {t("ReviewYourDayDirections")}
                  </Texts>
                </Holds>
                <Holds className="row-start-3 row-end-4 h-full justify-end ">
                  <Holds position={"row"}>
                    <Grids cols={"4"} gap={"4"} className="w-full">
                      <Titles size={"h6"}>{t("StartTime")}</Titles>
                      <Titles size={"h6"}>{t("EndTime")}</Titles>
                      <Titles size={"h6"}>{t("Jobsite")}</Titles>
                      <Titles size={"h6"}>{t("CostCode")}</Titles>
                    </Grids>
                  </Holds>
                </Holds>
                <Holds className="row-start-4 row-end-8 h-full overflow-y-scroll no-scrollbar border-[3px] rounded-[10px] border-black">
                  {loading ? (
                    <Holds className="h-full w-full justify-center ">
                      <Spinner />
                    </Holds>
                  ) : (
                    timesheets.map((timesheet, index) => (
                      <Holds
                        position={"row"}
                        className="gap-4 border-b-[3px] border-black"
                        key={index}
                      >
                        <Grids
                          cols={"4"}
                          gap={"4"}
                          className="w-full h-full p-4"
                        >
                          <Titles
                            size={"h6"}
                            className="col-start-1 col-end-2 "
                          >
                            {timesheet.startTime
                              ? new Date(
                                  timesheet.startTime
                                ).toLocaleTimeString([], {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                  hour12: true, // Change to false for 24-hour format
                                })
                              : " - "}
                          </Titles>

                          {timesheets.length - 1 === index ? (
                            <Titles
                              size={"h6"}
                              className="col-start-2 col-end-3 "
                            >
                              {t("Now")}
                            </Titles>
                          ) : (
                            <Titles
                              size={"h6"}
                              className="col-start-2 col-end-3 "
                            >
                              {timesheet.endTime
                                ? new Date(
                                    timesheet.endTime
                                  ).toLocaleTimeString([], {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                    hour12: true,
                                  })
                                : " - "}
                            </Titles>
                          )}

                          <Titles
                            size={"h6"}
                            className="col-start-3 col-end-4 "
                          >
                            {timesheet.jobsiteId}
                          </Titles>
                          <Titles
                            size={"h6"}
                            className="col-start-4 col-end-5 "
                          >
                            {timesheet.costcode}
                          </Titles>
                        </Grids>
                      </Holds>
                    ))
                  )}
                </Holds>
                <Holds className="row-span-1 h-full">
                  <Buttons background={"orange"} onClick={handleClick}>
                    <Titles size={"h2"}>{t("Continue")}</Titles>
                  </Buttons>
                </Holds>
              </Grids>
            </Holds>
          </Contents>
        </Holds>
      </Contents>
    </Bases>
  );
}
