import { createStateMileage } from "@/actions/truckingActions";
import { Buttons } from "@/components/(reusable)/buttons";
import { Grids } from "@/components/(reusable)/grids";
import { Holds } from "@/components/(reusable)/holds";
import { Texts } from "@/components/(reusable)/texts";
import StateMileageList from "./StateMileageList";
import { useTranslations } from "next-intl";
import { StateOptions } from "@/data/stateValues";
import { Contents } from "@/components/(reusable)/contents";
import TruckTabOptions from "../TruckTabOptions";

type StateMileage = {
  id: string;
  truckingLogId: string;
  state?: string;
  stateLineMileage?: number;
  createdAt?: Date;
};
export default function StateLog({
  StateMileage,
  setStateMileage,
  truckingLog,
  activeTab,
  setActiveTab,
  isLoading,
  isComplete,
}: {
  truckingLog: string | undefined;
  StateMileage: StateMileage[] | undefined;
  setStateMileage: React.Dispatch<
    React.SetStateAction<StateMileage[] | undefined>
  >;
  activeTab: 3;
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
  const AddStateMileage = async () => {
    const formData = new FormData();
    formData.append("truckingLogId", truckingLog ?? "");
    try {
      const tempStateMileage = await createStateMileage(formData);
      setStateMileage((prev) => [
        {
          id: tempStateMileage.id,
          truckingLogId: tempStateMileage.truckingLogId ?? "",
          state: tempStateMileage.state ?? "",
          stateLineMileage: tempStateMileage.stateLineMileage ?? 0,
          createdAt: new Date(),
        },
        ...(prev ?? []),
      ]);
    } catch (error) {
      console.log(t("ErrorAddingStateMileage"), error);
    }
  };

  return (
    <>
      <TruckTabOptions
        activeTab={3}
        setActiveTab={setActiveTab}
        isLoading={isLoading}
        isComplete={{
          haulingLogsTab: isComplete.haulingLogsTab,
          notesTab: isComplete.notesTab,
          stateMileageTab: isComplete.stateMileageTab,
          refuelLogsTab: isComplete.refuelLogsTab,
        }}
      />
      <Holds background={"white"} className="w-full h-full rounded-t-none ">
        <Grids rows={"7"} className="h-full">
          <Holds className="h-full row-start-1 row-end-2 ">
            <Contents width={"section"} className="h-full">
              <Holds position={"row"} className="h-full gap-2">
                <Holds size={"80"}>
                  <Texts size={"p3"}>{t("DidYouLeaveIdaho")}</Texts>
                </Holds>
                <Holds size={"20"} className="my-auto">
                  <Buttons
                    background={"green"}
                    className="py-1.5"
                    onClick={() => {
                      AddStateMileage();
                    }}
                  >
                    +
                  </Buttons>
                </Holds>
              </Holds>
            </Contents>
          </Holds>
          <Holds className="w-full h-full row-start-2 row-end-7 ">
            <Contents width={"section"} className="h-full">
              <StateMileageList
                StateOptions={StateOptions}
                StateMileage={StateMileage}
                setStateMileage={setStateMileage}
              />
            </Contents>
          </Holds>
        </Grids>
      </Holds>
    </>
  );
}
