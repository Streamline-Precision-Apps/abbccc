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
import { Images } from "@/components/(reusable)/images";
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
    <>
      <Titles variant={"default"} size={"default"}>{t("Jobsite")}</Titles>
      <CustomSelect
        options={filteredOptions}
        placeholder={t("Placeholder")}
        onOptionSelect={handleOptionSelect}
        selectedOption={selectedJobSite}
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
        size="default"
      >
        {selectedJobSite && (
          <>
            <Texts variant={"default"}>
              {selectedJobSite.label} {t("QR Code")}
            </Texts>
            <Contents variant={"rowCenter"} size={"default"}>
            <Images titleImg="" titleImgAlt="QR Code" src={qrCodeUrl}/>
            </Contents>
          </>
        )}
      </Modals>
    </>
  );
};

export default qrJobsiteContent;
