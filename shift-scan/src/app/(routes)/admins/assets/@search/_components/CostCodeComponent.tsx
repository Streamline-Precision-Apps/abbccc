"use client";
import { Buttons } from "@/components/(reusable)/buttons";
import { Grids } from "@/components/(reusable)/grids";
import { Holds } from "@/components/(reusable)/holds";
import { Images } from "@/components/(reusable)/images";
import { Inputs } from "@/components/(reusable)/inputs";
import { Selects } from "@/components/(reusable)/selects";
import { Texts } from "@/components/(reusable)/texts";
import { CostCodes } from "@/lib/types";
import { useRouter } from "next/navigation";
import { useState, useMemo, useCallback } from "react";

type Props = {
  costCodes: CostCodes[];
  setFilter: (filter: string) => void;
};

export const CostCodeComponent = ({ costCodes, setFilter }: Props) => {
  const [term, setTerm] = useState<string>("");
  // const [page, setPage] = useState(true);
  const router = useRouter();

  // Memoize the filtered list to avoid re-filtering on every render
  const filteredList = useMemo(() => {
    if (!term.trim()) return costCodes; // Return the full list if no term is entered

    return costCodes.filter((costCode) => {
      const name = costCode.name;
      return name.includes(term.toLowerCase());
    });
  }, [term, costCodes]);

  // Debounce handler to avoid rapid state updates on each keystroke
  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setTerm(e.target.value);
    },
    []
  );

  const selectCostCode = (costCode: CostCodes) => {
    setTerm(costCode.name);
    router.push(`/admins/assets/${costCode.id}`);
  };

  const createCostCode = () => {
    router.push(`/admins/assets/new-costCode`);
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
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
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
                  placeholder="Search costcodes by name"
                  value={term}
                  onChange={handleSearchChange}
                  className="border-none outline-none"
                />
              </Holds>
            </Holds>
            <Holds className=" h-full mb-4  overflow-y-auto no-scrollbar ">
              <Holds>
                {filteredList.length > 0 ? (
                  filteredList.map((costCode) => (
                    <Holds
                      key={costCode.id}
                      className="py-2 border-b"
                      onClick={() => selectCostCode(costCode)}
                    >
                      <Texts size="p6">
                        {costCode.name} - {costCode.description}
                      </Texts>
                    </Holds>
                  ))
                ) : (
                  <Texts size="p6" className="text-center">
                    No cost code found
                  </Texts>
                )}
              </Holds>
            </Holds>
          </>
        </Holds>

        {/* Create New CostCode Button */}
        <Buttons
          background="green"
          className="row-span-1 h-full"
          onClick={createCostCode}
        >
          <Texts size="p6">Create New Cost Code</Texts>
        </Buttons>
      </Grids>
    </Holds>
  );
};
