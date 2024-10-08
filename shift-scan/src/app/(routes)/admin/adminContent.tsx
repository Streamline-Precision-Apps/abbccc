"use client";
import { useTranslations } from "next-intl";
import "@/app/globals.css";
import DashboardButtons from "@/components/dashboard-buttons";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Bases } from "@/components/(reusable)/bases";
import { Holds } from "@/components/(reusable)/holds";
import { Buttons } from "@/components/(reusable)/buttons";
import { Titles } from "@/components/(reusable)/titles";
import { Images } from "@/components/(reusable)/images";
import { Modals } from "@/components/(reusable)/modals";
import { Banners } from "@/components/(reusable)/banners";
import { Texts } from "@/components/(reusable)/texts";
import { Footers } from "@/components/(reusable)/footers";
import {
  getAuthStep,
  setAuthStep,
} from "@/app/api/auth";
import { CustomSession, User } from "@/lib/types";
import { useSession } from "next-auth/react";
import AdminButtons from "@/components/adminButtons";
import { Content } from "next/font/google";
import { Contents } from "@/components/(reusable)/contents";

type AdminContentProps = {
  permission: string | undefined;
}

export default function AdminContent({ permission }: AdminContentProps) {
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
    <Bases variant={"default"}>
      <Contents size={"default"}>
      <Holds size={"default"}>
      <Contents size={"default"}>
        <Banners variant={"default"}>
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
        </Contents>
      </Holds>
      </Contents>
    </Bases>
  ) : (
    <></>
  );
}
