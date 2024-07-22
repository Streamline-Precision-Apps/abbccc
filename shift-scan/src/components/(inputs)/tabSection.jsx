'use client'
import React, { useEffect } from 'react'
import { useState } from "react";
import {Tab} from "@/components/(inputs)/tab";
import { getSentContent } from '@/actions/inboxSentActions';
import { Sections } from '../(reusable)/sections';
import { Buttons } from '../(reusable)/buttons';

export default function TabSection() {
  const [activeTab, setActiveTab] = useState(1);
  const [formData, setFormData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const results = await fetchSentContent();
      setFormData(results);
    };

    fetchData();
  }, []);

  async function fetchSentContent() {
    const results = await getSentContent();
    return results;
  }

  return (
    <div>
      <div className="py-4 max-w[400px]">
        <div className="flex gap-2">
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
        </div>
        <Sections variant={"tab"} size={"default"}>
          {activeTab === 1 && <ul> {formData.map((data, index) => ( <li key={index}>{data.firstName}</li> ))} </ul>}
          {activeTab === 2 && <p>Received Content</p>}
          <Buttons variant={"green"}>Add</Buttons>
        </Sections>
      </div>
    </div>
  )
}
