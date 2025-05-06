import { Contents } from "@/components/(reusable)/contents";
import { useEffect, useState } from "react";
import { deleteRefuelLog, updateRefuelLog } from "@/actions/tascoActions";
import SlidingDiv from "@/components/(animations)/slideDelete";
import { Holds } from "@/components/(reusable)/holds";
import { Inputs } from "@/components/(reusable)/inputs";
import { Refueled } from "@/lib/types";
import { useTranslations } from "next-intl";

export default function RefuelLogsList({
  refuelLogs,
  setRefuelLogs,
}: {
  refuelLogs: Refueled[] | undefined;
  setRefuelLogs: React.Dispatch<React.SetStateAction<Refueled[] | undefined>>;
}) {
  const [editedRefuel, setEditedRefuel] = useState<Refueled[]>(
    refuelLogs || []
  );
  const t = useTranslations("Tasco");
  const handleDelete = async (id: string) => {
    try {
      await deleteRefuelLog({ type: "tasco", id });
      const newRefueledLogs = editedRefuel.filter((rL) => rL.id !== id);
      setEditedRefuel(newRefueledLogs);
      setRefuelLogs(newRefueledLogs);
    } catch (error) {
      console.error("Failed to delete refuel log:", error);
    }
  };

  const handleGallonsChange = (index: number, value: string | number) => {
    const newRefuel = [...editedRefuel];
    newRefuel[index].gallonsRefueled = Number(value);
    setEditedRefuel(newRefuel);
    setRefuelLogs(newRefuel);
  };

  const handleUpdateRefuelLog = async (log: Refueled) => {
    try {
      await updateRefuelLog({
        type: "tasco",
        id: log.id,
        gallonsRefueled: log.gallonsRefueled,
      });
    } catch (error) {
      console.error("Failed to update refuel log:", error);
      // You might want to add user feedback here
    }
  };

  useEffect(() => {
    setEditedRefuel(refuelLogs || []);
  }, [refuelLogs]);

  return (
    <Contents className="overflow-y-auto no-scrollbar">
      {editedRefuel.map((rL, index) => (
        <SlidingDiv key={rL.id} onSwipeLeft={() => handleDelete(rL.id)}>
          <Holds
            position={"row"}
            background={"white"}
            className="w-full h-full border-black border-[3px] rounded-[10px] mb-3"
          >
            <Holds background={"white"} className="px-2 h-full justify-center">
              <Inputs
                type="number"
                name="gallons"
                placeholder={t("TotalGallons")}
                value={rL.gallonsRefueled || ""}
                onChange={(e) => handleGallonsChange(index, e.target.value)}
                onBlur={() => handleUpdateRefuelLog(rL)}
                className={`border-none text-center text-sm focus:outline-none focus:ring-0 ${
                  rL.gallonsRefueled === 0 ? "placeholder:text-app-red " : ""
                }`}
              />
            </Holds>
          </Holds>
        </SlidingDiv>
      ))}
    </Contents>
  );
}
