"use client";
import { Holds } from "@/components/(reusable)/holds";
import {
  Dispatch,
  SetStateAction,
  useCallback,
  useMemo,
  useState,
} from "react";
import SearchBar from "../../../personnel/components/SearchBar";
import { Texts } from "@/components/(reusable)/texts";

type Equipment = {
  id: string;
  qrId: string;
  name: string;
  description?: string;
  equipmentTag: string;
  status?: string;
  isActive: boolean;
  inUse: boolean;
  overWeight: boolean;
  currentWeight: number;
  equipmentVehicleInfo?: {
    make: string | null;
    model: string | null;
    year: string | null;
    licensePlate: string | null;
    registrationExpiration: Date | null;
    mileage: number | null;
  };
};

export default function EquipmentSideBar({
  assets,
  setAssets,
  equipments,
  setSelectEquipment,
  selectEquipment,
}: {
  assets: string;
  setAssets: Dispatch<SetStateAction<string>>;
  equipments: Equipment[];
  setSelectEquipment: Dispatch<SetStateAction<Equipment | null>>;
  selectEquipment: Equipment | null;
  isRegistrationFormOpen: boolean;
  setIsRegistrationFormOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const [term, setTerm] = useState("");

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
              <Holds
                key={equipment.id}
                className="py-3 "
                onClick={() => setSelectEquipment(equipment)}
              >
                <Texts position={"left"} className="pl-4" size="xs">
                  {`${equipment.name.slice(0, 30)} (${equipment.id})`}
                </Texts>
              </Holds>
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
