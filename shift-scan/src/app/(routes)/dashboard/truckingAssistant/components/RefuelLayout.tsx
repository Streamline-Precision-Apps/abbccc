import { createRefuelLog } from "@/actions/truckingActions";
import { Buttons } from "@/components/(reusable)/buttons";
import { Grids } from "@/components/(reusable)/grids";
import { Holds } from "@/components/(reusable)/holds";
import { Texts } from "@/components/(reusable)/texts";
import RefuelLogsList from "./RefuelLogsList";
import { useTranslations } from "next-intl";
import { Contents } from "@/components/(reusable)/contents";
import TruckTabOptions from "../TruckTabOptions";

type Refueled = {
  id: string;
  employeeEquipmentLogId: string | null;
  truckingLogId: string | null;
  gallonsRefueled: number | null;
  milesAtFueling: number | null;
  tascoLogId: string | null;
};

export default function RefuelLayout({
  truckingLog,
  refuelLogs,
  setRefuelLogs,
  activeTab,
  setActiveTab,
  isLoading,
  isComplete,
}: {
  truckingLog: string | undefined;
  refuelLogs: Refueled[] | undefined;
  setRefuelLogs: React.Dispatch<React.SetStateAction<Refueled[] | undefined>>;
  activeTab: 4;
  setActiveTab: React.Dispatch<React.SetStateAction<number>>;
  isLoading: boolean;
  isComplete: {
    haulingLogsTab: boolean;
    notesTab: boolean;
    stateMileageTab: boolean;
    refuelLogsTab: boolean;
  };
}) {
  const t = useTranslations("TruckingAssistant");
  const AddRefuelLog = async () => {
    const formData = new FormData();
    formData.append("truckingLogId", truckingLog ?? "");
    try {
      const tempRefuelLog = await createRefuelLog(formData);
      setRefuelLogs((prev) => [
        {
          id: tempRefuelLog.id,
          employeeEquipmentLogId: tempRefuelLog.employeeEquipmentLogId ?? "",
          truckingLogId: tempRefuelLog.truckingLogId ?? "",
          gallonsRefueled: tempRefuelLog.gallonsRefueled ?? 0,
          milesAtFueling: tempRefuelLog.milesAtFueling ?? 0,
          tascoLogId: tempRefuelLog.tascoLogId ?? "",
        },
        ...(prev ?? []),
      ]);
    } catch (error) {
      console.log(t("ErrorAddingStateMileage"), error);
    }
  };

  return (
    <Holds className="w-full h-full">
      <TruckTabOptions
        activeTab={4}
        setActiveTab={setActiveTab}
        isLoading={isLoading}
        isComplete={{
          haulingLogsTab: isComplete.haulingLogsTab,
          notesTab: isComplete.notesTab,
          stateMileageTab: isComplete.stateMileageTab,
          refuelLogsTab: isComplete.refuelLogsTab,
        }}
      />
      <Grids rows={"7"} gap={"5"}>
        <Holds position={"row"} className="h-full row-start-1 row-end-2">
          <Contents width={"section"} className="h-full">
            <Holds position={"row"} className="h-full gap-2">
              <Holds size={"80"}>
                <Texts size={"p3"}>{t("DidYouRefuel")}</Texts>
              </Holds>
              <Holds size={"20"}>
                <Buttons
                  background={"green"}
                  className="py-1.5"
                  onClick={() => {
                    AddRefuelLog();
                  }}
                >
                  +
                </Buttons>
              </Holds>
            </Holds>
          </Contents>
        </Holds>
        <Holds className="w-full h-full row-start-2 row-end-8">
          <RefuelLogsList
            refuelLogs={refuelLogs}
            setRefuelLogs={setRefuelLogs}
          />
        </Holds>
      </Grids>
    </Holds>
  );
}
