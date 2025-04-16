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
import { Titles } from "@/components/(reusable)/titles";
import NewCodeFinder from "@/components/(search)/newCodeFinder";
import { Texts } from "@/components/(reusable)/texts";

// Zod schema for EquipmentCodes
const EquipmentCodesSchema = z.object({
  id: z.string(),
  qrId: z.string(),
  name: z.string(),
});

type Option = {
  label: string;
  code: string;
};
// Zod schema for equipment list response
const EquipmentListSchema = z.array(EquipmentCodesSchema);

export default function QrEquipmentContent() {
  const router = useRouter();
  const [generatedList, setGeneratedList] = useState<Option[]>([]);
  const [selectedEquipment, setSelectedEquipment] = useState<Option | null>(
    null
  );
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
        } catch (error) {
          if (error instanceof z.ZodError) {
            console.error("Validation error in equipment data:", error.errors);
            return;
          }
        }
        setGeneratedList(
          equipmentData.map((item: EquipmentCodes) => ({
            label: item.name.toUpperCase(),
            code: item.qrId.toUpperCase(),
          }))
        );
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleGenerate = async () => {
    if (selectedEquipment) {
      try {
        const url = await QRCode.toDataURL(selectedEquipment.code);
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

  const handleSearchSelectChange = (selectedOption: Option | null) => {
    if (selectedOption) {
      setSelectedEquipment({
        label: selectedOption.label,
        code: selectedOption.code,
      });
    } else {
      setSelectedEquipment(null);
      return;
    }
  };

  return (
    <Grids rows={"7"} cols={"3"} gap={"5"} className="h-full w-full">
      <Holds className="row-start-1 row-end-7 col-span-3 h-full">
        <NewCodeFinder
          options={generatedList}
          selectedOption={selectedEquipment}
          onSelect={handleSearchSelectChange}
          placeholder={t("TypeHere")}
          label="Select Job Site"
        />
      </Holds>

      <Holds className="row-start-7 row-end-8 col-start-1 col-end-2 h-full">
        <Buttons
          background={selectedEquipment ? "lightBlue" : "darkGray"}
          disabled={!selectedEquipment}
          onClick={handleGenerate}
          className="w-full h-full justify-center items-center"
        >
          <Images
            src="/qr.svg"
            alt="Team"
            className="w-8 h-8 mx-auto"
            titleImg={""}
            titleImgAlt={""}
          />
        </Buttons>
      </Holds>
      <Holds
        size={"full"}
        className="row-start-7 row-end-8 col-start-2 col-end-4 h-full"
      >
        <Buttons background={"green"} onClick={handleNew}>
          <Titles size={"h4"}>{t("CreateNewEquipment")}</Titles>
        </Buttons>
      </Holds>

      <NModals
        isOpen={isModalOpen}
        handleClose={() => setIsModalOpen(false)}
        size={"xlWS"}
      >
        {selectedEquipment && (
          <>
            <Holds className="fixed rounded-[10px] p-2 bg-white top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col max-w-[75%] max-h-[75%] w-full h-auto">
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
  );
}
