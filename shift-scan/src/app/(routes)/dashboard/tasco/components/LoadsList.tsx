import { Contents } from "@/components/(reusable)/contents";
import { useEffect, useState } from "react";
import { deleteRefuelLog, updateRefuelLog } from "@/actions/truckingActions";
import SlidingDiv from "@/components/(animations)/slideDelete";
import { Holds } from "@/components/(reusable)/holds";
import { Inputs } from "@/components/(reusable)/inputs";
import { Loads } from "@/lib/types";

export default function LoadsList({
  loads,
  setLoads,
}: {
  loads: Loads[] | undefined;
  setLoads: React.Dispatch<React.SetStateAction<Loads[] | undefined>>;
}) {
  const [editedLoad, setEditedLoad] = useState<Loads[]>(
    loads || []
  );

  const handleDelete = async (id: string) => {
    const newLoads = editedLoad.filter((rL) => rL.id !== id);
    setEditedLoad(newLoads);
    setLoads(newLoads);
    const isDeleted = await deleteRefuelLog(id);
    if (isDeleted) {
      console.log("Deleted");
      setEditedLoad(newLoads || []);
      setLoads(newLoads);
    }
  };

  const handleLoadTypeChange = (index: number, value: string | number) => {
    const newLoad = [...editedLoad];
    newLoad[index].loadType = String(value);
    setEditedLoad(newLoad);
    setLoads(newLoad);
  };

  const handleLoadWeightChange = (index: number, value: string | number) => {
    const newLoad = [...editedLoad];
    newLoad[index].loadWeight = Number(value);
    setEditedLoad(newLoad);
    setLoads(newLoad);
  };

  useEffect(() => {
    setEditedLoad(loads || []);
  }, [loads]);

  return (
    <Contents className="overflow-y-auto no-scrollbar">
      {editedLoad.map((rL, index) => (
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
                name="loadType"
                placeholder="Load Type"
                value={rL.loadType || ""}
                onChange={(e) => handleLoadTypeChange(index, e.target.value)}
                onBlur={() => {
                  const formData = new FormData();
                  formData.append("id", rL.id);
                  formData.append(
                    "loadType",
                    rL.loadType?.toString() || ""
                  );
                  formData.append(
                    "loadWeight",
                    rL.loadWeight?.toString() || ""
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
                value={rL.loadWeight || ""}
                onChange={(e) => handleLoadWeightChange(index, e.target.value)}
                onBlur={() => {
                  const formData = new FormData();
                  formData.append("id", rL.id);
                  formData.append(
                    "loadType",
                    rL.loadType?.toString() || ""
                  );
                  formData.append(
                    "loadWeight",
                    rL.loadWeight?.toString() || ""
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
