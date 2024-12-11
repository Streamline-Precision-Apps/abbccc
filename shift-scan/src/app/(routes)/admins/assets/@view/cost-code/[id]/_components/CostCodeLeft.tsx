import { CheckBox } from "@/components/(inputs)/checkBox";
import { Grids } from "@/components/(reusable)/grids";
import { Holds } from "@/components/(reusable)/holds";
import { Images } from "@/components/(reusable)/images";
import { Inputs } from "@/components/(reusable)/inputs";
import { Texts } from "@/components/(reusable)/texts";
import { CCTags } from "@/lib/types";
import { useState, useMemo } from "react";

export function CostCodeLeft({
  initalTags,
  selectedTags,
  toggleTagSelection,
}: {
  initalTags: CCTags[];
  selectedTags: CCTags[];
  toggleTagSelection: (tag: CCTags) => void;
}) {
  const [term, setTerm] = useState<string>("");

  const filteredTags = useMemo(() => {
    return initalTags.filter((tag) =>
      tag.name.toLowerCase().includes(term.toLowerCase())
    );
  }, [term, initalTags]);

  return (
    <Holds background="white" className="w-full h-full p-4">
      <Grids rows="10" gap="5" className="h-full">
        <Holds className="row-span-10 h-full border-[3px] border-black rounded-t-[10px]">
          <Holds position="row" className="py-2 border-b-[3px] border-black">
            <Holds className="h-full w-[20%]">
              <Images titleImg="/magnifyingGlass.svg" titleImgAlt="search" />
            </Holds>
            <Holds className="w-[80%]">
              <Inputs
                type="search"
                placeholder="Search Tags"
                value={term}
                onChange={(e) => setTerm(e.target.value)}
                className="border-none outline-none"
              />
            </Holds>
          </Holds>
          <Holds className="h-full mb-4 overflow-y-auto no-scrollbar">
            {filteredTags.map((tag) => (
              <Holds
                key={tag.id}
                className="py-2 border-b cursor-pointer flex items-center"
              >
                <Holds position={"row"} className="justify-between">
                  <Holds className="flex w-2/3">
                    <Texts size="p6">{tag.name}</Texts>
                  </Holds>
                  <Holds position="row" className="relative flex w-1/3">
                    <CheckBox
                      id={tag.id.toString()}
                      checked={selectedTags.some((t) => t.id === tag.id)}
                      onChange={() => toggleTagSelection(tag)}
                      size={2}
                      name={tag.name}
                      aria-label={`Toggle tag ${tag.name}`}
                    />
                  </Holds>
                </Holds>
              </Holds>
            ))}
          </Holds>
        </Holds>
      </Grids>
    </Holds>
  );
}
