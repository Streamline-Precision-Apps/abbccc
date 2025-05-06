"use client";
import Spinner from "@/components/(animations)/spinner";
import { Buttons } from "@/components/(reusable)/buttons";
import { Contents } from "@/components/(reusable)/contents";
import { Grids } from "@/components/(reusable)/grids";
import { Holds } from "@/components/(reusable)/holds";
import { NModals } from "@/components/(reusable)/newmodals";
import { Selects } from "@/components/(reusable)/selects";
import { Titles } from "@/components/(reusable)/titles";
import React, { useEffect, useState } from "react";
import { Images } from "@/components/(reusable)/images";
import EqScannerModal from "./eqScannerModal";
import CodeFinder from "./(search)/codeFinder";
import { useRouter } from "next/navigation";

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

export default function CompanyDocuments() {
  const [loading, setLoading] = useState(true);
  const [selectedFilter, setSelectedFilter] = useState<string>("all");
  const [documents, setDocuments] = useState<documentType[]>([]);
  const [tags, setTags] = useState<tagType[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [scanned, setScanned] = useState<string | null>(null);
  const [equipment, setEquipment] = useState<equipmentType[]>([]);
  const [equipmentTags, setEquipmentTags] = useState<string[]>([]);
  const [selectedDocument, setSelectedDocument] = useState<documentType | null>(
    null
  );
  const router = useRouter();

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
      <Holds
        background={"white"}
        className="rounded-t-none row-span-9 h-full w-full pt-5"
      >
        <Contents width={"section"}>
          <Grids rows={"10"} gap={"4"} className="h-full w-full">
            <Holds className="row-start-1 row-end-2 h-full px-2">
              <Selects
                value={selectedFilter}
                onChange={(e) => setSelectedFilter(e.target.value)}
                className="text-center justify-center h-full"
                disabled
              >
                <option value="all">Loading tags...</option>
              </Selects>
            </Holds>
            <Holds className="row-start-2 row-end-6 h-full w-full flex justify-center items-center">
              <Spinner size={50} />
            </Holds>
          </Grids>
        </Contents>
      </Holds>
    );
  }

  return (
    <Holds
      background={"white"}
      className="rounded-t-none row-span-9 h-full w-full pt-5"
    >
      <Contents width={"section"}>
        <Holds className="h-full w-full">
          <Grids rows={"10"} gap={"5"} className="h-full w-full">
            <Holds className="row-start-1 row-end-2 h-[75] px-2">
              <Grids cols={"6"} gap={"4"}>
                <Holds className="col-start-1 col-end-2 h-full px-2">
                  <Buttons
                    background={"green"}
                    onClick={() => setModalOpen(true)}
                    className="h-full w-12"
                  >
                    <Holds className="p-2">
                      <Images
                        titleImg={"/qr.svg"}
                        titleImgAlt={"QR"}
                        className="w-7 h-7 items-center"
                      />
                    </Holds>
                  </Buttons>
                </Holds>
                <Holds className="col-start-2 col-end-7 h-full px-2">
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
                      <option key={tag.id} value={tag.tagName.toLowerCase()}>
                        {tag.tagName}
                      </option>
                    ))}
                    {scanned && equipment.find((eq) => eq.qrId === scanned) && (
                      <option
                        value={
                          equipment.find((eq) => eq.qrId === scanned)!.name
                        }
                        selected
                      >
                        {equipment.find((eq) => eq.qrId === scanned)!.name}
                      </option>
                    )}
                  </Selects>
                </Holds>
              </Grids>
            </Holds>

            {filteredDocuments.length === 0 ? (
              <Holds className="row-start-2 row-end-9 h-full w-full flex justify-center items-center">
                <Titles size={"h4"}>
                  {selectedFilter === "all"
                    ? "No documents found"
                    : equipmentTags.length > 0
                    ? `No documents found for equipment ${selectedFilter}`
                    : `No documents found for ${selectedFilter}`}
                </Titles>
              </Holds>
            ) : (
              <>
                <Holds className="row-start-2 row-end-9 h-full w-full">
                  <CodeFinder
                    documents={filteredDocuments}
                    selectedDocument={selectedDocument}
                    onSelect={(doc) => setSelectedDocument(doc)}
                    placeholder="Search documents..."
                  />
                </Holds>
                <Holds className="row-start-9 row-end-11 h-[75%] px-2 pb-2">
                  <Grids cols={"2"} gap={"4"}>
                    <Holds className="col-start-1 col-end-2 h-full px-2">
                      <Buttons
                        background={selectedDocument ? "orange" : "lightGray"}
                        onClick={handleDownload}
                        className="w-full"
                        disabled={!selectedDocument}
                      >
                        Download
                      </Buttons>
                    </Holds>
                    <Holds className="col-start-2 col-end-3 h-full px-2">
                      <Buttons
                        background={selectedDocument ? "orange" : "lightGray"}
                        onClick={() => {}}
                        className="w-full"
                        disabled={!selectedDocument}
                      >
                        View
                      </Buttons>
                    </Holds>
                  </Grids>
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
      </Contents>
    </Holds>
  );
}
