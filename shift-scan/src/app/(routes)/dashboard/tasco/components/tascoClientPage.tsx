"use client";

import { Holds } from "@/components/(reusable)/holds";
import { useEffect, useState } from "react";
import Counter from "./counter";
import { Labels } from "@/components/(reusable)/labels";
import { NewTab } from "@/components/(reusable)/newTabs";
import { Titles } from "@/components/(reusable)/titles";
import { Grids } from "@/components/(reusable)/grids";
import { Contents } from "@/components/(reusable)/contents";
import { Refueled } from "@/lib/types";
import RefuelLayout from "./RefuelLayout";
import TascoComments from "./tascoComments";
import { addLoad, deleteLoad } from "@/actions/tascoActions";

export default function TascoEQClientPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [loadCount, setLoadCount] = useState(0);
  const [activeTab, setActiveTab] = useState(1);
  const [tascoLogId, setTascoLogId] = useState<string>();
  const [refuelLogs, setRefuelLogs] = useState<Refueled[]>();
  const [comment, setComment] = useState<string>("");

  useEffect(() => {
    const fetchTascoLog = async () => {
      try {
        const res = await fetch(`/api/getTascoLog/tascoId`);
        if (!res.ok) throw new Error("Failed to fetch Tasco Log");
        const data = await res.json();
        console.log("id: " + data);
        setTascoLogId(data);
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
          `/api/getTascoLog/comment/${tascoLogId}`,
          `/api/getTascoLog/loadCount/${tascoLogId}`,
          `/api/getTascoLog/refueledLogs/${tascoLogId}`,
        ];

        const responses = await Promise.all(endpoints.map((url) => fetch(url)));
        const data = await Promise.all(responses.map((res) => res.json()));
        console.log("Data:", data);
        setComment(data[0].comment || "");
        setLoadCount(data[1].loadCount || 0);
        setRefuelLogs(data[2]);
      } catch (error) {
        console.error("Error fetching Data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [tascoLogId]);

  const AddLoad = async () => {
    const formData = new FormData();
    formData.append("tascoLogId", tascoLogId ?? "");
    try {
      const temp = await addLoad(formData);
    } catch (error) {
      console.log("error adding Load", error);
    }
  };

  const ReduceLoad = async () => {
    try {
      const formData = new FormData();
      formData.append("tascoLogId", tascoLogId ?? "");
      const temp = await deleteLoad(formData);
    } catch (error) {
      console.log("error adding Load", error);
    }
  };

  return (
    // <Holds className="h-full overflow-y-hidden no-scrollbar">
    <Holds className="h-full">
      <Grids rows={"10"} className={isLoading ? "animate-pulse h-full w-full" : "h-full w-full"}>
        <Holds className="w-full items-center row-span-3" background={"white"}>
          <Labels>Load Counter</Labels>
          <Counter count={loadCount} setCount={setLoadCount} addAction={AddLoad} removeAction={ReduceLoad}/>
        </Holds>
        <Holds className="row-span-1 h-full gap-1 w-full" position={"row"}>
          <NewTab
            titleImage="/comment.svg"
            titleImageAlt="Comment"
            onClick={() => setActiveTab(1)}
            isActive={activeTab === 1}
            isComplete={comment.trim().length > 0}
          >
            <Titles size={"h4"}>Comments</Titles>
          </NewTab>
          <NewTab
            titleImage="/refuel.svg"
            titleImageAlt="refuel-Icon"
            onClick={() => setActiveTab(2)}
            isActive={activeTab === 2}
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
                  tascoLog={tascoLogId}
                  comments={comment}
                  setComments={setComment}
                />
              </Holds>
            )}
            {activeTab === 2 && (
              <RefuelLayout
                tascoLog={tascoLogId}
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
