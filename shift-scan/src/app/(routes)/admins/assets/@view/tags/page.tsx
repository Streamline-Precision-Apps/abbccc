"use client";
import { Holds } from "@/components/(reusable)/holds";
import EmptyView from "../../../_pages/EmptyView";
import { useTranslations } from "next-intl";

export default function Page() {
  const t = useTranslations("Admins");
  return (
    <Holds className="h-full w-full">
      <EmptyView Children={<h1>{t("SelectATagToView")}</h1>} />
    </Holds>
  );
}
