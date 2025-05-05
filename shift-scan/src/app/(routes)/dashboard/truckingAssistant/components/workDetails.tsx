import { Buttons } from "@/components/(reusable)/buttons";
import { Grids } from "@/components/(reusable)/grids";
import { Holds } from "@/components/(reusable)/holds";
import Sliders from "@/components/(reusable)/sliders";

import { EndingMileage } from "./EndingMileage";
import TruckDriverNotes from "./TruckDriverNotes";
import { Contents } from "@/components/(reusable)/contents";
import { act, useState } from "react";
import LaborType from "./laborType";

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
  const [activeTab, setActiveTab] = useState(1);

  return (
    <>
      <Holds
        background={"white"}
        className={"w-full h-full rounded-t-none row-start-2 row-end-3  "}
      >
        <Contents width={"section"} className="h-full">
          <Holds position={"row"} className="h-full gap-2">
            <Holds size={"80"}>
              <Sliders
                leftTitle={"Comments"}
                rightTitle={"Labor"}
                activeTab={activeTab}
                setActiveTab={setActiveTab}
              />
            </Holds>
            <Holds size={"20"} className="my-auto">
              {activeTab === 2 ? (
                <Buttons
                  background={"green"}
                  className="py-1.5"
                  onClick={() => {}}
                >
                  +
                </Buttons>
              ) : (
                <Buttons
                  background={"darkGray"}
                  className="py-1.5"
                  onClick={() => {}}
                >
                  +
                </Buttons>
              )}
            </Holds>
          </Holds>
        </Contents>
      </Holds>
      <Holds className="h-full w-full row-start-3 row-end-11 ">
        <Holds background={"white"} className="h-full w-full mt-3">
          <Contents width={"section"} className="h-full">
            <Grids rows={"8"} gap={"5"} className="h-full py-3">
              {activeTab === 1 ? (
                <>
                  <Holds className="h-full w-full row-start-1 row-end-2 ">
                    <EndingMileage
                      truckingLog={timeSheetId}
                      endMileage={endMileage ?? null}
                      setEndMileage={setEndMileage}
                    />
                  </Holds>
                  <Holds className="h-full w-full row-start-2 row-end-9 relative">
                    <TruckDriverNotes
                      truckingLog={timeSheetId}
                      notes={notes}
                      setNotes={setNotes}
                    />
                  </Holds>
                </>
              ) : (
                <Holds className="h-full w-full row-start-1 row-end-10 ">
                  <LaborType />
                </Holds>
              )}
            </Grids>
          </Contents>
        </Holds>
      </Holds>
    </>
  );
}
