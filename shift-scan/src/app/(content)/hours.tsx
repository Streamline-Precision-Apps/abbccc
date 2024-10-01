"use client";
import { useTranslations } from "next-intl";
import ViewHoursComponent from "@/app/(content)/hoursControl";
import { usePayPeriodHours } from "../context/PayPeriodHoursContext";
import { Buttons } from "@/components/(reusable)/buttons";
import { Texts } from "@/components/(reusable)/texts";
import Spinner from "@/components/(animations)/spinner";

// Assuming User has at least these fields, adjust accordingly

type HoursProps = {
  display: boolean;
  setToggle: (toggle: boolean) => void;
  loading: boolean;
}

export default function Hours({ setToggle, display, loading }: HoursProps) {
  const t = useTranslations("Home");
  const { payPeriodHours } = usePayPeriodHours();

  const handler = () => {
    setToggle(!display);
  };
  if (loading) return (
    <Buttons onClick={handler} background={"darkBlue"} size={"full"}>
        <Texts text={"white"} size={"p1"}>
          {t("PayPeriodHours")}
        </Texts>
        <Spinner />
    </Buttons>
  )

  return display ? (  
      <Buttons onClick={handler} background={"darkBlue"} size={"full"}>
        <Texts text={"white"} size={"p1"}>
          {t("PayPeriodHours")}
        </Texts>
          <Texts text={"white"} size={"p1"}>
            {payPeriodHours} {t("Unit")}
          </Texts>
      </Buttons>
  ) : (
    
    <ViewHoursComponent toggle={setToggle} />
    );
}
