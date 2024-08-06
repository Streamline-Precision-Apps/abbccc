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

const qrJobsiteContent: React.FC = () => {
  const [selectedJobSite, setSelectedJobSite] = useState<Option | null>(null);
  const [filteredOptions, setFilteredOptions] = useState<Option[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [qrCodeUrl, setQrCodeUrl] = useState("");
  const Router = useRouter();
  const jobSiteOptions = CostCodeOptions("jobsite");
  const t = useTranslations("QrJobsiteContent");

  useEffect(() => {
    setFilteredOptions(
      jobSiteOptions.filter((option) =>
        option.label.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [searchTerm]);

  const handleGenerate = async () => {
    if (selectedJobSite) {
      try {
        const url = await QRCode.toDataURL(selectedJobSite.code);
        setQrCodeUrl(url);
        setIsModalOpen(true);
      } catch (err) {
        console.error(err);
      }
    } else {
      console.log("No job site selected");
    }
  };

  const handleNew = () => {
    Router.push("/dashboard/qr-generator/add-new-jobsite");
  };

  const handleOptionSelect = (option: Option) => {
    setSelectedJobSite(option);
  };

  return (
    <div className="text-center font-sans">
      <h2 className="text-xl font-bold mb-4">{t("Jobsite")}</h2>
      <CustomSelect
        options={filteredOptions}
        placeholder={t("Placeholder")}
        onOptionSelect={handleOptionSelect}
        selectedOption={selectedJobSite}
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
        size="default"
      >
        {selectedJobSite && (
          <div className="text-center">
            <h2 className="text-xl font-bold mb-4">
              {selectedJobSite.label} {t("QR Code")}
            </h2>
            <img src={qrCodeUrl} alt="QR Code" />
          </div>
        )}
      </Modals>
    </div>
  );
};

export default qrJobsiteContent;
