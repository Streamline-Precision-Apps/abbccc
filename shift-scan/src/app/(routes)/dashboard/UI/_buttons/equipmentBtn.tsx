"use client";
import { Buttons } from "@/components/(reusable)/buttons";
import { Holds } from "@/components/(reusable)/holds";
import { Images } from "@/components/(reusable)/images";
import { Texts } from "@/components/(reusable)/texts";
import { useTranslations } from "next-intl";

export default function EquipmentBtn({ permission }: { permission: string }) {
  const t = useTranslations("Widgets");
  return (
    <>
      <Holds
        position={"row"}
        className={
          permission === "ADMIN" ||
          permission === "SUPERADMIN" ||
          permission === "MANAGER"
            ? "row-span-1 col-span-1 gap-5"
            : "row-span-1 col-span-1 gap-5"
        }
      >
        <Buttons //----------------------This is the Equipment Widget
          background={"green"}
          href="/dashboard/equipment"
        >
          <Holds>
            <Holds>
              <Images
                titleImg="/equipment.svg"
                titleImgAlt="Equipment Icon"
                size={"30"}
              />
            </Holds>
            <Holds>
              <Texts size={"p3"}>{t("Equipment")}</Texts>
            </Holds>
          </Holds>
        </Buttons>
      </Holds>
    </>
  );
}
