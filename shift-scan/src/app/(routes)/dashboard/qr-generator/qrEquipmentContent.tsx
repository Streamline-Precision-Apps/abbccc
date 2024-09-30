"use client";
import { Buttons } from "@/components/(reusable)/buttons";
import React, { useState, useEffect } from "react";
import { CostCodeOptions } from "@/components/(search)/options";
import { Modals } from "@/components/(reusable)/modals";
import QRCode from "qrcode";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { Titles } from "@/components/(reusable)/titles";
import { Contents } from "@/components/(reusable)/contents";
import { Texts } from "@/components/(reusable)/texts";
import { Images } from "@/components/(reusable)/images";
import { Selects } from "@/components/(reusable)/selects";
import { Options } from "@/components/(reusable)/options";
import { EquipmentCodes } from "@/lib/types";
import { Holds } from "@/components/(reusable)/holds";


export default function QrEquipmentContent() {
  const router = useRouter();
  const [generatedList, setGeneratedList] = useState<EquipmentCodes[]>([]);
  const [selectedEquipmentName, setSelectedEquipmentName] = useState<string>("");
  const [selectedEquipment, setSelectedEquipment] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [qrCodeUrl, setQrCodeUrl] = useState("");
  const [loading, setLoading] = useState(true);  // Loading state
  const t = useTranslations("qrEquipmentContent");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const equipmentResponse = await fetch("/api/getEquipment");

        if (!equipmentResponse.ok) {
          throw new Error("Failed to fetch job sites");
        }

        const equipment = await equipmentResponse.json();
        setGeneratedList(equipment);
        setLoading(false);  // Set loading to false after data is fetched
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);  // Set loading to false even if there is an error
      }
    };

    fetchData();
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
    router.push("/dashboard/qr-generator/add-new-equipment");
  };

  const handleOptionSelect = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedId = event.target.value;
    const selectedOption = generatedList.find(
      (option) => option.qrId === selectedId
    );

    if (selectedOption) {
      setSelectedEquipment(selectedOption.qrId);
      setSelectedEquipmentName(selectedOption.name);
    }
  };

  return (
<>
    {loading ? (
        <>
          <Holds size={"first"} >
          <Selects>
            <Options>
              {t("Loading")}
            </Options>
          </Selects>
          <Holds 
          position={"row"} 
          size={"full"} 
          className="justify-between items-center p-4"
          >
          <Buttons 
          background={"orange"} 
          onClick={handleGenerate} 
          size={"50"}
          className="p-4 mr-4"
          >
            <Titles size={"h2"}>{t("Generate")}</Titles>
          </Buttons>
          <Buttons 
          background={"green"} 
          onClick={handleNew} 
          size={"50"}
          className="p-4 ml-4"
          >
            <Titles size={"h2"}>{t("New")}</Titles>
          </Buttons>
          </Holds>
          </Holds>
        </>
      ) : 
      (
      <>
      <Holds size={"first"}>
      <Selects value={selectedEquipment} onChange={handleOptionSelect}>
      <Options  value="" className="w-full max-h-32 overflow-y-auto text-sm">
            Select One
          </Options>
          {generatedList.map((option) => (
            <Options
              
              key={option.qrId}
              value={option.qrId}
              className="text-sm"
            >
              {option.name}
            </Options>
          ))}
      </Selects>

      <Holds position={"row"} size={"full"} className="justify-between items-center p-4">
        <Buttons 
        background={"orange"} 
        onClick={handleGenerate} 
        size={"50"}
        className="p-4 mr-4">
          <Titles  size={"h2"}>{t("Generate")}</Titles>
        </Buttons>
        <Buttons 
        background={"green"} 
        onClick={handleNew} 
        size={"50"}
        className="p-4 ml-4"
        >
          <Titles size={"h2"}>{t("New")}</Titles>
        </Buttons>
        </Holds>
      <Modals
        isOpen={isModalOpen}
        handleClose={() => setIsModalOpen(false)}
        size="sm"
      >
        {selectedEquipment && (
            <Holds className="p-4">
            <Texts >
              {selectedEquipmentName} {t("QRCode")}
            </Texts>
            <Contents position={"row"}>
              <Images titleImg={qrCodeUrl} titleImgAlt={"QR Code"} />
              </Contents>
            </Holds>
          )}
        </Modals>
      </Holds>
      </>
    )}
</>
  );
}