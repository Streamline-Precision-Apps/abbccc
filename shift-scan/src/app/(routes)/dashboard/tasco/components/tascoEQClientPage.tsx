"use client";

import { Holds } from "@/components/(reusable)/holds";
import { useEffect, useState } from "react";
import Counter from "./counter";
import DidYouRefuel from "./didYouRefuel";
import { Labels } from "@/components/(reusable)/labels";
import { NewTab } from "@/components/(reusable)/newTabs";
import { Titles } from "@/components/(reusable)/titles";
import { Grids } from "@/components/(reusable)/grids";
import { Contents } from "@/components/(reusable)/contents";
import { TascoLog, Refueled, Loads as LoadsType } from "@/lib/types";
import TextInputWithRevert from "@/components/(reusable)/textInputWithRevert";
import RefuelLayout from "./RefuelLayout";
import { set } from "date-fns";

export default function TascoClientPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [loadCount, setLoadCount] = useState(0);
  const [activeTab, setActiveTab] = useState(1);
  const [timeSheetId, setTimeSheetId] = useState<string>();
  const [refuelLogs, setRefuelLogs] = useState<Refueled[]>();
  const [comment, setComment] = useState<string>("");

  useEffect(() => {
    const fetchTascoLog = async () => {
      try {
        const res = await fetch(`/api/getTascoLogs/tascoId`);
        if (!res.ok) throw new Error("Failed to fetch Tasco Log");
        const data = await res.json();
        console.log("id: " + data)
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
        ];

        const responses = await Promise.all(endpoints.map((url) => fetch(url)));
        const data = await Promise.all(responses.map((res) => res.json()));
        console.log("Data:", data);
        setComment(data[0].comment || "");
        setRefuelLogs(data[1]);
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
      <Grids rows={"10"} className="h-full w-full">
        <Holds className="w-full items-center row-span-3" background={"white"}>
          <Labels>Load Counter</Labels>
          <Counter count={loadCount} setCount={setLoadCount} />
        </Holds>
        <Holds className="row-span-1 h-full gap-1 w-full" position={"row"}>
          <NewTab
            titleImage="/comment.svg"
            titleImageAlt="Comment"
            onClick={() => setActiveTab(1)}
            isActive={activeTab === 1}
          >
            <Titles size={"h4"}>Comments</Titles>
          </NewTab>
          <NewTab
            titleImage="/refuel-Icon.svg"
            titleImageAlt="refuel-Icon"
            onClick={() => setActiveTab(2)}
            isActive={activeTab === 2}
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
              <Grids rows={"1"} className="h-full">
                <Holds
                  className="row-span-1 h-full gap-1 w-full"
                  position={"row"}
                >
                  
                </Holds>
              </Grids>
            )}
            {activeTab === 2 && (
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
