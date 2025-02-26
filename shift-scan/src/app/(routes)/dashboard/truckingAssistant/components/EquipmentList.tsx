"use client";
import {
  deleteEquipmentHauled,
  updateHaulingLogs,
} from "@/actions/truckingActions";
import { Contents } from "@/components/(reusable)/contents";
import { Holds } from "@/components/(reusable)/holds";
import { Inputs } from "@/components/(reusable)/inputs";
import {
  ChangeEvent,
  Dispatch,
  SetStateAction,
  useEffect,
  useState,
} from "react";
import debounce from "lodash.debounce";
import SlidingDiv from "@/components/(animations)/slideDelete";
import { NModals } from "@/components/(reusable)/newmodals";
import { useDBEquipment } from "@/app/context/dbCodeContext";
import { JobCode } from "@/lib/types";
import { Buttons } from "@/components/(reusable)/buttons";
import SearchBar from "@/components/(search)/searchbar";
import { Grids } from "@/components/(reusable)/grids";
import { Titles } from "@/components/(reusable)/titles";

type Material = {
  name: string;
  id: string;
  LocationOfMaterial: string | null;
  truckingLogId: string;
  quantity: number | null;
  createdAt: Date;
};
type EquipmentHauled = {
  id: string;
  truckingLogId: string;
  equipmentId: string;
  createdAt: Date;
};

export default function EquipmentList({
  equipmentHauled,
  setEquipmentHauled,
}: {
  equipmentHauled: EquipmentHauled[] | undefined;
  setEquipmentHauled: Dispatch<SetStateAction<EquipmentHauled[] | undefined>>;
}) {
  const { equipmentResults } = useDBEquipment();

  // Local state to track changes
  const [editedEquipmentOptions, setEditedEquipmentOptions] = useState<
    EquipmentHauled[]
  >(equipmentHauled || []);

  const [isLocationOpen, setIsLocationOpen] = useState<boolean>(false);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [tempLocation, setTempLocation] = useState<string>(""); // Temporary state for modal
  const [tempLocationSelected, setTempLocationSelected] =
    useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState("");

  // Filtered options for job sites
  const filteredEquipment = equipmentResults.filter(
    (equipment) =>
      equipment.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      equipment.qrId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Update local state when prop changes
  useEffect(() => {
    setEquipmentHauled(equipmentHauled || []);
  }, [equipmentHauled]);

  // Debounced server update function
  const updateHaulingLog = debounce(
    async (updatedEquipmentHauled: EquipmentHauled) => {
      const formData = new FormData();
      formData.append("id", updatedEquipmentHauled.id);

      await updateHaulingLogs(formData);
    },
    1000
  );

  // Handle Input Change
  const handleChange = (
    index: number,
    field: keyof Material,
    value: string | number
  ) => {
    const updatedEquipmentHauled = [...editedEquipmentOptions];
    if (updatedEquipmentHauled[index]) {
      updatedEquipmentHauled[index] = {
        ...updatedEquipmentHauled[index],
        [field]: value,
      };
      setEditedEquipmentOptions(updatedEquipmentHauled);
      setEquipmentHauled(updatedEquipmentHauled); // Sync with parent state

      // Trigger server action to update database
      updateHaulingLog(updatedEquipmentHauled[index]);
    }
  };

  // Handle Delete
  const handleDelete = async (equipmentHauledId: string) => {
    const updatedEquipmentHauled = editedEquipmentOptions.filter(
      (equipmentHauled) => equipmentHauled.id !== equipmentHauledId
    );
    setEditedEquipmentOptions(updatedEquipmentHauled);
    setEquipmentHauled(updatedEquipmentHauled); // Sync with parent state

    const isDeleted = await deleteEquipmentHauled(equipmentHauledId);

    if (!isDeleted) {
      alert("Failed to delete. Please try again.");
      setEditedEquipmentOptions(equipmentHauled || []);
      setEquipmentHauled(equipmentHauled);
    }
  };

  // Handle Location Selection
  const handleLocationSelect = (option: JobCode) => {
    setTempLocation(option.name); // Set temporary location
    setTempLocationSelected(true);
  };
  const handleLocationUnselect = () => {
    setTempLocation(""); // Clear temporary location
    setTempLocationSelected(false);
  };

  // Handle Search Input Change
  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  // Handle Submit
  const handleSubmit = () => {
    if (selectedIndex !== null) {
      handleChange(selectedIndex, "LocationOfMaterial", tempLocation);
      setIsLocationOpen(false);
    }
  };

  // Handle Cancel
  const handleCancel = () => {
    setIsLocationOpen(false);
    setTempLocation(""); // Clear temporary state
    setTempLocationSelected(false);
    setSelectedIndex(null); // Clear selected index
  };

  return (
    <>
      <Contents className="overflow-y-auto no-scrollbar">
        {editedEquipmentOptions.map((mat, index) => (
          <SlidingDiv key={mat.id} onSwipeLeft={() => handleDelete(mat.id)}>
            <Holds
              position={"row"}
              background={"white"}
              className="w-full h-full border-black border-[3px] rounded-[10px] mb-3 "
            >
              <Holds
                background={"white"}
                className="w-1/2 px-2 border-black border-r-[1.5px]"
              >
                <Inputs
                  type="text"
                  placeholder="Equipment"
                  value={mat.equipmentId || ""}
                  onChange={(e) => handleChange(index, "name", e.target.value)}
                  className={"border-none text-xs py-2 focus:outline-none"}
                />
              </Holds>

              <Holds
                background={"white"}
                className="w-1/2 h-full justify-center px-2 rounded-none border-black border-l-[1.5px]"
              >
                <Inputs
                  type="text"
                  placeholder="Location"
                  value={""}
                  onClick={() => {
                    setSelectedIndex(index);
                    setTempLocation(""); // Initialize temp state
                    setIsLocationOpen(true);
                  }}
                  className="border-none text-xs focus:outline-none cursor-pointer"
                  readOnly
                />
              </Holds>
            </Holds>
          </SlidingDiv>
        ))}
      </Contents>

      {/* Location Modal */}
      <NModals size={"xlW"} isOpen={isLocationOpen} handleClose={handleCancel}>
        <Grids rows={"8"} gap={"3"} className="h-full">
          <Holds className="row-start-1 row-end-2 h-full">
            <SearchBar
              searchTerm={searchTerm}
              onSearchChange={handleSearchChange}
              placeholder="Type here"
              selected={!!tempLocation}
              clearSelection={() => setTempLocation("")}
              selectTerm={tempLocation}
            />
          </Holds>
          <Holds className="row-start-2 row-end-8 border-black border-[3px] rounded-[10px] h-full">
            <Holds className=" overflow-y-auto no-scrollbar p-4">
              {filteredEquipment.map((option) => (
                <Buttons
                  background={
                    tempLocation === option.name ? "green" : "lightBlue"
                  }
                  key={option.qrId}
                  onClick={() =>
                    tempLocation === option.name
                      ? handleLocationUnselect()
                      : handleLocationSelect(option)
                  }
                  className="w-full p-3 mb-4 text-left"
                >
                  <Titles size={"h6"}>
                    {" "}
                    {option.name} - ({option.qrId})
                  </Titles>
                </Buttons>
              ))}
            </Holds>
          </Holds>
          <Holds position={"row"} className="row-start-8 row-end-9 py-2 gap-4">
            <Buttons background={"green"} onClick={handleSubmit}>
              Submit
            </Buttons>
            <Buttons background={"red"} onClick={handleCancel}>
              Cancel
            </Buttons>
          </Holds>
        </Grids>
      </NModals>
    </>
  );
}
