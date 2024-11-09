"use client";
import { Buttons } from "@/components/(reusable)/buttons";

import { Grids } from "@/components/(reusable)/grids";
import { Holds } from "@/components/(reusable)/holds";
import { Images } from "@/components/(reusable)/images";
import { Inputs } from "@/components/(reusable)/inputs";
import { Options } from "@/components/(reusable)/options";
import { Selects } from "@/components/(reusable)/selects";
import { Texts } from "@/components/(reusable)/texts";
import { SearchUser } from "@/lib/types";
import { useRouter } from "next/navigation";
import { useState, useMemo, useCallback } from "react";

type Props = {
  employees: SearchUser[];
};

export const Personnel = ({ employees }: Props) => {
  const [term, setTerm] = useState<string>("");
  const router = useRouter();

  // Memoize the filtered list to avoid re-filtering on every render
  const filteredList = useMemo(() => {
    if (!term.trim()) return employees; // Return the full list if no term is entered

    return employees.filter((employee) => {
      const name = `${employee.firstName} ${employee.lastName}`.toLowerCase();
      return name.includes(term.toLowerCase());
    });
  }, [term, employees]);

  // Debounce handler to avoid rapid state updates on each keystroke
  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setTerm(e.target.value);
    },
    []
  );

  const selectEmployee = (employee: SearchUser) => {
    setTerm(employee.firstName + " " + employee.lastName);
    router.push(`/admins/personnel/${employee.id}`);
  };

  return (
    <Holds className="h-full w-full">
      <Grids rows="10" gap="5" className="h-full">
        {/* Search Input Section */}
        <Holds className="row-span-8 h-full border-[3px] border-black rounded-t-[10px]">
          <Holds position={"row"} className="py-2 border-b-[3px] border-black">
            <Holds className="h-full w-[20%]">
              <Images titleImg="/magnifyingGlass.svg" titleImgAlt="search" />
            </Holds>
            <Holds className="w-[80%]">
              <Inputs
                type="search"
                placeholder="Search employees by name"
                value={term}
                onChange={handleSearchChange}
                className="border-none outline-none"
              />
            </Holds>
          </Holds>
          <Holds className=" h-full mb-4  overflow-y-auto ">
            <Holds>
              {filteredList.length > 0 ? (
                filteredList.map((employee) => (
                  <Holds
                    key={employee.id}
                    className="py-2 border-b"
                    onClick={() => selectEmployee(employee)}
                  >
                    <Texts size="p6">
                      {employee.firstName} {employee.lastName}
                    </Texts>
                  </Holds>
                ))
              ) : (
                <Texts size="p6" className="text-center">
                  No employees found
                </Texts>
              )}
            </Holds>
          </Holds>
        </Holds>

        {/* Create New Employee Button */}
        <Buttons background="green" className="row-span-1 h-full ">
          <Texts size="p6">Create New Employee</Texts>
        </Buttons>
      </Grids>
    </Holds>
  );
};
