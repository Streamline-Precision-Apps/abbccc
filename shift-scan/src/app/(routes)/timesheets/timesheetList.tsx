"use client";
import { Holds } from "@/components/(reusable)/holds";
import { Images } from "@/components/(reusable)/images";
import { Texts } from "@/components/(reusable)/texts";
import { Titles } from "@/components/(reusable)/titles";
import { formatTimeHHMM } from "@/utils/formatDateAmPm";
import { TimeSheet } from "@/lib/types";
import { useTranslations } from "next-intl";
import { Contents } from "@/components/(reusable)/contents";

export default function TimesheetList({
  timesheet,
  copyToClipboard,
  calculateDuration,
}: {
  timesheet: TimeSheet;
  copyToClipboard: (timesheet: string) => Promise<void>;
  calculateDuration: (
    startTime: string | Date | null | undefined,
    endTime: string | Date | null | undefined
  ) => string;
}) {
  const t = useTranslations("Home");
  return (
    <Holds
      key={timesheet.id}
      size={"full"}
      className="border-[3px] border-black rounded-[10px] p-2 "
    >
      <Contents width={"section"}>
        <Holds className="col-start-1 col-end-3 row-start-2 row-end-3 h-full">
          <Holds className="py-2">
            <Titles size={"h3"} className="underline">
              {t("TotalHoursWorked")}
            </Titles>
            <Texts size={"p4"}>
              {calculateDuration(timesheet.startTime, timesheet.endTime)}{" "}
              {"Hrs"}
            </Texts>
          </Holds>
          <Holds
            position={"row"}
            className="justify-center py-2 border-b-[1px]"
          >
            <Images
              titleImg="/formDuplicate.svg"
              titleImgAlt={"Copy And Paste"}
              onClick={() => copyToClipboard(timesheet.id)}
              className="w-8"
            />
          </Holds>
          <Holds position={"row"} className="justify-between border-b-[1px]">
            <Texts size={"p6"}>{t("StartTime")}</Texts>
            <Texts size={"p6"}>
              {timesheet.startTime
                ? formatTimeHHMM(timesheet.startTime.toString())
                : "N/A"}
            </Texts>
          </Holds>
          <Holds
            position={"row"}
            className="justify-between border-b-[1px] pt-2"
          >
            <Texts size={"p6"}>{t("EndTime")}</Texts>

            <Texts size={"p6"}>
              {timesheet.endTime
                ? formatTimeHHMM(timesheet.endTime.toString())
                : "N/A"}
            </Texts>
          </Holds>
          <Holds
            position={"row"}
            className="justify-between border-b-[1px] pt-2"
          >
            <Texts size={"p6"}>{t("Jobsite")}</Texts>

            <Texts size={"p6"}>{timesheet.jobsiteId}</Texts>
          </Holds>
          <Holds
            position={"row"}
            className="justify-between border-b-[1px] pt-2"
          >
            <Texts size={"p6"}>{t("CostCode")}</Texts>

            <Texts size={"p6"}>{timesheet.costcode}</Texts>
          </Holds>
        </Holds>
      </Contents>
    </Holds>
  );
}
{
  /* <Holds className="col-start-8 col-end-9">
<Images
  titleImg={"/formDuplicate.svg"}
  titleImgAlt={"Copy And Paste"}
  onClick={() => copyToClipboard(timesheet.id)}
/>
</Holds> */
}
