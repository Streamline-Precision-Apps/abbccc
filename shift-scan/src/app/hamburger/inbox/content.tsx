"use client";
import { Bases } from "@/components/(reusable)/bases";
import { TitleBoxes } from "@/components/(reusable)/titleBoxes";
import { useTranslations } from "next-intl";
import React from "react";
import { useState } from "react";
import { Tab } from "@/components/(reusable)/tab";
import { inboxContent } from "@/lib/types";
import STab from "./sTab";
import RTab from "./rTab";
import { Contents } from "@/components/(reusable)/contents";
import { Holds } from "@/components/(reusable)/holds";
import { Grids } from "@/components/(reusable)/grids";

export default function Content() {
  const t = useTranslations("Hamburger");
  const [activeTab, setActiveTab] = useState(1);

  return (
    <Holds className="h-full">
      <Grids className="grid-rows-10">
        <Holds position={"row"} className="row-span-1">
          <Tab
            onClick={() => setActiveTab(1)}
            tabLabel="Sent"
            isTabActive={activeTab === 1}
          />
          <Tab
            onClick={() => setActiveTab(2)}
            tabLabel="Received"
            isTabActive={activeTab === 2}
          />
        </Holds>
        <Holds
          background={"white"}
          className="rounded-t-none row-span-9 h-full"
        >
          {activeTab === 1 && <STab />}
          {activeTab === 2 && <RTab />}
        </Holds>
      </Grids>
    </Holds>
  );
}
