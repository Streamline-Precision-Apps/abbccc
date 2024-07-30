import { useTranslations } from "next-intl";
import { Buttons } from "@/components/(reusable)/buttons";
import { Images } from "@/components/(reusable)/images";
import { Texts } from "@/components/(reusable)/texts";

export const Manager = () => {
  const t = useTranslations("ManagerButtons");
  return (
    <>
      <Buttons href="/dashboard/myTeam" variant={"default"} size={"widgetSm"}>
        <Images titleImg="/myTeam.svg" titleImgAlt="my team" variant={"icon"} size={"widgetSm"}></Images>
        <Texts>{t("MyTeam")}</Texts>
      </Buttons>

      <Buttons href="/dashboard/qrGenerator" variant={"default"} size={"widgetSm"}>
        <Images titleImg="/qrCode.svg" titleImgAlt="QR Code" variant={"icon"} size={"widgetSm"}></Images>
        <Texts>{t("QrGenerator")}</Texts>
      </Buttons>
    </>
  );
};
