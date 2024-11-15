"use client";
import React from "react";
import { useState } from "react";
import { Tab } from "@/components/(reusable)/tab";
import STab from "@/app/hamburger/inbox/sTab";
import RTab from "@/app/hamburger/inbox/rTab";
import { Holds } from "@/components/(reusable)/holds";
import { Grids } from "@/components/(reusable)/grids";

export default function Content() {
  const [activeTab, setActiveTab] = useState(1); // change back to one

  return (
    <Holds className="h-full">
      <Grids className="grid-rows-10">
        <Holds position={"row"} className="row-span-1">
          <Tab onClick={() => setActiveTab(1)} isActive={activeTab === 1}>
            Sent
          </Tab>
          <Tab onClick={() => setActiveTab(2)} isActive={activeTab === 2}>
            Received
          </Tab>
        </Holds>
        <Holds
          background={"white"}
          className="rounded-t-none  row-span-9 h-full"
        >
          {activeTab === 1 && <STab />}
          {activeTab === 2 && <RTab />}
        </Holds>
      </Grids>
    </Holds>
  );
}
