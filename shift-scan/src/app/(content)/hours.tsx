"use client";
import { useTranslations } from "next-intl";
import ViewHoursComponent from "@/app/(content)/hoursControl";
import { useSavedPayPeriodHours } from "../context/SavedPayPeriodHours";
import { useSavedDailyHours } from "../context/SavedDailyHours";
import { Buttons } from "@/components/(reusable)/buttons";
import { Titles } from "@/components/(reusable)/titles";
import { Content } from "next/font/google";
import { Contents } from "@/components/(reusable)/contents";
import { Texts } from "@/components/(reusable)/texts";

// Assuming User has at least these fields, adjust accordingly

interface HoursProps {
  display: boolean;
  setToggle: (toggle: boolean) => void;
}

export default function Hours({ setToggle, display }: HoursProps) {
  const t = useTranslations("Home");
  const { payPeriodHours } = useSavedPayPeriodHours();
  
  const handler = () => {
    setToggle(!display);
  };

  return display ? (
    <>
      <Buttons 
        onClick={handler} 
        variant={"darkBlue"} 
        size={"hours"}
      >
        <Texts variant={"totalHours"} size={"p0"}>{t("PayPeriodHours")}</Texts>
          <Contents variant={"white"} size={"hoursBtn"}>
          <Texts variant={"default"} size={"p0"}>{payPeriodHours}</Texts>
          </Contents>
      </Buttons>
    </>
  ) : (
      <ViewHoursComponent toggle={setToggle} />
  );
}
