import { Buttons } from "@/components/(reusable)/buttons";
import { Contents } from "@/components/(reusable)/contents";
import { Grids } from "@/components/(reusable)/grids";
import { Holds } from "@/components/(reusable)/holds";
import { Images } from "@/components/(reusable)/images";
import { Inputs } from "@/components/(reusable)/inputs";
import { NModals } from "@/components/(reusable)/newmodals";
import { Texts } from "@/components/(reusable)/texts";
import { useTranslations } from "next-intl";
import React, { useState } from "react";

interface SearchModalProps<T> {
  isOpen: boolean;
  handleClose: () => void;
  list: T[];
  filterFunction: (item: T, searchTerm: string) => boolean;
  onItemClick: (item: T) => void;
  placeholder?: string;
  renderItem?: (item: T) => React.ReactNode; // Custom rendering for list items
  submitAction?: (searchTerm: string) => void; // Optional submit action
}

export const SearchModal = <T extends { id: string; name: string }>({
  isOpen,
  handleClose,
  list,
  filterFunction,
  onItemClick,
  placeholder = "Search...",
  renderItem,
}: SearchModalProps<T>) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [itemClicked, setItemClicked] = useState<T | null>(null);
  const t = useTranslations("Admins");
  const filteredList = list.filter((item) => filterFunction(item, searchTerm));

  return (
    isOpen && (
      <NModals size={"lgH"} isOpen={isOpen} handleClose={handleClose}>
        <Contents width={"60"}>
          <Grids rows={"10"} gap={"5"}>
            <Holds className="w-full row-span-8 h-full border-[3px] border-black rounded-t-[10px]">
              <Holds
                position={"row"}
                className="py-2 border-b-[3px] border-black"
              >
                <Holds className="h-full w-[20%]">
                  <Images
                    titleImg="/magnifyingGlass.svg"
                    titleImgAlt="search"
                  />
                </Holds>
                <Holds className="w-[80%]">
                  <Inputs
                    type="text"
                    placeholder={placeholder}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="border-none outline-none"
                  />
                </Holds>
              </Holds>
              <Holds className="h-full mb-4 px-2 overflow-y-auto no-scrollbar scroll-smooth">
                {filteredList.length > 0 ? (
                  filteredList.map((item) => (
                    <Holds
                      key={item.id}
                      className="py-2 border-b"
                      onClick={() => {
                        setItemClicked(item);
                        setSearchTerm(item.name); // Clear search term
                        //   handleClose(); // Close modal
                      }}
                    >
                      <Texts size={"p4"}>
                        {renderItem
                          ? renderItem(item)
                          : `${item.name} - ${item.id}`}
                      </Texts>
                    </Holds>
                  ))
                ) : (
                  <Holds>
                    <Texts>{t("NoResultsFound")}</Texts>
                  </Holds>
                )}
              </Holds>
            </Holds>
            <Holds className="w-full h-full row-span-2 gap-4">
              <Buttons
                background={"green"}
                className="w-full h-1/2 my-auto shadow-none"
                onClick={() => {
                  if (itemClicked) {
                    onItemClick(itemClicked);
                    setSearchTerm("");
                    handleClose();
                  }
                }}
              >
                {t("Submit")}
              </Buttons>
              <Buttons
                className="w-full h-1/2 my-auto shadow-none"
                onClick={() => {
                  handleClose();
                  setSearchTerm("");
                }}
              >
                {t("Cancel")}
              </Buttons>
            </Holds>
          </Grids>
        </Contents>
      </NModals>
    )
  );
};
