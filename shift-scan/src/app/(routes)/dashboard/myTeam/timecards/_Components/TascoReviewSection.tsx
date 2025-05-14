"use client";
type employeeEquipmentLogs = {
  id: string;
  startTime: string;
  endTime: string;
  equipment: Equipment[];
  refueled: EquipmentRefueled[];
};

type TruckingLogs = {
  id: string;
  laborType: string;
  startingMileage: number;
  endingMileage: number | null;
  Material: Materials[] | null; // Changed from Materials to Material
  equipment: Equipment[] | null;
  EquipmentHauled: EquipmentHauled[] | null;
  Refueled: TruckingRefueled[] | null; // Changed from TruckingRefueled to Refueled
  stateMileage: stateMileage[] | null;
};

type stateMileage = {
  id: string;
  state: string;
  stateLineMileage: number;
};

type Materials = {
  id: string;
  name: string;
  quantity: number;
  loadType: string;
  LoadWeight: number;
};

type TinderSwipeRef = {
  swipeLeft: () => void;
  swipeRight: () => void;
};

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
  laborType: string;
  materialType: string | null;
  LoadQuantity: number;
  Equipment: Equipment | null;
  RefuelLogs: TascoRefueled[];
};

type TascoRefueled = {
  id: string;
  gallonsRefueled: number;
  TascoLog: {
    Equipment: {
      name: string;
    };
  };
};

type Equipment = {
  id: string;
  name: string;
};

type TeamMember = {
  id: string;
  firstName: string;
  lastName: string;
  clockedIn: boolean;
  TimeSheets: TimeSheet[]; // Changed to match JSON
};

import { Grids } from "@/components/(reusable)/grids";
import { Holds } from "@/components/(reusable)/holds";
import { Tab } from "@/components/(reusable)/tab";
import { Texts } from "@/components/(reusable)/texts";
import { Titles } from "@/components/(reusable)/titles";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";

export default function TascoReviewSection({
  currentTimeSheets,
}: {
  currentTimeSheets: TimeSheet[];
}) {
  const t = useTranslations("TimeCardSwiper");
  const [tabs, setTabs] = useState(1);
  const allTascoLogs = currentTimeSheets.flatMap(
    (timesheet) => timesheet.TascoLogs || []
  );
  useEffect(() => {
    console.log(allTascoLogs);
  }, [allTascoLogs]);

  const hasAnyTascoData = allTascoLogs.length > 0;

  const hasHaulingData = allTascoLogs.some(
    (log) => log.materialType || log.LoadQuantity || log.Equipment?.name
  );
  const hasRefuelData = allTascoLogs.some((log) => log.RefuelLogs?.length);
  if (!hasAnyTascoData) {
    return (
      <Holds className="h-full w-full flex items-center justify-center">
        <Texts size="p6">{t("NoTascoDataAvailable")}</Texts>
      </Holds>
    );
  }
  return (
    <Holds
      className="h-full w-full overflow-y-auto no-scrollbar"
      style={{ touchAction: "pan-y" }}
    >
      <Grids rows={"9"} className="w-full h-full">
        <Holds
          position={"row"}
          className="row-start-1 row-end-2 w-full h-full gap-x-[2px] relative"
        >
          <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-black z-0" />
          {hasHaulingData && (
            <Tab
              isActive={tabs === 1}
              onClick={() => setTabs(1)}
              titleImage={"/haulingFilled.svg"}
              titleImageAlt={"haulingFilled"}
              activeColor={"white"}
              inActiveColor={"lightBlue"}
              isComplete={true}
              activeBorder={"border"}
              inActiveBorder={"default"}
              className={
                tabs === 1
                  ? "relative z-10 after:content-[''] after:absolute after:bottom-[-2px] after:left-0 after:right-0 after:h-[2px] after:bg-white"
                  : ""
              }
            >
              <Titles position={"right"} size="h5">
                {t("HaulingLogs")}
              </Titles>
            </Tab>
          )}
          {hasRefuelData && (
            <Tab
              isActive={tabs === 2}
              onClick={() => setTabs(2)}
              titleImage={"/refuelFilled.svg"}
              titleImageAlt={"refuelFilled"}
              activeColor={"white"}
              inActiveColor={"lightBlue"}
              isComplete={true}
              activeBorder={"border"}
              inActiveBorder={"default"}
              className={
                tabs === 2
                  ? "relative z-10 after:content-[''] after:absolute after:bottom-[-2px] after:left-0 after:right-0 after:h-[2px] after:bg-white"
                  : ""
              }
            >
              <Titles position={"right"} size="h5">
                {t("RefuelLogs")}
              </Titles>
            </Tab>
          )}
        </Holds>
        <Holds
          background={"white"}
          className="row-start-2 row-end-10 h-full rounded-t-none border-x-[3px] border-b-[3px] border-black"
        >
          {tabs === 1 && (
            <Holds className="w-full h-full ">
              <Holds>
                <Grids className="grid grid-cols-[.5fr,1fr,1fr,1fr,.5fr] gap-2 py-2 px-1 border-b-[3px] border-black">
                  <Titles size={"h7"}>{t("Shift")}</Titles>
                  <Titles size={"h7"}>{t("Labor")}</Titles>

                  <Titles size={"h7"}>{t("Equipment")}</Titles>
                  <Titles size={"h7"}>{t("Material")}</Titles>
                  <Titles position={"right"} size={"h7"}>
                    {t("Loads")}
                  </Titles>
                </Grids>
              </Holds>
              <Holds className="overflow-y-auto no-scrollbar">
                {allTascoLogs.map((log) => (
                  <Grids
                    key={log.id}
                    className="grid grid-cols-[.5fr,1fr,1fr,1fr,.5fr] gap-2 p-1 py-2 border-b border-gray-200 last:border-0 justify-center items-center grid-"
                  >
                    <Texts position={"left"} size={"p7"}>
                      {log.shiftType.split(" ")[0]}
                    </Texts>
                    <Texts position={"left"} size={"p7"}>
                      {log.laborType === "tascoAbcdEquipment"
                        ? "EQ.Operator"
                        : log.laborType === "tascoAbcdLabor"
                        ? `Labor`
                        : log.laborType === "tascoEEquipment"
                        ? "EQ.Operator"
                        : log.laborType}
                    </Texts>

                    <Texts size={"p7"}>{log.Equipment?.name || "-"}</Texts>
                    <Texts size={"p7"}>{log.materialType || "N/A"}</Texts>
                    <Texts size={"p7"}>{log.LoadQuantity || "0"}</Texts>
                  </Grids>
                ))}
              </Holds>
            </Holds>
          )}
          {tabs === 2 && (
            <Holds background="white" className="w-full h-full">
              <Holds>
                <Grids
                  cols={"2"}
                  gap={"2"}
                  className="p-2 h-full border-b-[3px] border-black"
                >
                  <Titles size={"h7"}>{t("EquipmentId")}</Titles>
                  <Titles size={"h7"}>{t("Gallons")}</Titles>
                </Grids>
              </Holds>
              <Holds>
                {allTascoLogs.flatMap(
                  (log) =>
                    log.RefuelLogs?.map((refuel) => (
                      <Grids
                        key={refuel.id}
                        cols={"2"}
                        gap={"2"}
                        className="p-2 border-b border-gray-200 last:border-0"
                      >
                        <Texts size={"p7"}>
                          {refuel.TascoLog?.Equipment?.name || "-"}
                        </Texts>
                        <Texts
                          size={"p7"}
                        >{`${refuel.gallonsRefueled} Gal`}</Texts>
                      </Grids>
                    )) || []
                )}
              </Holds>
            </Holds>
          )}
        </Holds>
      </Grids>
    </Holds>
  );
}
