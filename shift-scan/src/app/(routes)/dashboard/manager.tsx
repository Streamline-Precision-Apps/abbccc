"use client";
import { useTranslations } from "next-intl";
import { Buttons } from "@/components/(reusable)/buttons";
import { Images } from "@/components/(reusable)/images";
import { Texts } from "@/components/(reusable)/texts";
import { Contents } from "@/components/(reusable)/contents";

interface ManagerProps {
  show: boolean;
}

export const Manager: React.FC<ManagerProps> = ({ show }) => {
  const t = useTranslations("ManagerButtons");
  return (
    <>
      {show && (
        <>
          <Buttons href="/dashboard/qr-generator" variant={"default"} size={"widgetSm"}>
            <Contents variant={"widgetButton"} size={"test"}>
              <Images titleImg="/qrCode.svg" titleImgAlt="QR Code" variant={"icon"} size={"widgetSm"}/>
              <Texts size={"widgetSm"}>{t("QrGenerator")}</Texts>
            </Contents>
          </Buttons>
          <Buttons href="/dashboard/myTeam" variant={"default"} size={"widgetSm"}>
            <Contents variant={"widgetButton"} size={"test"}>
              <Images titleImg="/myTeam.svg" titleImgAlt="my team" variant={"icon"} size={"widgetSm"}/>
              <Texts size={"widgetSm"}>{t("MyTeam")}</Texts>
            </Contents>
          </Buttons>
        </>
      )}
    </>
  );
};