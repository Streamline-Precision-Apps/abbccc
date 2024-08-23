"use client";
import { useTranslations } from "next-intl";
import "@/app/globals.css";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Bases } from "@/components/(reusable)/bases";
import { Sections } from "@/components/(reusable)/sections";
import { Titles } from "@/components/(reusable)/titles";
import { Headers } from "@/components/(reusable)/headers";
import { Banners } from "@/components/(reusable)/banners";
import { Footers } from "@/components/(reusable)/footers";
import {
  setAuthStep,
} from "@/app/api/auth";
import { CustomSession, SearchUser, User } from "@/lib/types";
import { useSession } from "next-auth/react";
import { useSavedUserData } from "@/app/context/UserContext";
import AddEmployeeForm from "./addEmployee";
import UserManagement from "./(components)/userManagement";

interface AddEmployeeContentProps {
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
  const { setSavedUserData } = useSavedUserData();
  const date = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    weekday: "long",
  });

  useEffect(() => {
    if (permission !== "ADMIN" && permission !== "SUPERADMIN") {
      router.push("/"); // Redirect to login page if not authenticated
    } else {
      setAuthStep("ADMIN");
    }
  }, []);

  useEffect(() => {
    if (session && session.user) {
      setSavedUserData({
        id: session.user.id,
      });
      setData({
        id: session.user.id,
        firstName: session.user.firstName,
        lastName: session.user.lastName,
        permission: session.user.permission,
      });
    }
  }, [session]);

  return session ? (
    <Bases variant={"default"}>
      <Sections size={"default"}>
        <Headers variant={"relative"} size={"default"}></Headers>
        <Banners variant={"default"}>
          <Titles variant={"default"} size={"h1"}>
            {t("AddEmployee")}
          </Titles>
        </Banners>
        <UserManagement users={users}/>
        <Footers>{t("lN1")}</Footers>
      </Sections>
    </Bases>
  ) : (
    <></>
  );
}
