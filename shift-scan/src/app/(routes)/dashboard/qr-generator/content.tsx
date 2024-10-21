"use client";
import { useTranslations } from "next-intl";
import "@/app/globals.css";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Bases } from "@/components/(reusable)/bases";
import { Holds } from "@/components/(reusable)/holds";
import { Titles } from "@/components/(reusable)/titles";
import { Banners } from "@/components/(reusable)/banners";
import { Footers } from "@/components/(reusable)/footers";
import { Grids } from "@/components/(reusable)/grids";
import { setAuthStep } from "@/app/api/auth";
import { CustomSession, SearchUser, User } from "@/lib/types";
import { useSession } from "next-auth/react";
import { Tab } from "@/components/(reusable)/tab";
import { Contents } from "@/components/(reusable)/contents";
import { TitleBoxes } from "@/components/(reusable)/titleBoxes";
import QrJobsiteContent from "./qrJobsiteContent";
import QrEquipmentContent from "./qrEquipmentContent";

export default function QRGeneratorContent() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState(1);
  const t = useTranslations("Generator");
  const u = useTranslations("Generator");

  return (
    <>
      <Grids rows={"10"}>
        <Holds position={"row"} className="row-span-1 h-full gap-2">
          <Tab
            onClick={() => setActiveTab(1)}
            tabLabel={t("Jobsite")}
            isTabActive={activeTab === 1}
          />
          <Tab
            onClick={() => setActiveTab(2)}
            tabLabel={u("EquipmentTitle")}
            isTabActive={activeTab === 2}
          />
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
