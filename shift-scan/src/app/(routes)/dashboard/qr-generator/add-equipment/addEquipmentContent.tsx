"use client";
import "@/app/globals.css";
import { useState } from "react";
import { Holds } from "@/components/(reusable)/holds";
import { TitleBoxes } from "@/components/(reusable)/titleBoxes";
import AddEquipmentForm from "./addEquipmentForm";
import EquipmentPicture from "../../../../../components/(camera)/camera";
import { Bases } from "@/components/(reusable)/bases";
import { useTranslations } from "next-intl";
import { Titles } from "@/components/(reusable)/titles";
import { Contents } from "@/components/(reusable)/contents";
import { Texts } from "@/components/(reusable)/texts";
import { Images } from "@/components/(reusable)/images";

export const AddEquipmentContent = () => {
  const [base64String, setBase64String] = useState<string>("");
  const t = useTranslations("Generator");
  const [banner, setBanner] = useState(false);
  const [bannerText, setBannerText] = useState("");

  const handleBanner = (words: string) => {
    setBanner(true);
    setBannerText(words);
    setTimeout(() => {
      setBanner(false);
      setBannerText("");
    }, 5000);
  };

  return (
    <Holds>
      {banner && (
        <Holds background="green" className="my-3">
          <Texts>{bannerText}</Texts>
        </Holds>
      )}
      <Holds background="white" className="mt-5">
        <Contents width={"section"} className="mt-2 mb-5">
          <Titles size={"h3"}>{t("Picture")}</Titles>
          <Images
            titleImg={"/camera.svg"}
            titleImgAlt={"camera"}
            size={"10"}
            className="my-3"
          />
          <EquipmentPicture setBase64String={setBase64String} />
        </Contents>
      </Holds>
      <AddEquipmentForm
        base64String={base64String}
        setBanner={setBanner}
        setBannerText={setBannerText}
        handler={() => handleBanner}
      />
    </Holds>
  );
};
