"use client";

import { Grids } from "@/components/(reusable)/grids";
import { Holds } from "@/components/(reusable)/holds";
import Counter from "./counter";
import DidYouRefuel from "./didYouRefuel";
import Loads from "./loads";
import { useEffect, useState } from "react";
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
    <Holds className="w-full h-full overflow-y-hidden no-scrollbar">
      <DidYouRefuel />
      <Loads />
    </Holds>
  );
}
