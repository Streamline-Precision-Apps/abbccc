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
import { Titles } from "@/components/(reusable)/titles";
import { Buttons } from "@/components/(reusable)/buttons";
import { Images } from "@/components/(reusable)/images";
import { title } from "process";
import { NewTab } from "@/components/(reusable)/newTabs";

export default function MechanicDisplay({ isManager }: { isManager: boolean }) {
  const [activeTab, setActiveTab] = useState(isManager ? 2 : 1);
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
            <Grids cols={"3"} rows={"2"} className="w-full h-full p-3 ">
              <Holds className="col-span-1 row-span-1 flex items-center justify-center fixed">
                <Buttons
                  onClick={() => router.push("/dashboard")}
                  background={"none"}
                  position={"left"}
                  size={"50"}
                >
                  <Images
                    titleImg="/turnBack.svg"
                    titleImgAlt={t("Mechanic")}
                    className="max-w-8 h-auto object-contain"
                  />
                </Buttons>
              </Holds>

              <Holds className="col-start-1 col-end-5 row-start-1 row-end-3 flex items-center justify-center">
                <Titles size={"h1"}>{t("Projects")}</Titles>
              </Holds>
            </Grids>
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
            <Grids cols={"3"} rows={"2"} className="w-full h-full p-3 ">
              <Holds className="col-span-1 row-span-1 flex items-center justify-center fixed">
                <Buttons
                  onClick={() => router.push("/dashboard")}
                  background={"none"}
                  position={"left"}
                  size={"50"}
                >
                  <Images
                    titleImg="/turnBack.svg"
                    titleImgAlt={t("Mechanic")}
                    className="max-w-8 h-auto object-contain"
                  />
                </Buttons>
              </Holds>

              <Holds className="col-start-1 col-end-5 row-start-1 row-end-3 flex items-center justify-center">
                <Titles size={"h1"}>
                  {activeTab === 1 ? t("PriorityList") : t("Projects")}
                </Titles>
              </Holds>
            </Grids>
          </Holds>
          <Holds className="row-span-7 h-full">
            <Grids rows={"10"} className="h-full">
              <Holds position={"row"} className="row-span-1 gap-1">
                <NewTab
                  titleImage="/OrangeOngoing.svg"
                  titleImageAlt={"Todays"}
                  onClick={() => setActiveTab(1)}
                  isActive={activeTab === 1}
                  isComplete={true}
                >
                  {t("Todays")}
                </NewTab>
                <NewTab
                  titleImage="/form.svg"
                  titleImageAlt={"all widgets"}
                  onClick={() => setActiveTab(2)}
                  isActive={activeTab === 2}
                  isComplete={true}
                >
                  {t("All")}
                </NewTab>
              </Holds>
              <Holds
                background={"white"}
                className="rounded-t-none row-span-9 h-full"
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
