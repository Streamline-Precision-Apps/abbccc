"use client";
import Spinner from "@/components/(animations)/spinner";
import { Buttons } from "@/components/(reusable)/buttons";
import { Contents } from "@/components/(reusable)/contents";
import { Grids } from "@/components/(reusable)/grids";
import { Holds } from "@/components/(reusable)/holds";
import { NModals } from "@/components/(reusable)/newmodals";
import { Selects } from "@/components/(reusable)/selects";
import { Titles } from "@/components/(reusable)/titles";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { Images } from "@/components/(reusable)/images";
import EqScannerModal from "./eqScannerModal";
import { NewTab } from "@/components/(reusable)/newTabs";
import { Texts } from "@/components/(reusable)/texts";

type documentType = {
  id: string;
  qrId: string;
  fileName: string;
  description?: string;
  isActive: boolean;
  DocumentTags: {
    tagName: string;
  }[];
};

type tagType = {
  id: string;
  tagName: string;
};

export type equipmentType = {
  id: string;
  qrId: string;
  name: string;
  DocumentTags?: {
    tagName: string;
  }[];
};

export default function CompanyDocuments({
  setActiveTab,
  activeTab,
  isManager,
}: {
  setActiveTab: React.Dispatch<React.SetStateAction<number>>;
  activeTab: number;
  isManager: boolean;
}) {
  const [loading, setLoading] = useState(true);
  const [selectedFilter, setSelectedFilter] = useState<string>("all");
  const [documents, setDocuments] = useState<documentType[]>([]);
  const [tags, setTags] = useState<tagType[]>([]);
  const router = useRouter();
  const [modalOpen, setModalOpen] = useState(false);
  const [scanned, setScanned] = useState<string | null>(null);
  const [equipment, setEquipment] = useState<equipmentType[]>([]);
  const [equipmentTags, setEquipmentTags] = useState<string[]>([]);
  const [selectedDocument, setSelectedDocument] = useState<documentType | null>(
    null
  );

  const handleDownload = async () => {
    if (!selectedDocument) return;

    try {
      const response = await fetch(
        `/api/getDocumentById/${selectedDocument.id}`,
        {
          headers: {
            Accept: "application/pdf",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch document");
      }

      const blob = await response.blob();
      if (blob.size === 0) {
        throw new Error("Received empty PDF file");
      }

      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = selectedDocument.fileName || "document.pdf";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Download error:", error);
      alert(
        error instanceof Error ? error.message : "Failed to download document"
      );
    }
  };

  const handleDocumentClick = (document: documentType) => {
    if (selectedDocument?.id === document.id) {
      setSelectedDocument(null);
    } else {
      setSelectedDocument(document);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [docsResponse, tagsResponse, equipmentResponse] =
          await Promise.all([
            fetch("/api/getDocuments"),
            fetch("/api/getDocumentTags"),
            fetch("/api/getEqForDocs"),
          ]);

        const docsData = await docsResponse.json();
        const tagsData = await tagsResponse.json();
        const equipmentData = await equipmentResponse.json();

        setDocuments(docsData);
        setTags(tagsData);
        setEquipment(equipmentData);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (scanned && equipment.length > 0) {
      const matchedEquipment = equipment.find((eq) => eq.qrId === scanned);
      if (matchedEquipment) {
        const tags =
          matchedEquipment.DocumentTags?.map((tag) =>
            tag.tagName.toLowerCase()
          ) || [];
        setEquipmentTags(tags);
        setSelectedFilter(matchedEquipment.name);
      }
    } else {
      setEquipmentTags([]);
    }
  }, [scanned, equipment]);

  const filteredDocuments =
    selectedFilter === "all"
      ? documents
      : equipmentTags.length > 0
      ? documents.filter((doc) =>
          doc.DocumentTags.some((docTag) =>
            equipmentTags.includes(docTag.tagName.toLowerCase())
          )
        )
      : documents.filter((doc) =>
          doc.DocumentTags.some(
            (tag) => tag.tagName.toLowerCase() === selectedFilter.toLowerCase()
          )
        );

  if (loading) {
    return (
      <Holds className=" h-full w-full ">
        <Grids rows={"7"} gap={"5"} className="h-full w-full">
          <Holds className="row-start-1 row-end-8 h-full ">
            <Holds className=" h-full w-full">
              <Holds position={"row"} className="gap-x-1 h-fit">
                <NewTab
                  onClick={() => setActiveTab(1)}
                  isActive={activeTab === 1}
                  isComplete={true}
                  titleImage={"/formSelection.svg"}
                  titleImageAlt={""}
                  animatePulse={loading}
                >
                  <Titles size={"h5"}>Form Selection</Titles>
                </NewTab>
                <NewTab
                  onClick={() => setActiveTab(2)}
                  isActive={activeTab === 2}
                  isComplete={true}
                  titleImage={"/submittedForms.svg"}
                  titleImageAlt={""}
                  animatePulse={loading}
                >
                  <Titles size={"h5"}>Submitted Forms</Titles>
                </NewTab>
                {isManager && (
                  <NewTab
                    onClick={() => setActiveTab(3)}
                    isActive={activeTab === 3}
                    isComplete={true}
                    titleImage={"/pendingForms.svg"}
                    titleImageAlt={""}
                    animatePulse={loading}
                  >
                    <Titles size={"h5"}>Pending Forms</Titles>
                  </NewTab>
                )}

                <NewTab
                  onClick={() => setActiveTab(4)}
                  isActive={activeTab === 4}
                  isComplete={true}
                  titleImage={"/pendingForms.svg"}
                  titleImageAlt={""}
                  animatePulse={loading}
                >
                  <Titles size={"h5"}>Company Documents</Titles>
                </NewTab>
              </Holds>
              <Holds
                background={"white"}
                className={`h-full rounded-t-none animate-pulse`}
              >
                <Grids rows={"9"} className="h-full w-full">
                  <Holds className="row-start-1 row-end-2">
                    <Contents width={"section"}>
                      <Holds position={"row"} className="h-full w-full gap-x-4">
                        <Holds className="w-fit ">
                          <Buttons
                            background={"green"}
                            onClick={() => setModalOpen(true)}
                            className="w-12 h-full"
                          >
                            <Holds className="p-2">
                              <Images
                                titleImg={"/qr.svg"}
                                titleImgAlt={"QR"}
                                className="w-6 h-6 items-center"
                              />
                            </Holds>
                          </Buttons>
                        </Holds>
                        <Holds className="w-full h-full ">
                          <Selects
                            value={selectedFilter}
                            onChange={(e) => setSelectedFilter(e.target.value)}
                            className="text-center justify-center h-full"
                            disabled
                          >
                            <option value="all">Loading tags...</option>
                          </Selects>
                        </Holds>
                      </Holds>
                    </Contents>
                  </Holds>
                  <Holds className="row-start-2 row-end-6 h-full w-full flex justify-center items-center">
                    <Spinner size={50} />
                  </Holds>
                </Grids>
              </Holds>
            </Holds>
          </Holds>
        </Grids>
      </Holds>
    );
  }

  return (
    <Holds className=" h-full w-full ">
      <Grids rows={"7"} gap={"5"} className="h-full w-full">
        <Holds className="row-start-1 row-end-8 h-full ">
          <Holds position={"row"} className="gap-x-1 h-fit">
            <NewTab
              onClick={() => setActiveTab(1)}
              isActive={activeTab === 1}
              isComplete={true}
              titleImage={"/formSelection.svg"}
              titleImageAlt={""}
              animatePulse={loading}
            >
              <Titles size={"h5"}>Form Selection</Titles>
            </NewTab>
            <NewTab
              onClick={() => setActiveTab(2)}
              isActive={activeTab === 2}
              isComplete={true}
              titleImage={"/submittedForms.svg"}
              titleImageAlt={""}
              animatePulse={loading}
            >
              <Titles size={"h5"}>Submitted Forms</Titles>
            </NewTab>
            {isManager && (
              <NewTab
                onClick={() => setActiveTab(3)}
                isActive={activeTab === 3}
                isComplete={true}
                titleImage={"/pendingForms.svg"}
                titleImageAlt={""}
                animatePulse={loading}
              >
                <Titles size={"h5"}>Pending Forms</Titles>
              </NewTab>
            )}

            <NewTab
              onClick={() => setActiveTab(4)}
              isActive={activeTab === 4}
              isComplete={true}
              titleImage={"/pendingForms.svg"}
              titleImageAlt={""}
              animatePulse={loading}
            >
              <Titles size={"h5"}>Company Documents</Titles>
            </NewTab>
          </Holds>
          <Holds background={"white"} className={`h-full rounded-t-none`}>
            <Grids rows={"9"} className="h-full w-full  pb-5">
              <Holds className="row-start-1 row-end-2">
                <Contents width={"section"}>
                  <Holds position={"row"} className="h-full w-full gap-x-4">
                    <Holds className="w-fit ">
                      <Buttons
                        background={"green"}
                        onClick={() => setModalOpen(true)}
                        className="w-12 h-full"
                      >
                        <Holds className="p-2">
                          <Images
                            titleImg={"/qr.svg"}
                            titleImgAlt={"QR"}
                            className="w-6 h-6 items-center"
                          />
                        </Holds>
                      </Buttons>
                    </Holds>
                    <Holds className="w-full h-full ">
                      <Selects
                        value={selectedFilter}
                        onChange={(e) => {
                          setSelectedFilter(e.target.value);
                          setScanned(null);
                        }}
                        className="text-center justify-center h-full"
                      >
                        <option value="all">All Documents</option>
                        {tags.map((tag) => (
                          <option
                            key={tag.id}
                            value={tag.tagName.toLowerCase()}
                          >
                            {tag.tagName}
                          </option>
                        ))}
                        {scanned &&
                          equipment.find((eq) => eq.qrId === scanned) && (
                            <option
                              value={
                                equipment.find((eq) => eq.qrId === scanned)!
                                  .name
                              }
                              selected
                            >
                              {
                                equipment.find((eq) => eq.qrId === scanned)!
                                  .name
                              }
                            </option>
                          )}
                      </Selects>
                    </Holds>
                  </Holds>
                </Contents>
              </Holds>

              {filteredDocuments.length === 0 ? (
                <Holds className="row-start-2 row-end-9 h-full w-full ">
                  <Contents width={"section"}>
                    <Holds className="w-full h-full flex justify-center items-center">
                      <Texts size={"p6"} className="italic text-gray-500">
                        {selectedFilter === "all"
                          ? "No documents found"
                          : equipmentTags.length > 0
                          ? `No documents found for equipment ${selectedFilter}`
                          : `No documents found for ${selectedFilter}`}
                      </Texts>
                    </Holds>
                  </Contents>
                </Holds>
              ) : (
                <>
                  <Holds className="row-start-2 row-end-9 py-3 h-full w-full overflow-y-scroll no-scrollbar">
                    <Contents width={"section"}>
                      <Holds background={"darkBlue"} className="w-full h-full ">
                        {filteredDocuments.map((document) => (
                          <Holds key={document.id} className="px-2 pb-5">
                            <Buttons
                              className={`py-0.5 relative w-full`}
                              background={
                                selectedDocument?.id === document.id
                                  ? "green"
                                  : "white"
                              }
                              onClick={() => handleDocumentClick(document)}
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
                        ))}
                      </Holds>
                    </Contents>
                  </Holds>
                  <Holds className="row-start-9 row-end-10  ">
                    <Contents width={"section"}>
                      <Grids cols={"2"} gap={"4"} className="w-full h-full">
                        <Holds className="col-start-1 col-end-2  ">
                          <Buttons
                            background={
                              selectedDocument ? "orange" : "darkGray"
                            }
                            onClick={handleDownload}
                            className="w-full py-3 "
                            disabled={!selectedDocument}
                          >
                            <Titles size={"h5"}>Download</Titles>
                          </Buttons>
                        </Holds>
                        <Holds className="col-start-2 col-end-3  ">
                          <Buttons
                            background={
                              selectedDocument ? "orange" : "darkGray"
                            }
                            onClick={() => {}}
                            className="w-full py-3"
                            disabled={!selectedDocument}
                          >
                            <Titles size={"h5"}>View</Titles>
                          </Buttons>
                        </Holds>
                      </Grids>
                    </Contents>
                  </Holds>
                </>
              )}
              <NModals
                size="screen"
                background="takeABreak"
                isOpen={modalOpen}
                handleClose={() => {
                  setModalOpen(false);
                }}
              >
                <EqScannerModal
                  setModalOpen={setModalOpen}
                  scanned={scanned}
                  setScanned={setScanned}
                  equipment={equipment}
                />
              </NModals>
            </Grids>
          </Holds>
        </Holds>
      </Grids>
    </Holds>
  );
}
