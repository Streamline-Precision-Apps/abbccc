"use client";
import "@/app/globals.css";
import { useState } from "react";
import { Holds } from "@/components/(reusable)/holds";
import AddJobsiteForm from "./addJobsiteForm";
import { Texts } from "@/components/(reusable)/texts";

export const AddJobsiteContent = () => {
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
    {/* Displays a banner with the bannerText and disappears after 5 seconds to show submissions and errors.*/}
        { banner &&
          <Holds background="green" className="my-3">
          <Texts>{bannerText}</Texts>
        </Holds>
        }
      <Holds background={"white"}>
        <AddJobsiteForm setBanner={setBanner} setBannerText={setBannerText} handler={()=> handleBanner} />
      </Holds>
   </>
  );
};
