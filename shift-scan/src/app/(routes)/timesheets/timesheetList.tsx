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
  const t = useTranslations("TimeSheet");
  return (
    <Holds
      key={timesheet.id}
      size={"full"}
      className="w-full border-[3px] border-black rounded-[10px] pt-2 pb-4 my-3 relative"
    >
      <Contents width={"section"}>
        <Holds className="w-full h-full ">
          <Holds className="w-full h-full py-2">
            <Titles size={"h3"} className="underline">
              {t("TotalHoursWorked")}
            </Titles>
            <Texts size={"p4"}>
              {calculateDuration(timesheet.startTime, timesheet.endTime)}{" "}
              {"Hrs"}
            </Texts>
            <Holds
              background={"orange"}
              className="max-w-10 h-auto absolute top-2 right-2"
            >
              <Images
                titleImg="/formDuplicate.svg"
                titleImgAlt={"Copy And Paste"}
                onClick={() => copyToClipboard(timesheet.id)}
                className="w-full h-auto object-contain"
              />
            </Holds>
          </Holds>
          <Holds position={"row"} className="justify-between border-b">
            <Texts size={"p6"}>{t("StartTime")}</Texts>
            <Texts size={"p6"}>
              {timesheet.startTime
                ? formatTimeHHMM(timesheet.startTime.toString())
                : "N/A"}
            </Texts>
          </Holds>
          <Holds
            position={"row"}
            className="justify-between border-b pt-2"
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
            className="justify-between border-b pt-2"
          >
            <Texts size={"p6"}>{t("Jobsite")}</Texts>

            <Texts size={"p6"}>{timesheet.Jobsite.name}</Texts>
          </Holds>
          <Holds
            position={"row"}
            className="justify-between border-b pt-2"
          >
            <Texts size={"p6"}>{t("CostCode")}</Texts>

            <Texts size={"p6"}>{timesheet.costcode}</Texts>
          </Holds>
        </Holds>
      </Contents>
    </Holds>
  );
}
