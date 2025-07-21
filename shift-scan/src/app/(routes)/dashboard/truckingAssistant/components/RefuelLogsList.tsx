import { Contents } from "@/components/(reusable)/contents";
import { useEffect, useState, useCallback } from "react";
import { deleteRefuelLog, updateRefuelLog } from "@/actions/truckingActions";
import SlidingDiv from "@/components/(animations)/slideDelete";
import { Holds } from "@/components/(reusable)/holds";
import { Inputs } from "@/components/(reusable)/inputs";
import { useTranslations } from "next-intl";
import { Grids } from "@/components/(reusable)/grids";
import { Texts } from "@/components/(reusable)/texts";
import { debounce } from "lodash";

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
  startingMileage,
}: {
  refuelLogs: Refueled[] | undefined;
  setRefuelLogs: React.Dispatch<React.SetStateAction<Refueled[] | undefined>>;
  startingMileage: number | null;
}) {
  const t = useTranslations("TruckingAssistant");
  const [editedRefuel, setEditedRefuel] = useState<Refueled[]>(
    refuelLogs || []
  );
  const [validationErrors, setValidationErrors] = useState<{
    [key: string]: string;
  }>({});

  // Helper function to get validation message for mileage input
  const getValidationMessage = (
    milesAtFueling: number | null | undefined,
    itemId: string
  ): string => {
    if (!startingMileage) return "";

    // Show validation message for empty/null values
    if (
      milesAtFueling === null ||
      milesAtFueling === undefined ||
      milesAtFueling === 0
    ) {
      return `Mileage required, must be ${startingMileage} or greater`;
    }

    if (milesAtFueling < startingMileage) {
      return `Mileage must be ${startingMileage} or greater`;
    }
    return "";
  };

  // Debounced server update function
  const updateRefuelLogServer = useCallback(
    debounce(async (refuelLog: Refueled) => {
      const formData = new FormData();
      formData.append("id", refuelLog.id);
      formData.append(
        "gallonsRefueled",
        refuelLog.gallonsRefueled?.toString() || "0"
      );
      formData.append(
        "milesAtfueling",
        refuelLog.milesAtFueling?.toString() || "0"
      );

      try {
        await updateRefuelLog(formData);
      } catch (error) {
        console.error("Error updating refuel log:", error);
      }
    }, 1000),
    []
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

    // Trigger server update
    updateRefuelLogServer(newRefuel[index]);
  };

  const handleMileageChange = (index: number, value: string | number) => {
    const newRefuel = [...editedRefuel];
    const numericValue = Number(value);
    newRefuel[index].milesAtFueling = numericValue;
    setEditedRefuel(newRefuel);
    setRefuelLogs(newRefuel);

    // Validate mileage
    const itemId = newRefuel[index].id;
    const validationMessage = getValidationMessage(numericValue, itemId);
    setValidationErrors((prev) => ({
      ...prev,
      [itemId]: validationMessage,
    }));

    // Trigger server update
    updateRefuelLogServer(newRefuel[index]);
  };

  useEffect(() => {
    setEditedRefuel(refuelLogs || []);
  }, [refuelLogs]);

  // Validate all existing entries when startingMileage or refuelLogs changes
  useEffect(() => {
    if (startingMileage) {
      const newValidationErrors: { [key: string]: string } = {};
      editedRefuel.forEach((item) => {
        const validationMessage = getValidationMessage(
          item.milesAtFueling,
          item.id
        );
        if (validationMessage) {
          newValidationErrors[item.id] = validationMessage;
        }
      });
      setValidationErrors(newValidationErrors);
    }
  }, [startingMileage, editedRefuel]);

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
          <div key={rL.id} className="mb-2">
            <SlidingDiv onSwipeLeft={() => handleDelete(rL.id)}>
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
                    className={`border-none text-xs py-3 focus:outline-hidden focus:ring-0 ${
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
                    className={`border-none text-xs py-3 focus:outline-hidden focus:ring-0 ${
                      rL.milesAtFueling
                        ? "text-black"
                        : "text-app-red placeholder:text-app-red"
                    } `}
                  />
                </Holds>
              </Holds>
            </SlidingDiv>
            {validationErrors[rL.id] && (
              <div className="text-xs text-app-red text-center px-1 leading-tight">
                {validationErrors[rL.id]}
              </div>
            )}
          </div>
        ))}
      </div>
    </Grids>
  );
}
