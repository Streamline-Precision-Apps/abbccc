"use client";
import { useTranslations } from "next-intl";
import "@/app/globals.css";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Bases } from "@/components/(reusable)/bases";
import { Holds } from "@/components/(reusable)/holds";
import { Titles } from "@/components/(reusable)/titles";
import { Banners } from "@/components/(reusable)/banners";
import { Footers } from "@/components/(reusable)/footers";
import { Grids } from "@/components/(reusable)/grids";
import {
  setAuthStep,
} from "@/app/api/auth";
import { CustomSession, SearchUser, User } from "@/lib/types";
import { useSession } from "next-auth/react";
import AddEmployeeForm from "./addEmployee";
import UserManagement from "./(components)/userManagement";

import { Tab } from "@/components/(reusable)/tab";
import { Contents } from "@/components/(reusable)/contents";
import { TitleBoxes } from "@/components/(reusable)/titleBoxes";
import UserCards from "./userCards";

type AddEmployeeContentProps = {
  permission: string | undefined;
  users: SearchUser[];
}

export default function AddEmployeeContent({ permission , users }: AddEmployeeContentProps) {
  const t = useTranslations("admin");
  const router = useRouter();
  const [user, setData] = useState<User>({
    id: "",
    firstName: "",
    lastName: "",
    permission: undefined,
  });
  const { data: session } = useSession() as { data: CustomSession | null };
  const date = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    weekday: "long",
  });
  const [activeTab, setActiveTab] = useState(1);

  useEffect(() => {
    if (permission !== "ADMIN" && permission !== "SUPERADMIN") {
      router.push("/"); // Redirect to login page if not authenticated
    } else {
      setAuthStep("ADMIN");
    }
  }, []);

  useEffect(() => {
    if (session && session.user) {
      setData({
        id: session.user.id,
        firstName: session.user.firstName,
        lastName: session.user.lastName,
        permission: session.user.permission,
      });
    }
  }, [session]);

  return session ? (
    <>
      <Grids rows={"10"} gap={"5"}>
        <Holds 
        background={"white"}
        className="row-span-1 h-full">
            <TitleBoxes
            title="Assets"
            titleImg="/assets.svg"
            titleImgAlt="Assests"
            size={"default"}
            type="noIcon"
            />
        </Holds>

        <Holds 
        className="row-span-9 h-full">
          <Holds position={"row"}>
            <Tab 
            onClick={() => setActiveTab(1)}
            tabLabel= {t("ModifyEmployee")} 
            isTabActive= {activeTab === 1}
            />
            <Tab
            onClick={() => setActiveTab(2)} 
            tabLabel= {t("ViewEmployees")}
            isTabActive= {activeTab === 2}
            /> 
          </Holds>
          {activeTab === 1 && <UserManagement users={users}/> }
          {activeTab === 2 && <UserCards users={users}/>}
        </Holds>
      </Grids>
    </>
  ) : (
    <></>
  );
}
