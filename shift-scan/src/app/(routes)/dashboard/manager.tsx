"use client";
import { useTranslations } from "next-intl";
import { Buttons } from "@/components/(reusable)/buttons";
import { Images } from "@/components/(reusable)/images";
import { Texts } from "@/components/(reusable)/texts";
import { Contents } from "@/components/(reusable)/contents";

type ManagerProps = {
  show: boolean;
}

export default function Manager({ show } : ManagerProps) {
  const t = useTranslations("ManagerButtons");
  return (
    <>
      {show && (
        <>
          <Buttons href="/dashboard/qr-generator" variant={"lightBlue"} size={null}>
            <Contents variant={"widgetButton"} size={"test"}>
              <Images titleImg="/new/qr.svg" titleImgAlt="QR Code" variant={"icon"} size={"widgetSm"}/>
              <Texts size={"widgetSm"}>{t("QrGenerator")}</Texts>
            </Contents>
          </Buttons>
          <Buttons href="/dashboard/myTeam" variant={"lightBlue"} size={null}>
            <Contents variant={"widgetButton"} size={"test"}>
              <Images titleImg="/new/team.svg" titleImgAlt="my team" variant={"icon"} size={"widgetSm"}/>
              <Texts size={"widgetSm"}>{t("MyTeam")}</Texts>
            </Contents>
          </Buttons>
        </>
      )}
    </>
  );
};