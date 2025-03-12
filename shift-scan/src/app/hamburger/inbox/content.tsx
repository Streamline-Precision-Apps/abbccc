"use client";
import React, { useEffect } from "react";
import { useState } from "react";
import STab from "@/app/hamburger/inbox/sent";
import RTab from "@/app/hamburger/inbox/recieved";
import { Holds } from "@/components/(reusable)/holds";
import { Grids } from "@/components/(reusable)/grids";
import { NewTab } from "@/components/(reusable)/newTabs";
import { Titles } from "@/components/(reusable)/titles";
import FormSelection from "./formSelection";

export default function Content({ isManager }: { isManager: boolean }) {
  const [activeTab, setActiveTab] = useState(1);

  return (
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
            >
              <Titles size={"h4"}>Form Selection</Titles>
            </NewTab>
            <NewTab
              onClick={() => setActiveTab(2)}
              isActive={activeTab === 2}
              isComplete={true}
              titleImage={"/submittedForms.svg"}
              titleImageAlt={""}
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
              >
                <Titles size={"h4"}>Pending Forms</Titles>
              </NewTab>
            )}
          </Holds>
          {activeTab === 1 && <FormSelection />}
          {activeTab !== 1 && (
            <>
              {activeTab === 2 && <STab />}

              {isManager && activeTab === 3 && <RTab />}
            </>
          )}
        </Grids>
      </Holds>
    </Holds>
  );
}
