"use client";
import { Holds } from "@/components/(reusable)/holds";
import { Images } from "@/components/(reusable)/images";
import { Texts } from "@/components/(reusable)/texts";
import { Titles } from "@/components/(reusable)/titles";
import { formatTimeHHMM } from "@/utils/formatDateAmPm";
import { useTranslations } from "next-intl";
import { Contents } from "@/components/(reusable)/contents";
import { FormStatus, WorkType } from "@/lib/enums";

export type TimeSheet = {
  id: number;
  date: Date | string;
  userId: string;
  jobsiteId: string;
  costcode: string;
  nu: string;
  Fp: string;
  startTime: Date | string;
  endTime: Date | string | null;
  comment: string | null;
  statusComment: string | null;
  location: string | null;
  status: FormStatus; // Enum: PENDING, APPROVED, etc.
  workType: WorkType; // Enum: Type of work
  editedByUserId: string | null;
  newTimeSheetId: number | null;
  createdByAdmin: boolean;
  createdAt: Date | string;
  updatedAt: Date | string;
  clockInLat: number | null;
  clockInLng: number | null;
  clockOutLat: number | null;
  clockOutLng: number | null;
  withinFenceIn: boolean | null;
  withinFenceOut: boolean | null;
  wasInjured: boolean;

  // Relations
  Jobsite: {
    name: string;
  };
};

export default function TimesheetList({
  timesheet,
  copyToClipboard,
  calculateDuration,
}: {
  timesheet: TimeSheet;
  copyToClipboard: (timesheet: string) => Promise<void>;
  calculateDuration: (
    startTime: string | Date | null | undefined,
    endTime: string | Date | null | undefined,
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
              className="w-10 h-10 absolute top-2 right-2"
            >
              <Images
                titleImg="/formDuplicate.svg"
                titleImgAlt={"Copy And Paste"}
                onClick={() => copyToClipboard(String(timesheet.id))}
                className="w-full h-full object-contain"
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
          <Holds position={"row"} className="justify-between border-b pt-2">
            <Texts size={"p6"}>{t("EndTime")}</Texts>

            <Texts size={"p6"}>
              {timesheet.endTime
                ? formatTimeHHMM(timesheet.endTime.toString())
                : "N/A"}
            </Texts>
          </Holds>
          <Holds position={"row"} className="justify-between border-b pt-2">
            <Texts size={"p6"}>{t("Jobsite")}</Texts>

            <Texts size={"p6"}>{timesheet.Jobsite.name}</Texts>
          </Holds>
          <Holds position={"row"} className="justify-between border-b pt-2">
            <Texts size={"p6"}>{t("CostCode")}</Texts>

            <Texts size={"p6"}>{timesheet.costcode}</Texts>
          </Holds>
        </Holds>
      </Contents>
    </Holds>
  );
}
