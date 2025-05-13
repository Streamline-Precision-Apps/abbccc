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
  TruckingLog: {
    Equipment: {
      name: string;
    };
  };
};

type TruckingRefueled = {
  id: string;
  gallonsRefueled: number;
  milesAtFueling?: number; // Made optional to match your JSON
  TruckingLog: {
    Equipment: {
      name: string;
    };
  };
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

type TeamMember = {
  id: string;
  firstName: string;
  lastName: string;
  clockedIn: boolean;
  TimeSheets: TimeSheet[]; // Changed to match JSON
};

import { Contents } from "@/components/(reusable)/contents";
import { Grids } from "@/components/(reusable)/grids";
import { Holds } from "@/components/(reusable)/holds";
import { Images } from "@/components/(reusable)/images";
import { NewTab } from "@/components/(reusable)/newTabs";
import { Tab } from "@/components/(reusable)/tab";
import { Texts } from "@/components/(reusable)/texts";
import { Titles } from "@/components/(reusable)/titles";
import { useTranslations } from "next-intl";
import { useState } from "react";

export default function TruckingReviewSection({
  currentTimeSheets,
}: {
  currentTimeSheets: TimeSheet[];
}) {
  const t = useTranslations("TimeCardSwiper");
  const [tabs, setTabs] = useState(1);
  // Combine all trucking logs from all timesheets
  const allTruckingLogs = currentTimeSheets.flatMap(
    (timesheet) => timesheet.TruckingLogs || []
  );

  // Check if we have any trucking data at all
  const hasAnyTruckingData = allTruckingLogs.length > 0;

  // Check for specific data sections
  const hasMileageData = allTruckingLogs.some(
    (log) => log.startingMileage || log.endingMileage
  );

  const hasRefuelData = allTruckingLogs.some((log) => log.RefuelLogs?.length);

  const hasStateMileage = allTruckingLogs.some(
    (log) => log.StateMileages?.length
  );

  const hasMaterials = allTruckingLogs.some(
    (log) => log.Materials?.length // Changed from Materials to Material
  );
  const hasEquipmentHauled = allTruckingLogs.some(
    (log) => log.EquipmentHauled?.length
  );

  if (!hasAnyTruckingData) {
    return (
      <Holds className="h-full w-full flex items-center justify-center">
        <Texts size="p6">{t("NoTruckingDataAvailable")}</Texts>
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
          {hasMileageData && (
            <Tab
              isActive={tabs === 1}
              onClick={() => setTabs(1)}
              titleImage={"/mileage.svg"}
              titleImageAlt={"mileage"}
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
            />
          )}
          {hasMaterials && (
            <Tab
              isActive={tabs === 2}
              onClick={() => setTabs(2)}
              titleImage={"/haulingFilled.svg"}
              titleImageAlt={"haulingFilled"}
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
            />
          )}

          {hasRefuelData && (
            <Tab
              isActive={tabs === 3}
              onClick={() => setTabs(3)}
              titleImage={"/refuelFilled.svg"}
              titleImageAlt={"refuelFilled"}
              activeColor={"white"}
              inActiveColor={"lightBlue"}
              isComplete={true}
              activeBorder={"border"}
              inActiveBorder={"default"}
              className={
                tabs === 3
                  ? "relative z-10 after:content-[''] after:absolute after:bottom-[-2px] after:left-0 after:right-0 after:h-[2px] after:bg-white"
                  : ""
              }
            />
          )}
          {hasStateMileage && (
            <Tab
              isActive={tabs === 4}
              onClick={() => setTabs(4)}
              titleImage={"/stateFilled.svg"}
              titleImageAlt={"stateFilled"}
              activeColor={"white"}
              inActiveColor={"lightBlue"}
              isComplete={true}
              activeBorder={"border"}
              inActiveBorder={"default"}
              className={
                tabs === 4
                  ? "relative z-10 after:content-[''] after:absolute after:bottom-[-2px] after:left-0 after:right-0 after:h-[2px] after:bg-white"
                  : ""
              }
            />
          )}
          {hasEquipmentHauled && (
            <Tab
              isActive={tabs === 5}
              onClick={() => setTabs(5)}
              titleImage={"/trucking.svg"}
              titleImageAlt={"trucking"}
              activeColor={"white"}
              inActiveColor={"lightBlue"}
              isComplete={true}
              activeBorder={"border"}
              inActiveBorder={"default"}
              className={
                tabs === 5
                  ? "relative z-10 after:content-[''] after:absolute after:bottom-[-2px] after:left-0 after:right-0 after:h-[2px] after:bg-white"
                  : ""
              }
            />
          )}
        </Holds>
        <Holds
          background={"white"}
          className="row-start-2 row-end-10 h-full rounded-t-none border-x-[3px] border-b-[3px] border-black"
        >
          {/* Main Trucking Logs */}
          {tabs === 1 && (
            <Holds className="w-full h-full ">
              <Holds
                position={"row"}
                className="p-2 border-b-[3px] border-black justify-between"
              >
                <Titles size={"h7"}>{t("TruckId")}</Titles>
                <Titles size={"h7"}>{t("StartEndMileage")}</Titles>
              </Holds>
              <Holds className="overflow-y-auto no-scrollbar">
                {allTruckingLogs.map((log) => (
                  <Holds
                    position={"row"}
                    key={log.id}
                    className={`p-2 py-3 border-b-[3px] border-black last:border-0 ${
                      log.endingMileage &&
                      log.startingMileage > log.endingMileage &&
                      "bg-red-500"
                    }`}
                  >
                    <Holds className="min-w-6 max-w-[50%]">
                      <Texts position={"left"} size={"p7"}>
                        {`${(log.Equipment as Equipment | null)?.name.slice(
                          0,
                          15
                        )}${
                          ((log.Equipment as Equipment | null)?.name?.length ??
                            0) > 15
                            ? "..."
                            : ""
                        }` || "-"}
                      </Texts>
                    </Holds>

                    <Holds
                      position={"row"}
                      className={`max-w-[50%] gap-2 justify-start items-center`}
                    >
                      <Texts size={"p7"}>{log.startingMileage || "-"}</Texts>
                      <Images
                        titleImg={"/arrowRightThin.svg"}
                        titleImgAlt="Arrow"
                        className="max-w-4 h-auto object-contain"
                      />
                      <Texts size={"p7"}>{log.endingMileage || "-"}</Texts>
                    </Holds>
                  </Holds>
                ))}
              </Holds>
            </Holds>
          )}

          {tabs === 2 && (
            <Holds className="h-full w-full ">
              <Holds background="white" className="">
                <Grids
                  cols={"3"}
                  gap={"2"}
                  className="p-1 py-2 border-b-[3px] border-black"
                >
                  <Titles position={"left"} size={"h7"}>
                    {t("Material")}
                  </Titles>

                  <Titles size={"h7"}>{t("Weight")}</Titles>
                  <Titles position={"right"} size={"h7"}>
                    {t("Screened")}
                  </Titles>
                </Grids>
                {allTruckingLogs.flatMap(
                  (log) =>
                    log.Materials?.map((material) => (
                      <Grids
                        key={material.id}
                        cols={"3"}
                        gap={"2"}
                        className="p-2 border-b-[3px] border-black last:border-0"
                      >
                        <Holds>
                          <Texts position={"left"} size={"p7"}>
                            {material.name || "-"}
                          </Texts>
                        </Holds>

                        <Holds className="w-full ">
                          <Holds
                            position={"row"}
                            className="w-full justify-center gap-1"
                          >
                            <Texts size={"p7"}>{t("Light")}</Texts>
                            <Texts size={"p7"}>
                              {material.lightWeight || "-"}
                            </Texts>
                          </Holds>
                          <Holds
                            position={"row"}
                            className="w-full justify-center gap-1"
                          >
                            <Texts size={"p7"}>{t("Gross")}</Texts>
                            <Texts size={"p7"}>
                              {material.grossWeight || "-"}
                            </Texts>
                          </Holds>
                          <Holds
                            position={"row"}
                            className="w-full justify-center gap-1"
                          >
                            <Texts size={"p7"}>{t("MaterialWeight")}</Texts>
                            <Texts size={"p7"}>
                              {material.materialWeight || "-"}
                            </Texts>
                          </Holds>
                        </Holds>
                        <Texts position={"right"} size={"p6"}>
                          {material.loadType === "SCREENED"
                            ? t("Yes")
                            : t("No")}
                        </Texts>
                      </Grids>
                    )) || []
                )}
              </Holds>
            </Holds>
          )}

          {/* Refueling Section */}
          {tabs === 3 && (
            <Holds background="white" className="w-full h-full">
              <Holds>
                <Grids
                  cols={"3"}
                  gap={"2"}
                  className="p-2 h-full border-b-[3px] border-black"
                >
                  <Titles size={"h7"}>{t("EquipmentId")}</Titles>
                  <Titles size={"h7"}>{t("Gallons")}</Titles>
                  <Titles size={"h7"}>{t("Mileage")}</Titles>
                </Grids>
              </Holds>
              <Holds>
                {allTruckingLogs.flatMap(
                  (log) =>
                    log.RefuelLogs?.map((refuel) => (
                      <Grids
                        key={refuel.id}
                        cols={"3"}
                        gap={"2"}
                        className="p-2 border-b border-gray-200 last:border-0"
                      >
                        <Texts size={"p7"}>
                          {refuel.TruckingLog.Equipment.name || "-"}
                        </Texts>
                        <Texts
                          size={"p7"}
                        >{`${refuel.gallonsRefueled} Gal`}</Texts>
                        <Texts
                          size={"p7"}
                        >{`${refuel.milesAtFueling} mi`}</Texts>
                      </Grids>
                    )) || []
                )}
              </Holds>
            </Holds>
          )}

          {/* State Mileage Section */}
          {tabs === 4 && (
            <Holds className="h-full w-full">
              <Holds>
                <Grids
                  cols={"3"}
                  gap={"2"}
                  className="p-2 h-full border-b-[3px] border-black"
                >
                  <Titles size={"h7"}>{t("EquipmentId")}</Titles>
                  <Titles size={"h7"}>{t("State")}</Titles>
                  <Titles size={"h7"}>{t("Mileage")}</Titles>
                </Grids>
              </Holds>
              {allTruckingLogs.flatMap(
                (log) =>
                  log.StateMileages?.map((state) => (
                    <Grids
                      key={state.id}
                      cols={"3"}
                      gap={"2"}
                      className="p-2 border-b border-gray-200 last:border-0"
                    >
                      <Texts size={"p7"}>
                        {state.TruckingLog.Equipment.name || "-"}
                      </Texts>
                      <Texts size={"p7"}>{state.state || "-"}</Texts>
                      <Texts size={"p7"}>
                        {`${state.stateLineMileage} mi` || "-"}
                      </Texts>
                    </Grids>
                  )) || []
              )}
            </Holds>
          )}

          {/* Materials Section */}

          {/* Equipment Hauled Section */}
          {tabs === 5 && (
            <Holds>
              <Grids
                cols={"2"}
                className="h-full w-full gap-2 py-2 border-b-[3px] border-black"
              >
                <Titles size={"h7"}>{t("EquipmentHauled")}</Titles>
                <Titles size={"h7"}>{t("TransportedTo")}</Titles>
              </Grids>

              {allTruckingLogs.flatMap(
                (log) =>
                  log.EquipmentHauled?.map((hauled) => (
                    <Grids
                      key={hauled.id}
                      cols={"3"}
                      gap={"2"}
                      className="p-2 border-b-[3px] border-black last:border-0"
                    >
                      <Texts size={"p7"}>
                        {
                          (hauled.Equipment as unknown as Equipment | null)
                            ?.name
                        }
                      </Texts>
                      <Images
                        titleImg="/arrowRightThin.svg"
                        titleImgAlt="arrow"
                        className="max-w-5 h-auto mx-auto"
                      />
                      <Texts size={"p7"}>
                        {(hauled.JobSite as unknown as JobSite | null)?.name}
                      </Texts>
                    </Grids>
                  )) || []
              )}
            </Holds>
          )}
        </Holds>
      </Grids>
    </Holds>
  );
}
