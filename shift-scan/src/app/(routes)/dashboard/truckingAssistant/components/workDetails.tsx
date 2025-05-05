import { Buttons } from "@/components/(reusable)/buttons";
import { Grids } from "@/components/(reusable)/grids";
import { Holds } from "@/components/(reusable)/holds";
import Sliders from "@/components/(reusable)/sliders";

import { EndingMileage } from "./EndingMileage";
import TruckDriverNotes from "./TruckDriverNotes";
import { Contents } from "@/components/(reusable)/contents";
import { useState } from "react";
import LaborType from "./laborType";
import { createTruckLaborLogs } from "@/actions/truckingActions";
import { useTranslations } from "next-intl";
import { format, formatDate } from "date-fns";
import TruckTabOptions from "../TruckTabOptions";

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
  activeTab2,
  setActiveTab2,
  isComplete,
}: {
  notes: string;
  setNotes: React.Dispatch<React.SetStateAction<string>>;
  endMileage: number | null;
  setEndMileage: React.Dispatch<React.SetStateAction<number | null>>;
  isLoading: boolean;
  timeSheetId: string | undefined;
  laborType: LaborType[] | undefined;
  setLaborType: React.Dispatch<React.SetStateAction<LaborType[]>>;
  activeTab2: 2;
  setActiveTab2: React.Dispatch<React.SetStateAction<number>>;
  isComplete: {
    haulingLogsTab: boolean;
    notesTab: boolean;
    stateMileageTab: boolean;
    refuelLogsTab: boolean;
  };
}) {
  const t = useTranslations("TruckingAssistant");
  const [activeTab, setActiveTab] = useState(1);

  const addTempLaborLogs = async () => {
    const formData = new FormData();
    formData.append("truckingLogId", timeSheetId ?? "");

    try {
      const now = new Date().toString();

      const tempLaborLogs = await createTruckLaborLogs(formData);
      setLaborType((prev) => [
        ...(prev ?? []),
        {
          id: tempLaborLogs.id ?? null,
          truckingLogId: tempLaborLogs.truckingLogId ?? null,
          type: "",
          startTime: now,
          endTime: null,
        },
      ]);
    } catch (error) {
      console.error(t("ErrorAddingEquipment"), error);
    }
  };

  return (
    <>
      <TruckTabOptions
        activeTab={2}
        setActiveTab={setActiveTab2}
        isLoading={isLoading}
        isComplete={{
          haulingLogsTab: isComplete.haulingLogsTab,
          notesTab: isComplete.notesTab,
          stateMileageTab: isComplete.stateMileageTab,
          refuelLogsTab: isComplete.refuelLogsTab,
        }}
      />
      <Holds
        background={"white"}
        className={"w-full h-full rounded-t-none row-start-1 row-end-2  "}
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
                  onClick={() => {
                    addTempLaborLogs();
                  }}
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
      <Holds className="h-full w-full row-start-2 row-end-8 ">
        <Holds background={"white"} className="h-full w-full ">
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
                  <LaborType
                    laborType={laborType}
                    setLaborType={setLaborType}
                  />
                </Holds>
              )}
            </Grids>
          </Contents>
        </Holds>
      </Holds>
    </>
  );
}
