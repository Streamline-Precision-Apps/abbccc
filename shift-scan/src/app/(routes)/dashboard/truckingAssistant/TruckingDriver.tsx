"use client";
import React, { useEffect, useState } from "react";
import { Holds } from "@/components/(reusable)/holds";
import { Grids } from "@/components/(reusable)/grids";
import { useTranslations } from "next-intl";
import HaulingLogs from "./components/HaulingLogs";
import StateLog from "./components/StateLog";
import RefuelLayout from "./components/RefuelLayout";
import WorkDetails from "./components/workDetails";
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
  Equipment: {
    id: string;
    name: string;
  } | null;
  JobSite: {
    id: string;
    name: string;
  } | null;
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
  const [startingMileage, setStartingMileage] = useState<number | null>(null);

  const [isComplete, setIsComplete] = useState({
    haulingLogsTab: true,
    notesTab: true,
    stateMileageTab: true,
    refuelLogsTab: true,
  });

  // Helper function to calculate the minimum required ending mileage
  const getMinimumEndMileage = (): number | null => {
    if (!startingMileage) return null;

    let maxMileage = startingMileage;

    // Check state mileage logs
    if (StateMileage && StateMileage.length > 0) {
      StateMileage.forEach((log) => {
        if (log.stateLineMileage && log.stateLineMileage > maxMileage) {
          maxMileage = log.stateLineMileage;
        }
      });
    }

    // Check refuel logs
    if (refuelLogs && refuelLogs.length > 0) {
      refuelLogs.forEach((log) => {
        if (log.milesAtFueling && log.milesAtFueling > maxMileage) {
          maxMileage = log.milesAtFueling;
        }
      });
    }

    return maxMileage;
  };

  // Enhanced validation for end mileage
  const isEndMileageValid = (): boolean => {
    if (endMileage === null) return false;
    const minRequired = getMinimumEndMileage();
    if (minRequired === null) return true;
    return endMileage >= minRequired;
  };

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
              // TODO: These fields don't exist in current database schema - temporarily commented out
              // item.grossWeight &&
              item.name &&
              item.materialWeight
              // && item.lightWeight
          )
      ),
      notesTab: isEndMileageValid(),
      stateMileageTab: Boolean(
        StateMileage &&
          StateMileage.length >= 0 &&
          StateMileage.every(
            (item) =>
              item.state &&
              item.stateLineMileage !== null &&
              item.stateLineMileage !== undefined &&
              startingMileage !== null &&
              item.stateLineMileage >= startingMileage
          )
      ),
      refuelLogsTab: Boolean(
        refuelLogs &&
          refuelLogs.length >= 0 &&
          refuelLogs.every(
            (item) =>
              item.gallonsRefueled &&
              item.milesAtFueling !== null &&
              item.milesAtFueling !== undefined &&
              startingMileage !== null &&
              item.milesAtFueling >= startingMileage
          )
      ),
    });
    console.log("Hauling Logs", isComplete.haulingLogsTab);
  };

  useEffect(() => {
    validateCompletion();
  }, [equipmentHauled, material, endMileage, notes, StateMileage, refuelLogs, startingMileage]);

  useEffect(() => {
    const fetchTruckingLog = async () => {
      try {
        console.log("Fetching trucking log ID..."); // Debug log
        const res = await fetch(`/api/getTruckingLogs/truckingId`);
        if (!res.ok) throw new Error(t("FailedToFetchTruckingLogs"));
        const data = await res.json();
        console.log("Received trucking log ID:", data); // Debug log
        setTimeSheetId(data);
      } catch (error) {
        console.error(t("ErrorFetchingTruckingLogs"), error);
      }
    };

    fetchTruckingLog();
  }, []);

  useEffect(() => {
    if (!timeSheetId) return;

    // Clear all previous state before fetching new data
    setEndMileage(null);
    setNotes("");
    setRefuelLogs([]);
    setStateMileage([]);
    setMaterial([]);
    setEquipmentHauled([]);
    setLaborType([]);
    setStartingMileage(null);

    const fetchData = async () => {
      setIsLoading(true);
      try {
        console.log("Fetching data for timeSheetId:", timeSheetId); // Debug log

        const endpoints = [
          `/api/getTruckingLogs/endingMileage/${timeSheetId}`,         // 0
          `/api/getTruckingLogs/notes/${timeSheetId}`,                 // 1
          `/api/getTruckingLogs/refueledLogs/${timeSheetId}`,          // 2
          `/api/getTruckingLogs/stateMileage/${timeSheetId}`,          // 3
          `/api/getTruckingLogs/material/${timeSheetId}`,              // 4
          `/api/getTruckingLogs/equipmentHauled/${timeSheetId}`,       // 5
          `/api/getTruckingLogs/laborType/${timeSheetId}`,             // 6
          `/api/getTruckingLogs/startingMileage/${timeSheetId}`,       // 7
        ];

        const responses = await Promise.all(endpoints.map((url) => fetch(url)));
        const data = await Promise.all(responses.map((res) => res.json()));

        console.log("Fetched data:", data); // Debug log

        // Map data in the same order as endpoints
        setEndMileage(data[0]?.endingMileage || null);
        setNotes(data[1] || "");
        setRefuelLogs(data[2] || []);
        setStateMileage(data[3] || []);
        setMaterial(data[4] || []);
        setEquipmentHauled(data[5] || []);
        setLaborType(data[6] || []);
        setStartingMileage(data[7]?.startingMileage || null);
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
          isComplete={isComplete}
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
            startingMileage={startingMileage}
            stateMileage={StateMileage}
            refuelLogs={refuelLogs}
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
            startingMileage={startingMileage}
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
            startingMileage={startingMileage}
          />
        )}
      </Holds>
    </Grids>
  );
}
