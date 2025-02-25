"use client";
import {
  deleteHaulingLogs,
  updateHaulingLogs,
} from "@/actions/truckingActions";
import { Contents } from "@/components/(reusable)/contents";
import { Holds } from "@/components/(reusable)/holds";
import { Inputs } from "@/components/(reusable)/inputs";
import { Selects } from "@/components/(reusable)/selects";
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
import { useDBJobsite } from "@/app/context/dbCodeContext";
import { JobCode } from "@/lib/types";
import { Buttons } from "@/components/(reusable)/buttons";
import SearchBar from "@/components/(search)/searchbar";
import { Texts } from "@/components/(reusable)/texts";
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

export default function MaterialList({
  material,
  setMaterial,
  materialOptions,
}: {
  material: Material[] | undefined;
  setMaterial: Dispatch<SetStateAction<Material[] | undefined>>;

  materialOptions: {
    value: string;
    label: string;
  }[];
}) {
  const { jobsiteResults } = useDBJobsite();

  // Local state to track changes
  const [editedMaterials, setEditedMaterials] = useState<Material[]>(
    material || []
  );

  const [isLocationOpen, setIsLocationOpen] = useState<boolean>(false);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [tempLocation, setTempLocation] = useState<string>(""); // Temporary state for modal
  const [tempLocationSelected, setTempLocationSelected] =
    useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState("");

  // Filtered options for job sites
  const filteredJobSites = jobsiteResults.filter(
    (jobsite) =>
      jobsite.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      jobsite.qrId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Update local state when prop changes
  useEffect(() => {
    setEditedMaterials(material || []);
  }, [material]);

  // Debounced server update function
  const updateHaulingLog = debounce(async (updatedMaterial: Material) => {
    const formData = new FormData();
    formData.append("id", updatedMaterial.id);
    formData.append("name", updatedMaterial.name || "");
    formData.append(
      "LocationOfMaterial",
      updatedMaterial.LocationOfMaterial || ""
    );
    formData.append("quantity", updatedMaterial.quantity?.toString() || "0");
    formData.append("truckingLogId", updatedMaterial.truckingLogId);

    await updateHaulingLogs(formData);
  }, 1000);

  // Handle Input Change
  const handleChange = (
    index: number,
    field: keyof Material,
    value: string | number
  ) => {
    const updatedMaterials = [...editedMaterials];
    if (updatedMaterials[index]) {
      updatedMaterials[index] = {
        ...updatedMaterials[index],
        [field]: value,
      };
      setEditedMaterials(updatedMaterials);
      setMaterial(updatedMaterials); // Sync with parent state

      // Trigger server action to update database
      updateHaulingLog(updatedMaterials[index]);
    }
  };

  // Handle Delete
  const handleDelete = async (materialId: string) => {
    const updatedMaterials = editedMaterials.filter(
      (material) => material.id !== materialId
    );
    setEditedMaterials(updatedMaterials);
    setMaterial(updatedMaterials); // Sync with parent state

    const isDeleted = await deleteHaulingLogs(materialId);

    if (!isDeleted) {
      alert("Failed to delete. Please try again.");
      setEditedMaterials(material || []);
      setMaterial(material);
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
        {editedMaterials.map((mat, index) => (
          <SlidingDiv key={mat.id} onSwipeLeft={() => handleDelete(mat.id)}>
            <Holds
              position={"row"}
              background={"white"}
              className="w-full h-full border-black border-[3px] rounded-[10px] mb-3 "
            >
              <Holds background={"white"} className="w-2/5 px-2">
                <Selects
                  value={mat.name || ""}
                  onChange={(e) => handleChange(index, "name", e.target.value)}
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

              <Holds
                background={"white"}
                className="w-2/5 h-full justify-center px-2 rounded-none border-black border-x-[3px]"
              >
                <Inputs
                  type="text"
                  placeholder="Location"
                  value={mat.LocationOfMaterial || ""}
                  onClick={() => {
                    setSelectedIndex(index);
                    setTempLocation(mat.LocationOfMaterial || ""); // Initialize temp state
                    setIsLocationOpen(true);
                  }}
                  className="border-none text-xs focus:outline-none cursor-pointer"
                  readOnly
                />
              </Holds>

              <Holds background={"white"} className="w-1/5">
                <Inputs
                  type="number"
                  placeholder="# Loads"
                  value={mat.quantity?.toString() || ""}
                  onChange={(e) =>
                    handleChange(
                      index,
                      "quantity",
                      parseInt(e.target.value, 10) || 0
                    )
                  }
                  className="border-none text-xs text-center h-full focus:outline-none "
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
              {filteredJobSites.map((option) => (
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
