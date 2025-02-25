"use client";
import React, { use, useEffect, useState } from "react";
import { Holds } from "@/components/(reusable)/holds";
import { Grids } from "@/components/(reusable)/grids";
import { Contents } from "@/components/(reusable)/contents";
import { useTranslations } from "next-intl";
import { NewTab } from "@/components/(reusable)/newTabs";
import { Titles } from "@/components/(reusable)/titles";
import HaulingLogs from "./components/HaulingLogs";

type StateMileage = {
  id: string;
  truckingLogId: string;
  state: string;
  stateLineMileage: number;
  createdAt: Date;
};

type Material = {
  name: string;
  id: string;
  LocationOfMaterial: string | null;
  truckingLogId: string;
  quantity: number | null;
  loadType: LoadType | null;
  LoadWeight: number | null;
  createdAt: Date;
};

type LoadType = "UNSCREENED" | "SCREENED";

type EquipmentHauled = {
  id: string;
  truckingLogId: string;
  equipmentId: string;
  createdAt: Date;
};

type Refueled = {
  id: string;
  date: Date;
  employeeEquipmentLogId: string | null;
  truckingLogId: string | null;
  gallonsRefueled: number | null;
  milesAtfueling: number | null;
  tascoLogId: string | null;
};

export default function TruckDriver({
  timeSheetId,
}: {
  timeSheetId: string | undefined;
}) {
  const t = useTranslations("TruckingAssistant");
  const [activeTab, setActiveTab] = useState(1);
  const [StateMileage, setStateMileage] = useState<StateMileage>();
  const [material, setMaterial] = useState<Material[]>();
  const [equipmentHauled, setEquipmentHauled] = useState<EquipmentHauled[]>();
  const [refuelLogs, setRefuelLogs] = useState<Refueled[]>();

  useEffect(() => {
    const truckingData = async () => {
      //Todo: make the api route and set data to state allowing for dynamic data and offline adding of logs
      const res = await fetch(`/api/getTruckingLogs/${timeSheetId}`);
      const data = await res.json();
      setStateMileage(data.stateMileage);
      setMaterial(data.material);
      setEquipmentHauled(data.equipmentHauled);
      setRefuelLogs(data.refuelLogs);
    };
    truckingData();
  });
  return (
    <Holds className="h-full">
      <Grids rows={"10"}>
        <Holds position={"row"} className="row-span-1 w-full gap-1">
          <NewTab
            titleImage="/Hauling-logs.svg"
            titleImageAlt="Truck"
            onClick={() => setActiveTab(1)}
            isActive={activeTab === 1}
          >
            <Titles size={"h4"}>{t("HaulingLogs")}</Titles>
          </NewTab>
          <NewTab
            titleImage="/comment.svg"
            titleImageAlt="Comment"
            onClick={() => setActiveTab(2)}
            isActive={activeTab === 2}
          >
            <Titles size={"h4"}>{t("MyComments")}</Titles>
          </NewTab>
          <NewTab
            titleImage="/state-mileage.svg"
            titleImageAlt="State Mileage"
            onClick={() => setActiveTab(3)}
            isActive={activeTab === 3}
          >
            <Titles size={"h4"}>{t("StateMileage")}</Titles>
          </NewTab>
          <NewTab
            titleImage="/refuel-Icon.svg"
            titleImageAlt="Refuel"
            onClick={() => setActiveTab(4)}
            isActive={activeTab === 4}
          >
            <Titles size={"h4"}>{t("RefuelLogs")}</Titles>
          </NewTab>
        </Holds>
        {activeTab === 1 && <HaulingLogs />}
        {activeTab !== 1 && (
          <Holds
            background={"white"}
            className="rounded-t-none row-span-9 h-full overflow-y-hidden no-scrollbar"
          >
            <Contents width={"section"} className="py-5">
              {activeTab === 2 && <></>}
              {activeTab === 3 && <></>}
              {activeTab === 4 && <></>}
            </Contents>
          </Holds>
        )}
      </Grids>
    </Holds>
  );
}
