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
  deleteEquipmentHauled,
} from "@/actions/truckingActions";
import EquipmentList from "./EquipmentList";
import { useTranslations } from "next-intl";
import MaterialItem from "./MaterialItem";

type EquipmentHauled = {
  id: string;
  truckingLogId: string | null;
  equipmentId: string | null;
  createdAt: Date;
  source: string | null;
  destination: string | null;
  Equipment: {
    id: string;
    name: string;
  } | null;
  JobSite: {
    id: string;
    name: string;
  } | null;
  startMileage: number | null;
  endMileage: number | null;
};

type Material = {
  id: string;
  truckingLogId: string;
  LocationOfMaterial: string | null;
  name: string;
  quantity: number | null;
  unit: string;
  loadType: LoadType | null;
  createdAt: Date;
};

enum LoadType {
  UNSCREENED,
  SCREENED,
}

export default function HaulingLogs({
  truckingLog,
  material,
  setMaterial,
  equipmentHauled,
  setEquipmentHauled,
  isLoading,
  isComplete,
}: {
  setMaterial: React.Dispatch<React.SetStateAction<Material[] | undefined>>;
  setEquipmentHauled: Dispatch<SetStateAction<EquipmentHauled[] | undefined>>;
  truckingLog: string | undefined;
  material: Material[] | undefined;
  equipmentHauled: EquipmentHauled[] | undefined;
  isLoading: boolean;
  isComplete: {
    haulingLogsTab: boolean;
    notesTab: boolean;
    stateMileageTab: boolean;
    refuelLogsTab: boolean;
  };
}) {
  const t = useTranslations("TruckingAssistant");
  const [activeTab, setActiveTab] = useState<number>(1);
  const [contentView, setContentView] = useState<"Item" | "List">("List");
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);

  // Add Temporary Equipment
  const addTempEquipmentList = async () => {
    const formData = new FormData();
    formData.append("truckingLogId", truckingLog ?? "");

    try {
      const tempEquipment = await createEquipmentHauled(formData);
      setEquipmentHauled((prev) => [
        {
          id: tempEquipment.id,
          truckingLogId: tempEquipment.truckingLogId,
          equipmentId: tempEquipment.equipmentId ?? null,
          source: "",
          destination: "",
          createdAt: new Date(),
          Equipment: {
            id: "",
            name: "",
          },
          JobSite: {
            id: "",
            name: "",
          },
          startMileage: null,
          endMileage: null,
        },
        ...(prev ?? []),
      ]);
    } catch (error) {
      console.error(t("ErrorAddingEquipment"), error);
    }
  };

  // Add Temporary Material
  const addTempMaterial = async () => {
    const formData = new FormData();
    formData.append("truckingLogId", truckingLog ?? "");
    formData.append("name", "Material");
    formData.append("quantity", "1");

    try {
      const tempMaterial = await createHaulingLogs(formData);
      setMaterial((prev) => [
        {
          id: tempMaterial.id,
          name: tempMaterial.name ?? "Material",
          LocationOfMaterial: "",
          truckingLogId: tempMaterial.truckingLogId,
          quantity: tempMaterial.quantity,
          unit: "",
          loadType: null,
          createdAt: tempMaterial.createdAt ?? new Date(),
        },
        ...(prev ?? []),
      ]);
    } catch (error) {
      console.error(t("ErrorAddingMaterial"), error);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteEquipmentHauled(id);
      setEquipmentHauled(
        (prevLogs) => prevLogs?.filter((log) => log.id !== id) ?? [],
      );
    } catch (error) {
      console.error("Error deleting equipment log:", error);
    }
  };

  return (
    <Grids rows={"7"} gap={"5"} className="h-full">
      <Holds
        background={"white"}
        className={"w-full h-full rounded-t-none row-start-1 row-end-2"}
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
              ) : equipmentHauled?.length === 0 ? (
                <Buttons
                  background={"green"}
                  className="py-1.5"
                  onClick={() => addTempEquipmentList()}
                >
                  +
                </Buttons>
              ) : (
                <Buttons
                  background={"red"}
                  className="py-1.5"
                  onClick={() => {
                    if (equipmentHauled && equipmentHauled.length > 0) {
                      handleDelete(equipmentHauled[0].id);
                    }
                  }}
                >
                  -
                </Buttons>
              )}
            </Holds>
          </Holds>
        </Contents>
      </Holds>
      <Holds
        className={`${
          isLoading
            ? "w-full h-full row-start-2 row-end-8  animate-pulse"
            : "w-full h-full row-start-2 row-end-8 overflow-y-auto no-scrollbar "
        }`}
      >
        <Holds background={"white"} className="w-full h-full">
          <Grids rows={"10"} className="h-full pt-3 pb-5  relative">
            {activeTab === 1 && (
              <Holds
                background={"white"}
                className="h-full w-full row-start-1 row-end-11"
              >
                {contentView === "Item" ? (
                  <MaterialItem
                    material={material}
                    setMaterial={setMaterial}
                    setContentView={setContentView}
                    selectedItemId={selectedItemId}
                    setSelectedItemId={setSelectedItemId}
                  />
                ) : (
                  contentView === "List" && (
                    <MaterialList
                      material={material}
                      setMaterial={setMaterial}
                      setContentView={setContentView}
                      setSelectedItemId={setSelectedItemId}
                    />
                  )
                )}
              </Holds>
            )}
            {activeTab === 2 && (
              <Holds className="h-full w-full row-start-1 row-end-11 relative">
                <EquipmentList
                  equipmentHauled={equipmentHauled || []}
                  setEquipmentHauled={setEquipmentHauled}
                  truckingLog={truckingLog ?? ""}
                />
              </Holds>
            )}
          </Grids>
        </Holds>
      </Holds>
    </Grids>
  );
}
