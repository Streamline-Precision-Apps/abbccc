"use client";
import { useTranslations } from "next-intl";
import { Buttons } from "@/components/(reusable)/buttons";
import { Images } from "@/components/(reusable)/images";
import { Texts } from "@/components/(reusable)/texts";
import { Contents } from "@/components/(reusable)/contents";
import { Holds } from "@/components/(reusable)/holds";

type ManagerProps = {
  show: boolean;
}

export default function Manager({ show } : ManagerProps) {
  const t = useTranslations("ManagerButtons");
  return (
    <>
      {show && (
        <>
          <Buttons href="/dashboard/qr-generator" background={"lightBlue"}>
            <Holds className="my-3">
              <Images titleImg="/qr.svg" titleImgAlt="QR Code" background={"none"} size={"70"}/>
              <Texts size={"p4"}>{t("QrGenerator")}</Texts>
            </Holds>
          </Buttons>
          <Buttons href="/dashboard/myTeam" background={"lightBlue"}>
            <Holds className="my-3">
              <Images titleImg="/team.svg" titleImgAlt="my team" background={"none"} size={"70"}/>
              <Texts size={"p4"}>{t("MyTeam")}</Texts>
            </Holds>
          </Buttons>
        </>
      )}
    </>
  );
};