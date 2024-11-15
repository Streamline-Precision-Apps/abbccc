"use client";
import { useTranslations } from "next-intl";
import "@/app/globals.css";
import { useState } from "react";
import { Holds } from "@/components/(reusable)/holds";
import { Grids } from "@/components/(reusable)/grids";
import { Tab } from "@/components/(reusable)/tab";
import { Contents } from "@/components/(reusable)/contents";
import QrJobsiteContent from "./qrJobsiteContent";
import QrEquipmentContent from "./qrEquipmentContent";

export default function QRGeneratorContent() {
  const [activeTab, setActiveTab] = useState(1);
  const t = useTranslations("Generator");
  const u = useTranslations("Generator");

  return (
    <>
      <Grids rows={"10"}>
        <Holds position={"row"} className="row-span-1 h-full gap-2">
          <Tab onClick={() => setActiveTab(1)} isActive={activeTab === 1}>
            {t("Jobsite")}
          </Tab>
          <Tab onClick={() => setActiveTab(2)} isActive={activeTab === 2}>
            {u("EquipmentTitle")}
          </Tab>
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
