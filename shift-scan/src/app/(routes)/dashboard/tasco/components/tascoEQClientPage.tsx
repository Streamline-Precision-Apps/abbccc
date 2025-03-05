"use client";

import { Holds } from "@/components/(reusable)/holds";
import { useEffect, useState } from "react";
import Counter from "./counter";
import DidYouRefuel from "./didYouRefuel";
import Loads from "./loads";
import Notes from "./notes";
import { Labels } from "@/components/(reusable)/labels";
import { NewTab } from "@/components/(reusable)/newTabs";
import { Titles } from "@/components/(reusable)/titles";
import { Grids } from "@/components/(reusable)/grids";
import { Contents } from "@/components/(reusable)/contents";
type Loads = {
  id: string;
  tascoLogId: string;
  loadType: string;
  loadWeight: number;
};

type Refueled = {
  id: string;
  tascoLogId: string;
  gallonsRefueled: number;
  milesAtfueling: number;
};

type TascoLog = {
  id: string;
  shiftType: string;
  equipmentId: string;
  laborType: string;
  materialType: string;
  loadsHauled: number;
  loads: Loads[];
  refueled: Refueled[];
  comment: string;
  completed: boolean;
};
export default function TascoClientPage() {
  const [tascoData, setTascoData] = useState<TascoLog[]>([]);
  const [loadCount, setLoadCount] = useState(0);
  const [activeTab, setActiveTab] = useState(1);

  useEffect(() => {
    const fetchTimesheet = async () => {
      // get recent timecard then fetch and call api: /api/getRecentTimecard
      const tascoLog = await fetch(`/api/getRecentTascoLog`);
      const logData = await tascoLog.json();
      setTascoData(logData);
    };
    fetchTimesheet();
  });
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
            {activeTab === 1 && <Notes/>}
            {activeTab === 2 && <DidYouRefuel/>}
          </Contents>
        </Holds>
      </Grids>
    </Holds>
  );
}
