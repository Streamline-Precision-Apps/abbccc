"use client";
import { Buttons } from "@/components/(reusable)/buttons";
import { Holds } from "@/components/(reusable)/holds";
import { Images } from "@/components/(reusable)/images";
import { Texts } from "@/components/(reusable)/texts";
import { useTranslations } from "next-intl";

export default function TruckingBtn({
  view,
  permission,
}: {
  view: string;
  permission: string;
}) {
  const t = useTranslations("Widgets");
  return (
    <Holds
      className={
        view === "truck" && permission !== "USER"
          ? "row-span-1 col-span-2 h-full w-full"
          : "row-span-1 col-span-2 h-full w-full"
      }
    >
      <Buttons //----------------------This is the trucking assistant
        background={"orange"}
        href="/dashboard/truckingAssistant"
      >
        <Holds position={"row"} className="justify-center items-center">
          <Holds>
            <Images titleImg="/trucking.svg" titleImgAlt="truck" size={"50"} />
          </Holds>
          <Holds className="justify-center items-center">
            <Texts size={"p3"}>{t("TruckingAssistant")}</Texts>
          </Holds>
        </Holds>
      </Buttons>
    </Holds>
  );
}
