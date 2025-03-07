import { Contents } from "@/components/(reusable)/contents";
import { useEffect, useState } from "react";
import { deleteRefuelLog, updateRefuelLog } from "@/actions/truckingActions";
import SlidingDiv from "@/components/(animations)/slideDelete";
import { Holds } from "@/components/(reusable)/holds";
import { Inputs } from "@/components/(reusable)/inputs";
import { Refueled } from "@/lib/types";

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

  const handleDelete = async (id: string) => {
    const newRefueledLogs = editedRefuel.filter((rL) => rL.id !== id);
    setEditedRefuel(newRefueledLogs);
    setRefuelLogs(newRefueledLogs);
    const isDeleted = await deleteRefuelLog(id);
    if (isDeleted) {
      console.log("Deleted");
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
    newRefuel[index].milesAtfueling = Number(value);
    setEditedRefuel(newRefuel);
    setRefuelLogs(newRefuel);
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
            className="w-full h-full border-black border-[3px] rounded-[10px] mb-3 "
          >
            <Holds
              background={"white"}
              className="w-1/2 px-2 h-full justify-center"
            >
              <Inputs
                type="number"
                name="gallons"
                placeholder="Total Gallons"
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
                    rL.milesAtfueling?.toString() || ""
                  );
                  updateRefuelLog(formData);
                }}
                className={
                  "border-none text-xs py-2 focus:outline-none focus:ring-0"
                }
              />
            </Holds>
            <Holds
              background={"white"}
              className="w-1/2 px-2 h-full justify-center  border-black border-l-[3px] rounded-l-none"
            >
              <Inputs
                type="number"
                name="currentMileage"
                placeholder="Current Mileage"
                value={rL.milesAtfueling || ""}
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
                    rL.milesAtfueling?.toString() || ""
                  );
                  updateRefuelLog(formData);
                }}
                className={
                  "border-none text-xs py-2 focus:outline-none focus:ring-0"
                }
              />
            </Holds>
          </Holds>
        </SlidingDiv>
      ))}
    </Contents>
  );
}
