"use client";
import React, { useEffect, useState } from "react";
import { Holds } from "@/components/(reusable)/holds";
import { Grids } from "@/components/(reusable)/grids";
import { Contents } from "@/components/(reusable)/contents";
import { useTranslations } from "next-intl";
import { NewTab } from "@/components/(reusable)/newTabs";
import { Titles } from "@/components/(reusable)/titles";
import HaulingLogs from "./components/HaulingLogs";
import StateLog from "./components/StateLog";
import RefuelLayout from "./components/RefuelLayout";
import { EndingMileage } from "./components/EndingMileage";
import TruckDriverNotes from "./components/TruckDriverNotes";

type StateMileage = {
  id: string;
  truckingLogId: string;
  state?: string;
  stateLineMileage?: number;
  createdAt?: Date;
};

type Refueled = {
  id: string;
  employeeEquipmentLogId: string | null;
  truckingLogId: string | null;
  gallonsRefueled: number | null;
  milesAtFueling: number | null;
  tascoLogId: string | null;
};

type EquipmentHauled = {
  id: string;
  truckingLogId: string;
  equipmentId: string | null;
  createdAt: Date;
  jobSiteId: string | null;
  equipment: {
    name: string | null;
  };
  jobSite: {
    name: string | null;
  };
};

type Material = {
  name: string;
  id: string;
  LocationOfMaterial: string | null;
  truckingLogId: string;
  quantity: number | null;
  createdAt: Date;
};

export default function TruckDriver() {
  const t = useTranslations("TruckingAssistant");
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState(1);
  const [StateMileage, setStateMileage] = useState<StateMileage[]>();
  const [refuelLogs, setRefuelLogs] = useState<Refueled[]>();
  const [timeSheetId, setTimeSheetId] = useState<string>();
  const [endMileage, setEndMileage] = useState<number | null>(null);
  const [notes, setNotes] = useState<string>("");
  const [equipmentHauled, setEquipmentHauled] = useState<EquipmentHauled[]>();
  const [material, setMaterial] = useState<Material[]>();

  const [isComplete, setIsComplete] = useState({
    haulingLogsTab: true,
    notesTab: true,
    stateMileageTab: true,
    refuelLogsTab: true,
  });

  const validateCompletion = () => {
    setIsComplete({
      haulingLogsTab: Boolean(
        equipmentHauled &&
          equipmentHauled.length >= 0 &&
          equipmentHauled.every((item) => item.equipmentId && item.jobSiteId) &&
          material &&
          material.length >= 0 &&
          material.every(
            (item) => item.LocationOfMaterial && item.quantity && item.name
          )
      ),
      notesTab: endMileage !== null,
      stateMileageTab: Boolean(
        StateMileage &&
          StateMileage.length >= 0 &&
          StateMileage.every((item) => item.state && item.stateLineMileage)
      ),
      refuelLogsTab: Boolean(
        refuelLogs &&
          refuelLogs.length >= 0 &&
          refuelLogs.every(
            (item) => item.gallonsRefueled && item.milesAtFueling
          )
      ),
    });
  };

  useEffect(() => {
    validateCompletion();
  }, [equipmentHauled, material, endMileage, notes, StateMileage, refuelLogs]);

  useEffect(() => {
    const fetchTruckingLog = async () => {
      try {
        const res = await fetch(`/api/getTruckingLogs/truckingId`);
        if (!res.ok) throw new Error(t("FailedToFetchTruckingLogs"));
        const data = await res.json();
        setTimeSheetId(data);
      } catch (error) {
        console.error(t("ErrorFetchingTruckingLogs"), error);
      }
    };

    fetchTruckingLog();
  }, []);

  useEffect(() => {
    if (!timeSheetId) return;

    const fetchData = async () => {
      setIsLoading(true);
      try {
        const endpoints = [
          `/api/getTruckingLogs/endingMileage/${timeSheetId}`,
          `/api/getTruckingLogs/notes/${timeSheetId}`,
          `/api/getTruckingLogs/refueledLogs/${timeSheetId}`,
          `/api/getTruckingLogs/stateMileage/${timeSheetId}`,
          `/api/getTruckingLogs/material/${timeSheetId}`,
          `/api/getTruckingLogs/equipmentHauled/${timeSheetId}`,
        ];

        const responses = await Promise.all(endpoints.map((url) => fetch(url)));
        const data = await Promise.all(responses.map((res) => res.json()));

        setEndMileage(data[0].endingMileage || null);

        setNotes(data[1].comment || "");
        setRefuelLogs(data[2]);
        setStateMileage(data[3]);
        setMaterial(data[4]);
        setEquipmentHauled(data[5]);
      } catch (error) {
        console.error(t("FetchingError"), error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [timeSheetId]);

  return (
    <Holds className="h-full w-full ">
      <Grids
        rows={"10"}
        className={isLoading ? "animate-pulse h-full w-full" : "h-full w-full"}
      >
        <Holds position={"row"} className="row-span-1 w-full gap-1">
          <NewTab
            titleImage="/hauling.svg"
            titleImageAlt="Truck"
            onClick={() => setActiveTab(1)}
            isActive={activeTab === 1}
            isComplete={isComplete.haulingLogsTab}
            isLoading={isLoading}
          >
            <Titles size={"h4"}>{t("HaulingLogs")}</Titles>
          </NewTab>
          <NewTab
            titleImage="/comment.svg"
            titleImageAlt="Comment"
            onClick={() => setActiveTab(2)}
            isActive={activeTab === 2}
            isComplete={isComplete.notesTab}
            isLoading={isLoading}
          >
            <Titles size={"h4"}>{t("MyComments")}</Titles>
          </NewTab>
          <NewTab
            titleImage="/state.svg"
            titleImageAlt="State Mileage"
            onClick={() => setActiveTab(3)}
            isActive={activeTab === 3}
            isComplete={isComplete.stateMileageTab}
            isLoading={isLoading}
          >
            <Titles size={"h4"}>{t("StateMileage")}</Titles>
          </NewTab>
          <NewTab
            titleImage="/refuel.svg"
            titleImageAlt="Refuel"
            onClick={() => setActiveTab(4)}
            isActive={activeTab === 4}
            isComplete={isComplete.refuelLogsTab}
            isLoading={isLoading}
          >
            <Titles size={"h4"}>{t("RefuelLogs")}</Titles>
          </NewTab>
        </Holds>
        {activeTab === 1 && (
          <HaulingLogs
            truckingLog={timeSheetId}
            material={material}
            equipmentHauled={equipmentHauled}
            setEquipmentHauled={setEquipmentHauled}
            setMaterial={setMaterial}
            isLoading={isLoading}
          />
        )}
        {activeTab !== 1 && (
          <Holds
            background={"white"}
            className={
              "rounded-t-none row-span-9 h-full overflow-y-hidden no-scrollbar"
            }
          >
            <Contents width={"section"} className="py-5">
              {activeTab === 2 && (
                <Holds className="h-full w-full">
                  <Grids rows={"8"} gap={"5"} className="h-full">
                    <Holds className="h-full w-full row-start-1 row-end-2 ">
                      <EndingMileage
                        truckingLog={timeSheetId}
                        endMileage={endMileage ?? null}
                        setEndMileage={setEndMileage}
                      />
                    </Holds>
                    <Holds className="h-full w-full row-start-2 row-end-9 relative">
                      <TruckDriverNotes
                        truckingLog={timeSheetId}
                        notes={notes}
                        setNotes={setNotes}
                      />
                    </Holds>
                  </Grids>
                </Holds>
              )}
              {activeTab === 3 && (
                <StateLog
                  StateMileage={StateMileage}
                  setStateMileage={setStateMileage}
                  truckingLog={timeSheetId}
                />
              )}
              {activeTab === 4 && (
                <RefuelLayout
                  truckingLog={timeSheetId}
                  refuelLogs={refuelLogs}
                  setRefuelLogs={setRefuelLogs}
                />
              )}
            </Contents>
          </Holds>
        )}
      </Grids>
    </Holds>
  );
}
