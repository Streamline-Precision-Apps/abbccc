import { Buttons } from "@/components/(reusable)/buttons";
import { Contents } from "@/components/(reusable)/contents";
import { Grids } from "@/components/(reusable)/grids";
import { Holds } from "@/components/(reusable)/holds";
import Sliders from "@/components/(reusable)/sliders";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import MaterialList from "./MaterialList";
import {
  createEquipmentHauled,
  createHaulingLogs,
} from "@/actions/truckingActions";
import EquipmentList from "./EquipmentList";
import { m } from "framer-motion";

type EquipmentHauled = {
  id: string;
  truckingLogId: string;
  equipmentId: string | null;
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
  truckingLog,
}: {
  truckingLog: string | undefined;
}) {
  const [activeTab, setActiveTab] = useState<number>(1);
  const [material, setMaterial] = useState<Material[]>();
  const [equipmentHauled, setEquipmentHauled] = useState<EquipmentHauled[]>();

  // Material - Only when timeSheetId is available
  useEffect(() => {
    const fetchMaterial = async () => {
      try {
        console.log("Fetching Material Hauled...");
        const res = await fetch(`/api/getTruckingLogs/material/${truckingLog}`);
        if (!res.ok) throw new Error("Failed to fetch Material");
        const data = await res.json();
        setMaterial(data);
        console.log(material);
      } catch (error) {
        console.error("Error fetching Material:", error);
      }
    };

    fetchMaterial();
  }, [truckingLog]); // Run only when timeSheetId changes

  // Equipment Hauled - Only when timeSheetId is available
  useEffect(() => {
    const fetchEquipmentHauled = async () => {
      try {
        console.log("Fetching Equipment Hauled...");
        const res = await fetch(
          `/api/getTruckingLogs/equipmentHauled/${truckingLog}`
        );
        if (!res.ok) throw new Error("Failed to fetch Equipment Hauled");
        const data = await res.json();
        setEquipmentHauled(data);
        console.log(equipmentHauled);
      } catch (error) {
        console.error("Error fetching Equipment Hauled:", error);
      }
    };

    fetchEquipmentHauled();
  }, [truckingLog]); // Run only when timeSheetId changes

  // Add Temporary Equipment
  const addTempEquipmentList = async () => {
    const formData = new FormData();
    formData.append("truckingLogId", truckingLog ?? "");

    try {
      const tempEquipment = await createEquipmentHauled(formData);
      setEquipmentHauled((prev) => [
        ...(prev ?? []),
        {
          id: tempEquipment.id,
          truckingLogId: tempEquipment.truckingLogId ?? null,
          equipmentId: tempEquipment.equipmentId ?? null,
          createdAt: new Date(),
        },
      ]);
    } catch (error) {
      console.error("Error adding Equipment:", error);
    }
  };

  // Add Temporary Material
  const addTempMaterial = async () => {
    const formData = new FormData();
    formData.append("truckingLogId", truckingLog ?? "");

    try {
      const tempMaterial = await createHaulingLogs(formData);
      setMaterial((prev) => [
        ...(prev ?? []),
        {
          id: tempMaterial.id,
          name: "",
          LocationOfMaterial: "",
          truckingLogId: tempMaterial.truckingLogId,
          quantity: null,
          createdAt: new Date(),
        },
      ]);
    } catch (error) {
      console.error("Error adding Material:", error);
    }
  };

  // Material Options for Dropdown
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
              {activeTab === 1 ? (
                <Buttons
                  background={"green"}
                  className="py-1.5"
                  onClick={() => addTempMaterial()}
                >
                  +
                </Buttons>
              ) : (
                <Buttons
                  background={"green"}
                  className="py-1.5"
                  onClick={() => addTempEquipmentList()}
                >
                  +
                </Buttons>
              )}
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
              <Holds className="h-full w-full row-start-1 row-end-11 relative">
                <Contents className="overflow-y-auto no-scrollbar">
                  <EquipmentList
                    equipmentHauled={equipmentHauled || []}
                    setEquipmentHauled={setEquipmentHauled}
                  />
                </Contents>
              </Holds>
            )}
          </Grids>
        </Holds>
      </Holds>
    </>
  );
}
