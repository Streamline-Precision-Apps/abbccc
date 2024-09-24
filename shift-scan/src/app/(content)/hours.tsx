"use client";
import { useTranslations } from "next-intl";
import ViewHoursComponent from "@/app/(content)/hoursControl";
import { usePayPeriodHours } from "../context/PayPeriodHoursContext";
import { Buttons } from "@/components/(reusable)/buttons";
import { Titles } from "@/components/(reusable)/titles";
import { Content } from "next/font/google";
import { Contents } from "@/components/(reusable)/contents";
import { Texts } from "@/components/(reusable)/texts";

// Assuming User has at least these fields, adjust accordingly

type HoursProps = {
  display: boolean;
  setToggle: (toggle: boolean) => void;
}

export default function Hours({ setToggle, display }: HoursProps) {
  const t = useTranslations("Home");
  const { payPeriodHours } = usePayPeriodHours();

  const handler = () => {
    setToggle(!display);
  };

  return display ? (
    <>
      <Buttons onClick={handler} background={"darkBlue"} size={"widgetMed"}>
        <Texts variant={"totalHours"} size={"p2"}>
          {t("PayPeriodHours")}
        </Texts>
        <Contents variant={"white"} size={"hoursBtn"}>
          <Texts variant={"default"} size={"p0"}>
            {payPeriodHours}
          </Texts>
        </Contents>
      </Buttons>
    </>
  ) : (
    <ViewHoursComponent toggle={setToggle} />
  );
}
