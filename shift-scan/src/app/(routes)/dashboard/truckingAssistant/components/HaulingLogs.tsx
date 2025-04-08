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
import { useTranslations } from "next-intl";

type EquipmentHauled = {
  id: string;
  truckingLogId: string;
  equipmentId: string | null;
  createdAt: Date;
  jobSiteId: string | null;
  equipment: {
    name: string | null;
  };
  jobSite: {
    name: string | null;
  };
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
  material,
  setMaterial,
  equipmentHauled,
  setEquipmentHauled,
  isLoading,
}: {
  setMaterial: React.Dispatch<React.SetStateAction<Material[] | undefined>>;
  setEquipmentHauled: Dispatch<SetStateAction<EquipmentHauled[] | undefined>>;
  truckingLog: string | undefined;
  material: Material[] | undefined;
  equipmentHauled: EquipmentHauled[] | undefined;
  isLoading: boolean;
}) {
  const t = useTranslations("TruckingAssistant");
  const [activeTab, setActiveTab] = useState<number>(1);

  // Add Temporary Equipment
  const addTempEquipmentList = async () => {
    const formData = new FormData();
    formData.append("truckingLogId", truckingLog ?? "");

    try {
      const tempEquipment = await createEquipmentHauled(formData);
      setEquipmentHauled((prev) => [
        {
          id: tempEquipment.id,
          truckingLogId: tempEquipment.truckingLogId ?? null,
          equipmentId: tempEquipment.equipmentId ?? null,
          jobSiteId: tempEquipment.jobSiteId ?? null,
          createdAt: new Date(),
          equipment: {
            name: "",
          },
          jobSite: {
            name: "",
          },
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
      console.error(t("ErrorAddingMaterial"), error);
    }
  };

  return (
    <>
      <Holds
        background={"white"}
        className={"w-full h-full rounded-t-none row-start-2 row-end-3 "}
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
      <Holds
        className={`${
          isLoading
            ? "w-full h-full row-start-3 row-end-11 pt-5 animate-pulse"
            : "w-full h-full row-start-3 row-end-11 pt-5"
        }`}
      >
        <Holds background={"white"} className="w-full h-full">
          <Grids rows={"10"} className="h-full py-2 px-4 ">
            {activeTab === 1 && (
              <Holds className="h-full w-full row-start-1 row-end-11 overflow-y-auto no-scrollbar">
                <MaterialList material={material} setMaterial={setMaterial} />
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
    </>
  );
}
