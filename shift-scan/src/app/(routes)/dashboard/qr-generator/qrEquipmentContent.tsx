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
        <Selects>
          <Options>
            Loading Equipment codes...
          </Options>
        </Selects>
        </>
      ) : (
      <Selects value={selectedEquipment} onChange={handleOptionSelect}>
      <Options variant={"default"} value="">
            Select One
          </Options>
          {generatedList.map((option) => (
            <Options
              variant={"default"}
              key={option.qrId}
              value={option.qrId}
            >
              {option.name}
            </Options>
          ))}
      </Selects>
      )}
      <Holds variant={"row"}>
        <Buttons variant={"orange"} onClick={handleGenerate} size={"half"}>
          <Titles variant={"default"} size={"h1"}>{t("Generate")}</Titles>
        </Buttons>
        <Buttons variant={"green"} onClick={handleNew} size={"half"}
        >
          <Titles variant={"default"} size={"h1"}>{t("New")}</Titles>
        </Buttons>
        </Holds>
      <Modals
        isOpen={isModalOpen}
        handleClose={() => setIsModalOpen(false)}
        size="sm"
      >
        {selectedEquipment && (
          <>
            <Texts variant={"default"}>
              {selectedEquipmentName} {t("QRCode")}
            </Texts>
            <Contents variant={"rowCenter"} size={"default"}>
              <Images titleImg={qrCodeUrl} titleImgAlt={"QR Code"} />
            </Contents>
          </>
        )}
      </Modals>
    </>
  );
}