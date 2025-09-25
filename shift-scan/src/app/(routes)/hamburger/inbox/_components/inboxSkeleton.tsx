"use client";
import React from "react";
import { Holds } from "@/components/(reusable)/holds";
import { Titles } from "@/components/(reusable)/titles";
import { TitleBoxes } from "@/components/(reusable)/titleBoxes";
import { useTranslations } from "next-intl";
import { NewTab } from "@/components/(reusable)/newTabs";

export default function InboxSkeleton() {
  const t = useTranslations("Hamburger-Inbox");

  return (
    <div className="h-full w-full rounded-lg bg-white">
      <TitleBoxes
        className="h-16 flex-shrink-0 rounded-lg sticky top-0 z-10 bg-white"
        position={"row"}
      >
        <Holds
          position={"row"}
          className="w-full justify-center items-center gap-x-2 "
        >
          <Titles size={"md"}>{t("FormsDocuments")}</Titles>
        </Holds>
      </TitleBoxes>

      <div className="h-[50px] items-center flex flex-row gap-2 border-2 border-neutral-100 bg-neutral-100">
        <NewTab
          onClick={() => {}}
          isActive={true}
          isComplete={true}
          titleImage={"/formInspect.svg"}
          titleImageAlt={""}
          className="border-gray-200 border-2"
        >
          <Titles size={"sm"}>{t("Forms")}</Titles>
        </NewTab>
        <NewTab
          onClick={() => {}}
          isActive={false}
          isComplete={true}
          titleImage={"/formApproval.svg"}
          titleImageAlt={""}
        >
          <Titles size={"sm"}>{t("TeamSubmissions")}</Titles>
        </NewTab>
      </div>

      {/* Skeleton loading UI */}
      <div className="p-4 space-y-4">
        {Array(5)
          .fill(0)
          .map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="h-12 bg-gray-200 rounded-md w-full"></div>
            </div>
          ))}
      </div>
    </div>
  );
}
