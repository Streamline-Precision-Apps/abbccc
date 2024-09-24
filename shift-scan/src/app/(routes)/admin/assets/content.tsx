"use client";
import { Bases } from "@/components/(reusable)/bases";
import { Buttons } from "@/components/(reusable)/buttons";
import { Contents } from "@/components/(reusable)/contents";
import { Holds } from "@/components/(reusable)/holds";
import { Texts } from "@/components/(reusable)/texts";
import { TitleBoxes } from "@/components/(reusable)/titleBoxes";
import { Tab } from "@/components/(reusable)/tab";
import { useState } from "react";
import Jobsite from "./(components)/jobsite";
import Equipment from "./(components)/equipment";
import Costcodes from "./(components)/costcodes";
import {
  Equipment as EquipmentType,
  Jobsites,
  costCodes,
} from "@/lib/types";

type Props = {
  equipment: EquipmentType[];
  jobsites: Jobsites[];
  costCodes: costCodes[];
};

export default function Content({ equipment, jobsites, costCodes }: Props) {
  const [activeTab, setActiveTab] = useState(2); // change to one programming
  const [showBanner, setShowBanner] = useState<boolean>(false);
  const [banner, setBanner] = useState<string>("");

  return (
    <Bases>
      <Holds size={"titleBox"}>
        <TitleBoxes
          title="Assets"
          titleImg="/assets.svg"
          titleImgAlt="Assests"
          variant={"default"}
          size={"default"}
          type="noIcon"
        />
      </Holds>
      <Contents size={null} variant={"default"}>
        {showBanner && (
          <Contents size={null}>
            <Texts>{banner} something</Texts>
          </Contents>
        )}
      </Contents>
      <Contents variant={"widgetButtonRow"} size={null}>
        <Tab
          onClick={() => setActiveTab(1)}
          tabLabel="Equipment"
          isTabActive={activeTab === 1}
        />

        <Tab
          onClick={() => setActiveTab(2)}
          tabLabel="Job Codes"
          isTabActive={activeTab === 2}
        />

        <Tab
          onClick={() => setActiveTab(3)}
          tabLabel="Cost Codes"
          isTabActive={activeTab === 3}
        />
      </Contents>
      <Holds size={"dynamic"}>
        {activeTab === 1 && (
          <Equipment
            equipment={equipment}
            setBanner={setBanner}
            setShowBanner={setShowBanner}
          />
        )}
        {activeTab === 2 && (
          <Jobsite
            jobsites={jobsites}
            setBanner={setBanner}
            setShowBanner={setShowBanner}
          />
        )}
        {activeTab === 3 && (
          <Costcodes
            jobsites={jobsites}
            costCodes={costCodes}
            setBanner={setBanner}
            setShowBanner={setShowBanner}
          />
        )}
      </Holds>
    </Bases>
  );
}
