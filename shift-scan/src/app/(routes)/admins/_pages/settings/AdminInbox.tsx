"use client";
import { Holds } from "@/components/(reusable)/holds";
import { useState } from "react";
import { useTranslations } from "next-intl";
import { NewTab } from "@/components/(reusable)/newTabs";

export const AdminInbox = () => {
  const [activeTab, setActiveTab] = useState(1); // change back to one
  const t = useTranslations("Admins");
  return (
    <Holds className="h-full">
      <Holds position={"row"} className="row-span-1 gap-5 w-full ">
        <NewTab
          onClick={() => setActiveTab(1)}
          isActive={activeTab === 1}
          isComplete={true}
          titleImage="/sent.svg"
          titleImageAlt=""
        >
          {t("Sent")}
        </NewTab>
        <NewTab
          onClick={() => setActiveTab(2)}
          isActive={activeTab === 2}
          isComplete={true}
          titleImage="/recieved.svg"
          titleImageAlt=""
        >
          {t("Recieved")}
        </NewTab>
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
          {/* {activeTab === 1 && <AdminSTab />}
          {activeTab === 2 && <AdminRTab />} */}
        </Holds>
        <Holds size={"60"} className="h-full">
          {/* {form === 0 && <CreateRequest />}
          {form === 1 && <EditRequest />} */}
        </Holds>
      </Holds>
    </Holds>
  );
};
