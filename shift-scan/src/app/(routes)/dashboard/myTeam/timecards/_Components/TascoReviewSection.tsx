"use client";
type TimeSheet = {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
  jobsiteId: string;
  workType: string;
  status: string;
  CostCode: {
    name: string;
  };
  Jobsite: {
    name: string;
  };
  TascoLogs: {
    id: string;
    shiftType: string;
    laborType: string;
    materialType: string | null;
    LoadQuantity: number;
    Equipment: {
      id: string;
      name: string;
    };
    RefuelLogs: {
      id: string;
      gallonsRefueled: number;
    }[];
  }[];
  TruckingLogs: {
    id: string;
    laborType: string;
    startingMileage: number;
    endingMileage: number | null;
    Equipment: {
      id: string;
      name: string;
    };
    Materials: {
      id: string;
      name: string;
      quantity: number;
      loadType: string;
      grossWeight: number;
      lightWeight: number;
      materialWeight: number;
    }[];
    EquipmentHauled: {
      id: string;
      Equipment: {
        name: string;
      };
      JobSite: {
        name: string;
      };
    }[];
    RefuelLogs: {
      id: string;
      gallonsRefueled: number;
      milesAtFueling?: number;
    }[];
    StateMileages: {
      id: string;
      state: string;
      stateLineMileage: number;
    }[];
  }[];
  EmployeeEquipmentLogs: {
    id: string;
    startTime: string;
    endTime: string;
    Equipment: {
      id: string;
      name: string;
    };
    RefuelLogs: {
      id: string;
      gallonsRefueled: number;
    }[];
  }[];
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
        {/* Tab Navigation */}
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

        {/* Content Area */}
        <Holds
          background={"white"}
          className="row-start-2 row-end-10 h-full rounded-t-none border-x-[3px] border-b-[3px] border-black"
        >
          {/* Hauling Logs Tab */}
          {tabs === 1 && (
            <Holds className="w-full h-full">
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
                    className="grid grid-cols-[.5fr,1fr,1fr,1fr,.5fr] gap-2 p-1 py-2 border-b border-gray-200 last:border-0 justify-center items-center"
                  >
                    <Texts position={"left"} size={"p7"}>
                      {log.shiftType?.split(" ")[0] || "-"}
                    </Texts>
                    <Texts position={"left"} size={"p7"}>
                      {log.laborType === "tascoAbcdEquipment"
                        ? "EQ.Operator"
                        : log.laborType === "tascoAbcdLabor"
                        ? "Labor"
                        : log.laborType === "tascoEEquipment"
                        ? "EQ.Operator"
                        : log.laborType || "-"}
                    </Texts>
                    <Texts size={"p7"}>{log.Equipment?.name || "-"}</Texts>
                    <Texts size={"p7"}>{log.materialType || "N/A"}</Texts>
                    <Texts size={"p7"} className="text-right">
                      {log.LoadQuantity || "0"}
                    </Texts>
                  </Grids>
                ))}
              </Holds>
            </Holds>
          )}

          {/* Refuel Logs Tab */}
          {tabs === 2 && (
            <Holds background="white" className="w-full h-full">
              <Holds>
                <Grids
                  cols={"2"}
                  gap={"2"}
                  className="p-2 h-full border-b-[3px] border-black"
                >
                  <Titles size={"h7"}>{t("Equipment")}</Titles>
                  <Titles size={"h7"}>{t("Gallons")}</Titles>
                </Grids>
              </Holds>

              <Holds className="overflow-y-auto no-scrollbar">
                {allTascoLogs.flatMap(
                  (log) =>
                    log.RefuelLogs?.map((refuel) => (
                      <Grids
                        key={refuel.id}
                        cols={"2"}
                        gap={"2"}
                        className="p-2 border-b border-gray-200 last:border-0"
                      >
                        <Texts size={"p7"}>{log.Equipment?.name || "-"}</Texts>
                        <Texts size={"p7"} className="text-right">
                          {refuel.gallonsRefueled} Gal
                        </Texts>
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
