import { Buttons } from "@/components/(reusable)/buttons";
import { Grids } from "@/components/(reusable)/grids";
import { Holds } from "@/components/(reusable)/holds";
import { Texts } from "@/components/(reusable)/texts";
import { Titles } from "@/components/(reusable)/titles";
import { TimeSheet } from "@/lib/types";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";

export default function ReviewYourDay({
  handleClick,
}: {
  handleClick: () => void;
}) {
  const t = useTranslations("ClockOut");
  const [timesheets, setTimesheets] = useState<TimeSheet[]>([]);

  useEffect(() => {
    const fetchTimesheets = async () => {
      try {
        const response = await fetch("/api/getTodaysTimesheets");
        const data = await response.json();
        setTimesheets(data);
      } catch (error) {
        console.error("Error fetching timesheets:", error);
      }
    };
    fetchTimesheets();
  }, []);

  return (
    <Holds className="h-full w-full">
      <Grids rows={"6"} gap={"5"}>
        <Holds className="row-span-1">
          <Titles size={"h1"}>{t("ReviewYourDay")}</Titles>
        </Holds>
        <Holds className="row-span-4 h-full overflow-y-scroll no-scrollbar">
          <Texts size={"p4"} className="mb-5">
            {t("ReviewYourDayDirections")}
          </Texts>
          <Holds position={"row"} className="gap-4 border-b-[3px] border-black">
            <Titles size={"h6"}>{t("StartTime")}</Titles>
            <Titles size={"h6"}>{t("EndTime")}</Titles>
            <Titles size={"h6"}>{t("Jobsite")}</Titles>
            <Titles size={"h6"}>{t("CostCode")}</Titles>
          </Holds>
          {timesheets.map((timesheet, index) => (
            <>
              <Holds
                position={"row"}
                className="gap-4 border-b-[3px] border-black"
              >
                <Grids cols={"4"} gap={"4"} className="w-full h-full p-3">
                  <Titles size={"h6"} className="col-start-1 col-end-2 ">
                    {timesheet.startTime.toString().slice(11, 16)}
                  </Titles>
                  {timesheets.length - 1 === index ? (
                    <Titles size={"h6"} className="col-start-2 col-end-3 ">
                      {t("Current")}
                    </Titles>
                  ) : (
                    <Titles size={"h6"} className="col-start-2 col-end-3 ">
                      {timesheet.endTime
                        ? timesheet.endTime.toString().slice(11, 16)
                        : " - "}
                    </Titles>
                  )}

                  <Titles size={"h6"} className="col-start-3 col-end-4 ">
                    {timesheet.jobsiteId}
                  </Titles>
                  <Titles size={"h6"} className="col-start-4 col-end-5 ">
                    {timesheet.costcode}
                  </Titles>
                </Grids>
              </Holds>
            </>
          ))}
        </Holds>
        <Holds className="row-span-1 h-full">
          <Buttons onClick={handleClick}>{t("Continue")}</Buttons>
        </Holds>
      </Grids>
    </Holds>
  );
}
