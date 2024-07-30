
import { useTranslations } from "next-intl";
import { Buttons } from "@/components/(reusable)/buttons";
import { Images } from "@/components/(reusable)/images";
import { Texts } from "@/components/(reusable)/texts";

export const User = () => {
  const t = useTranslations("ManagerButtons");
  return (
    <>
      <Buttons href="/dashboard/switch-jobs" variant={"orange"} size={"widgetSm"}>
        <Images titleImg="/jobsite.svg" titleImgAlt="Jobsite Icon" variant={"icon"} size={"widgetSm"}></Images>
        <Texts>{t("SwitchJobs")}</Texts>
      </Buttons>
      <Buttons href="/dashboard/equipment" variant={"green"} size={"widgetSm"}>
        <Images titleImg="/equipment.svg" titleImgAlt="Equipment Icon" variant={"icon"} size={"widgetSm"}></Images>
        <Texts>{t("Equipment")}</Texts>
      </Buttons>
      <Buttons href="/dashboard/forms" variant={"default"} size={"widgetSm"}>
        <Images titleImg="/forms.svg" titleImgAlt="Forms Icon" variant={"icon"} size={"widgetSm"}></Images>
        <Texts>{t("Forms")}</Texts>
      </Buttons>
      <Buttons href="/dashboard/clock-out" variant={"red"} size={"widgetSm"}>
        <Images titleImg="/clockOut.svg" titleImgAlt="Clock Out Icon" variant={"icon"} size={"widgetSm"}></Images>
        <Texts>{t("ClockOut")}</Texts>
      </Buttons>
    </>
  );
};
