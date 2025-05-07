"use client";
import React, { useEffect } from "react";
import { useState } from "react";
import STab from "@/app/(routes)/hamburger/inbox/_components/sent";

import { Holds } from "@/components/(reusable)/holds";
import { Grids } from "@/components/(reusable)/grids";
import { Titles } from "@/components/(reusable)/titles";
import FormSelection from "./formSelection";
import { TitleBoxes } from "@/components/(reusable)/titleBoxes";
import { useTranslations } from "next-intl";
import CompanyDocuments from "./companyDocuments";
import { useRouter, useSearchParams } from "next/navigation";
import { Images } from "@/components/(reusable)/images";
import RTab from "./recieved";

export default function InboxContent({ isManager }: { isManager: boolean }) {
  const [activeTab, setActiveTab] = useState(1);
  const router = useRouter();
  const searchParams = useSearchParams();
  const url = searchParams.get("returnUrl") || "/dashboard";
  const t = useTranslations("Hamburger");
  const [loading, setLoading] = useState<boolean>(false);
  return (
    <Grids rows={"7"} gap={"5"} className="h-full">
      <Holds
        background={"white"}
        className={`row-span-1 h-full ${loading && "animate-pulse"} `}
      >
        <TitleBoxes position={"row"} onClick={() => router.push(url)}>
          <Titles size={"h3"}>{t("FormsDocuments")}</Titles>
          <Images
            titleImg="/form.svg"
            titleImgAlt="Inbox"
            className="h-8 w-8"
          />
        </TitleBoxes>
      </Holds>
      <Holds className={`row-start-2 row-end-8 h-full`}>
        {activeTab === 1 && (
          <FormSelection
            setActiveTab={setActiveTab}
            activeTab={activeTab}
            loading={loading}
            setLoading={setLoading}
            isManager={isManager}
          />
        )}
        {activeTab !== 1 && (
          <>
            {activeTab === 2 && (
              <STab
                setActiveTab={setActiveTab}
                activeTab={activeTab}
                isManager={isManager}
              />
            )}

            {activeTab === 3 && (
              <RTab
                setActiveTab={setActiveTab}
                activeTab={activeTab}
                isManager={isManager}
              />
            )}

            {activeTab === 4 && (
              <CompanyDocuments
                setActiveTab={setActiveTab}
                activeTab={activeTab}
                isManager={isManager}
              />
            )}
          </>
        )}
      </Holds>
    </Grids>
  );
}
