import { Buttons } from "@/components/(reusable)/buttons";
import { Contents } from "@/components/(reusable)/contents";
import { Grids } from "@/components/(reusable)/grids";
import { Holds } from "@/components/(reusable)/holds";
import Sliders from "@/components/(reusable)/sliders";
import { Dispatch, SetStateAction, use, useEffect, useState } from "react";
import MaterialList from "./MaterialList";
import {
  createEquipmentHauled,
  createHaulingLogs,
} from "@/actions/truckingActions";
import EquipmentList from "./EquipmentList";
import { Texts } from "@/components/(reusable)/texts";

type Material = {
  name: string;
  id: string;
  LocationOfMaterial: string | null;
  truckingLogId: string;
  quantity: number | null;
  createdAt: Date;
};

export default function OperatorHaulingLogs({
  truckingLog,
  material,
  setMaterial,
  isLoading,
}: {
  setMaterial: React.Dispatch<React.SetStateAction<Material[] | undefined>>;
  truckingLog: string | undefined;
  material: Material[] | undefined;
  isLoading: boolean;
}) {
  // Add Temporary Material
  const addTempMaterial = async () => {
    const formData = new FormData();
    formData.append("truckingLogId", truckingLog ?? "");

    try {
      const tempMaterial = await createHaulingLogs(formData);
      setMaterial((prev) => [
        {
          id: tempMaterial.id,
          name: "",
          LocationOfMaterial: "",
          truckingLogId: tempMaterial.truckingLogId,
          quantity: null,
          createdAt: new Date(),
        },
        ...(prev ?? []),
      ]);
    } catch (error) {
      console.error("Error adding Material:", error);
    }
  };

  useEffect(() => {
    setMaterial(material ?? []);
  }, [material]);

  // Material Options for Dropdown
  const materialOptions = [
    { value: "Material 1", label: "Material 1" },
    { value: "Material 2", label: "Material 2" },
    { value: "Material 3", label: "Material 3" },
  ];

  return (
    <Grids rows={"10"}>
      <Holds
        background={"white"}
        className={"w-full h-full rounded-t-none row-start-1 row-end-2 "}
      >
        <Contents width={"section"} className="h-full">
          <Holds position={"row"} className="h-full gap-2">
            <Holds size={"80"}>
              <Texts size={"p3"} className="font-semibold">
                Did you haul material?
              </Texts>
            </Holds>
            <Holds size={"20"} className="my-auto">
              <Buttons
                background={"green"}
                className="py-1.5"
                onClick={() => addTempMaterial()}
              >
                +
              </Buttons>
            </Holds>
          </Holds>
        </Contents>
      </Holds>
      <Holds
        className={`${
          isLoading
            ? "w-full h-full row-start-2 row-end-11 pt-5 animate-pulse"
            : "w-full h-full row-start-2 row-end-11 pt-5"
        }`}
      >
        <Holds
          background={"white"}
          className="w-full h-full  overflow-y-auto no-scrollbar"
        >
          <MaterialList
            material={material}
            setMaterial={setMaterial}
            materialOptions={materialOptions}
          />
        </Holds>
      </Holds>
    </Grids>
  );
}
