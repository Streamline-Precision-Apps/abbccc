"use client";
import { Bases } from "@/components/(reusable)/bases";
import { Buttons } from "@/components/(reusable)/buttons";
import { Contents } from "@/components/(reusable)/contents";
import { Sections } from "@/components/(reusable)/sections";
import { Texts } from "@/components/(reusable)/texts";
import { TitleBoxes } from "@/components/(reusable)/titleBoxes";
import { Tab } from "@/components/(inputs)/tab";
import { useState } from "react";
import Jobsite from "./(components)/jobsite";
import Equipment from "./(components)/equipment";
import Costcodes from "./(components)/costcodes";

type Equipment = {
    id: string;
    qr_id: string;
    name: string;
    equipment_tag: string;
}
type Props = {
    equipment: Equipment[];
}

export default function Content( { equipment }: Props ) {
    const [activeTab, setActiveTab] = useState(1);
    
    return (
        <Bases>
        <Sections
        size={"titleBox"}>
            <TitleBoxes
            title="Assets"
            titleImg="/assets.svg"
            titleImgAlt="Assests"
            variant={"default"}
            size={"default"}
            type="noIcon"
            />
        </Sections>
        <Sections size={"dynamic"}>
        <Contents size={"assets"} variant={"row"}>
        <Tab 
        onClick={() => setActiveTab(1)}
        tabLabel= "Equipment" 
        isTabActive= {activeTab === 1}
        />
            <Tab
            onClick={() => setActiveTab(2)} 
            tabLabel= "Job Codes"
            isTabActive= {activeTab === 2}
            />  

        <Tab
        onClick={() => setActiveTab(3)} 
        tabLabel= "Cost Codes"
        isTabActive= {activeTab === 3}
        />  
            </Contents>
            {activeTab === 1 && <Equipment equipment={equipment}/> }
            {activeTab === 2 && <Jobsite/>}
            {activeTab === 3 && <Costcodes/>}
            </Sections>
        </Bases>
    )
}