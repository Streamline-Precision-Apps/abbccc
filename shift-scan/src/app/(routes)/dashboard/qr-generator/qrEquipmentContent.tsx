"use client";
import { Buttons } from "@/components/(reusable)/buttons";
import React, { useState, useEffect } from "react";
import CustomSelect from "./customSelect";
import { CostCodeOptions } from "@/components/(search)/options";
import { Modals } from "@/components/(reusable)/modals";
import QRCode from "qrcode";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

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
    <div className="text-center font-sans">
      <h2 className="text-xl font-bold mb-4">{t("Equipment")}</h2>
      <CustomSelect
        options={filteredOptions}
        placeholder={t("Placeholder")}
        onOptionSelect={handleOptionSelect}
        selectedOption={selectedEquipment}
      />
      <div className="flex justify-center gap-4">
        <Buttons variant={"orange"} onClick={handleGenerate} size="default">
          {t("Generate")}
        </Buttons>
        <Buttons variant={"green"} onClick={handleNew} size="default">
          {t("New")}
        </Buttons>
      </div>
      <Modals
        isOpen={isModalOpen}
        handleClose={() => setIsModalOpen(false)}
        size="sm"
      >
        {selectedEquipment && (
          <div className="text-center">
            <h2 className="text-xl font-bold mb-4">
              {selectedEquipment.label} {t("QRCode")}
            </h2>
            <img src={qrCodeUrl} alt="QR Code" />
          </div>
        )}
      </Modals>
    </div>
  );
};

export default qrEquipmentContent;
