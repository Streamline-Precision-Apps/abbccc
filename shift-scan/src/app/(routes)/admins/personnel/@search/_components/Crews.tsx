"use client";
import { Buttons } from "@/components/(reusable)/buttons";
import { Grids } from "@/components/(reusable)/grids";
import { Holds } from "@/components/(reusable)/holds";
import { Images } from "@/components/(reusable)/images";
import { Inputs } from "@/components/(reusable)/inputs";
import { Texts } from "@/components/(reusable)/texts";
import { SearchCrew } from "@/lib/types";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useCallback, useMemo, useState } from "react";
type Props = {
  crew: SearchCrew[];
};

export const Crews = ({ crew }: Props) => {
  const t = useTranslations("Admins");
  const [term, setTerm] = useState<string>("");

  const router = useRouter();

  const filteredList = useMemo(() => {
    if (!term.trim()) {
      return [...crew].sort((a, b) => a.name.localeCompare(b.name));
    } // Return the full list if no term is entered

    return crew
      .filter((c) => {
        const name = `${c.name}`.toLowerCase();
        return name.includes(term.toLowerCase());
      })
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [term, crew]);

  // Debounce handler to avoid rapid state updates on each keystroke
  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setTerm(e.target.value);
    },
    []
  );

  const selectCrew = (crew: SearchCrew) => {
    setTerm(`${crew.name} `);

    router.push(`/admins/personnel/crew/${crew.id}`);
  };

  const createCrew = () => {
    router.push(`/admins/personnel/crew/new-crew`);
  };
  return (
    <Holds className="h-full w-full">
      <Grids rows="10" gap="5" className="h-full py-5">
        {/* Search Input Section */}
        <Holds className="row-span-10 h-full border-[3px]  border-black rounded-t-[10px]">
          <Holds position={"row"} className="py-2 border-b-[3px] border-black">
            <Holds className="h-full w-[20%]">
              <Images titleImg="/searchLeft.svg" titleImgAlt="search" />
            </Holds>
            <Holds className="w-[80%]">
              <Inputs
                type="search"
                placeholder={t("CrewsSearchPlaceholder")}
                value={term}
                onChange={handleSearchChange}
                className="border-none outline-none"
              />
            </Holds>
          </Holds>
          <Holds className=" h-full mb-4 overflow-y-auto no-scrollbar ">
            <Holds>
              {filteredList.length > 0 ? (
                filteredList.map((crew) => (
                  <Holds
                    key={crew.id}
                    className="py-2 border-b"
                    onClick={() => selectCrew(crew)}
                  >
                    <Texts position={"left"} size="p6" className="pl-4">
                      {crew.name}
                    </Texts>
                  </Holds>
                ))
              ) : (
                <Texts size="p6" className="text-center">
                  {t("NoCrewsFound")}
                </Texts>
              )}
            </Holds>
          </Holds>
        </Holds>
        {/* Create New Employee Button */}
        <Buttons
          background="green"
          className="row-span-1 h-full"
          onClick={createCrew}
        >
          <Texts size="p6">{t("CreateNewCrew")}</Texts>
        </Buttons>
      </Grids>
    </Holds>
  );
};
