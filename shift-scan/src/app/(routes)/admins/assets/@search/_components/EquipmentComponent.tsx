"use client";
import { Buttons } from "@/components/(reusable)/buttons";
import { Grids } from "@/components/(reusable)/grids";
import { Holds } from "@/components/(reusable)/holds";
import { Images } from "@/components/(reusable)/images";
import { Inputs } from "@/components/(reusable)/inputs";
import { Selects } from "@/components/(reusable)/selects";
import { Texts } from "@/components/(reusable)/texts";
import { Equipment } from "@/lib/types";
import { useRouter } from "next/navigation";
import { useState, useMemo, useCallback } from "react";

type Props = {
  equipments: Equipment[];
  setFilter: (filter: string) => void;
};

export const EquipmentComponent = ({ equipments, setFilter }: Props) => {
  const [term, setTerm] = useState<string>("");
  // const [page, setPage] = useState(true);
  const router = useRouter();

  // Memoize the filtered list to avoid re-filtering on every render
  const filteredList = useMemo(() => {
    if (!term.trim()) return equipments; // Return the full list if no term is entered

    return equipments.filter((equipment) => {
      const name = equipment.name;
      return name.includes(term.toLowerCase());
    });
  }, [term, equipments]);

  // Debounce handler to avoid rapid state updates on each keystroke
  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setTerm(e.target.value);
    },
    []
  );

  const selectEquipment = (equipment: Equipment) => {
    setTerm(equipment.name);
    router.push(`/admins/assets/${equipment.id}`);
  };

  const createEquipment = () => {
    router.push(`/admins/assets/new-equipment`);
  };

  return (
    <Holds className="h-full w-full">
      <Grids rows="10" gap="5" className="h-full">
        <Holds className=" bg-white h-full w-full  ">
          <Selects
            defaultValue={"all"}
            onChange={(e) => setFilter(e.target.value)}
            className="w-full px-0 py-2 text-center"
            // onClick={() => setPage(!page)}
          >
            <option value="all">Select Filter</option>
            <option value="all">All</option>
            <option value="Temporary">Temporary</option>
            <option value="needsRepair">Needs Repair</option>
            <option value="truck">Truck</option>
            <option value="trailer">Trailer</option>
            <option value="equipment">Equipment</option>
            <option value="vehicle">Vehicle</option>
          </Selects>
        </Holds>
        {/* Search Input Section */}
        <Holds className="row-span-8 h-full border-[3px] border-black rounded-t-[10px]">
          <>
            <Holds
              position={"row"}
              className="py-2 border-b-[3px] border-black"
            >
              <Holds className="h-full w-[20%]">
                <Images titleImg="/magnifyingGlass.svg" titleImgAlt="search" />
              </Holds>
              <Holds className="w-[80%]">
                <Inputs
                  type="search"
                  placeholder="Search equipments by name"
                  value={term}
                  onChange={handleSearchChange}
                  className="border-none outline-none"
                />
              </Holds>
            </Holds>
            <Holds className=" h-full mb-4  overflow-y-auto no-scrollbar ">
              <Holds>
                {filteredList.length > 0 ? (
                  filteredList.map((equipment) => (
                    <Holds
                      key={equipment.id}
                      className="py-2 border-b"
                      onClick={() => selectEquipment(equipment)}
                    >
                      <Texts size="p6">
                        {equipment.qrId} - {equipment.name}
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
        </Holds>

        {/* Create New Equipment Button */}
        <Buttons
          background="green"
          className="row-span-1 h-full"
          onClick={createEquipment}
        >
          <Texts size="p6">Create New Equipment</Texts>
        </Buttons>
      </Grids>
    </Holds>
  );
};
