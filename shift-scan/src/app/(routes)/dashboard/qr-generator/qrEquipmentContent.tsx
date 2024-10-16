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
import { EquipmentCodes, JobCodes } from "@/lib/types";
import { Holds } from "@/components/(reusable)/holds";
import SearchSelect from "@/components/(search)/searchSelect";

export default function QrEquipmentContent() {
  const router = useRouter();
  const [generatedList, setGeneratedList] = useState<EquipmentCodes[]>([]);
  const [selectedEquipmentName, setSelectedEquipmentName] =
    useState<string>("");
  const [selectedEquipment, setSelectedEquipment] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [qrCodeUrl, setQrCodeUrl] = useState("");
  const [loading, setLoading] = useState(true); // Loading state
  const t = useTranslations("Generator");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const equipmentResponse = await fetch("/api/getEquipment");

        if (!equipmentResponse.ok) {
          throw new Error("Failed to fetch equipment");
        }

        const equipment = await equipmentResponse.json();
        setGeneratedList(equipment);
        setLoading(false); // Set loading to false after data is fetched
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false); // Set loading to false even if there is an error
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
    router.push("/dashboard/qr-generator/add-equipment");
  };

  const handleSelectEquipment = (selectedOption: EquipmentCodes) => {
    setSelectedEquipment(selectedOption.qrId);
    setSelectedEquipmentName(selectedOption.name);
  };

  return (
    <>
      {loading ? (
        <Holds>
          <SearchSelect
            datatype={`${t("Loading")}`}
            options={generatedList}
            onSelect={handleSelectEquipment}
          />
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
      ) : (
        <Holds>
          {/* Use SearchSelect for equipment */}
          <SearchSelect
            datatype={`${t("EquipmentDatatype")}`}
            options={generatedList}
            onSelect={handleSelectEquipment}
          />

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
          <Modals
            isOpen={isModalOpen}
            handleClose={() => setIsModalOpen(false)}
            size="sm"
          >
            {selectedEquipment && (
              <Holds className="p-4">
                <Texts>
                  {selectedEquipmentName} {t("QRCode")}
                </Texts>
                <Contents position={"row"}>
                  <Images titleImg={qrCodeUrl} titleImgAlt={"QR Code"} />
                </Contents>
              </Holds>
            )}
          </Modals>
        </Holds>
      )}
    </>
  );
}
