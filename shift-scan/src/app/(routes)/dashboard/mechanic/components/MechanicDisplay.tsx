"use client";
import { Holds } from "@/components/(reusable)/holds";
import { useState } from "react";
import MechanicPriority from "./MechanicPriorityList";
import { Grids } from "@/components/(reusable)/grids";
import { Tab } from "@/components/(reusable)/tab";
import { useTranslations } from "next-intl";
import { TitleBoxes } from "@/components/(reusable)/titleBoxes";
import MechanicSelectList from "./MechanicSelectList";

export default function MechanicDisplay() {
  const [isManager, setIsManager] = useState(true);
  const [activeTab, setActiveTab] = useState(1);
  const t = useTranslations("Mechanic");

  return (
    <>
      {!isManager && (
        <Grids rows={"8"} gap={"5"}>
          <Holds
            background={"white"}
            className="row-span-1 h-full justify-center"
          >
            <TitleBoxes
              title="Projects"
              titleImg="/mechanic.svg"
              titleImgAlt="Mechanic"
              type="row"
            />
          </Holds>
          <Holds background={"white"} className="row-span-7 h-full">
            <MechanicPriority />
          </Holds>
        </Grids>
      )}
      {isManager && (
        <Grids rows={"8"} gap={"5"}>
          <Holds
            background={"white"}
            className="row-span-1 h-full justify-center"
          >
            <TitleBoxes
              title={activeTab === 1 ? "Priority List" : "Projects"}
              titleImg="/mechanic.svg"
              titleImgAlt="Mechanic"
              type="row"
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
                  Todays
                </Tab>
                <Tab
                  onClick={() => setActiveTab(2)}
                  isActive={activeTab === 2}
                  size={"md"}
                >
                  All
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
