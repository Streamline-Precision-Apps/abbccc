'use client'
import React, { useEffect } from 'react'
import { useState } from "react";
import {Tab} from "@/components/(inputs)/tab";
import {getUserSentContent } from '@/actions/inboxSentActions';
import { Sections } from '../../../components/(reusable)/sections';
import { Buttons } from '../../../components/(reusable)/buttons';
import {inboxContent} from "@/lib/types";
import STab from './sTab';
import RTab from './rTab';
import { Contents } from '@/components/(reusable)/contents';

export default function TabSection( { sentContent, recievedContent, session } :inboxContent) {
  const [activeTab, setActiveTab] = useState(1);
  const [sentContents, setSentContents] = useState(sentContent);
  const [recievedContents, setRecievedContents] = useState(recievedContent);
  const userId = session?.user?.id;

  async function fetchSentContent() {
    const results = await getUserSentContent(userId);
    return results;
  }

  return (
    <>
    <Contents size={null} variant={"default"} >
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
      <Sections size={"dynamic"}>
          {activeTab === 1 && <STab />}
          {activeTab === 2 && <RTab />}
        </Sections>
    </Contents>
    </>
  )
}
