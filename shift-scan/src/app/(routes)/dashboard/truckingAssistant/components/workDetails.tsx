import { Buttons } from "@/components/(reusable)/buttons";
import { Grids } from "@/components/(reusable)/grids";
import { Holds } from "@/components/(reusable)/holds";
import Sliders from "@/components/(reusable)/sliders";

import { EndingMileage } from "./EndingMileage";
// import TruckDriverNotes from "./TruckDriverNotes";
import { Contents } from "@/components/(reusable)/contents";
import { useState } from "react";
import TruckDriverNotes from "./TruckDriverNotes";
import { useTranslations } from "next-intl";

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

type LaborType = {
  id: string;
  type: string | null;
  startTime: string;
  endTime: string | null;
};

export default function WorkDetails({
  notes,
  setNotes,
  endMileage,
  setEndMileage,
  isLoading,
  timeSheetId,
  laborType,
  setLaborType,
  startingMileage,
  stateMileage,
  refuelLogs,
}: {
  notes: string;
  setNotes: React.Dispatch<React.SetStateAction<string>>;
  endMileage: number | null;
  setEndMileage: React.Dispatch<React.SetStateAction<number | null>>;
  isLoading: boolean;
  timeSheetId: string | undefined;
  laborType: LaborType[] | undefined;
  setLaborType: React.Dispatch<React.SetStateAction<LaborType[]>>;
  startingMileage: number | null;
  stateMileage?: StateMileage[];
  refuelLogs?: Refueled[];
}) {
  const t = useTranslations("TruckingAssistant");

  // Add state for activeTab (default to 1)
  const [activeTab, setActiveTab] = useState(1);

  return (
    <Holds background={"white"} className={"w-full h-full rounded-t-none"}>
      <Contents width={"section"} className="h-full">
        <Grids rows={"8"} gap={"5"} className="h-full py-3">
          <Holds className="w-full h-full row-start-1 row-end-2">
            <EndingMileage
              truckingLog={timeSheetId}
              endMileage={endMileage ?? null}
              setEndMileage={setEndMileage}
              startingMileage={startingMileage}
              stateMileage={stateMileage}
              refuelLogs={refuelLogs}
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
      </Contents>
    </Holds>
  );
}
