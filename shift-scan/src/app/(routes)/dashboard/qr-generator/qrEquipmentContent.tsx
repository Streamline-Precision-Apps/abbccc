"use client";
import { Buttons } from "@/components/(reusable)/buttons";
import React, { useState, useEffect } from "react";
import CustomSelect from "./customSelect";
import { CostCodeOptions } from "@/components/(search)/options";
import { Modals } from "@/components/(reusable)/modals";
import QRCode from "qrcode";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { Titles } from "@/components/(reusable)/titles";
import { Contents } from "@/components/(reusable)/contents";
import { Texts } from "@/components/(reusable)/texts";

interface Option {
  code: string;
  label: string;
}

const qrEquipmentContent: React.FC = () => {
  const router = useRouter();
  const [selectedEquipment, setSelectedEquipment] = useState<Option | null>(
    null
  );
  const [filteredOptions, setFilteredOptions] = useState<Option[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [qrCodeUrl, setQrCodeUrl] = useState("");
  const t = useTranslations("qrEquipmentContent");
  const equipmentOptions = CostCodeOptions("equipment");

  useEffect(() => {
    setFilteredOptions(
      equipmentOptions.filter((option) =>
        option.label.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [searchTerm]);

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
    console.log("New equipment button clicked");
    router.push("/dashboard/qr-generator/add-new-equipment");
  };

  const handleOptionSelect = (option: Option) => {
    setSelectedEquipment(option);
  };

  return (
    <>
      <Titles variant={"default"} size={"default"}>{t("Equipment")}</Titles>
      <CustomSelect
        options={filteredOptions}
        placeholder={t("Placeholder")}
        onOptionSelect={handleOptionSelect}
        selectedOption={selectedEquipment}
      />
      <Contents variant={"rowCenter"} size={"generator"}>
        <Buttons variant={"orange"} onClick={handleGenerate} size="default">
        <Titles variant={"default"} size={"h1"}>{t("Generate")}</Titles>
        </Buttons>
        <Buttons variant={"green"} onClick={handleNew} size="default">
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
                {selectedEquipment.label} {t("QRCode")}
            </Texts>
            <Contents variant={"rowCenter"} size={"default"}>
            <img src={qrCodeUrl} alt="QR Code" />
            </Contents>
          </>
        )}
      </Modals>
    </>
  );
};

export default qrEquipmentContent;
