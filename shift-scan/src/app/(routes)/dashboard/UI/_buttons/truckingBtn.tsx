"use client";
import { Buttons } from "@/components/(reusable)/buttons";
import { Holds } from "@/components/(reusable)/holds";
import { Images } from "@/components/(reusable)/images";
import { Texts } from "@/components/(reusable)/texts";
import { useTranslations } from "next-intl";

export default function TruckingBtn() {
  const t = useTranslations("Widgets");
  return (
    <Holds className="row-span-1 col-span-1 h-full w-full">
      <Buttons //----------------------This is the trucking assistant
        background={"orange"}
        href="/dashboard/truckingAssistant"
      >
        <Holds className="justify-center items-center">
          <Holds size={"90"}>
            <Images titleImg="/trucking.svg" titleImgAlt="truck" size={"40"} />
          </Holds>
          <Holds className="justify-center items-center">
            <Texts size={"p6"}>{t("TruckingAssistant")}</Texts>
          </Holds>
        </Holds>
      </Buttons>
    </Holds>
  );
}
