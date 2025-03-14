import { Buttons } from "@/components/(reusable)/buttons";
import { Grids } from "@/components/(reusable)/grids";
import { Holds } from "@/components/(reusable)/holds";
import { Texts } from "@/components/(reusable)/texts";
import { set } from "date-fns";
import RefuelLogsList from "./RefuelLogsList";
import { Refueled } from "@/lib/types";
import { createRefuelLog } from "@/actions/tascoActions";

export default function RefuelLayout({
  tascoLog,
  refuelLogs,
  setRefuelLogs,
}: {
  tascoLog: string | undefined;
  refuelLogs: Refueled[] | undefined;
  setRefuelLogs: React.Dispatch<React.SetStateAction<Refueled[] | undefined>>;
}) {
  const AddRefuelLog = async () => {
    const formData = new FormData();
    formData.append("tascoLogId", tascoLog ?? "");
    try {
      const tempRefuelLog = await createRefuelLog(formData);
      setRefuelLogs((prev) => [
        ...(prev ?? []),
        {
          id: tempRefuelLog.id,
          employeeEquipmentLogId: tempRefuelLog.employeeEquipmentLogId ?? "",
          tascoLogId: tempRefuelLog.tascoLogId ?? "",
          gallonsRefueled: tempRefuelLog.gallonsRefueled ?? 0,
          milesAtfueling: tempRefuelLog.milesAtfueling ?? 0,
          // tascoLogId: tempRefuelLog.tascoLogId ?? "",
        },
      ]);
    } catch (error) {
      console.log("error adding state Mileage", error);
    }
  };

  return (
    <Holds className="w-full h-full">
      <Grids rows={"8"}>
        <Holds position={"row"} className="w-full h-full row-start-1 row-end-2">
          <Holds size={"80"}>
            <Texts size={"p3"} className="font-bold">
              Did you Refuel?
            </Texts>
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
