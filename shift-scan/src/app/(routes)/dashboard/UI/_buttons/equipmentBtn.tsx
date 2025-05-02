"use client";
import WidgetContainer from "@/app/(content)/widgetContainer";
import { useTranslations } from "next-intl";

export default function EquipmentBtn({ permission }: { permission: string }) {
  const t = useTranslations("Widgets");
  return (
    <WidgetContainer
      titleImg="/equipment.svg"
      titleImgAlt="Equipment Icon"
      text={t("Equipment")}
      background={"green"}
      translation={"Widgets"}
      href="/dashboard/equipment"
    />
  );
}
