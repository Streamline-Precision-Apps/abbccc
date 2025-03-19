"use client";
import React, { useEffect } from "react";
import { useState } from "react";
import STab from "@/app/hamburger/inbox/_components/sent";
import RTab from "@/app/hamburger/inbox/_components/recieved";
import { Holds } from "@/components/(reusable)/holds";
import { Grids } from "@/components/(reusable)/grids";
import { NewTab } from "@/components/(reusable)/newTabs";
import { Titles } from "@/components/(reusable)/titles";
import FormSelection from "./formSelection";
import { Contents } from "@/components/(reusable)/contents";
import { TitleBoxes } from "@/components/(reusable)/titleBoxes";
import { useTranslations } from "next-intl";

export default function InboxContent({ isManager }: { isManager: boolean }) {
  const [activeTab, setActiveTab] = useState(1);
  const t = useTranslations("Hamburger");
  const [loading, setLoading] = useState<boolean>(false);
  return (
    <>
      <Holds
        background={"white"}
        className={`row-span-1 h-full ${loading && "animate-pulse"} `}
      >
        <Contents width={"section"}>
          <TitleBoxes
            title={t("Inbox")}
            titleImg="/Inbox.svg"
            titleImgAlt="Inbox"
          />
        </Contents>
      </Holds>
      <Holds className={`row-span-8 h-full `}>
        <Holds className="h-full">
          <Grids className="grid-rows-10">
            <Holds position={"row"} className="row-span-1 gap-1">
              <NewTab
                onClick={() => setActiveTab(1)}
                isActive={activeTab === 1}
                isComplete={true}
                titleImage={"/formSelection.svg"}
                titleImageAlt={""}
                animatePulse={loading}
              >
                <Titles size={"h4"}>Form Selection</Titles>
              </NewTab>
              <NewTab
                onClick={() => setActiveTab(2)}
                isActive={activeTab === 2}
                isComplete={true}
                titleImage={"/submittedForms.svg"}
                titleImageAlt={""}
                animatePulse={loading}
              >
                <Titles size={"h4"}>Submitted Forms</Titles>
              </NewTab>
              {isManager && (
                <NewTab
                  onClick={() => setActiveTab(3)}
                  isActive={activeTab === 3}
                  isComplete={true}
                  titleImage={"/pendingForms.svg"}
                  titleImageAlt={""}
                  animatePulse={loading}
                >
                  <Titles size={"h4"}>Pending Forms</Titles>
                </NewTab>
              )}
            </Holds>
            {activeTab === 1 && (
              <FormSelection loading={loading} setLoading={setLoading} />
            )}
            {activeTab !== 1 && (
              <>
                {activeTab === 2 && <STab />}

                {isManager && activeTab === 3 && <RTab isManager={isManager} />}
              </>
            )}
          </Grids>
        </Holds>
      </Holds>
    </>
  );
}
