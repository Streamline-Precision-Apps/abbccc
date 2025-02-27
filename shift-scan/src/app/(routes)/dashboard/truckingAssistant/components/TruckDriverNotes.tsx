import { Holds } from "@/components/(reusable)/holds";
import { Grids } from "@/components/(reusable)/grids";
import { EndingMileage } from "./EndingMileage";
import { TextAreas } from "@/components/(reusable)/textareas";
import { Texts } from "@/components/(reusable)/texts";
import { useEffect, useRef } from "react";
import { updateTruckDrivingNotes } from "@/actions/truckingActions";

export default function TruckDriverNotes({
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
  const isInitialRender = useRef(true);
  // Debounce Notes
  useEffect(() => {
    if (isInitialRender.current) {
      isInitialRender.current = false;
      return;
    }
    const timeoutId = setTimeout(() => {
      const formData = new FormData();
      formData.append("comment", notes ?? "");
      formData.append("id", truckingLog ?? "");
      updateTruckDrivingNotes(formData);
    }, 700);

    return () => clearTimeout(timeoutId);
  }, [notes, truckingLog]);

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
          <TextAreas
            name="notes"
            maxLength={40}
            value={notes}
            placeholder="Write your Notes here..."
            className="h-full w-full text-base focus:outline-none focus:ring-transparent focus:border-current "
            onChange={(e) => setNotes(e.target.value)}
          />
          <Texts
            size={"p2"}
            className={`absolute bottom-5 right-2 ${
              notes.length >= 40 ? " text-red-500" : ""
            }`}
          >
            {notes.length}/40
          </Texts>
        </Holds>
      </Grids>
    </Holds>
  );
}
