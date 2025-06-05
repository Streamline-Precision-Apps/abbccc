"use client";
import { Holds } from "@/components/(reusable)/holds";
import {
  ChangeEvent,
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
import Spinner from "@/components/(animations)/spinner";

export default function EquipmentSideBar({
  assets,
  setAssets,
  equipments,
  setSelectEquipment,
  selectEquipment,
  hasUnsavedChanges = false,
  setEquipmentUIState,
  equipmentUIState,
  setHasUnsavedChanges,
  loading,
}: {
  assets: string;
  setAssets: React.Dispatch<
    React.SetStateAction<"Equipment" | "CostCode" | "Jobsite">
  >;
  equipments: EquipmentSummary[];
  setSelectEquipment: (equipment: EquipmentSummary | null) => void;
  selectEquipment: Equipment | null;
  isRegistrationFormOpen: boolean;
  setIsRegistrationFormOpen: Dispatch<SetStateAction<boolean>>;
  hasUnsavedChanges?: boolean;
  setEquipmentUIState: Dispatch<
    SetStateAction<"idle" | "creating" | "editing">
  >;
  equipmentUIState: "idle" | "creating" | "editing";
  setHasUnsavedChanges: Dispatch<SetStateAction<boolean>>;
  loading: boolean;
}) {
  const [term, setTerm] = useState("");

  // Handle equipment selection with toggle functionality
  const handleEquipmentClick = useCallback(
    (equipment: EquipmentSummary) => {
      // If the clicked equipment is already selected, deselect it
      if (selectEquipment?.id === equipment.id) {
        setSelectEquipment(null);
        setEquipmentUIState("idle");
      } else {
        // Otherwise, select the new equipment
        setSelectEquipment(equipment);
        setEquipmentUIState("editing");
      }
    },
    [selectEquipment, setSelectEquipment, setEquipmentUIState]
  );

  const filteredEquipments = useMemo(() => {
    // Create a sorted copy of the original array with PENDING items first
    const sortedEquipments = [...equipments].sort((a, b) => {
      // First sort by approval status (PENDING first)
      if (a.approvalStatus === "PENDING" && b.approvalStatus !== "PENDING") {
        return -1; // a comes before b
      } else if (
        a.approvalStatus !== "PENDING" &&
        b.approvalStatus === "PENDING"
      ) {
        return 1; // b comes before a
      }

      // Then sort alphabetically by name
      return a.name.localeCompare(b.name);
    });

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

  const handleSearchChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setTerm(e.target.value);
  }, []);

  return (
    <>
      <SearchBar
        term={term}
        handleSearchChange={(e) => {
          handleSearchChange(e);
        }}
        disabled={loading}
        placeholder={"Search for equipment here..."}
      />
      <Holds
        background={"white"}
        className={`${
          loading && "animate-pulse"
        } w-full h-full row-span-2 rounded-[10px] p-3 overflow-y-auto no-scrollbar`}
      >
        {loading ? (
          <Holds className="h-full w-full justify-center items-center">
            <Spinner />
          </Holds>
        ) : (
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
        )}
      </Holds>
    </>
  );
}
