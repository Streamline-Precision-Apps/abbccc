"use client";
import React from "react";
import { useState } from "react";
import { Holds } from "@/components/(reusable)/holds";
import { Grids } from "@/components/(reusable)/grids";
import { Titles } from "@/components/(reusable)/titles";
import FormSelection from "./formSelection";
import { TitleBoxes } from "@/components/(reusable)/titleBoxes";
import { useTranslations } from "next-intl";
// import CompanyDocuments from "./companyDocuments";
import { useRouter, useSearchParams } from "next/navigation";
import { Images } from "@/components/(reusable)/images";
import RTab from "./recieved";
import { NewTab } from "@/components/(reusable)/newTabs";

export default function InboxContent({ isManager }: { isManager: boolean }) {
  const [activeTab, setActiveTab] = useState(1);
  const router = useRouter();
  const searchParams = useSearchParams();
  const url = searchParams.get("returnUrl") || "/dashboard";
  const t = useTranslations("Hamburger-Inbox");
  const [loading, setLoading] = useState<boolean>(false);

  return (
    <div className="h-full w-full rounded-lg bg-white">
      <TitleBoxes
        className="h-16 flex-shrink-0 rounded-lg sticky top-0 z-10 bg-white"
        position={"row"}
        onClick={() => router.push(url)}
      >
        <Holds
          position={"row"}
          className="w-full justify-center items-center gap-x-2 "
        >
          <Titles size={"md"}>{t("FormsDocuments")}</Titles>
        </Holds>
      </TitleBoxes>

      {activeTab === 1 && (
        <>
          <div className="h-[50px] items-center flex flex-row gap-2 border-2  border-neutral-100 bg-neutral-100">
            <NewTab
              onClick={() => setActiveTab(1)}
              isActive={activeTab === 1}
              isComplete={true}
              titleImage={"/formInspect.svg"}
              titleImageAlt={""}
              animatePulse={loading}
              className="border-gray-200 border-2"
            >
              <Titles size={"sm"}>{t("Forms")}</Titles>
            </NewTab>

            {isManager && (
              <NewTab
                onClick={() => setActiveTab(3)}
                isActive={false}
                isComplete={true}
                titleImage={"/formApproval.svg"}
                titleImageAlt={""}
                animatePulse={loading}
              >
                <Titles size={"sm"}>{t("TeamSubmissions")}</Titles>
              </NewTab>
            )}
          </div>

          {/* <NewTab
                  onClick={() => setActiveTab(4)}
                  isActive={false}
                  isComplete={true}
                  titleImage={"/policies.svg"}
                  titleImageAlt={""}
                  animatePulse={loading}
                >
                  <Titles size={"h5"}>{t("Documents")}</Titles>
                </NewTab> */}

          <FormSelection
            setActiveTab={setActiveTab}
            activeTab={activeTab}
            loading={loading}
            setLoading={setLoading}
            isManager={isManager}
          />
        </>
      )}
      {activeTab !== 1 && (
        <>
          <div className="h-[50px] items-center flex flex-row gap-2 border-2  border-neutral-100 bg-neutral-100">
            <NewTab
              onClick={() => setActiveTab(1)}
              isActive={activeTab === 1}
              isComplete={true}
              titleImage={"/formInspect.svg"}
              titleImageAlt={""}
            >
              <Titles size={"sm"}>{t("Forms")}</Titles>
            </NewTab>

            {isManager && (
              <NewTab
                onClick={() => setActiveTab(3)}
                isActive={activeTab === 3}
                isComplete={true}
                titleImage={"/formApproval.svg"}
                titleImageAlt={""}
              >
                <Titles size={"sm"}>{t("TeamSubmissions")}</Titles>
              </NewTab>
            )}

            {/* <NewTab
                  onClick={() => setActiveTab(4)}
                  isActive={activeTab === 4}
                  isComplete={true}
                  titleImage={"/policies.svg"}
                  titleImageAlt={""}
                >
                  <Titles size={"h5"}>{t("Documents")}</Titles>
                </NewTab> */}
          </div>

          {activeTab === 3 && <RTab isManager={isManager} />}

          {/* {activeTab === 4 && <CompanyDocuments />} */}
        </>
      )}
    </div>
  );
}
