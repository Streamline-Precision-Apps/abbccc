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
  createdAt: Date;
};

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

export default function TruckDriver() {
  const t = useTranslations("TruckingAssistant");
  const [activeTab, setActiveTab] = useState(1);
  const [StateMileage, setStateMileage] = useState<StateMileage>();
  const [material, setMaterial] = useState<Material[]>();
  const [equipmentHauled, setEquipmentHauled] = useState<EquipmentHauled[]>();
  const [refuelLogs, setRefuelLogs] = useState<Refueled[]>();
  const [timeSheetId, setTimeSheetId] = useState<string>();

  useEffect(() => {
    // Trucking Log
    const fetchTruckingLog = async () => {
      try {
        const res = await fetch(`/api/getTruckingLogs/truckingId`);
        if (!res.ok) throw new Error("Failed to fetch Trucking Log");
        const data = await res.json();
        setTimeSheetId(data);
      } catch (error) {
        console.error("Error fetching Trucking Log:", error);
      }
    };

    fetchTruckingLog();
  }, []);

  useEffect(() => {
    if (timeSheetId) {
      // State Mileage
      const fetchStateMileage = async () => {
        try {
          const res = await fetch(
            `/api/getTruckingLogs/stateMileage/${timeSheetId}`
          );
          if (!res.ok) throw new Error("Failed to fetch State Mileage");
          const data = await res.json();
          setStateMileage(data);
        } catch (error) {
          console.error("Error fetching State Mileage:", error);
        }
      };

      // Material
      const fetchMaterial = async () => {
        try {
          const res = await fetch(
            `/api/getTruckingLogs/material/${timeSheetId}`,
            {
              next: {
                tags: ["material"],
              },
            }
          );
          if (!res.ok) throw new Error("Failed to fetch Material");
          const data = await res.json();
          setMaterial(data);
        } catch (error) {
          console.error("Error fetching Material:", error);
        }
      };

      // Equipment Hauled
      const fetchEquipmentHauled = async () => {
        try {
          const res = await fetch(
            `/api/getTruckingLogs/equipmentHauled/${timeSheetId}`
          );
          if (!res.ok) throw new Error("Failed to fetch Equipment Hauled");
          const data = await res.json();
          setEquipmentHauled(data);
        } catch (error) {
          console.error("Error fetching Equipment Hauled:", error);
        }
      };

      // Refuel Logs
      const fetchRefuelLogs = async () => {
        try {
          const res = await fetch(
            `/api/getTruckingLogs/refueledLogs/${timeSheetId}`
          );
          if (!res.ok) throw new Error("Failed to fetch Refuel Logs");
          const data = await res.json();
          setRefuelLogs(data);
        } catch (error) {
          console.error("Error fetching Refuel Logs:", error);
        }
      };

      fetchStateMileage();
      fetchMaterial();
      fetchEquipmentHauled();
      fetchRefuelLogs();
    }
  }, [timeSheetId]);

  return (
    <Holds className="h-full w-full ">
      <Grids rows={"10"} className="h-full w-full">
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
        {activeTab === 1 && (
          <HaulingLogs
            equipmentHauled={equipmentHauled}
            setEquipmentHauled={setEquipmentHauled}
            material={material}
            setMaterial={setMaterial}
            truckingLog={timeSheetId}
          />
        )}
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
