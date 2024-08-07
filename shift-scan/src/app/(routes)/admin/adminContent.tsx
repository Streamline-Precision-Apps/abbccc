"use client";
import { useTranslations } from "next-intl";
import "@/app/globals.css";
import DashboardButtons from "@/components/dashboard-buttons";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Bases } from "@/components/(reusable)/bases";
import { Sections } from "@/components/(reusable)/sections";
import { Buttons } from "@/components/(reusable)/buttons";
import { Titles } from "@/components/(reusable)/titles";
import { Images } from "@/components/(reusable)/images";
import { Modals } from "@/components/(reusable)/modals";
import { Headers } from "@/components/(reusable)/headers";
import { Banners } from "@/components/(reusable)/banners";
import { Texts } from "@/components/(reusable)/texts";
import { Footers } from "@/components/(reusable)/footers";
import {
  getAuthStep,
  setAuthStep,
  isDashboardAuthenticated,
} from "@/app/api/auth";
import { CustomSession, User } from "@/lib/types";
import { useSession } from "next-auth/react";
import { useSavedUserData } from "@/app/context/UserContext";
import AdminButtons from "@/components/adminButtons";

interface AdminContentProps {
  permission: string | undefined;
}

export default function AdminContent({ permission }: AdminContentProps) {
  const t = useTranslations("admin");
  const router = useRouter();
  const [user, setData] = useState<User>({
    id: "",
    name: "",
    firstName: "",
    lastName: "",
    permission: "",
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
        name: session.user.name,
        firstName: session.user.firstName,
        lastName: session.user.lastName,
        permission: session.user.permission,
      });
    }
  }, [session]);

  return session ? (
    <Bases variant={"default"} size={"default"}>
      <Sections size={"default"}>
        <Headers variant={"relative"} size={"default"}></Headers>
        <Banners variant={"default"} size={"default"}>
          <Titles variant={"default"} size={"h1"}>
            {t("Banner")}
          </Titles>
          <Texts variant={"default"} size={"p1"}>
            {date}
          </Texts>
        </Banners>
        <Texts variant={"name"} size={"p1"}>
          {t("Name", { firstName: user.firstName, lastName: user.lastName })}
        </Texts>
        <AdminButtons />
        <Footers>{t("lN1")}</Footers>
      </Sections>
    </Bases>
  ) : (
    <></>
  );
}
