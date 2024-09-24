"use client"
import { Bases } from "@/components/(reusable)/bases";
import { TitleBoxes } from "@/components/(reusable)/titleBoxes";
import { useTranslations } from "next-intl";
import React, { useEffect } from 'react'
import { useState } from "react";
import {Tab} from "@/components/(reusable)/tab";
import {getUserSentContent } from '@/actions/inboxSentActions';
import { Holds } from '../../../components/(reusable)/holds';
import { Buttons } from '../../../components/(reusable)/buttons';
import {inboxContent} from "@/lib/types";
import STab from './sTab';
import RTab from './rTab';
import { Contents } from '@/components/(reusable)/contents';

export default function Content( { sentContent, receivedContent: recievedContent, session } : inboxContent) {
    const t = useTranslations("Hamburger");
    const [activeTab, setActiveTab] = useState(1);
    const [sentContents, setSentContents] = useState([]);
    const [recievedContents, setRecievedContents] = useState(recievedContent);
    const userId = session?.user?.id;

        return (
        <Bases>
        <Contents>
        <Holds 
        size={"titleBox"}>
            <TitleBoxes
            title={t("Inbox")}
            titleImg="/Inbox.svg"
            titleImgAlt="Inbox"
            />
        </Holds>

    <Contents variant={"widgetButtonRow"} size={null}>
        <Tab 
        onClick={() => setActiveTab(1)}
        tabLabel= "Sent" 
        isTabActive= {activeTab === 1}
        />
        <Tab
        onClick={() => setActiveTab(2)} 
        tabLabel= "Received"
        isTabActive= {activeTab === 2}
        />  
    </Contents>
        <Holds variant={"tab"} size={"default"}>
            {activeTab === 1 && <STab  sentContent={sentContent} session={session}/>}  
            {activeTab === 2 && <RTab receivedContent={recievedContent} session={session} sentContent={sentContent}/>}
        </Holds>
        </Contents>
        </Bases>  
    )
}
