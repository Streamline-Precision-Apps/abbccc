"use client";

type TimeSheet = {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
  jobsiteId: string;
  CostCode: {
    name: string;
    description?: string; // Made optional since it's not in your JSON
  };
  Jobsite: {
    name: string;
  };
  TascoLogs: TascoLog[] | null;
  TruckingLogs: TruckingLog[] | null;
  EmployeeEquipmentLogs: EmployeeEquipmentLog[] | null;
  status: string;
};

type EmployeeEquipmentLog = {
  id: string;
  startTime: string;
  endTime: string;
  Equipment: Equipment;
  RefuelLogs: EquipmentRefueled[];
};

type EquipmentRefueled = {
  id: string;
  gallonsRefueled: number;
};

type TruckingLog = {
  id: string;
  laborType: string;
  startingMileage: number;
  endingMileage: number | null;
  Materials: Material[] | null;
  Equipment: Equipment | null;
  EquipmentHauled: EquipmentHauled[] | null;
  RefuelLogs: TruckingRefueled[] | null;
  StateMileages: StateMileage[] | null;
};

type EquipmentHauled = {
  id: string;
  Equipment: Equipment;
  JobSite: JobSite;
};

type JobSite = {
  name: string;
};

type StateMileage = {
  id: string;
  state: string;
  stateLineMileage: number;
};

type TruckingRefueled = {
  id: string;
  gallonsRefueled: number;
  milesAtFueling?: number; // Made optional to match your JSON
};

type Material = {
  id: string;
  name: string;
  quantity: number;
  loadType: string;
  grossWeight: number;
  lightWeight: number;
  materialWeight: number;
};

type TascoLog = {
  id: string;
  shiftType: string;
  materialType: string | null;
  LoadQuantity: number;
  Equipment: Equipment | null;
  RefuelLogs: TascoRefueled[];
};

type TascoRefueled = {
  id: string;
  gallonsRefueled: number;
};

type Equipment = {
  id: string;
  name: string;
};

import { Holds } from "@/components/(reusable)/holds";
import { Texts } from "@/components/(reusable)/texts";
import { Titles } from "@/components/(reusable)/titles";
import { useTranslations } from "next-intl";

export default function GeneralReviewSection({
  currentTimeSheets,
  formatTime,
}: {
  currentTimeSheets: TimeSheet[];
  formatTime: (dateString: string) => string;
}) {
  const t = useTranslations("TimeCardSwiper");
  return (
    <>
      <Holds className="p-1">
        <Holds className="grid grid-cols-4 gap-2">
          <Titles size={"h6"}>{t("StartTime")}</Titles>
          <Titles size={"h6"}>{t("EndTime")}</Titles>
          <Titles size={"h6"}>{t("Jobs")}</Titles>
          <Titles size={"h6"}>{t("CostCode")}</Titles>
        </Holds>
      </Holds>
      <Holds
        background={"white"}
        className="h-full border-[3px] border-black overflow-y-auto no-scrollbar"
      >
        {currentTimeSheets.map((timesheet: TimeSheet) => (
          <Holds
            key={timesheet.id}
            className="h-fit grid grid-cols-4 gap-2 border-b-[2px] py-2 border-black"
          >
            <Holds>
              <Texts size={"p7"}>{formatTime(timesheet.startTime)}</Texts>
            </Holds>
            <Holds>
              <Texts size={"p7"}>{formatTime(timesheet.endTime)}</Texts>
            </Holds>
            <Holds>
              <Texts size={"p7"}>
                {`${timesheet.Jobsite.name.slice(0, 9)}` || "-"}
              </Texts>
            </Holds>
            <Holds>
              <Texts size={"p7"}>
                {`${timesheet.CostCode.name.split(" ")[0]}` || "-"}
              </Texts>
            </Holds>
          </Holds>
        ))}
      </Holds>
    </>
  );
}
