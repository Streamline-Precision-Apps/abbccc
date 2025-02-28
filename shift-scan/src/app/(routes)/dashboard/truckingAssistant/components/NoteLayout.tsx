import { Holds } from "@/components/(reusable)/holds";
import { Grids } from "@/components/(reusable)/grids";
import { EndingMileage } from "./EndingMileage";
import { TextAreas } from "@/components/(reusable)/textareas";
import { Texts } from "@/components/(reusable)/texts";
import { SetStateAction, useEffect, useRef } from "react";
import { updateTruckDrivingNotes } from "@/actions/truckingActions";
import TruckDriverNotes from "./TruckDriverNotes";

export default function NoteLayout({
  truckingLog,
  notes,
  setNotes,
  endMileage,
  setEndMileage,
}: {
  truckingLog: string | undefined;
  notes: string;
  setNotes: React.Dispatch<React.SetStateAction<string>>;
  endMileage: number | null;
  setEndMileage: React.Dispatch<React.SetStateAction<number | null>>;
}) {
  return (
    <Holds className="h-full w-full">
      <Grids rows={"8"} gap={"5"} className="h-full">
        <Holds className="h-full w-full row-start-1 row-end-2 ">
          <EndingMileage
            truckingLog={truckingLog}
            endMileage={endMileage ?? null}
            setEndMileage={setEndMileage}
          />
        </Holds>
        <Holds className="h-full w-full row-start-2 row-end-9 relative">
          <TruckDriverNotes
            truckingLog={truckingLog}
            notes={notes}
            setNotes={setNotes}
          />
        </Holds>
      </Grids>
    </Holds>
  );
}
