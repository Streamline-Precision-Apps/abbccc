"use client";
import { Buttons } from "@/components/(reusable)/buttons";

import { Holds } from "@/components/(reusable)/holds";
import { Images } from "@/components/(reusable)/images";
import { Inputs } from "@/components/(reusable)/inputs";

import { Texts } from "@/components/(reusable)/texts";
import { useRouter } from "next/navigation";
import { useState, useMemo, useCallback } from "react";

type Tags = {
  id: number;
  name: string;
  jobsiteId: number;
};

type Props = {
  tags: Tags[];
};

export const TagsComponent = ({ tags }: Props) => {
  const [term, setTerm] = useState<string>("");
  // const [page, setPage] = useState(true);
  const router = useRouter();

  // Memoize the filtered list to avoid re-filtering on every render
  const filteredList = useMemo(() => {
    if (!term.trim()) return tags; // Return the full list if no term is entered

    return tags.filter((tags) => {
      const name = tags.name;
      return name.includes(term.toLowerCase());
    });
  }, [term, tags]);

  // Debounce handler to avoid rapid state updates on each keystroke
  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setTerm(e.target.value);
    },
    []
  );

  const selectTags = (tags: Tags) => {
    setTerm(tags.name);
    router.push(`/admins/assets/tags/${tags.id}`);
  };

  const createTags = () => {
    router.push(`/admins/assets/new-cost-codes`);
  };

  return (
    <>
      <Holds className="row-span-9 h-full border-[3px] border-black rounded-t-[10px]">
        <>
          <Holds position={"row"} className="py-2 border-b-[3px] border-black">
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
                filteredList.map((tags) => (
                  <Holds
                    key={tags.id}
                    className="py-2 border-b"
                    onClick={() => selectTags(tags)}
                  >
                    <Texts size="p6">
                      {tags.name} - {tags.jobsiteId}
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

      {/* Create New Tags Button */}
      <Buttons
        background="green"
        className="row-span-1 h-full"
        onClick={createTags}
      >
        <Texts size="p6">Create New Tag</Texts>
      </Buttons>
    </>
  );
};
