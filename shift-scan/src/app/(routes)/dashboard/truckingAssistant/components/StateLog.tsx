import { createStateMileage } from "@/actions/truckingActions";
import { Buttons } from "@/components/(reusable)/buttons";
import { Grids } from "@/components/(reusable)/grids";
import { Holds } from "@/components/(reusable)/holds";
import { Texts } from "@/components/(reusable)/texts";
import StateMileageList from "./StateMileageList";
import { useTranslations } from "next-intl";
import { StateOptions } from "@/data/stateValues";

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
}: {
  truckingLog: string | undefined;
  StateMileage: StateMileage[] | undefined;
  setStateMileage: React.Dispatch<
    React.SetStateAction<StateMileage[] | undefined>
  >;
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
    <Holds className="w-full h-full">
      <Grids rows={"8"}>
        <Holds position={"row"} className="w-full h-full row-start-1 row-end-2">
          <Holds size={"80"}>
            <Texts size={"p3"} className="font-bold">
              {t("DidYouLeaveIdaho")}
            </Texts>
          </Holds>
          <Holds size={"20"}>
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
        <Holds className="w-full h-full row-start-2 row-end-9">
          <StateMileageList
            StateOptions={StateOptions}
            StateMileage={StateMileage}
            setStateMileage={setStateMileage}
          />
        </Holds>
      </Grids>
    </Holds>
  );
}
