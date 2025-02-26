import { Buttons } from "@/components/(reusable)/buttons";
import { Contents } from "@/components/(reusable)/contents";
import { Grids } from "@/components/(reusable)/grids";
import { Holds } from "@/components/(reusable)/holds";
import Sliders from "@/components/(reusable)/sliders";
import { Dispatch, SetStateAction, useState } from "react";
import MaterialList from "./MaterialList";
import {
  createEquipmentHauled,
  createHaulingLogs,
} from "@/actions/truckingActions";
import EquipmentList from "./EquipmentList";
import { add } from "date-fns";
import { createEquipment } from "@/actions/equipmentActions";
type EquipmentHauled = {
  id: string;
  truckingLogId: string;
  equipmentId: string;
  createdAt: Date;
};

type Material = {
  name: string;
  id: string;
  LocationOfMaterial: string | null;
  truckingLogId: string;
  quantity: number | null;
  createdAt: Date;
};

export default function HaulingLogs({
  equipmentHauled,
  setEquipmentHauled,
  material,
  setMaterial,
  truckingLog,
  triggerMaterial,
  triggerEquipment,
}: {
  equipmentHauled: EquipmentHauled[] | undefined;
  setEquipmentHauled: Dispatch<SetStateAction<EquipmentHauled[] | undefined>>;
  material: Material[] | undefined;
  setMaterial: Dispatch<SetStateAction<Material[] | undefined>>;
  truckingLog: string | undefined;
  triggerMaterial: () => void;
  triggerEquipment: () => void;
}) {
  const [activeTab, setActiveTab] = useState<number>(1);

  const addTempEquipmentList = async () => {
    const formData = new FormData();
    formData.append("truckingLogId", truckingLog ?? "");
    const tempEquipment = await createEquipmentHauled(formData);
    setEquipmentHauled((prev) => [
      ...(prev ?? []),
      {
        id: tempEquipment.id,
        truckingLogId: tempEquipment.truckingLogId,
        equipmentId: "",
        createdAt: new Date(),
      },
    ]);
    triggerEquipment();
  };

  const addTempMaterial = async () => {
    const formData = new FormData();
    formData.append("truckingLogId", truckingLog ?? "");

    const tempMaterial = await createHaulingLogs(formData);
    setMaterial((prev) => [
      ...(prev ?? []),
      {
        id: tempMaterial.id,
        name: "",
        LocationOfMaterial: "",
        truckingLogId: tempMaterial.truckingLogId,
        quantity: null,
        loadType: null,
        LoadWeight: null,
        createdAt: new Date(),
      },
    ]);
    triggerMaterial();
  };

  const materialOptions = [
    { value: "Material 1", label: "Material 1" },
    { value: "Material 2", label: "Material 2" },
    { value: "Material 3", label: "Material 3" },
  ];

  return (
    <>
      <Holds
        background={"white"}
        className="w-full h-full rounded-t-none row-start-2 row-end-3 "
      >
        <Contents width={"section"} className="h-full">
          <Holds position={"row"} className="h-full gap-2">
            <Holds size={"80"}>
              <Sliders
                leftTitle={"Material"}
                rightTitle={"Equipment"}
                activeTab={activeTab}
                setActiveTab={setActiveTab}
              />
            </Holds>
            <Holds size={"20"} className="my-auto">
              <Buttons
                background={"green"}
                className="py-1.5"
                onClick={
                  activeTab === 1
                    ? addTempMaterial
                    : activeTab === 2
                    ? addTempEquipmentList
                    : () => {}
                }
              >
                +
              </Buttons>
            </Holds>
          </Holds>
        </Contents>
      </Holds>
      <Holds className="w-full h-full row-start-3 row-end-11 pt-5">
        <Holds background={"white"} className="w-full h-full">
          <Grids rows={"10"} className="h-full py-2 px-4 ">
            {activeTab === 1 && (
              <Holds className="h-full w-full row-start-1 row-end-11 p-2 overflow-y-auto no-scrollbar">
                <MaterialList
                  material={material}
                  setMaterial={setMaterial}
                  materialOptions={materialOptions}
                />
              </Holds>
            )}
            {activeTab === 2 && (
              <>
                <Holds className="h-full w-full row-start-1 row-end-11">
                  <EquipmentList
                    equipmentHauled={equipmentHauled}
                    setEquipmentHauled={setEquipmentHauled}
                  />
                </Holds>
              </>
            )}
          </Grids>
        </Holds>
      </Holds>
    </>
  );
}
