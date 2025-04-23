"use client";
import { Buttons } from "@/components/(reusable)/buttons";

import { Holds } from "@/components/(reusable)/holds";
import { Images } from "@/components/(reusable)/images";
import { Inputs } from "@/components/(reusable)/inputs";

import { Texts } from "@/components/(reusable)/texts";
import { CCTags, CostCodes } from "@/lib/types";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useState, useMemo, useCallback } from "react";

type Props = {
  costCodes: CostCodes[];
  tags: CCTags[];
};

export const CostCodeComponent = ({ costCodes }: Props) => {
  const t = useTranslations("Admins");
  const [term, setTerm] = useState<string>("");
  // const [page, setPage] = useState(true);
  const router = useRouter();

  // Memoize the filtered list to avoid re-filtering on every render
  const filteredList = useMemo(() => {
    if (!term.trim()) {
      return [...costCodes].sort((a, b) => a.name.localeCompare(b.name));
    }

    return costCodes
      .filter((costCode) => {
        const name = costCode.name;
        return name.includes(term.toLowerCase());
      })
      .sort((a, b) => a.name.localeCompare(b.name));
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
    router.push(`/admins/assets/cost-code/${costCode.id}`);
  };

  const createCostCode = () => {
    router.push(`/admins/assets/new-cost-codes`);
  };

  return (
    <>
      {/* Search Input Section */}
      <Holds className="row-span-9 h-full border-[3px] border-black rounded-t-[10px]">
        <>
          <Holds position={"row"} className="py-2 border-b-[3px] border-black">
            <Holds className="h-full w-[20%]">
              <Images titleImg="/magnifyingGlass.svg" titleImgAlt="search" />
            </Holds>
            <Holds className="w-[80%]">
              <Inputs
                type="search"
                placeholder={t("CostCodeSearchPlaceholder")}
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
                    <Texts position={"left"} className="pl-4" size="p6">
                      {`
                      ${costCode.name.split(" ")[0]} - ${costCode.name
                        .split(" ")
                        .slice(1)
                        .join(" ")
                        .slice(0, 20)}`}
                    </Texts>
                  </Holds>
                ))
              ) : (
                <Texts size="p6" className="text-center">
                  {t("NoCostCodeFound")}
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
        <Texts size="p6">{t("CreateNewCostCode")}</Texts>
      </Buttons>
    </>
  );
};
