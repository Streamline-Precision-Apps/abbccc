import {
  deleteLaborTypeLogs,
  updateLaborType,
} from "@/actions/truckingActions";
import SlidingDiv from "@/components/(animations)/slideDelete";
import { Contents } from "@/components/(reusable)/contents";
import { Holds } from "@/components/(reusable)/holds";
import { Inputs } from "@/components/(reusable)/inputs";
import { Selects } from "@/components/(reusable)/selects";
import { Texts } from "@/components/(reusable)/texts";
import { format } from "date-fns";
import { debounce } from "lodash";

import { useTranslations } from "next-intl";
import { Dispatch, SetStateAction, useCallback, useState } from "react";
type LaborType = {
  id: string;
  type: string | null;
  startTime: string;
  endTime: string | null;
};
export default function LaborType({
  laborType = [],
  setLaborType,
}: {
  laborType?: LaborType[];
  setLaborType: Dispatch<SetStateAction<LaborType[]>>;
}) {
  const t = useTranslations("TruckingAssistant");

  const handleDelete = async (laborTypeId: string) => {
    try {
      // Optimistic update
      const updatedLaborType = laborType.filter((lt) => lt.id !== laborTypeId);
      setLaborType(updatedLaborType);

      // API call
      const isDeleted = await deleteLaborTypeLogs(laborTypeId);

      if (!isDeleted) {
        throw new Error(t("FailedToDeletePleaseTryAgain"));
      }
    } catch (error) {
      console.error(error);
      // Revert on error
      setLaborType(laborType);
    }
  };

  const handleUpdate = useCallback(
    debounce(async (updatedLabor: LaborType) => {
      const formData = new FormData();
      formData.append("id", updatedLabor.id);
      formData.append("type", updatedLabor.type || "");
      formData.append("startTime", updatedLabor.startTime);
      formData.append("endTime", updatedLabor.endTime || "");

      try {
        await updateLaborType(formData);
      } catch (error) {
        console.error("Failed to update labor type:", error);
      }
    }, 500),
    []
  );

  const handleChange = (field: keyof LaborType, id: string, value: string) => {
    setLaborType((prev) =>
      prev.map((item) => (item.id === id ? { ...item, [field]: value } : item))
    );

    // Find the updated item and trigger the API update
    const updatedItem = laborType.find((item) => item.id === id);
    if (updatedItem) {
      handleUpdate({ ...updatedItem, [field]: value });
    }
  };

  return (
    <>
      <Contents className="overflow-y-auto no-scrollbar">
        {laborType.length === 0 && (
          <Holds className="px-10 mt-4">
            <Texts size={"p5"} text={"gray"} className="italic">
              No Labor Types Logs Recorded
            </Texts>
            <Texts size={"p7"} text={"gray"}>
              {`(Tap the plus icon to add a log.)`}
            </Texts>
          </Holds>
        )}
        <div className=" row-start-1 row-end-2 h-full ">
          {laborType.map((lt) => (
            <SlidingDiv key={lt.id} onSwipeLeft={() => handleDelete(lt.id)}>
              <Holds
                background={"white"}
                position={"row"}
                className="w-full h-full border-[3px] border-black rounded-[10px]"
              >
                <Holds className=" h-full w-1/3 justify-center items-center ">
                  <Selects
                    value={lt.type || ""}
                    className={`border-none text-xs focus:outline-hidden ${
                      lt.type === "" && "text-app-red"
                    } `}
                    onChange={(e) => {
                      handleChange("type", lt.id, e.target.value);
                    }}
                  >
                    <option value="">Labor Type</option>
                    <option value="Truck Driver">Truck Driver</option>
                    <option value="Operator">Operator</option>
                    <option value="Manual Labor">Manual Labor</option>
                  </Selects>
                </Holds>
                <Holds className="h-full border-x-[3px] border-black w-1/3 justify-center items-center px-2 ">
                  <Inputs
                    type="time"
                    value={format(lt.startTime, "HH:mm")} // Now directly using the stored time
                    placeholder="Start Time"
                    onChange={(e) => {
                      const change = e.target.value;
                      const string = lt.startTime;
                      const date = new Date(string);
                      date.setHours(parseInt(change.split(":")[0]));
                      date.setMinutes(parseInt(change.split(":")[1]));
                      handleChange("startTime", lt.id, date.toISOString());
                    }}
                    className={`py-2 border-none text-xs focus:outline-hidden ${
                      lt.startTime === "" && "text-app-red"
                    }`}
                  />
                </Holds>
                <Holds className="h-full justify-center items-center w-1/3  ">
                  <Inputs
                    type="time"
                    min={lt.startTime}
                    value={lt.endTime ? format(lt.endTime, "HH:mm") : ""}
                    onChange={(e) => {
                      const change = e.target.value;
                      const string = lt.endTime || lt.startTime;
                      const date = new Date(string);
                      date.setHours(parseInt(change.split(":")[0]));
                      date.setMinutes(parseInt(change.split(":")[1]));
                      handleChange("endTime", lt.id, date.toISOString());
                    }}
                    placeholder="End Time"
                    className={`text-xs focus:outline-hidden ${
                      !lt.endTime
                        ? "h-full border-app-red rounded-none rounded-tr-md rounded-br-md "
                        : "border-none"
                    }`}
                  />
                </Holds>
              </Holds>
            </SlidingDiv>
          ))}
        </div>
      </Contents>
    </>
  );
}
