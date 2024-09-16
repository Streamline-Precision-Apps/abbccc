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
import { EquipmentCode } from "@/lib/types";

type Props = {
  equipment: EquipmentCode[];
};

export default function QrEquipmentContent({ equipment }: Props) {
  const router = useRouter();
  const [selectedEquipmentName, setSelectedEquipmentName] = useState<string>("");
  const [selectedEquipment, setSelectedEquipment] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [qrCodeUrl, setQrCodeUrl] = useState("");
  const t = useTranslations("qrEquipmentContent");

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
    const selectedOption = equipment.find(
      (option) => option.qr_id === selectedId
    );

    if (selectedOption) {
      setSelectedEquipment(selectedOption.qr_id);
      setSelectedEquipmentName(selectedOption.name);
    }
  };

  return (
    <>
    <Contents variant={"center"} size={null}>
    <Images titleImg="/new/equipment.svg" titleImgAlt="equipment" variant={"icon"} size={"iconMed"}/>
      <Titles variant={"default"} size={"default"}>{t("Equipment")}</Titles>
    </Contents>
      <Selects value={selectedEquipment} onChange={handleOptionSelect}>
        <Options variant={"default"} value="">
          {t("Select")}
        </Options>
        {equipment.map((option) => (
          <Options
            variant={"default"}
            key={option.qr_id}
            value={option.qr_id}
          >
            {option.name}
          </Options>
        ))}
      </Selects>
      <Contents variant={"rowCenter"} size={"default"}>
        <Buttons variant={"orange"} onClick={handleGenerate} size={"minBtn"}>
          <Titles variant={"default"} size={"h1"}>{t("Generate")}</Titles>
        </Buttons>
        <Buttons variant={"green"} onClick={handleNew} size={"minBtn"}>
          <Titles variant={"default"} size={"h1"}>{t("New")}</Titles>
        </Buttons>
      </Contents>
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