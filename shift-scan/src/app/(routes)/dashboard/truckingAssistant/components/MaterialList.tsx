import { createHaulingLogs } from "@/actions/truckingActions";
import { Contents } from "@/components/(reusable)/contents";
import { Holds } from "@/components/(reusable)/holds";
import { Inputs } from "@/components/(reusable)/inputs";
import { Selects } from "@/components/(reusable)/selects";
import { Dispatch, SetStateAction, useEffect, useState } from "react";

type Material = {
  name: string;
  id: string;
  LocationOfMaterial: string | null;
  truckingLogId: string;
  quantity: number | null;
  createdAt: Date;
};

export default function MaterialList({
  material,
  setMaterial,
  materialOptions,
  locationOptions,
}: {
  material: Material[] | undefined;
  setMaterial: Dispatch<SetStateAction<Material[] | undefined>>;

  locationOptions: {
    value: string;
    label: string;
  }[];
  materialOptions: {
    value: string;
    label: string;
  }[];
}) {
  const handleCreateHaulingLogs = async () => {
    const formData = new FormData();

    const haulingLog = await createHaulingLogs(formData);
  };
  return (
    <Contents className="overflow-y-auto no-scrollbar">
      {material && material.length > 0
        ? material.map((material, index) => (
            <Holds
              key={material.id || index}
              position={"row"}
              className="w-full rounded-[10px] border-[3px] border-black mb-3 "
            >
              <Holds className="w-2/5 h-full border-r-[3px] border-black px-2">
                {" "}
                <Selects
                  defaultValue={material.name}
                  onChange={(e) => {}}
                  className={"border-none text-xs py-2 focus:outline-none"}
                >
                  <option
                    className="text-xs text-center text-app-light-gray"
                    value=""
                  >
                    Material
                  </option>
                  {materialOptions.map((option) => (
                    <option
                      className="text-xs"
                      key={option.value}
                      value={option.value}
                    >
                      {option.label}
                    </option>
                  ))}
                </Selects>
              </Holds>
              <Holds className="w-2/5 px-2">
                <Selects
                  defaultValue={material.LocationOfMaterial || ""}
                  className="border-none text-xs focus:outline-none"
                >
                  <option
                    value=""
                    className="text-xs text-center text-app-light-gray"
                  >
                    Location
                  </option>
                  {locationOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </Selects>
              </Holds>
              <Holds className="w-1/5 h-full border-l-[3px] border-black ">
                <Inputs
                  type="number"
                  placeholder="# Loads"
                  defaultValue={material.quantity?.toString() || ""}
                  className="border-none text-xs text-center h-full focus:outline-none "
                />
              </Holds>
            </Holds>
          ))
        : null}
    </Contents>
  );
}
