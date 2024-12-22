"use client";

import { Buttons } from "@/components/(reusable)/buttons";
import React, { useState, useEffect } from "react";
import QRCode from "qrcode";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { Images } from "@/components/(reusable)/images";
import { Holds } from "@/components/(reusable)/holds";
import SearchSelect from "@/components/(search)/searchSelect";
import { Grids } from "@/components/(reusable)/grids";
import { z } from "zod";
import { EquipmentCodes } from "@/lib/types";
import { NModals } from "@/components/(reusable)/newmodals";

// Zod schema for EquipmentCodes
const EquipmentCodesSchema = z.object({
  id: z.string(),
  qrId: z.string(),
  name: z.string(),
});

// Zod schema for equipment list response
const EquipmentListSchema = z.array(EquipmentCodesSchema);

export default function QrEquipmentContent() {
  const router = useRouter();
  const [generatedList, setGeneratedList] = useState<EquipmentCodes[]>([]);
  const [generatedRecentList, setGeneratedRecentList] = useState<
    EquipmentCodes[]
  >([]);
  const [selectedEquipment, setSelectedEquipment] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [qrCodeUrl, setQrCodeUrl] = useState("");
  const [loading, setLoading] = useState(true);
  const t = useTranslations("Generator");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const equipmentResponse = await fetch("/api/getEquipment");

        if (!equipmentResponse.ok) {
          throw new Error("Failed to fetch equipment");
        }

        const equipmentData = await equipmentResponse.json();

        // Validate fetched equipment data with Zod
        try {
          EquipmentListSchema.parse(equipmentData);
          setGeneratedList(equipmentData);
        } catch (error) {
          if (error instanceof z.ZodError) {
            console.error("Validation error in equipment data:", error.errors);
            return;
          }
        }

        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const fetchRecentEquipment = async () => {
      try {
        const equipmentResponse = await fetch("/api/getRecentEquipment");

        if (!equipmentResponse.ok) {
          throw new Error("Failed to fetch recent equipment");
        }

        const recentEquipmentData = await equipmentResponse.json();

        // Validate fetched recent equipment data with Zod
        try {
          EquipmentListSchema.parse(recentEquipmentData);
          setGeneratedRecentList(recentEquipmentData);
        } catch (error) {
          if (error instanceof z.ZodError) {
            console.error(
              "Validation error in recent equipment data:",
              error.errors
            );
            return;
          }
        }

        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };

    fetchRecentEquipment();
  }, []);

  const handleGenerate = async () => {
    if (selectedEquipment) {
      try {
        const url = await QRCode.toDataURL(selectedEquipment);
        setQrCodeUrl(url);
        setIsModalOpen(true);
      } catch (err) {
        console.error(err);
      }
    } else {
      console.log("No equipment selected");
    }
  };

  const handleNew = () => {
    router.push("/dashboard/qr-generator/add-equipment");
  };

  const handleSelectEquipment = (selectedOption: EquipmentCodes) => {
    setSelectedEquipment(selectedOption.qrId);
  };

  return (
    <>
      {loading ? (
        <Grids rows={"5"} cols={"3"} gap={"5"}>
          <Holds className="row-span-4 col-span-3 h-full">
            <SearchSelect
              loading={true}
              datatype={`${t("Loading")}`}
              options={generatedList}
              handleGenerate={handleGenerate}
              recentOptions={generatedRecentList}
              onSelect={handleSelectEquipment}
            />
          </Holds>

          <Holds
            size={"full"}
            className="row-span-1 col-start-3 col-end-4 h-full"
          >
            <Buttons background={"green"} onClick={handleNew}>
              <Holds>
                <Images
                  titleImg={"/plus.svg"}
                  titleImgAlt={"plus"}
                  size={"40"}
                />
              </Holds>
            </Buttons>
          </Holds>
        </Grids>
      ) : (
        <Grids rows={"5"} cols={"3"} gap={"5"}>
          <Holds className="row-span-4 col-span-3 h-full">
            <SearchSelect
              loading={false}
              datatype={`${t("EquipmentDatatype")}`}
              options={generatedList}
              handleGenerate={handleGenerate}
              recentOptions={generatedRecentList}
              onSelect={handleSelectEquipment}
            />
          </Holds>

          <Holds
            size={"full"}
            className="row-span-1 col-start-3 col-end-4 h-full"
          >
            <Buttons background={"green"} onClick={handleNew}>
              <Holds>
                <Images
                  titleImg={"/plus.svg"}
                  titleImgAlt={"plus"}
                  size={"40"}
                />
              </Holds>
            </Buttons>
          </Holds>

          <NModals
            isOpen={isModalOpen}
            handleClose={() => setIsModalOpen(false)}
            size={"xlWS"}
          >
            {selectedEquipment && (
              <>
                <Holds className="fixed rounded-[10px] p-4 bg-white top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col max-w-[90%] max-h-[90%] w-auto h-auto">
                  <Images
                    titleImg={qrCodeUrl}
                    titleImgAlt="QR Code"
                    className="h-full w-full object-contain"
                  />
                </Holds>
              </>
            )}
          </NModals>
        </Grids>
      )}
    </>
  );
}
