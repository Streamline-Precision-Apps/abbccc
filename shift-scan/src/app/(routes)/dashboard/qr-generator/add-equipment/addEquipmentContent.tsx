"use client";
import "@/app/globals.css";
import { useState } from "react";
import { Holds } from "@/components/(reusable)/holds";
import AddEquipmentForm from "./addEquipmentForm";
import { Texts } from "@/components/(reusable)/texts";

export const AddEquipmentContent = () => {
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
    <>
      {banner && (
        <Holds background="green" className="my-3">
          <Texts>{bannerText}</Texts>
        </Holds>
      )}

      <AddEquipmentForm
        setBanner={setBanner}
        setBannerText={setBannerText}
        handler={() => handleBanner}
      />
    </>
  );
};
