"use client";
import { Holds } from "@/components/(reusable)/holds";
import { Tab } from "@/components/(reusable)/tab";
import { useState } from "react";
import AdminSTab from "./AdminSTab";
import AdminRTab from "./AdminRTab";
import { useTranslations } from "next-intl";

// import { CreateRequest } from "./CreateRequest";

// import { EditRequest } from "./EditRequest";

export const AdminInbox = () => {
  const [activeTab, setActiveTab] = useState(1); // change back to one
  const t = useTranslations("Admins");
  return (
    <Holds className="h-full">
      <Holds position={"row"} className="row-span-1 gap-5 w-full ">
        <Tab onClick={() => setActiveTab(1)} isActive={activeTab === 1}>
          {t("Sent")}
        </Tab>
        <Tab onClick={() => setActiveTab(2)} isActive={activeTab === 2}>
          {t("Recieved")}
        </Tab>
      </Holds>
      <Holds
        position={"row"}
        background={"white"}
        className="rounded-t-none h-full p-3 gap-5"
      >
        <Holds
          size={"40"}
          className="border-[3px] border-black h-full rounded-[10px]"
        >
          {activeTab === 1 && <AdminSTab />}
          {activeTab === 2 && <AdminRTab />}
        </Holds>
        <Holds size={"60"} className="h-full">
          {/* {form === 0 && <CreateRequest />}
          {form === 1 && <EditRequest />} */}
        </Holds>
      </Holds>
    </Holds>
  );
};
