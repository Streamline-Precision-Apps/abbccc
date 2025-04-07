"use client";

import { Contents } from "@/components/(reusable)/contents";
import { useEffect, useState } from "react";
import { deleteRefuelLog, updateRefuelLog } from "@/actions/truckingActions";
import SlidingDiv from "@/components/(animations)/slideDelete";
import { Holds } from "@/components/(reusable)/holds";
import { Inputs } from "@/components/(reusable)/inputs";

type Refueled = {
  id: string;
  employeeEquipmentLogId: string | null;
  truckingLogId: string | null;
  gallonsRefueled: number | null;
  milesAtFueling: number | null;
  tascoLogId: string | null;
};

interface RefuelEquipmentLogsListProps {
  mileage?: boolean;
  refuelLogs: Refueled[];
  setRefuelLogs: (logs: Refueled[]) => void;
}

export default function RefuelEquipmentLogsList({
  refuelLogs = [],
  setRefuelLogs,
  mileage = true,
}: RefuelEquipmentLogsListProps) {
  const handleDelete = async (id: string) => {
    const newRefueledLogs = refuelLogs.filter((rL) => rL.id !== id);
    setRefuelLogs(newRefueledLogs);
    await deleteRefuelLog(id);
  };

  const handleFieldChange = (
    index: number,
    field: keyof Refueled,
    value: string | number
  ) => {
    const newRefuel = [...refuelLogs];
    newRefuel[index] = {
      ...newRefuel[index],
      [field]: Number(value),
    };
    setRefuelLogs(newRefuel);
  };

  const handleSave = async (rL: Refueled) => {
    const formData = new FormData();
    formData.append("id", rL.id);
    formData.append("gallonsRefueled", rL.gallonsRefueled?.toString() || "");
    formData.append("milesAtfueling", rL.milesAtFueling?.toString() || "");
    await updateRefuelLog(formData);
  };

  return (
    <Contents className="overflow-y-auto no-scrollbar">
      {refuelLogs.map((rL, index) => (
        <SlidingDiv key={rL.id} onSwipeLeft={() => handleDelete(rL.id)}>
          <Holds
            position={"row"}
            background={"white"}
            className="w-full h-full border-black border-[3px] rounded-[10px] mb-3"
          >
            <Holds
              background={"white"}
              className="w-full px-2 h-full justify-center"
            >
              <Inputs
                type="number"
                name="gallons"
                placeholder="Total Gallons"
                value={rL.gallonsRefueled || ""}
                onChange={(e) =>
                  handleFieldChange(index, "gallonsRefueled", e.target.value)
                }
                onBlur={() => handleSave(rL)}
                className="border-none text-xs py-2 focus:outline-none focus:ring-0"
              />
            </Holds>
            {mileage && (
              <Holds
                background={"white"}
                className="w-full px-2 h-full justify-center border-black border-l-[3px] rounded-l-none"
              >
                <Inputs
                  type="number"
                  name="currentMileage"
                  placeholder="Current Mileage"
                  value={rL.milesAtFueling || ""}
                  onChange={(e) =>
                    handleFieldChange(index, "milesAtFueling", e.target.value)
                  }
                  onBlur={() => handleSave(rL)}
                  className="border-none text-xs py-2 focus:outline-none focus:ring-0"
                />
              </Holds>
            )}
          </Holds>
        </SlidingDiv>
      ))}
    </Contents>
  );
}
