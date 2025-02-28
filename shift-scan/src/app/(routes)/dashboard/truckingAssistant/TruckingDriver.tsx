"use client";
import React, { useEffect, useState } from "react";
import { Holds } from "@/components/(reusable)/holds";
import { Grids } from "@/components/(reusable)/grids";
import { Contents } from "@/components/(reusable)/contents";
import { useTranslations } from "next-intl";
import { NewTab } from "@/components/(reusable)/newTabs";
import { Titles } from "@/components/(reusable)/titles";
import HaulingLogs from "./components/HaulingLogs";
import TruckDriverNotes from "./components/TruckDriverNotes";
import StateLog from "./components/StateLog";

type StateMileage = {
  id: string;
  truckingLogId: string;
  state?: string;
  stateLineMileage?: number;
  createdAt?: Date;
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
  const [StateMileage, setStateMileage] = useState<StateMileage[]>();
  const [refuelLogs, setRefuelLogs] = useState<Refueled[]>();
  const [timeSheetId, setTimeSheetId] = useState<string>();
  const [endMileage, setEndMileage] = useState<number | null>(null);
  const [notes, setNotes] = useState<string>("");
  // Trucking Log - Fetch Once
  useEffect(() => {
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
  }, []); // Only run once on mount

  // State Mileage - Only when timeSheetId is available
  useEffect(() => {
    if (!timeSheetId) return; // Exit if timeSheetId is not set

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

    fetchStateMileage();
  }, [timeSheetId]); // Run only when timeSheetId changes

  // Refuel Logs - Only when timeSheetId is available
  useEffect(() => {
    if (!timeSheetId) return; // Exit if timeSheetId is not set

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

    fetchRefuelLogs();
  }, [timeSheetId]); // Run only when timeSheetId changes

  // Fetch Ending Mileage and Notes
  useEffect(() => {
    if (!timeSheetId) return;

    const fetchData = async () => {
      try {
        const [mileageRes, notesRes] = await Promise.all([
          fetch(`/api/getTruckingLogs/endingMileage/${timeSheetId}`),
          fetch(`/api/getTruckingLogs/notes/${timeSheetId}`),
        ]);

        if (!mileageRes.ok) throw new Error("Failed to fetch Mileage");
        if (!notesRes.ok) throw new Error("Failed to fetch Notes");

        const mileageData = await mileageRes.json();
        const notesData = await notesRes.json();

        setEndMileage(mileageData.endingMileage || null);
        setNotes(notesData.comment || "");
      } catch (error) {
        console.error("Error fetching Data:", error);
      }
    };

    fetchData();
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
        {activeTab === 1 && <HaulingLogs truckingLog={timeSheetId} />}
        {activeTab !== 1 && (
          <Holds
            background={"white"}
            className="rounded-t-none row-span-9 h-full overflow-y-hidden no-scrollbar"
          >
            <Contents width={"section"} className="py-5">
              {activeTab === 2 && (
                <TruckDriverNotes
                  truckingLog={timeSheetId}
                  notes={notes}
                  setNotes={setNotes}
                  endMileage={endMileage}
                  setEndMileage={setEndMileage}
                />
              )}
              {activeTab === 3 && (
                <StateLog
                  StateMileage={StateMileage}
                  setStateMileage={setStateMileage}
                  truckingLog={timeSheetId}
                />
              )}
              {activeTab === 4 && <></>}
            </Contents>
          </Holds>
        )}
      </Grids>
    </Holds>
  );
}
