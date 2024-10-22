"use client";
import { useTranslations } from "next-intl";
import "@/app/globals.css";
import { useEffect, useState } from "react";
import { Bases } from "@/components/(reusable)/bases";
import { Holds } from "@/components/(reusable)/holds";
import { Titles } from "@/components/(reusable)/titles";
import { Banners } from "@/components/(reusable)/banners";
import { Texts } from "@/components/(reusable)/texts";
import { Footers } from "@/components/(reusable)/footers";
import { CustomSession, User } from "@/lib/types";
import { useSession } from "next-auth/react";
import AdminButtons from "@/components/adminButtons";
import { Contents } from "@/components/(reusable)/contents";
export const dynamic = "force-dynamic";

export default function AdminContent() {
  const t = useTranslations("admin");
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
    <Bases>
      <Contents>
        <Holds>
          <Contents>
            <Banners>
              <Titles size={"h1"}>{t("Banner")}</Titles>
              <Texts size={"p1"}>{date}</Texts>
            </Banners>
            <Texts size={"p1"}>
              {t("Name", {
                firstName: user.firstName,
                lastName: user.lastName,
              })}
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
