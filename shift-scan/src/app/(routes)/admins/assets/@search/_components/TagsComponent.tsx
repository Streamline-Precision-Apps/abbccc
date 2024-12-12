"use client";
import { Buttons } from "@/components/(reusable)/buttons";

import { Holds } from "@/components/(reusable)/holds";
import { Images } from "@/components/(reusable)/images";
import { Inputs } from "@/components/(reusable)/inputs";

import { Texts } from "@/components/(reusable)/texts";
import { useRouter } from "next/navigation";
import { useState, useMemo, useCallback } from "react";

import { CCTags } from "@/lib/types";
import { useTranslations } from "next-intl";

export const TagsComponent = ({ tags }: { tags: CCTags[] }) => {
  const t = useTranslations("Admins");
  const [term, setTerm] = useState<string>("");
  // const [page, setPage] = useState(true);
  const router = useRouter();

  // Memoize the filtered list to avoid re-filtering on every render
  const filteredList = useMemo(() => {
    if (!term.trim()) {
      // Return the full list sorted alphabetically if no term is entered
      return [...tags].sort((a, b) => a.name.localeCompare(b.name));
    }

    // Filter the tags based on the term and then sort alphabetically
    return tags
      .filter((tag) => {
        const name = tag.name.toLowerCase();
        return name.includes(term.toLowerCase());
      })
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [term, tags]);

  // Debounce handler to avoid rapid state updates on each keystroke
  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setTerm(e.target.value);
    },
    []
  );

  const selectTags = (tags: CCTags) => {
    setTerm(tags.name);
    router.push(`/admins/assets/tags/${tags.id}`);
  };

  const createTags = () => {
    router.push(`/admins/assets/new-tag`);
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
                placeholder={t("TagSearchPlaceholder")}
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
                    <Texts size="p6" position={"left"} className="pl-4">
                      {tags.name.slice(0, 20).toUpperCase()}
                    </Texts>
                  </Holds>
                ))
              ) : (
                <Texts size="p6" className="text-center">
                  {t("NoTagsFound")}
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
        <Texts size="p6">{t("CreateNewTag")}</Texts>
      </Buttons>
    </>
  );
};
