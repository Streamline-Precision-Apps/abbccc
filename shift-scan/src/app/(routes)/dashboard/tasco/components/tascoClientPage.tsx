"use client";

import { Holds } from "@/components/(reusable)/holds";
import { useEffect, useState } from "react";
import { NewTab } from "@/components/(reusable)/newTabs";
import { Titles } from "@/components/(reusable)/titles";
import { Grids } from "@/components/(reusable)/grids";
import { Contents } from "@/components/(reusable)/contents";
import { Refueled, Loads as LoadsType } from "@/lib/types";
import RefuelLayout from "./RefuelLayout";
import TascoComments from "./tascoComments";
import LoadsLayout from "./loads";

export default function TascoClientPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [loads, setLoads] = useState<LoadsType[] | undefined>([] as LoadsType[]);
  const [loadCount, setLoadCount] = useState(0);
  const [activeTab, setActiveTab] = useState(1);
  const [timeSheetId, setTimeSheetId] = useState<string>();
  const [refuelLogs, setRefuelLogs] = useState<Refueled[]>();
  const [comment, setComment] = useState<string>("");

  useEffect(() => {
    const fetchTascoLog = async () => {
      try {
        const res = await fetch(`/api/getTascoLog/tascoId`);
        if (!res.ok) throw new Error("Failed to fetch Tasco Log");
        const data = await res.json();
        console.log("id: " + data);
        setTimeSheetId(data);
      } catch (error) {
        console.error("Error fetching Tasco Log:", error);
      }
    };

    fetchTascoLog();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const endpoints = [
          `/api/getTascoLog/comment/${timeSheetId}`,
          `/api/getTascoLog/refueledLogs/${timeSheetId}`,
          `/api/getTascoLog/loads/${timeSheetId}`,
        ];

        const responses = await Promise.all(endpoints.map((url) => fetch(url)));
        const data = await Promise.all(responses.map((res) => res.json()));
        console.log("Data:", data);
        setComment(data[0].comment || "");
        setRefuelLogs(data[1]);
        setLoads(data[2]);
        setLoadCount(data[2].length);
      } catch (error) {
        console.error("Error fetching Data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [timeSheetId]);


  return (
    // <Holds className="h-full overflow-y-hidden no-scrollbar">
    <Holds className="h-full">
      <Grids
        rows={"10"}
        className={isLoading ? "animate-pulse h-full w-full" : "h-full w-full"}
      >
        <Holds className="row-span-1 h-full gap-1 w-full" position={"row"}>
          <NewTab
            titleImage="/comment.svg"
            titleImageAlt="Comment"
            onClick={() => setActiveTab(1)}
            isActive={activeTab === 1}
            isComplete={true}
          >
            <Titles size={"h4"}>Comments</Titles>
          </NewTab>
          <NewTab
            titleImage="/Hauling-logs.svg"
            titleImageAlt="Load Counter"
            onClick={() => setActiveTab(2)}
            isActive={activeTab === 2}
            isComplete={loads === undefined || loads.length === 0 || loads.every(log => log.loadWeight > 0 && log.loadType.trim().length > 0)}
          >
            <Titles size={"h4"}>Load Counter</Titles>
          </NewTab>
          <NewTab
            titleImage="/refuel-Icon.svg"
            titleImageAlt="refuel-Icon"
            onClick={() => setActiveTab(3)}
            isActive={activeTab === 3}
            isComplete={refuelLogs === undefined || refuelLogs.length === 0 || refuelLogs.every(log => log.gallonsRefueled > 0)}
          >
            <Titles size={"h4"}>Refuel Logs</Titles>
          </NewTab>
        </Holds>
        <Holds
          background={"white"}
          className="rounded-t-none row-span-9 h-full overflow-y-hidden no-scrollbar"
        >
          <Contents width={"section"} className="py-5">
            {activeTab === 1 && (
              <Holds className="h-full w-full relative pt-2">
                <TascoComments
                  tascoLog={timeSheetId}
                  comments={comment}
                  setComments={setComment}
                />
              </Holds>
            )}
            {activeTab === 2 && (
              <Holds className="h-full w-full relative pt-2">
                <LoadsLayout
                  tascoLog={timeSheetId}
                  loads={loads}
                  setLoads={setLoads}
                  loadCount={loadCount}
                  setLoadCount={setLoadCount}
                />
              </Holds>
            )}
            {activeTab === 3 && (
              <RefuelLayout
                tascoLog={timeSheetId}
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
