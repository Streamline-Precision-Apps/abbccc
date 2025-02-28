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
import { useDBEquipment, useDBJobsite } from "@/app/context/dbCodeContext";
import SelectableModal from "@/components/(reusable)/selectableModal";
import { Contents } from "@/components/(reusable)/contents";

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

type Option = {
  id: string;
  name: string;
  qrId: string;
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
  const { equipmentResults } = useDBEquipment();
  const { jobsiteResults } = useDBJobsite();
  const [editedEquipmentHauled, setEditedEquipmentHauled] =
    useState<EquipmentHauled[]>(equipmentHauled);
  // manageState and Modals
  const [isEquipmentOpen, setIsEquipmentOpen] = useState(false);
  const [isLocationOpen, setIsLocationOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState<string | null>(null);
  const [selectedEquipment, setSelectedEquipment] = useState<Option | null>(
    null
  );
  const [selectedLocation, setSelectedLocation] = useState<Option | null>(null);

  // handle select and update
  const handleSelectEquipment = (option: Option) => {
    setSelectedEquipment(option);

    if (selectedIndex) {
      const index = editedEquipmentHauled.findIndex(
        (item) => item.id === selectedIndex
      );

      if (index !== -1) {
        const updatedHauled = [...editedEquipmentHauled];
        updatedHauled[index] = {
          ...updatedHauled[index],
          equipmentId: option.id,
          equipment: {
            name: option.name, // Update the name here
          },
        };

        setEditedEquipmentHauled(updatedHauled);
        setEquipmentHauled(updatedHauled);
      }
    }
  };

  const handleSelectLocation = (option: Option) => {
    setSelectedLocation(option);

    if (selectedIndex) {
      const index = editedEquipmentHauled.findIndex(
        (item) => item.id === selectedIndex
      );

      if (index !== -1) {
        const updatedHauled = [...editedEquipmentHauled];
        updatedHauled[index] = {
          ...updatedHauled[index],
          jobSiteId: option.id,
          jobSite: {
            name: option.name, // Update the name here
          },
        };
        setEditedEquipmentHauled(updatedHauled);
        setEquipmentHauled(updatedHauled);
      }
    }
  };

  // handle delete, update, and create
  //delete
  const handleDelete = async (id: string) => {
    const updatedMaterials = editedEquipmentHauled.filter(
      (mat: EquipmentHauled) => mat.id !== id
    );
    setEditedEquipmentHauled(updatedMaterials);
    setEquipmentHauled(updatedMaterials);

    const isDeleted = await deleteEquipmentHauled(id);

    if (!isDeleted) {
      alert("Failed to delete. Please try again.");
      setEditedEquipmentHauled(equipmentHauled || []);
      setEquipmentHauled(equipmentHauled);
    }
  };

  const handleUpdateEquipment = async () => {
    try {
      // Create a FormData object
      const formData = new FormData();
      formData.append("id", selectedIndex?.toString() || "");
      formData.append("truckingLogId", truckingLog);
      formData.append(
        "equipmentId",
        selectedEquipment?.id || editedEquipmentHauled[0].equipmentId || ""
      );
      // Wait for the database update to complete
      await updateEquipmentLogsEquipment(formData);
      // Clear selections after successful submission
      setSelectedEquipment(null);
      setSelectedLocation(null);
      setSelectedIndex(null);
    } catch (error) {
      console.error("Error submitting data:", error);
    }
  };

  const handleUpdateLocation = async () => {
    try {
      // Create a FormData object
      const formData = new FormData();
      formData.append("id", selectedIndex?.toString() || "");
      formData.append("truckingLogId", truckingLog);
      formData.append(
        "jobSiteId",
        selectedLocation?.id || editedEquipmentHauled[0].jobSiteId || ""
      );

      // Wait for the database update to complete
      await updateEquipmentLogsLocation(formData);
      // Clear selections after successful submission
      setSelectedEquipment(null);
      setSelectedLocation(null);
      setSelectedIndex(null);
    } catch (error) {
      console.error("Error submitting data:", error);
    }
  };

  // reloads the sliding div
  useEffect(() => {
    setEditedEquipmentHauled(equipmentHauled || []);
  }, [equipmentHauled]);

  return (
    <>
      <Contents className="overflow-y-auto no-scrollbar">
        {editedEquipmentHauled.map((mat: EquipmentHauled) => (
          <SlidingDiv key={mat.id} onSwipeLeft={() => handleDelete(mat.id)}>
            <Holds
              key={mat.id}
              position={"row"}
              background={"white"}
              className="w-full h-full border-black border-[3px] rounded-[10px] mb-3  "
            >
              <Holds
                background={"white"}
                className="w-1/2  h-full justify-center  px-2 border-black rounded-r-none"
              >
                <Inputs
                  type="text"
                  placeholder="Equipment"
                  value={
                    selectedIndex === mat.id && selectedEquipment
                      ? selectedEquipment.name
                      : mat.equipment?.name || ""
                  }
                  onClick={() => {
                    setIsEquipmentOpen(true);
                    setSelectedIndex(mat.id);
                  }}
                  className={"border-none text-xs py-2 focus:outline-none "}
                  readOnly
                />
              </Holds>

              <Holds
                background={"white"}
                className="w-1/2 h-full justify-center px-2 rounded-l-none border-black border-l-[3px]"
              >
                <Inputs
                  type="text"
                  placeholder="Location"
                  value={
                    selectedIndex === mat.id && selectedLocation
                      ? selectedLocation.name
                      : mat.jobSite?.name || ""
                  }
                  onClick={() => {
                    setIsLocationOpen(true);
                    setSelectedIndex(mat.id);
                  }}
                  className="border-none text-xs focus:outline-none cursor-pointer"
                  readOnly
                />
              </Holds>
            </Holds>
          </SlidingDiv>
        ))}
        <SelectableModal
          isOpen={isEquipmentOpen}
          handleSave={() => {
            handleUpdateEquipment();
            setIsEquipmentOpen(false);
          }}
          handleClose={() => setIsEquipmentOpen(false)}
          handleCancel={() => setSelectedEquipment(null)}
          selectedValue={selectedEquipment ? selectedEquipment.name : ""}
          options={equipmentResults}
          onSelect={handleSelectEquipment}
          placeholder="Search Equipment"
        />

        <SelectableModal
          isOpen={isLocationOpen}
          handleSave={() => {
            handleUpdateLocation();
            setIsLocationOpen(false);
          }}
          handleCancel={() => setSelectedLocation(null)}
          handleClose={() => setIsLocationOpen(false)}
          selectedValue={selectedLocation ? selectedLocation.name : ""}
          options={jobsiteResults}
          onSelect={handleSelectLocation}
          placeholder="Search Equipment"
        />
      </Contents>
    </>
  );
}
