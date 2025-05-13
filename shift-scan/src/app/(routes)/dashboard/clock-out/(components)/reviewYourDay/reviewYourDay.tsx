import Spinner from "@/components/(animations)/spinner";
import { Bases } from "@/components/(reusable)/bases";
import { Buttons } from "@/components/(reusable)/buttons";
import { Contents } from "@/components/(reusable)/contents";
import { Grids } from "@/components/(reusable)/grids";
import { Holds } from "@/components/(reusable)/holds";
import { Images } from "@/components/(reusable)/images";
import { Texts } from "@/components/(reusable)/texts";
import { TitleBoxes } from "@/components/(reusable)/titleBoxes";
import { Titles } from "@/components/(reusable)/titles";

import { useTranslations } from "next-intl";
import { Dispatch, SetStateAction } from "react";

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

export default function ReviewYourDay({
  handleClick,
  prevStep,
  loading,
  timesheets,
  manager,
  setReviewYourTeam,
}: {
  loading: boolean;
  timesheets: TimeSheet[];
  handleClick: () => void;
  prevStep: () => void;
  manager: boolean;
  setReviewYourTeam: Dispatch<SetStateAction<boolean>>;
}) {
  const t = useTranslations("ClockOut");

  return (
    <Bases>
      <Contents>
        <Holds background={"white"} className="row-span-1 h-full">
          <Holds className="h-full w-full">
            <Grids rows={"8"} gap={"5"}>
              <Holds className="row-start-1 row-end-2 h-full w-full justify-center">
                <TitleBoxes onClick={prevStep}>
                  <Holds className="h-full justify-end">
                    <Titles size={"h2"}>{t("ReviewYourDay")}</Titles>
                  </Holds>
                </TitleBoxes>
              </Holds>

              <Holds className="row-start-2 row-end-3 h-full justify-center">
                <Texts size={"p5"} className="px-2">
                  {t("ReviewYourDayDirections")}
                </Texts>
              </Holds>

              <Holds className="row-start-3 row-end-8 h-full ">
                <Contents width={"section"} className="">
                  <Holds className=" h-full overflow-y-scroll no-scrollbar border-[3px] rounded-[10px] border-black">
                    {loading ? (
                      <>
                        <Holds
                          position={"row"}
                          className="border-b-[3px] border-black py-1 px-2"
                        >
                          <Holds className="w-[30px]"></Holds>
                          <Grids cols={"3"} gap={"2"} className="w-full">
                            <Titles position={"left"} size={"h6"}>
                              {t("StartEndTime")}
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
                              {t("StartEnd")}
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
                                  titleImg="/mechanic.svg"
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
                            <Grids
                              cols={"3"}
                              gap={"1"}
                              className="w-full h-full"
                            >
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
                                  {timesheet.Jobsite.name.length > 9
                                    ? `${timesheet.Jobsite.name.slice(0, 9)}...`
                                    : timesheet.Jobsite.name}
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
                </Contents>
              </Holds>
              <Holds className="row-span-1 h-full pb-5">
                <Contents width={"section"}>
                  <Buttons
                    background={"orange"}
                    onClick={
                      manager ? () => setReviewYourTeam(true) : handleClick
                    }
                  >
                    <Titles size={"h2"}>{t("Continue")}</Titles>
                  </Buttons>
                </Contents>
              </Holds>
            </Grids>
          </Holds>
        </Holds>
      </Contents>
    </Bases>
  );
}
