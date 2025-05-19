"use client";
import WidgetContainer from "@/app/(content)/widgetContainer";
import { Holds } from "@/components/(reusable)/holds";
import { useTranslations } from "next-intl";

export default function EquipmentBtn({ permission }: { permission: string }) {
  const t = useTranslations("Widgets");
  return permission !== "USER" ? (
    <WidgetContainer
      titleImg="/equipment.svg"
      titleImgAlt="Equipment Icon"
      text={t("Equipment")}
      background={"green"}
      translation={"Widgets"}
      href="/dashboard/equipment"
    />
  ) : (
    <Holds className="h-full w-full col-span-2">
      <WidgetContainer
        titleImg="/equipment.svg"
        titleImgAlt="Equipment Icon"
        text={t("Equipment")}
        background={"green"}
        translation={"Widgets"}
        href="/dashboard/equipment"
      />
    </Holds>
  );
}
