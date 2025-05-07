"use client";
import {
  deleteEquipmentHauled,
  updateEquipmentLogsEquipment,
  updateEquipmentLogsLocation,
} from "@/actions/truckingActions";
import { Holds } from "@/components/(reusable)/holds";
import { Inputs } from "@/components/(reusable)/inputs";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import SlidingDiv from "@/components/(animations)/slideDelete";
import { Contents } from "@/components/(reusable)/contents";
import { useTranslations } from "next-intl";
import { Texts } from "@/components/(reusable)/texts";
import { NModals } from "@/components/(reusable)/newmodals";
import { EquipmentSelector } from "@/components/(clock)/(General)/equipmentSelector";
import { Buttons } from "@/components/(reusable)/buttons";
import { on } from "events";

type EquipmentHauled = {
  id: string;
  truckingLogId: string;
  equipmentId: string | null;
  createdAt: Date;
  jobSiteId: string | null;
  Equipment: {
    name: string;
  } | null;
  JobSite: {
    name: string;
  } | null;
};

type Option = {
  label: string;
  code: string;
};

export default function EquipmentList({
  equipmentHauled,
  setEquipmentHauled,
  truckingLog,
}: {
  equipmentHauled: EquipmentHauled[];
  setEquipmentHauled: Dispatch<SetStateAction<EquipmentHauled[] | undefined>>;
  truckingLog: string;
}) {
  const t = useTranslations("TruckingAssistant");
  const [isEquipmentOpen, setIsEquipmentOpen] = useState(false);
  const [isLocationOpen, setIsLocationOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState<string | null>(null);
  const [selectedEquipment, setSelectedEquipment] = useState<Option>({
    label: "",
    code: "",
  });

  const handleUpdateEquipment = async (equipment: Option | null) => {
    if (!selectedIndex || !equipment) return;

    try {
      const formData = new FormData();
      formData.append("id", selectedIndex);
      formData.append("truckingLogId", truckingLog);
      formData.append("equipmentId", equipment.code); // Use the passed equipment, not selectedEquipment
      formData.append("equipment", equipment.label); // Use the passed equipment, not selectedEquipment

      await updateEquipmentLogsEquipment(formData);

      // Update local state
      setEquipmentHauled((prev) =>
        prev
          ? prev.map((item) =>
              item.id === selectedIndex
                ? {
                    ...item,
                    Equipment: {
                      ...item.Equipment,
                      name: equipment.label,
                      qr: equipment.code,
                    },
                  }
                : item
            )
          : []
      );

      setIsEquipmentOpen(false);
      setSelectedIndex(null);
      setSelectedEquipment({ label: "", code: "" });
    } catch (error) {
      console.error(t("ErrorSubmittingData"), error);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteEquipmentHauled(id);
      setEquipmentHauled(
        (prevLogs) => prevLogs?.filter((log) => log.id !== id) ?? []
      );
    } catch (error) {
      console.error("Error deleting equipment log:", error);
    }
  };

  return (
    <>
      <Contents className="overflow-y-auto no-scrollbar">
        {equipmentHauled.length === 0 && (
          <Holds className="px-10 mt-4">
            <Texts size={"p5"} text={"gray"} className="italic">
              No Equipment Hauled Recorded
            </Texts>
            <Texts size={"p7"} text={"gray"}>
              {`(Tap the plus icon to add a log.)`}
            </Texts>
          </Holds>
        )}
        {equipmentHauled.map((mat: EquipmentHauled) => (
          <SlidingDiv key={mat.id} onSwipeLeft={() => handleDelete(mat.id)}>
            <Holds
              key={mat.id}
              position={"row"}
              background={"white"}
              className={`w-full h-full border-[3px] rounded-[10px] mb-3 border-black`}
            >
              <Holds
                background={"white"}
                className="w-1/2 h-full justify-center px-2 border-black rounded-r-none"
              >
                <Inputs
                  type="text"
                  placeholder="Equipment"
                  value={mat.Equipment?.name || ""}
                  onClick={() => {
                    setIsEquipmentOpen(true);
                    setSelectedIndex(mat.id);
                  }}
                  className={`border-none text-xs focus:outline-none cursor-pointer ${
                    mat.equipmentId === null && "placeholder:text-app-red"
                  }`}
                  readOnly
                />
              </Holds>

              <Holds
                background={"white"}
                className={`w-1/2 h-full justify-center px-2 rounded-l-none border-l-[3px] border-black`}
              >
                <Inputs
                  type="text"
                  placeholder="Location"
                  value={mat.JobSite?.name || ""}
                  onClick={() => {
                    setIsLocationOpen(true);
                    setSelectedIndex(mat.id);
                  }}
                  className={`border-none text-xs focus:outline-none cursor-pointer ${
                    mat.jobSiteId === null && "placeholder:text-app-red"
                  }`}
                  readOnly
                />
              </Holds>
            </Holds>
          </SlidingDiv>
        ))}

        <NModals
          size={"xlW"}
          background={"noOpacity"}
          isOpen={isEquipmentOpen}
          handleClose={() => setIsEquipmentOpen(false)}
        >
          <EquipmentSelector
            onEquipmentSelect={(equipment) => {
              if (equipment) {
                setSelectedEquipment(equipment); // Update the equipment state with the full Option object
              } else {
                setSelectedEquipment({ code: "", label: "" }); // Reset if null
              }
            }}
          />
          <Buttons
            onClick={() => {
              handleUpdateEquipment(selectedEquipment);
              setIsEquipmentOpen(false);
            }}
          />
        </NModals>

        <NModals
          size={"xlW"}
          background={"noOpacity"}
          isOpen={isLocationOpen}
          handleClose={() => setIsLocationOpen(false)}
        >
          {/* Location selector would go here */}
        </NModals>
      </Contents>
    </>
  );
}
