"use client";
import { Holds } from "@/components/(reusable)/holds";
import { Tab } from "@/components/(reusable)/tab";
import { useState } from "react";
import AdminSTab from "./AdminSTab";
import AdminRTab from "./AdminRTab";
import { useSession } from "next-auth/react";
import { CreateRequest } from "./CreateRequest";
import { set } from "zod";
import { EditRequest } from "./EditRequest";

export const AdminInbox = () => {
  const [activeTab, setActiveTab] = useState(1); // change back to one
  const [form, SetForm] = useState(0);

  const handleForm = () => {
    SetForm(1);
  };

  return (
    <Holds className="h-full">
      <Holds position={"row"} className="row-span-1 gap-5 w-full">
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
        position={"row"}
        background={"white"}
        className="rounded-t-none h-full p-4 gap-5"
      >
        <Holds
          size={"40"}
          className="border-[3px] border-black h-full rounded-[10px]"
        >
          {activeTab === 1 && <AdminSTab />}
          {activeTab === 2 && <AdminRTab />}
        </Holds>
        <Holds size={"60"} className="h-full">
          {form === 0 && <CreateRequest />}
          {form === 1 && <EditRequest />}
        </Holds>
      </Holds>
    </Holds>
  );
};
