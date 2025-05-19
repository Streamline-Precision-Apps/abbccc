import { Contents } from "@/components/(reusable)/contents";
import { useEffect, useState } from "react";
import { deleteRefuelLog, updateRefuelLog } from "@/actions/truckingActions";
import SlidingDiv from "@/components/(animations)/slideDelete";
import { Holds } from "@/components/(reusable)/holds";
import { Inputs } from "@/components/(reusable)/inputs";
import { useTranslations } from "next-intl";
import { Grids } from "@/components/(reusable)/grids";
import { Texts } from "@/components/(reusable)/texts";

type Refueled = {
  id: string;
  employeeEquipmentLogId: string | null;
  truckingLogId: string | null;
  gallonsRefueled: number | null;
  milesAtFueling: number | null;
  tascoLogId: string | null;
};

export default function RefuelLogsList({
  refuelLogs,
  setRefuelLogs,
}: {
  refuelLogs: Refueled[] | undefined;
  setRefuelLogs: React.Dispatch<React.SetStateAction<Refueled[] | undefined>>;
}) {
  const t = useTranslations("TruckingAssistant");
  const [editedRefuel, setEditedRefuel] = useState<Refueled[]>(
    refuelLogs || []
  );

  const handleDelete = async (id: string) => {
    const newRefueledLogs = editedRefuel.filter((rL) => rL.id !== id);
    setEditedRefuel(newRefueledLogs);
    setRefuelLogs(newRefueledLogs);
    const isDeleted = await deleteRefuelLog(id);
    if (isDeleted) {
      setEditedRefuel(newRefueledLogs || []);
      setRefuelLogs(newRefueledLogs);
    }
  };

  const handleGallonsChange = (index: number, value: string | number) => {
    const newRefuel = [...editedRefuel];
    newRefuel[index].gallonsRefueled = Number(value);
    setEditedRefuel(newRefuel);
    setRefuelLogs(newRefuel);
  };

  const handleMileageChange = (index: number, value: string | number) => {
    const newRefuel = [...editedRefuel];
    newRefuel[index].milesAtFueling = Number(value);
    setEditedRefuel(newRefuel);
    setRefuelLogs(newRefuel);
  };

  useEffect(() => {
    setEditedRefuel(refuelLogs || []);
  }, [refuelLogs]);

  return (
    <Grids rows={"1"} className="h-full overflow-y-auto no-scrollbar mb-5">
      <div className=" row-span-1 h-full ">
        {editedRefuel.length === 0 && (
          <Holds className="px-10 mt-4">
            <Texts size={"p5"} text={"gray"} className="italic">
              No Refuel Logs Recorded
            </Texts>
            <Texts size={"p7"} text={"gray"}>
              {`(Tap the plus icon to add a log.)`}
            </Texts>
          </Holds>
        )}
        {editedRefuel.map((rL, index) => (
          <SlidingDiv key={rL.id} onSwipeLeft={() => handleDelete(rL.id)}>
            <Holds
              position={"row"}
              background={"white"}
              className={`w-full h-full  border-[3px] rounded-[10px]  border-black
            `}
            >
              <Holds
                background={"white"}
                className="w-1/2 px-2 h-full justify-center"
              >
                <Inputs
                  type="number"
                  name="gallons"
                  placeholder={t("TotalGallons")}
                  value={rL.gallonsRefueled || ""}
                  onChange={(e) => handleGallonsChange(index, e.target.value)}
                  onBlur={() => {
                    const formData = new FormData();
                    formData.append("id", rL.id);
                    formData.append(
                      "gallonsRefueled",
                      rL.gallonsRefueled?.toString() || ""
                    );
                    formData.append(
                      "milesAtfueling",
                      rL.milesAtFueling?.toString() || ""
                    );
                    updateRefuelLog(formData);
                  }}
                  className={`border-none text-xs py-2 focus:outline-none focus:ring-0 ${
                    rL.gallonsRefueled
                      ? "text-black"
                      : "text-app-red placeholder:text-app-red"
                  } `}
                />
              </Holds>
              <Holds
                background={"white"}
                className="w-1/2 px-2 h-full justify-center  border-black border-l-[3px] rounded-l-none"
              >
                <Inputs
                  type="number"
                  name="currentMileage"
                  placeholder={t("CurrentMileage")}
                  value={rL.milesAtFueling || ""}
                  onChange={(e) => handleMileageChange(index, e.target.value)}
                  onBlur={() => {
                    const formData = new FormData();
                    formData.append("id", rL.id);
                    formData.append(
                      "gallonsRefueled",
                      rL.gallonsRefueled?.toString() || ""
                    );
                    formData.append(
                      "milesAtfueling",
                      rL.milesAtFueling?.toString() || ""
                    );
                    updateRefuelLog(formData);
                  }}
                  className={`border-none text-xs py-2 focus:outline-none focus:ring-0 ${
                    rL.milesAtFueling
                      ? "text-black"
                      : "text-app-red placeholder:text-app-red"
                  } `}
                />
              </Holds>
            </Holds>
          </SlidingDiv>
        ))}
      </div>
    </Grids>
  );
}
