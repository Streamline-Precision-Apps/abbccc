"use client";
import "@/app/globals.css";
import { useState } from "react";
import { Sections } from "@/components/(reusable)/sections";
import { TitleBoxes } from "@/components/(reusable)/titleBoxes";
import AddJobsiteForm from "./addJobsiteForm";
import { Bases } from "@/components/(reusable)/bases";
import { useTranslations } from "next-intl";
import { Contents } from "@/components/(reusable)/contents";
import { Texts } from "@/components/(reusable)/texts";

export const AddJobsiteContent = () => {
  const t = useTranslations("addJobsiteContent");
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
    <Bases>
    <Contents>
      <Sections size={"titleBox"}>
        <TitleBoxes
          title={t("Title")}
          titleImg="/profile.svg"
          titleImgAlt="Team"
          variant={"default"}
          size={"default"}
          />
      </Sections>
      { banner &&
      <Contents variant="green" size={"listTitle"}>
      <Texts>{bannerText}</Texts>
    </Contents>
    }
      <Sections size={"dynamic"}>
        <AddJobsiteForm setBanner={setBanner} setBannerText={setBannerText} handler={()=> handleBanner} />
      </Sections>
    </Contents>
    </Bases>
  );
};
