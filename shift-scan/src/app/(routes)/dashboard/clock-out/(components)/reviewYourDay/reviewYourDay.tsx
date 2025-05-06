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
  workType: string;
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
                <Holds className="row-start-2 row-end-3 h-full justify-center">
                  <Texts size={"p5"} className="px-2">
                    {t("ReviewYourDayDirections")}
                  </Texts>
                </Holds>

                <Holds className="row-start-3 row-end-8 h-full overflow-y-scroll no-scrollbar border-[3px] rounded-[10px] border-black">
                  {loading ? (
                    <>
                      <Holds
                        position={"row"}
                        className="border-b-[3px] border-black py-1 px-2"
                      >
                        <Holds className="w-[30px]"></Holds>
                        <Grids cols={"3"} gap={"2"} className="w-full">
                          <Titles position={"left"} size={"h6"}>
                            {t("StartTime")}
                          </Titles>
                          <Titles position={"center"} size={"h6"}>
                            {t("Jobsite")}
                          </Titles>
                          <Titles position={"right"} size={"h6"}>
                            {t("CostCode")}
                          </Titles>
                        </Grids>
                      </Holds>
                      <Holds className="h-full w-full justify-center">
                        <Spinner />
                      </Holds>
                    </>
                  ) : (
                    <>
                      <Holds
                        position={"row"}
                        className="border-b-[3px] border-black py-1 px-2"
                      >
                        <Holds className="w-[30px]"></Holds>
                        <Grids cols={"3"} gap={"2"} className="w-full">
                          <Titles position={"left"} size={"h6"}>
                            {t("StartTime")}
                          </Titles>
                          <Titles position={"center"} size={"h6"}>
                            {t("Jobsite")}
                          </Titles>
                          <Titles position={"right"} size={"h6"}>
                            {t("CostCode")}
                          </Titles>
                        </Grids>
                      </Holds>
                      {timesheets.map((timesheet, index) => (
                        <Holds
                          position={"row"}
                          className=" border-b-[3px] border-black py-2 pr-1"
                          key={index}
                        >
                          <Holds className="w-[25px] mx-2">
                            {timesheet.workType === "TRUCK_DRIVER" ? (
                              <Images
                                titleImg="/trucking.svg"
                                titleImgAlt="Trucking Icon"
                                className="w-7 h-7 "
                              />
                            ) : timesheet.workType === "MECHANIC" ? (
                              <Images
                                titleImg="/mechanic-icon.svg"
                                titleImgAlt="Mechanic Icon"
                                className="w-7 h-7 "
                              />
                            ) : timesheet.workType === "TASCO" ? (
                              <Images
                                titleImg="/tasco.svg"
                                titleImgAlt="Tasco Icon"
                                className="w-7 h-7 "
                              />
                            ) : (
                              <Images
                                titleImg="/equipment.svg"
                                titleImgAlt="General Icon"
                                className="w-7 h-7 "
                              />
                            )}
                          </Holds>
                          <Grids cols={"3"} gap={"1"} className="w-full h-full">
                            <Holds className="col-start-1 col-end-2 h-full w-full">
                              <Texts position={"left"} size={"p7"}>
                                {timesheet.startTime
                                  ? new Date(
                                      timesheet.startTime
                                    ).toLocaleTimeString([], {
                                      hour: "2-digit",
                                      minute: "2-digit",
                                      hour12: true, // Change to false for 24-hour format
                                    })
                                  : " - "}
                              </Texts>

                              {timesheets.length - 1 === index ? (
                                <Texts position={"left"} size={"p7"}>
                                  {`${new Date().toLocaleTimeString([], {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                    hour12: true,
                                  })} (${t("Now")})`}
                                </Texts>
                              ) : (
                                <Texts position={"left"} size={"p7"}>
                                  {timesheet.endTime
                                    ? new Date(
                                        timesheet.endTime
                                      ).toLocaleTimeString([], {
                                        hour: "2-digit",
                                        minute: "2-digit",
                                        hour12: true,
                                      })
                                    : " - "}
                                </Texts>
                              )}
                            </Holds>

                            <Holds className="col-start-2 col-end-3 h-full w-full justify-center  ">
                              <Texts size={"p7"} position={"center"}>
                                {timesheet.jobsiteId.length > 9
                                  ? `${timesheet.jobsiteId.slice(0, 9)}...`
                                  : timesheet.jobsiteId}
                              </Texts>
                            </Holds>
                            <Holds className="col-start-3 col-end-4 h-full w-full justify-center  ">
                              <Texts size={"p7"} position={"right"}>
                                {timesheet.costcode.split(" ")[0]}
                              </Texts>
                            </Holds>
                          </Grids>
                        </Holds>
                      ))}
                    </>
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
