"use client";
import { useTranslations } from "next-intl";
import "@/app/globals.css";
import { useState } from "react";
import { Holds } from "@/components/(reusable)/holds";
import { Grids } from "@/components/(reusable)/grids";

import { Contents } from "@/components/(reusable)/contents";
import QrJobsiteContent from "./qrJobsiteContent";
import QrEquipmentContent from "./qrEquipmentContent";
import { NewTab } from "@/components/(reusable)/newTabs";
import { Titles } from "@/components/(reusable)/titles";
import { TitleBoxes } from "@/components/(reusable)/titleBoxes";
import { Images } from "@/components/(reusable)/images";
import { useRouter } from "next/navigation";

export default function QRGeneratorContent() {
  const [activeTab, setActiveTab] = useState(1);
  const t = useTranslations("Generator");
  const router = useRouter();

  return (
    <>
      <Holds background={"white"} className="row-start-1 row-end-2 h-full">
        <TitleBoxes position={"row"} onClick={() => router.back()}>
          <Titles size={"h2"}>{t("QrGenerator")}</Titles>
          <Images
            src="/qr.svg"
            alt="Team"
            className="w-8 h-8"
            titleImg={""}
            titleImgAlt={""}
          />
        </TitleBoxes>
      </Holds>
      <Holds className="row-start-2 row-end-8 h-full">
        <Grids rows={"10"}>
          <Holds position={"row"} className="row-span-1 h-full gap-1.5">
            <NewTab
              onClick={() => setActiveTab(1)}
              isActive={activeTab === 1}
              isComplete={true}
              titleImage="/jobsite.svg "
              titleImageAlt=""
            >
              <Titles size={"h2"}>{t("Jobsite")}</Titles>
            </NewTab>
            <NewTab
              onClick={() => setActiveTab(2)}
              isActive={activeTab === 2}
              isComplete={true}
              titleImage="/equipment.svg "
              titleImageAlt=""
            >
              <Titles size={"h3"}>{t("EquipmentTitle")}</Titles>
            </NewTab>
          </Holds>
          <Holds
            background={"white"}
            className="rounded-t-none row-span-9 h-full"
          >
            <Contents width={"section"} className="py-5">
              {activeTab === 1 && <QrJobsiteContent />}
              {activeTab === 2 && <QrEquipmentContent />}
            </Contents>
          </Holds>
        </Grids>
      </Holds>
    </>
  );
}
