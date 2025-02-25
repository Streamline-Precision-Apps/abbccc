import { Holds } from "@/components/(reusable)/holds";
import { Inputs } from "@/components/(reusable)/inputs";
import { Selects } from "@/components/(reusable)/selects";
import { Select } from "@nextui-org/react";
import { Material } from "@prisma/client";
import { use, useEffect, useState } from "react";

type MaterialLoads = {
  material: string;
  location: string;
  quantity: number;
};
export default function AddMaterial({}: {}) {
  const materialOptions = [
    { value: "Material 1", label: "Material 1" },
    { value: "Material 2", label: "Material 2" },
    { value: "Material 3", label: "Material 3" },
  ];
  const [fetchLoggedMaterials, setFetchLoggedMaterials] = useState<
    MaterialLoads[]
  >([]);

  const [locationOptions, setLocationOptions] = useState<
    { value: string; label: string }[]
  >([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/getTruckingLogs");
        const data = await response.json();
        setFetchLoggedMaterials(data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, [locationOptions]);

  return (
    <Holds
      position={"row"}
      className="w-full rounded-[10px] border-[3px] border-black "
    >
      <Holds className="w-2/5 h-full border-r-[3px] border-black px-2">
        {" "}
        <Selects
          defaultValue={""}
          className={"border-none text-xs py-2 focus:outline-none"}
        >
          <option className="text-xs text-center text-app-light-gray" value="">
            Material
          </option>
          {materialOptions.map((option) => (
            <option className="text-xs" key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </Selects>
      </Holds>
      <Holds className="w-2/5 px-2">
        <Selects
          defaultValue={""}
          className="border-none text-xs focus:outline-none"
        >
          <option value="" className="text-xs text-center text-app-light-gray">
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
          className="border-none text-xs text-center h-full focus:outline-none "
        />
      </Holds>
    </Holds>
  );
}
