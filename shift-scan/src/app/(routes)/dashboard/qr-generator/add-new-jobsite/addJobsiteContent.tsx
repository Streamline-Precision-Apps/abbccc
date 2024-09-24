"use client";
import "@/app/globals.css";
import { useState } from "react";
import { Holds } from "@/components/(reusable)/holds";
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
      <Holds size={"titleBox"}>
        <TitleBoxes
          title={t("Title")}
          titleImg="/profile.svg"
          titleImgAlt="Team"
          variant={"default"}
          size={"default"}
          />
      </Holds>
      { banner &&
      <Contents variant="green" size={"listTitle"}>
      <Texts>{bannerText}</Texts>
    </Contents>
    }
      <Holds size={"dynamic"}>
        <AddJobsiteForm setBanner={setBanner} setBannerText={setBannerText} handler={()=> handleBanner} />
      </Holds>
    </Contents>
    </Bases>
  );
};
