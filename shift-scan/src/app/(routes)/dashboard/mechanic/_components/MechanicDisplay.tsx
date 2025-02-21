"use client";
import { Holds } from "@/components/(reusable)/holds";
import { useState } from "react";
import MechanicPriority from "./MechanicPriorityList";
import { Grids } from "@/components/(reusable)/grids";
import { Tab } from "@/components/(reusable)/tab";
// import { useTranslations } from "next-intl";
import { TitleBoxes } from "@/components/(reusable)/titleBoxes";
import MechanicSelectList from "./MechanicSelectList";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

export default function MechanicDisplay({ isManager }: { isManager: boolean }) {
  const [activeTab, setActiveTab] = useState(1);
  const router = useRouter();
  const t = useTranslations("MechanicWidget");
  return (
    <>
      {!isManager && (
        <Grids rows={"8"} gap={"5"}>
          <Holds
            background={"white"}
            className="row-span-1 h-full justify-center"
          >
            <TitleBoxes
              title={t("Projects")}
              titleImg="/mechanic.svg"
              titleImgAlt={t("Mechanic")}
              type="row"
            />
          </Holds>

          <MechanicPriority />
        </Grids>
      )}
      {isManager && (
        <Grids rows={"8"} gap={"5"}>
          <Holds
            background={"white"}
            className="row-span-1 h-full justify-center"
          >
            <TitleBoxes
              title={activeTab === 1 ? t("PriorityList") : t("Projects")}
              titleImg="/mechanic.svg"
              titleImgAlt={t("Mechanic")}
              onClick={() => router.push("/dashboard")}
              type="noIcon-NoHref"
            />
          </Holds>
          <Holds className="row-span-7 h-full">
            <Grids rows={"10"} className="h-full">
              <Holds position={"row"} className="row-span-1 gap-2">
                <Tab
                  onClick={() => setActiveTab(1)}
                  isActive={activeTab === 1}
                  size={"md"}
                >
                  {t("Todays")}
                </Tab>
                <Tab
                  onClick={() => setActiveTab(2)}
                  isActive={activeTab === 2}
                  size={"md"}
                >
                  {t("All")}
                </Tab>
              </Holds>
              <Holds
                background={"white"}
                className="rounded-t-none row-span-9 h-full py-2"
              >
                {activeTab === 1 && <MechanicPriority />}
                {activeTab === 2 && <MechanicSelectList />}
              </Holds>
            </Grids>
          </Holds>
        </Grids>
      )}
    </>
  );
}
