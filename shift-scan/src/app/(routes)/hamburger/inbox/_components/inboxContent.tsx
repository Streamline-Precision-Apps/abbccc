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
    <Grids rows={"7"} gap={"5"} className="h-full">
      <Holds
        background={"white"}
        className={`row-span-1 h-full ${loading && "animate-pulse"} `}
      >
        <TitleBoxes position={"row"} onClick={() => router.push(url)}>
          <Holds
            position={"row"}
            className="w-full justify-center items-center gap-x-2 "
          >
            <Titles size={"h3"}>{t("FormsDocuments")}</Titles>
            <Images
              titleImg="/form.svg"
              titleImgAlt="Inbox"
              className="max-w-6 h-auto object-contain"
            />
          </Holds>
        </TitleBoxes>
      </Holds>
      <Holds className={`row-start-2 row-end-8 h-full`}>
        {activeTab === 1 && (
          <Holds className="h-full w-full">
            <Grids rows={"12"} className="h-full w-full">
              <Holds position={"row"} className="gap-x-1 row-start-1 row-end-2">
                <NewTab
                  onClick={() => setActiveTab(1)}
                  isActive={activeTab === 1}
                  isComplete={true}
                  titleImage={"/formInspect.svg"}
                  titleImageAlt={""}
                  animatePulse={loading}
                >
                  <Titles size={"h5"}>{t("Forms")}</Titles>
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
                    <Titles size={"h5"}>{t("TeamSubmissions")}</Titles>
                  </NewTab>
                )}

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
              </Holds>
              <Holds className="row-start-2 row-end-13 h-full">
                <FormSelection
                  setActiveTab={setActiveTab}
                  activeTab={activeTab}
                  loading={loading}
                  setLoading={setLoading}
                  isManager={isManager}
                />
              </Holds>
            </Grids>
          </Holds>
        )}
        {activeTab !== 1 && (
          <Holds className=" h-full w-full">
            <Grids rows={"12"} className="h-full w-full">
              <Holds position={"row"} className="gap-x-1 h-full">
                <NewTab
                  onClick={() => setActiveTab(1)}
                  isActive={activeTab === 1}
                  isComplete={true}
                  titleImage={"/formInspect.svg"}
                  titleImageAlt={""}
                >
                  <Titles size={"h5"}>{t("Forms")}</Titles>
                </NewTab>

                {isManager && (
                  <NewTab
                    onClick={() => setActiveTab(3)}
                    isActive={activeTab === 3}
                    isComplete={true}
                    titleImage={"/formApproval.svg"}
                    titleImageAlt={""}
                  >
                    <Titles size={"h5"}>{t("TeamSubmissions")}</Titles>
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
              </Holds>
              <Holds
                background={"white"}
                className="row-start-2 row-end-13 h-full rounded-t-none "
              >
                {activeTab === 3 && <RTab isManager={isManager} />}

                {/* {activeTab === 4 && <CompanyDocuments />} */}
              </Holds>
            </Grids>
          </Holds>
        )}
      </Holds>
    </Grids>
  );
}
