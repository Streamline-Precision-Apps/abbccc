"use client";
import { Holds } from "@/components/(reusable)/holds";
import {
  Dispatch,
  SetStateAction,
  useCallback,
  useMemo,
  useState,
} from "react";
import SearchBar from "../../../../personnel/components/SearchBar";
import { Texts } from "@/components/(reusable)/texts";
import EquipmentRow from "./EquipmentRow";
import { Equipment, EquipmentSummary } from "../../../types";

export default function EquipmentSideBar({
  assets,
  setAssets,
  equipments,
  setSelectEquipment,
  selectEquipment,
  hasUnsavedChanges = false,
}: {
  assets: string;
  setAssets: Dispatch<SetStateAction<string>>;
  equipments: EquipmentSummary[];
  setSelectEquipment: (equipment: EquipmentSummary | null) => void;
  selectEquipment: Equipment | null;
  isRegistrationFormOpen: boolean;
  setIsRegistrationFormOpen: React.Dispatch<React.SetStateAction<boolean>>;
  hasUnsavedChanges?: boolean;
}) {
  const [term, setTerm] = useState("");

  // Handle equipment selection with toggle functionality
  const handleEquipmentClick = useCallback(
    (equipment: EquipmentSummary) => {
      // If the clicked equipment is already selected, deselect it
      if (selectEquipment?.id === equipment.id) {
        setSelectEquipment(null);
      } else {
        // Otherwise, select the new equipment
        setSelectEquipment(equipment);
      }
    },
    [selectEquipment, setSelectEquipment]
  );

  const filteredEquipments = useMemo(() => {
    // Create a sorted copy of the original array
    const sortedEquipments = [...equipments].sort((a, b) =>
      a.name.localeCompare(b.name)
    );

    // Early return if search term is empty
    if (!term.trim()) {
      return sortedEquipments;
    }

    const searchTerm = term.toLowerCase();

    return sortedEquipments.filter((equipment) => {
      // Case-insensitive search
      return equipment.name.toLowerCase().includes(searchTerm);
    });
  }, [term, equipments]);

  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setTerm(e.target.value);
    },
    []
  );

  return (
    <>
      <SearchBar
        term={term}
        handleSearchChange={(e) => {
          handleSearchChange(e);
        }}
        placeholder={"Search for equipment here..."}
      />
      <Holds
        background={"white"}
        className="w-full h-full row-span-2 rounded-[10px] p-3 overflow-y-auto no-scrollbar"
      >
        <Holds>
          {filteredEquipments.length > 0 ? (
            filteredEquipments.map((equipment) => (
              <EquipmentRow
                key={equipment.id}
                equipment={equipment}
                isSelected={selectEquipment?.id === equipment.id}
                onEquipmentClick={handleEquipmentClick}
                hasUnsavedChanges={hasUnsavedChanges}
              />
            ))
          ) : (
            <Texts size="p6" className="text-center">
              No equipment found
            </Texts>
          )}
        </Holds>
      </Holds>
    </>
  );
}
