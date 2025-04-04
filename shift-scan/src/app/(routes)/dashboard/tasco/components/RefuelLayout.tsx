import { Buttons } from "@/components/(reusable)/buttons";
import { Grids } from "@/components/(reusable)/grids";
import { Holds } from "@/components/(reusable)/holds";
import { Texts } from "@/components/(reusable)/texts";
import RefuelLogsList from "./RefuelLogsList";
import { Refueled } from "@/lib/types";
import { createRefuelLog } from "@/actions/tascoActions";
import { useTranslations } from "next-intl";

export default function RefuelLayout({
  tascoLog,
  refuelLogs,
  setRefuelLogs,
}: {
  tascoLog: string | undefined;
  refuelLogs: Refueled[] | undefined;
  setRefuelLogs: React.Dispatch<React.SetStateAction<Refueled[] | undefined>>;
}) {
  const t = useTranslations("Tasco");
  const AddRefuelLog = async () => {
    if (!tascoLog) return;

    try {
      const newRefuelLog = await createRefuelLog({
        type: 'tasco',
        parentId: tascoLog
      });

      setRefuelLogs((prev) => [
        ...(prev ?? []),
        {
          id: newRefuelLog.id,
          employeeEquipmentLogId: newRefuelLog.employeeEquipmentLogId ?? "",
          tascoLogId: newRefuelLog.tascoLogId ?? "",
          gallonsRefueled: newRefuelLog.gallonsRefueled ?? 0,
          milesAtfueling: newRefuelLog.milesAtfueling ?? 0,
        },
      ]);
    } catch (error) {
      console.error("Error adding refuel log:", error);
    }
  };

  return (
    <Holds className="w-full h-full">
      <Grids rows={"8"}>
        <Holds position={"row"} className="w-full h-full row-start-1 row-end-2">
          <Holds size={"80"}>
            <Texts size={"p3"} className="font-bold">
              {t("DidYouRefuel?")}
            </Texts>
          </Holds>
          <Holds size={"20"}>
            <Buttons
              background={"green"}
              className="py-1.5"
              onClick={AddRefuelLog}
            >
              +
            </Buttons>
          </Holds>
        </Holds>
        <Holds className="w-full h-full row-start-2 row-end-9">
          <RefuelLogsList
            refuelLogs={refuelLogs}
            setRefuelLogs={setRefuelLogs}
          />
        </Holds>
      </Grids>
    </Holds>
  );
}