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

export default function WorkDetails({
  notes,
  setNotes,
  endMileage,
  setEndMileage,
  isLoading,
  timeSheetId,
}: {
  notes: string;
  setNotes: React.Dispatch<React.SetStateAction<string>>;
  endMileage: number | null;
  setEndMileage: React.Dispatch<React.SetStateAction<number | null>>;
  isLoading: boolean;
  timeSheetId: string | undefined;
}) {
  const t = useTranslations("TruckingAssistant");

  return (
    <Holds
      background={"white"}
      className={"w-full h-full rounded-t-none"}
    >
      <Contents width={"section"} className="h-full">
        <Grids rows={"8"} gap={"5"} className="h-full">
          <Holds
            position={"row"}
            className="h-full row-start-1 row-end-2"
          >
            <Holds size={"80"} className="w-full flex items-center">
              <span className="text-lg font-semibold items">{t("MileageAndComments")}</span>
            </Holds>
          </Holds>
          <Holds className="h-full w-full row-start-2 row-end-3 ">
            <EndingMileage
              truckingLog={timeSheetId}
              endMileage={endMileage ?? null}
              setEndMileage={setEndMileage}
            />
          </Holds>
          <Holds className="h-full w-full row-start-3 row-end-9 relative">
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
