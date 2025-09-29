"use client";

import { Contents } from "@/components/(reusable)/contents";
import { Grids } from "@/components/(reusable)/grids";
import { Holds } from "@/components/(reusable)/holds";
import { Titles } from "@/components/(reusable)/titles";
import { NewTab } from "@/components/(reusable)/newTabs";
import { useTranslations } from "next-intl";

export default function TascoClientPageSkeleton() {
  const t = useTranslations("Tasco");

  return (
    <>
      <Grids rows={"10"} gap={"3"} className="animate-pulse h-full w-full">
        <Holds
          className="w-full h-full items-center row-start-1 row-end-3"
          background={"white"}
        >
          <Holds className="w-full h-full items-center py-2">
            <Titles size={"h5"}>{t("LoadCounter")}</Titles>
            <div className="h-12 w-24 bg-gray-200 rounded-md"></div>
          </Holds>
        </Holds>

        <Holds className="row-start-3 row-end-11 h-full w-full">
          <Holds position={"row"} className="gap-1.5 h-[50px]">
            <NewTab
              titleImage="/comment.svg"
              titleImageAlt={t("Comments")}
              isActive={true}
            >
              <Titles size={"h4"}>{t("Comments")}</Titles>
            </NewTab>
            <NewTab
              titleImage="/refuel.svg"
              titleImageAlt={t("RefuelIcon")}
              isActive={false}
            >
              <Titles size={"h4"}>{t("RefuelLogs")}</Titles>
            </NewTab>
          </Holds>

          <Holds
            background={"white"}
            className="rounded-t-none h-full overflow-y-hidden no-scrollbar"
          >
            <Contents width={"section"} className="py-5">
              <Holds className="h-full w-full relative pt-2">
                <div className="h-32 bg-gray-200 rounded-md w-full"></div>
              </Holds>
            </Contents>
          </Holds>
        </Holds>
      </Grids>
    </>
  );
}
