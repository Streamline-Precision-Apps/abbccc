"use client";
import React, { useEffect, useState } from "react";
import { Holds } from "@/components/(reusable)/holds";
import { Grids } from "@/components/(reusable)/grids";
import { Contents } from "@/components/(reusable)/contents";
import { useTranslations } from "next-intl";
import { NewTab } from "@/components/(reusable)/newTabs";
import { Titles } from "@/components/(reusable)/titles";
import RefuelLayout from "./components/RefuelLayout";
import OperatorHaulingLogs from "./components/OperatorHaulingLogs";
import TruckDriverNotes from "./components/TruckDriverNotes";

type Refueled = {
  id: string;
  employeeEquipmentLogId: string | null;
  truckingLogId: string | null;
  gallonsRefueled: number | null;
  milesAtFueling: number | null;
  tascoLogId: string | null;
};

type Material = {
  name: string;
  id: string;
  LocationOfMaterial: string | null;
  truckingLogId: string;
  quantity: number | null;
  createdAt: Date;
};

export default function TruckOperator() {
  const t = useTranslations("TruckingAssistant");
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState(1);
  const [refuelLogs, setRefuelLogs] = useState<Refueled[]>();
  const [notes, setNotes] = useState<string>("");
  const [material, setMaterial] = useState<Material[]>();
  const [timeSheetId, setTimeSheetId] = useState<string>();

  const [isComplete, setIsComplete] = useState({
    haulingLogsTab: true,
    refuelLogsTab: true,
  });

  const validateCompletion = () => {
    setIsComplete({
      haulingLogsTab: Boolean(
        material &&
          material.length >= 0 &&
          material.every(
            (item) => item.LocationOfMaterial && item.quantity && item.name
          )
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
  }, [material, refuelLogs]);

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
          `/api/getTruckingLogs/notes/${timeSheetId}`,
          `/api/getTruckingLogs/refueledLogs/${timeSheetId}`,
          `/api/getTruckingLogs/material/${timeSheetId}`,
        ];

        const responses = await Promise.all(endpoints.map((url) => fetch(url)));
        const data = await Promise.all(responses.map((res) => res.json()));

        setNotes(data[0].comment || "");
        setRefuelLogs(data[1]);
        setMaterial(data[2]);
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
            titleImage="/Hauling-logs.svg"
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
            isComplete={true}
            isLoading={isLoading}
          >
            <Titles size={"h4"}>{t("MyComments")}</Titles>
          </NewTab>
          <NewTab
            titleImage="/refuel-Icon.svg"
            titleImageAlt="Refuel"
            onClick={() => setActiveTab(3)}
            isActive={activeTab === 3}
            isComplete={isComplete.refuelLogsTab}
            isLoading={isLoading}
          >
            <Titles size={"h4"}>{t("RefuelLogs")}</Titles>
          </NewTab>
        </Holds>

        <Holds
          background={"white"}
          className={
            "rounded-t-none row-span-9 h-full overflow-y-hidden no-scrollbar"
          }
        >
          <Contents width={"section"} className="py-2">
            {activeTab === 1 && (
              <OperatorHaulingLogs
                material={material}
                setMaterial={setMaterial}
                isLoading={isLoading}
                truckingLog={timeSheetId}
              />
            )}
            {activeTab === 2 && (
              <Holds className="h-full w-full relative pt-2">
                <TruckDriverNotes
                  truckingLog={timeSheetId}
                  notes={notes}
                  setNotes={setNotes}
                />
              </Holds>
            )}
            {activeTab === 3 && (
              <RefuelLayout
                truckingLog={timeSheetId}
                refuelLogs={refuelLogs}
                setRefuelLogs={setRefuelLogs}
              />
            )}
          </Contents>
        </Holds>
      </Grids>
    </Holds>
  );
}
