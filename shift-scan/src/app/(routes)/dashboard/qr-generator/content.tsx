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

export default function QRGeneratorContent() {
  const [activeTab, setActiveTab] = useState(1);
  const t = useTranslations("Generator");

  return (
    <>
      <Grids rows={"10"}>
        <Holds position={"row"} className="row-span-1 h-full gap-1">
          <NewTab
            onClick={() => setActiveTab(1)}
            isActive={activeTab === 1}
            isComplete={true}
            titleImage="/jobsite.svg "
            titleImageAlt=""
          >
            <Titles size={"h3"}>{t("Jobsite")}</Titles>
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
    </>
  );
}
