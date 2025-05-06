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
import Sliders from "@/components/(reusable)/sliders";
import { Buttons } from "@/components/(reusable)/buttons";
import WorkDetails from "./components/workDetails";
import { setLaborType } from "@/actions/cookieActions";
import TruckTabOptions from "./TruckTabOptions";

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
  id: string;
  truckingLogId: string;
  LocationOfMaterial: string | null;
  name: string;
  quantity: number | null;
  materialWeight: number | null;
  lightWeight: number | null;
  grossWeight: number | null;
  loadType: LoadType | null;
  createdAt: Date;
};

enum LoadType {
  UNSCREENED,
  SCREENED,
}

type LaborType = {
  id: string;
  type: string | null;
  startTime: string;
  endTime: string | null;
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
  const [laborType, setLaborType] = useState<LaborType[]>([]);

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
            (item) =>
              item.LocationOfMaterial &&
              item.grossWeight &&
              item.name &&
              item.materialWeight &&
              item.lightWeight
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
          `/api/getTruckingLogs/laborType/${timeSheetId}`,
        ];

        const responses = await Promise.all(endpoints.map((url) => fetch(url)));
        const data = await Promise.all(responses.map((res) => res.json()));

        setEndMileage(data[0].endingMileage || null);

        setNotes(data[1].comment || "");
        setRefuelLogs(data[2]);
        setStateMileage(data[3]);
        setMaterial(data[4]);
        setEquipmentHauled(data[5]);
        setLaborType(data[6]);
      } catch (error) {
        console.error(t("FetchingError"), error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [timeSheetId]);

  return (
    <Grids rows={"10"} className="h-full w-full">
      <Holds className={"w-full h-full rounded-t-none row-start-1 row-end-2 "}>
        <TruckTabOptions
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          isLoading={isLoading}
          isComplete={{
            haulingLogsTab: isComplete.haulingLogsTab,
            notesTab: isComplete.notesTab,
            stateMileageTab: isComplete.stateMileageTab,
            refuelLogsTab: isComplete.refuelLogsTab,
          }}
        />
      </Holds>
      <Holds className={"w-full h-full rounded-t-none row-start-2 row-end-11"}>
        {activeTab === 1 && (
          <HaulingLogs
            isComplete={isComplete}
            isLoading={isLoading}
            truckingLog={timeSheetId}
            material={material}
            equipmentHauled={equipmentHauled}
            setEquipmentHauled={setEquipmentHauled}
            setMaterial={setMaterial}
          />
        )}
        {activeTab === 2 && (
          <WorkDetails
            isLoading={isLoading}
            timeSheetId={timeSheetId}
            notes={notes}
            setNotes={setNotes}
            endMileage={endMileage}
            setEndMileage={setEndMileage}
            laborType={laborType}
            setLaborType={setLaborType}
          />
        )}

        {activeTab === 3 && (
          <StateLog
            isLoading={isLoading}
            isComplete={isComplete}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            StateMileage={StateMileage}
            setStateMileage={setStateMileage}
            truckingLog={timeSheetId}
          />
        )}
        {activeTab === 4 && (
          <RefuelLayout
            isLoading={isLoading}
            isComplete={isComplete}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            truckingLog={timeSheetId}
            refuelLogs={refuelLogs}
            setRefuelLogs={setRefuelLogs}
          />
        )}
      </Holds>
    </Grids>
  );
}
