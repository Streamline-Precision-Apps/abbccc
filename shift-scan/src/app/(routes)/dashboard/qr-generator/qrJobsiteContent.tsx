"use client";
import { Buttons } from "@/components/(reusable)/buttons";
import React, { useState, useEffect } from "react";
import { Modals } from "@/components/(reusable)/modals";
import QRCode from "qrcode";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { Titles } from "@/components/(reusable)/titles";
import { Contents } from "@/components/(reusable)/contents";
import { Texts } from "@/components/(reusable)/texts";
import { Images } from "@/components/(reusable)/images";
import { Holds } from "@/components/(reusable)/holds";
import { TitleBoxes } from "@/components/(reusable)/titleBoxes";
import { Selects } from "@/components/(reusable)/selects";
import { Options } from "@/components/(reusable)/options";
import { JobCodes } from "@/lib/types";

type Props = {
  jobCodes: JobCodes[];
};

export default function QrJobsiteContent({ jobCodes }: Props) {
  const [selectedJobSiteName, setSelectedJobSiteName] = useState<string>("");
  const [selectedJobSite, setSelectedJobSite] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [qrCodeUrl, setQrCodeUrl] = useState("");
  const router = useRouter();
  const t = useTranslations("QrJobsiteContent");
  const q = useTranslations("qr-Generator");

  const handleGenerate = async () => {
    if (selectedJobSite) {
      try {
        const url = await QRCode.toDataURL(selectedJobSite);
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
    router.push("/dashboard/qr-generator/add-new-jobsite");
  };

  const handleOptionSelect = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedId = event.target.value;
    const selectedOption = jobCodes.find(
      (option) => option.qrId === selectedId
    );

    if (selectedOption) {
      setSelectedJobSite(selectedOption.qrId);
      setSelectedJobSiteName(selectedOption.name);
    }
  };
  return (
    <>
      <Holds size={"titleBox"}>
        <TitleBoxes
          title={q("Title")}
          titleImg="/new/qr.svg"
          titleImgAlt="Team"
          variant={"default"}
          size={"default"}
        />
      </Holds>
      <Holds size={"half"}>
        <Contents variant={"center"} size={null}>
        <Images titleImg="/new/jobsite.svg" titleImgAlt="jobsite" variant={"icon"} size={"iconMed"}/>
        <Titles variant={"default"} size={"default"}>{t("Jobsite")}</Titles>
        </Contents>
        <Selects value={selectedJobSite} onChange={handleOptionSelect}>
        <Options variant={"default"} value="">
        Select One
        </Options>
        {jobCodes.map((option) => (
        <Options
        variant={"default"}
        key={option.qrId}
        value={option.qrId}
        >
        {option.name}
        </Options>
        ))}
        </Selects>
        <Contents variant={"rowCenter"} size={null}>
          <Buttons variant={"orange"} onClick={handleGenerate} size={null}>
            <Titles variant={"default"} size={"h1"}>{t("Generate")}</Titles>
          </Buttons>
          <Buttons variant={"green"} onClick={handleNew} size={null}>
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
                {selectedJobSiteName} {t("QR Code")}
              </Texts>
              <Contents variant={"rowCenter"} size={"default"}>
                <Images titleImg="" titleImgAlt="QR Code" src={qrCodeUrl} />
              </Contents>
            </>
          )}
        </Modals>
      </Holds>
    </>
  );
}
