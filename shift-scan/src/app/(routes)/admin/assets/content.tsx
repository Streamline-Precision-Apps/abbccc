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

type Jobsite = {
    id: number;
    jobsite_id: string;
    jobsite_name: string;
    street_number?: string | null;
    street_name?: string;
    city?: string;
    state?: string | null;
    country?: string;
    zip?: string;
    phone?: string;
    email?: string;
    created_at?: Date;
    jobsite_description?: string | null;
    jobsite_active: boolean;
}

type costCodes = {
    id: number;
    cost_code: string;
    cost_code_description: string;
    cost_code_type: string;
}


type Props = {
    equipment: Equipment[];
    jobsites: Jobsite[];
    costCodes: costCodes[];
}

export default function Content( { equipment , jobsites, costCodes }: Props ) {
    const [activeTab, setActiveTab] = useState(2); // change to one programming
    const [showBanner, setShowBanner] = useState<boolean>(false);
    const [banner, setBanner] = useState<string>("");


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
        <Contents size={null} variant={"default"} >
        { showBanner && ( 
                    <Contents size={null} variant={"green"} >
                        <Texts>{banner} something</Texts>
                    </Contents>     
                )
            } 
        </Contents>
        <Contents variant={"widgetButtonRow"} size={null}>
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
        <Sections size={"dynamic"}>
            {activeTab === 1 && <Equipment equipment={equipment} setBanner={setBanner} setShowBanner={setShowBanner} /> }
            {activeTab === 2 && <Jobsite jobsites={jobsites} setBanner={setBanner} setShowBanner={setShowBanner} /> }
            {activeTab === 3 && <Costcodes costCodes={costCodes} setBanner={setBanner} setShowBanner={setShowBanner} /> }
            </Sections>
        </Bases>
    )
}