"use client";
import React, { useState, ChangeEvent, useMemo } from "react";
import { useTranslations } from "next-intl";
import { Buttons } from "@/components/(reusable)/buttons";
import { Grids } from "@/components/(reusable)/grids";
import { Holds } from "@/components/(reusable)/holds";
import { Images } from "@/components/(reusable)/images";
import { Titles } from "@/components/(reusable)/titles";

export type DocumentTag = {
  tagName: string;
};

export type DocumentType = {
  id: string;
  qrId: string;
  fileName: string;
  description?: string;
  isActive: boolean;
  DocumentTags: DocumentTag[];
};

type CodeFinderProps = {
  documents: DocumentType[];
  selectedDocument: DocumentType | null;
  onSelect: (document: DocumentType | null) => void;
  placeholder?: string;
  label?: string;
  className?: string;
};

export default function CodeFinder({
  documents,
  selectedDocument,
  onSelect,
  placeholder = "Search documents...",
  label,
  className = "",
}: CodeFinderProps) {
  const t = useTranslations("Clock");
  const [searchTerm, setSearchTerm] = useState("");

  const filteredDocuments = useMemo(() => {
    return documents
      .filter((doc) =>
        doc.fileName.toLowerCase().includes(searchTerm.toLowerCase())
      )
      .sort((a, b) => a.fileName.localeCompare(b.fileName));
  }, [documents, searchTerm]);

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const clearSelection = () => {
    setSearchTerm("");
    onSelect(null);
  };

  return (
    <Grids rows={"8"} className={`h-full w-full ${className}`}>
      <Holds className="row-span-1 h-full">
        {selectedDocument ? (
          <Holds
            background={"lightBlue"}
            className="h-full w-full border-[3px] border-b-none border-black rounded-b-none justify-center items-center"
            onClick={clearSelection}
          >
            <Titles size={"h4"} className="text-center text-black">
              {selectedDocument.fileName.length > 21
                ? selectedDocument.fileName.slice(0, 21) + "..."
                : selectedDocument.fileName}
            </Titles>
          </Holds>
        ) : (
          <SearchBar
            searchTerm={searchTerm}
            onSearchChange={handleSearchChange}
            placeholder={placeholder}
            label={label}
          />
        )}
      </Holds>
      <Holds
        background={"darkBlue"}
        className="row-start-2 row-end-9 h-full border-[3px] border-black rounded-[10px] rounded-t-none overflow-y-auto no-scrollbar"
      >
        {filteredDocuments.length > 0 ? (
          filteredDocuments.map((document) => (
            <Holds key={document.id} className="p-2">
              <Buttons
                background={
                  selectedDocument?.id === document.id ? "green" : "white"
                }
                className={`p-2 cursor-pointer w-full`}
                onClick={() =>
                  selectedDocument?.id === document.id
                    ? clearSelection()
                    : onSelect(document)
                }
              >
                <div className="flex flex-col w-full p-1">
                  <div className="flex justify-between items-center w-full">
                    <Titles size={"h4"} text={"black"}>
                      {document.fileName}
                    </Titles>
                    {document.DocumentTags.length > 0 && (
                      <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                        {document.DocumentTags[0].tagName}
                      </span>
                    )}
                  </div>
                  {selectedDocument?.id === document.id &&
                    document.description && (
                      <div className="text-left text-sm mt-2 text-black">
                        {document.description}
                      </div>
                    )}
                </div>
              </Buttons>
            </Holds>
          ))
        ) : (
          <Holds className="h-full w-full p-1.5 ">
            <Holds
              background={"white"}
              className="flex justify-center items-center h-full w-full opacity-10 relative"
            >
              <Titles size={"h4"}>No documents found</Titles>
            </Holds>
          </Holds>
        )}
      </Holds>
    </Grids>
  );
}

const SearchBar = ({
  searchTerm,
  onSearchChange,
  placeholder,
  label,
}: {
  searchTerm: string;
  onSearchChange: (e: ChangeEvent<HTMLInputElement>) => void;
  placeholder: string;
  label?: string;
}) => {
  return (
    <Holds
      position={"row"}
      className="px-4 border-[3px] border-black rounded-[10px] rounded-b-none h-full"
    >
      <Holds position={"row"} className="h-full w-full">
        <Holds size={"10"}>
          <Images
            titleImg="/magnifyingGlass.svg"
            titleImgAlt="search"
            size={"full"}
          />
        </Holds>
        <Holds size={"80"} className="pl-4 text-xl">
          <input
            type="text"
            value={searchTerm}
            onChange={onSearchChange}
            placeholder={placeholder}
            className="w-full h-full text-center placeholder-gray-500 placeholder:text-xl focus:outline-none rounded-[10px]"
            aria-label={label}
          />
        </Holds>
        <Holds size={"10"}></Holds>
      </Holds>
    </Holds>
  );
};